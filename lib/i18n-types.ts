import type { Locale } from './i18n-routing'

export interface PageMetadataCopy {
  title: string
  description: string
}

export interface Dictionary {
  locale: Locale
  meta: {
    home: PageMetadataCopy
    activities: PageMetadataCopy
    support: PageMetadataCopy
  }
  nav: {
    homeAria: string
    languageSwitcherAria: string
    menuButton: string
    menuClose: string
    menuEyebrow: string
    subscribe: string
    subscribeAccent: string
    subscribeFull: string
    links: {
      home: string
      about: string
      activities: string
      support: string
    }
  }
  home: {
    hero: {
      eyebrow: string
      title: string
      titleLine1: string
      titleLine2: string
      intro: string
      detail: string
      imageAlt: string
      join: string
      activities: string
    }
    about: {
      eyebrow: string
      index: string
      titleLine1: string
      titleLine2: string
      titleLine3: string
      titleAccent: string
      whoTitleLine1: string
      whoTitleLine2: string
      lede: string
      invitation: string
    }
    community: {
      aria: string
      eyebrow: string
      caption: string
    }
    offers: {
      eyebrow: string
      index: string
      title: string
      viewAll: string
      items: Array<{
        num: string
        title: string
        accent: string
        description: string
      }>
    }
    upcoming: {
      eyebrow: string
      index: string
      title: string
      timeTba: string
      placeTba: string
      rainierAction: string
      rainierDisabled: string
      partnerAction: string
      partnerDisabled: string
      partnerSource: string
      posterAlt: string
      bodyAria: string
    }
    gallery: {
      eyebrow: string
      index: string
      title: string
      aria: string
      viewDetails: string
      closeDetails: string
      posterAlt: string
      empty: string
    }
  }
  activities: {
    eyebrow: string
    title: string
    intro: string
    fallbackNotice: string
    pinnedEyebrow: string
    rainierHeading: string
    rainierAccent: string
    rainierSource: string
    partnerEyebrow: string
    partnerHeading: string
    partnerAccent: string
    partnerSource: string
    archiveEyebrow: string
    archiveHeading: string
    archiveAccent: string
    noUpcoming: string
    noPast: string
    allCategories: string
    categoryFilterAria: string
    timeTba: string
    placeTba: string
    comingSoon: string
    posterAlt: string
    posterPlaceholder: string
    expand: string
    collapse: string
    details: string
    review: string
    register: string
    registerDisabled: string
    learnMore: string
    learnMoreDisabled: string
  }
  support: {
    eyebrow: string
    title: string
    intro: string
    merchEyebrow: string
    merchTitle: string
    merchComingSoon: string
    merchSubscribe: string
    merchPreview: string
    merch: Array<{
      id: number
      num: string
      name: string
      accent: string
      description: string
      imageLabel: string
    }>
    ticketsEyebrow: string
    ticketsTitle: string
    ticketsEmpty: string
    ticketsComingSoon: string
    general: string
    generalAccent: string
    supporter: string
    supporterAccent: string
    recommended: string
    register: string
    registerDisabled: string
  }
  subscribe: {
    close: string
    weekly: string
    successEyebrow: string
    successTitle: string
    continue: string
    noteEyebrow: string
    pitch: string
    englishNotice: string
    privacy: string
    sending: string
    sendingAccent: string
    submit: string
    submitAccent: string
    fallbackError: string
    fallbackSuccess: string
  }
  footer: {
    tagline: string
    taglineAccent: string
    menuAria: string
    menuEyebrow: string
    followEyebrow: string
    links: {
      home: string
      about: string
      activities: string
      support: string
    }
    copyrightAccent: string
  }
  sentence: {
    eyebrow: string
    title: string
  }
  carousel: {
    imageAlt: string
    previous: string
    next: string
    goTo: string
  }
  wechat: {
    trigger: string
    triggerAccent: string
    close: string
    eyebrow: string
    title: string
    description: string
    qrAlt: string
    open: string
  }
  activityLanguage: Record<'zh' | 'bilingual' | 'en', string>
}
