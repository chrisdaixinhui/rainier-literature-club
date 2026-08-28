export type ActivityStatus = 'upcoming' | 'past' | 'coming_soon'

export interface ActivityRecord {
  id: string
  title: string
  titleEn?: string | null
  subType?: string | null
  date?: string | null
  time?: string | null
  endAt?: string | null
  location?: string | null
  locationDetail?: string | null
  description?: string | null
  descriptionEn?: string | null
  poster?: string | null
  registerUrl?: string | null
  reviewUrl?: string | null
  comingSoon?: boolean
  featured?: boolean
  status: ActivityStatus
}

export interface CategoryRecord {
  id: string
  name: string
  nameEn: string
  tagline: string
  taglineEn: string
  color: string
  textColor: string
  comingSoon?: boolean
  events: ActivityRecord[]
}

export interface PartnerRecord {
  id: string
  partnerName: string
  partnerNameEn?: string | null
  eventName: string
  eventNameEn?: string | null
  date?: string | null
  time?: string | null
  endAt?: string | null
  location?: string | null
  locationDetail?: string | null
  description?: string | null
  descriptionEn?: string | null
  poster?: string | null
  url?: string | null
  comingSoon?: boolean
  status?: ActivityStatus
}

export interface TicketRecord {
  id: string
  activityId?: string | null
  title: string
  date?: string | null
  time?: string | null
  location?: string | null
  generalPrice?: number | null
  generalUrl?: string | null
  supporterPrice?: number | null
  supporterUrl?: string | null
  supporterPerks?: string | null
  comingSoon?: boolean
}

export interface ActivitiesPayload {
  upcoming: ActivityRecord[]
  categories: CategoryRecord[]
  partners: PartnerRecord[]
  tickets: TicketRecord[]
  source?: 'notion' | 'static-fallback'
  syncedAt?: string | null
}
