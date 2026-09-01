import assert from 'node:assert/strict'
import test from 'node:test'
import {
  externalPathForLocale,
  internalPathForLocale,
  localizedHref,
  preferredLocaleFromHeader,
  resolveRootLocale,
} from '../lib/i18n-routing.ts'
import {
  localizeActivitiesPayload,
  validateEnglishActivity,
} from '../lib/activityPublication.ts'
import type { ActivitiesPayload, ActivityRecord } from '../lib/types.ts'

test('Accept-Language honors quality weights and supported-language order', () => {
  assert.equal(preferredLocaleFromHeader('zh-CN;q=0.6, en-US;q=0.9'), 'en')
  assert.equal(preferredLocaleFromHeader('en-GB;q=0.7, zh-TW;q=0.7'), 'en')
  assert.equal(preferredLocaleFromHeader('fr-FR, zh-CN;q=0.8, en;q=0'), 'zh')
  assert.equal(preferredLocaleFromHeader('fr-FR, de-DE;q=0.8'), 'zh')
  assert.equal(preferredLocaleFromHeader(null), 'zh')
})

test('saved locale takes priority over Accept-Language', () => {
  assert.equal(resolveRootLocale('en', 'zh-CN,zh;q=0.9'), 'en')
  assert.equal(resolveRootLocale('zh', 'en-US,en;q=0.9'), 'zh')
  assert.equal(resolveRootLocale('invalid', 'en-US,en;q=0.9'), 'en')
})

test('locale path mapping keeps the Chinese routes unprefixed', () => {
  assert.equal(externalPathForLocale('/', 'zh'), '/')
  assert.equal(externalPathForLocale('/', 'en'), '/en')
  assert.equal(externalPathForLocale('/activities', 'en'), '/en/activities')
  assert.equal(externalPathForLocale('/en/support', 'zh'), '/support')
  assert.equal(internalPathForLocale('/support', 'zh'), '/zh/support')
  assert.equal(
    localizedHref('/en/activities', 'zh', '?category=reading', '#archive'),
    '/activities?category=reading#archive',
  )
})

test('English publication validation reports every required missing field', () => {
  const result = validateEnglishActivity({
    id: 'missing',
    title: '中文标题',
    location: '中文地点',
    locationDetail: '中文地点详情',
    description: '中文简介',
    publishedEn: true,
    status: 'upcoming',
  })

  assert.equal(result.requested, true)
  assert.equal(result.valid, false)
  assert.deepEqual(result.missingFields, [
    '活动名称（英文）',
    '英文简介',
    '英文地点',
    '英文地点详情',
    '活动语言',
  ])
})

function activity(overrides: Partial<ActivityRecord>): ActivityRecord {
  return {
    id: 'base',
    categoryId: 'reading',
    title: '中文标题',
    titleEn: 'English title',
    description: '中文简介',
    descriptionEn: 'English description',
    location: '中文地点',
    locationEn: 'English venue',
    publishedEn: true,
    activityLanguage: 'bilingual',
    status: 'upcoming',
    ...overrides,
  }
}

test('one publication filter controls activities, categories, partners, and tickets', () => {
  const valid = activity({ id: 'valid' })
  const incomplete = activity({ id: 'incomplete', descriptionEn: null })
  const chineseOnly = activity({ id: 'zh-only', publishedEn: false })
  const payload: ActivitiesPayload = {
    upcoming: [valid, incomplete, chineseOnly],
    categories: [{
      id: 'reading',
      name: '读书会',
      nameEn: 'Reading Group',
      tagline: '一起读书',
      taglineEn: 'Read together',
      color: '#2E463D',
      textColor: '#fff',
      events: [valid, incomplete, chineseOnly],
    }],
    partners: [
      {
        id: 'partner-valid',
        partnerName: '友社',
        partnerNameEn: 'Partner',
        eventName: '友社活动',
        eventNameEn: 'Partner Event',
        description: '中文简介',
        descriptionEn: 'English description',
        publishedEn: true,
        activityLanguage: 'en',
        status: 'upcoming',
      },
      {
        id: 'partner-incomplete',
        partnerName: '友社',
        eventName: '友社活动',
        eventNameEn: 'Partner Event',
        description: '中文简介',
        descriptionEn: 'English description',
        publishedEn: true,
        activityLanguage: 'en',
        status: 'upcoming',
      },
    ],
    tickets: [
      {
        id: 'ticket-valid',
        activityId: 'valid',
        title: '中文标题',
        titleEn: 'English title',
        location: '中文地点',
        locationEn: 'English venue',
        supporterPerks: '中文权益',
        supporterPerksEn: 'English perks',
        publishedEn: true,
        activityLanguage: 'bilingual',
      },
      {
        id: 'ticket-linked-to-invalid',
        activityId: 'incomplete',
        title: '中文标题',
        titleEn: 'English title',
        publishedEn: true,
        activityLanguage: 'bilingual',
      },
    ],
  }

  const warn = console.warn
  console.warn = () => undefined
  try {
    const english = localizeActivitiesPayload(payload, 'en')
    assert.deepEqual(english.upcoming.map((record) => record.id), ['valid'])
    assert.equal(english.upcoming[0].title, 'English title')
    assert.equal(english.upcoming[0].titleEn, null)
    assert.deepEqual(english.categories.map((category) => category.name), ['Reading Group'])
    assert.deepEqual(english.categories[0].events.map((record) => record.id), ['valid'])
    assert.deepEqual(english.partners.map((record) => record.id), ['partner-valid'])
    assert.deepEqual(english.tickets.map((record) => record.id), ['ticket-valid'])

    const chinese = localizeActivitiesPayload(payload, 'zh')
    assert.deepEqual(chinese.upcoming.map((record) => record.id), ['valid', 'incomplete', 'zh-only'])
    assert.equal(chinese.upcoming[0].title, '中文标题')
    assert.equal(chinese.upcoming[0].titleEn, null)
  } finally {
    console.warn = warn
  }
})
