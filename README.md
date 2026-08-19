This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 内容管理（Notion CMS）

活动内容以 Notion 数据库为数据源，网站每 10 分钟自动重新拉取；Notion 未配置或不可用时，自动回退到 `data/activities.json` 的静态数据。每日一句同样从 Notion 句库读取，旧的 `data/sentences.json` 已移除。

### 环境变量

复制 `.env.example` 为 `.env.local` 并填入：

```bash
NOTION_API_KEY=secret_xxx
NOTION_ACTIVITY_DB_ID=your-database-id
NOTION_SENTENCE_DB_ID=your-sentence-database-id
ADMIN_PASSWORD=your-admin-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=rainier/activities
CRON_SECRET=your-cron-secret
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_AUDIENCE_ID=your-mailchimp-audience-id
MAILCHIMP_SERVER_PREFIX=usXX
```

### Mailchimp 邮件订阅

首页和页脚的「订阅 Subscribe」按钮会打开订阅弹窗。用户提交邮箱后，网站通过 `app/api/subscribe/route.ts` 调用 Mailchimp Marketing API，将联系人以 `pending` 状态加入 Audience；用户需要点击 Mailchimp 发出的确认邮件才能完成订阅。

首次配置：

1. 在 Mailchimp 创建一个主 Audience，并在 Audience 设置中确认默认发件人信息。
2. 在 `Account & billing` → `Extras` → `API keys` 创建 API Key。
3. 从浏览器地址或 API Key 末尾取得 Server Prefix，例如 `us21`。
4. 在 `Audience` → `Settings` → `Audience name and defaults` 找到 Audience ID。
5. 将三个值填入本地 `.env.local` 和 Vercel 项目的 Environment Variables，然后重新部署。

API Key 只放在服务端环境变量中，不要使用 `NEXT_PUBLIC_` 前缀，也不要提交到 Git。Mailchimp 的 Marketing API 不支持把 API Key 放在浏览器端调用；服务端 Route Handler 会保护这个密钥。

### Notion 数据库字段（活动）

| 字段 | 类型 | 说明 |
|------|------|------|
| 活动名称 | Title | 必填，中文 |
| 活动名称（英文） | Text | 英文标题 |
| 状态 | Select | 即将举行 / 已完成 / 草稿 |
| 分类 | Select | 读书会 / 雨山前Talk / 三小时线上阅读 / 写作营 / 剧本围读 / 亲子共读 |
| 开始时间 | Date | 活动时间 |
| 地点 | Text | 活动地点 |
| 地点详情 | Text | 可选，详细地址 |
| 简介 | Text | 中文简介 |
| 英文简介 | Text | 可选，英文简介 |
| 海报图片 URL | URL | Cloudinary 公开图片链接 |
| 海报图片 | Files & media | 运营者直接拖图，系统自动转存到 Cloudinary |
| 海报图片同步标记 | Text | 自动维护，用于判断图片是否已同步 |
| 普通票价 | Number | USD |
| 支持者票价 | Number | USD |
| 支持者票含周边说明 | Text | 可选 |
| 报名链接（Eventbrite） | URL | 报名外链 |
| 回顾文章链接 | URL | 活动结束后填入 |
| 是否置顶 | Checkbox | 勾选后进入"即将举行"主推 |
| 是否友社活动 | Checkbox | 勾选后进入"友社推荐" |
| 友社名称 | Text | 友社活动时填写 |

### Notion 数据库字段（每日一句）

`NOTION_SENTENCE_DB_ID` 指向标题为「每日一句」的数据库。网站只读取「是否启用」为开启的条目，并按日期在启用条目中轮询；每 10 分钟重新拉取一次。

| 字段 | 类型 | 说明 |
|------|------|------|
| 中文句子 | Title | 页面显示的中文句子 |
| 英文翻译 | Text | 中文句子的英文翻译 |
| 作者 | Text | 作者署名 |
| 出处 | Text | 作品、演讲或其他出处 |
| 是否启用 | Checkbox | 关闭后不参与每日轮询 |

### 手动刷新

Notion 改完后可立即刷新缓存（通常 10 分钟内也会自动生效）：

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-admin-key: $ADMIN_PASSWORD"
```

### 图片自动转存（Notion 传图）

运营者只需要把海报图片拖进 Notion 的「海报图片」字段，网站会通过同步任务把图片转存到 Cloudinary，并把永久链接写回「海报图片 URL」字段。

手动执行：

```bash
npm run sync:images
```

或调用接口（带 `x-admin-key` 或 `Authorization: Bearer`）：

```bash
curl -X POST http://localhost:3000/api/sync-images \
  -H "x-admin-key: $ADMIN_PASSWORD"
```

部署到 Vercel 后，`vercel.json` 里的 Cron 会每 10 分钟自动执行一次（需要配置 `CRON_SECRET` 环境变量用于鉴权）。
