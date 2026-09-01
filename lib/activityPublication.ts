import type {
  ActivitiesPayload,
  ActivityLanguage,
  ActivityRecord,
  CategoryRecord,
  PartnerRecord,
  TicketRecord,
} from './types'
import type { Locale } from './i18n-routing'

export interface EnglishPublicationValidation {
  requested: boolean
  valid: boolean
  missingFields: string[]
}

function hasText(value: string | null | undefined): value is string {
  return Boolean(value?.trim())
}

function hasActivityLanguage(value: ActivityLanguage | null | undefined): value is ActivityLanguage {
  return value === 'zh' || value === 'bilingual' || value === 'en'
}

function validation(requested: boolean, missingFields: string[]): EnglishPublicationValidation {
  return {
    requested,
    valid: requested && missingFields.length === 0,
    missingFields,
  }
}

export function validateEnglishActivity(record: ActivityRecord): EnglishPublicationValidation {
  if (!record.publishedEn) return validation(false, [])

  const missingFields: string[] = []
  if (!hasText(record.titleEn)) missingFields.push('活动名称（英文）')
  if (!hasText(record.descriptionEn)) missingFields.push('英文简介')
  if (hasText(record.location) && !hasText(record.locationEn)) missingFields.push('英文地点')
  if (hasText(record.locationDetail) && !hasText(record.locationDetailEn)) {
    missingFields.push('英文地点详情')
  }
  if (!hasActivityLanguage(record.activityLanguage)) missingFields.push('活动语言')

  return validation(true, missingFields)
}

export function validateEnglishPartner(record: PartnerRecord): EnglishPublicationValidation {
  if (!record.publishedEn) return validation(false, [])

  const missingFields: string[] = []
  if (!hasText(record.partnerNameEn)) missingFields.push('友社名称（英文）')
  if (!hasText(record.eventNameEn)) missingFields.push('活动名称（英文）')
  if (!hasText(record.descriptionEn)) missingFields.push('英文简介')
  if (hasText(record.location) && !hasText(record.locationEn)) missingFields.push('英文地点')
  if (hasText(record.locationDetail) && !hasText(record.locationDetailEn)) {
    missingFields.push('英文地点详情')
  }
  if (!hasActivityLanguage(record.activityLanguage)) missingFields.push('活动语言')

  return validation(true, missingFields)
}

export function validateEnglishTicket(record: TicketRecord): EnglishPublicationValidation {
  if (!record.publishedEn) return validation(false, [])

  const missingFields: string[] = []
  if (!hasText(record.titleEn)) missingFields.push('活动名称（英文）')
  if (hasText(record.location) && !hasText(record.locationEn)) missingFields.push('英文地点')
  if (hasText(record.supporterPerks) && !hasText(record.supporterPerksEn)) {
    missingFields.push('英文票务权益')
  }
  if (!hasActivityLanguage(record.activityLanguage)) missingFields.push('活动语言')

  return validation(true, missingFields)
}

function validateEnglishCategory(category: CategoryRecord): EnglishPublicationValidation {
  const requested = category.events.some((event) => event.publishedEn)
  if (!requested) return validation(false, [])

  const missingFields: string[] = []
  if (!hasText(category.nameEn)) missingFields.push('分类英文名')
  if (hasText(category.tagline) && !hasText(category.taglineEn)) missingFields.push('分类英文说明')
  return validation(true, missingFields)
}

function chineseActivity(record: ActivityRecord): ActivityRecord {
  return {
    ...record,
    titleEn: null,
    locationEn: null,
    locationDetailEn: null,
    descriptionEn: null,
  }
}

function englishActivity(record: ActivityRecord): ActivityRecord {
  return {
    ...record,
    title: record.titleEn!.trim(),
    titleEn: null,
    subType: null,
    location: record.locationEn?.trim() || null,
    locationDetail: record.locationDetailEn?.trim() || null,
    locationEn: null,
    locationDetailEn: null,
    description: record.descriptionEn!.trim(),
    descriptionEn: null,
  }
}

function chinesePartner(record: PartnerRecord): PartnerRecord {
  return {
    ...record,
    partnerNameEn: null,
    eventNameEn: null,
    locationEn: null,
    locationDetailEn: null,
    descriptionEn: null,
  }
}

