import { syncActivityPosters } from '../lib/notionSync.ts'

const result = await syncActivityPosters()
console.log(JSON.stringify(result, null, 2))

if (result.errors.length > 0) {
  process.exitCode = 1
}