function englishPartner(record: PartnerRecord): PartnerRecord {
  return {
    ...record,
    partnerName: record.partnerNameEn!.trim(),
    partnerNameEn: null,
    eventName: record.eventNameEn!.trim(),
    eventNameEn: null,
    location: record.locationEn?.trim() || null,
    locationDetail: record.locationDetailEn?.trim() || null,
    locationEn: null,
    locationDetailEn: null,
    description: record.descriptionEn!.trim(),
    descriptionEn: null,
  }
}

function chineseTicket(record: TicketRecord): TicketRecord {
  return {
    ...record,
    titleEn: null,
    locationEn: null,
    supporterPerksEn: null,
  }
}

function englishTicket(record: TicketRecord): TicketRecord {
  return {
    ...record,
    title: record.titleEn!.trim(),
    titleEn: null,
    location: record.locationEn?.trim() || null,
    locationEn: null,
    supporterPerks: record.supporterPerksEn?.trim() || null,
    supporterPerksEn: null,
  }
}

function reportInvalidEnglishRecord(
  kind: 'activity' | 'partner' | 'ticket' | 'category',
  id: string,
  result: EnglishPublicationValidation,
  reported: Set<string>,
) {
  if (!result.requested || result.valid) return
  const key = `${kind}:${id}`
  if (reported.has(key)) return
  reported.add(key)
  console.warn(JSON.stringify({
    scope: 'i18n-content',
    event: 'english-publication-skipped',
    kind,
    id,
    missingFields: result.missingFields,
  }))
}

export function localizeActivitiesPayload(
  payload: ActivitiesPayload,
  locale: Locale,
): ActivitiesPayload {
  if (locale === 'zh') {
    return {
      ...payload,
      upcoming: payload.upcoming.map(chineseActivity),
      categories: payload.categories.map((category) => ({
        ...category,
        nameEn: '',
        taglineEn: '',
        events: category.events.map(chineseActivity),
      })),
      partners: payload.partners.map(chinesePartner),
      tickets: payload.tickets.map(chineseTicket),
    }
  }

  const reported = new Set<string>()
  const categoryValidity = new Map<string, boolean>()
  for (const category of payload.categories) {
    const result = validateEnglishCategory(category)
    reportInvalidEnglishRecord('category', category.id, result, reported)
    categoryValidity.set(category.id, !result.requested || result.valid)
  }

  const activityValidity = new Map<string, boolean>()
  const allActivities = [
    ...payload.upcoming,
    ...payload.categories.flatMap((category) => category.events),
  ]

  for (const activity of allActivities) {
    const result = validateEnglishActivity(activity)
    const categoryValid = !activity.categoryId || categoryValidity.get(activity.categoryId) !== false
    const valid = result.valid && categoryValid
    reportInvalidEnglishRecord('activity', activity.id, result, reported)
    activityValidity.set(activity.id, valid)
  }

  const categories = payload.categories
    .filter((category) => categoryValidity.get(category.id) !== false)
    .map((category) => ({
      ...category,
      name: category.nameEn,
      nameEn: '',
      tagline: category.taglineEn,
      taglineEn: '',
      events: category.events
        .filter((activity) => activityValidity.get(activity.id))
        .map(englishActivity),
    }))
    .filter((category) => category.events.length > 0)

  const partners = payload.partners.flatMap((partner) => {
    const result = validateEnglishPartner(partner)
    reportInvalidEnglishRecord('partner', partner.id, result, reported)
    return result.valid ? [englishPartner(partner)] : []
  })

  const tickets = payload.tickets.flatMap((ticket) => {
    const result = validateEnglishTicket(ticket)
    const linkedActivityValid = !ticket.activityId || activityValidity.get(ticket.activityId) === true
    reportInvalidEnglishRecord('ticket', ticket.id, result, reported)
    return result.valid && linkedActivityValid ? [englishTicket(ticket)] : []
  })

  return {
    ...payload,
    upcoming: payload.upcoming
      .filter((activity) => activityValidity.get(activity.id))
      .map(englishActivity),
    categories,
    partners,
    tickets,
  }
}
