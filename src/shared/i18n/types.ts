import type { Locale } from './locales';

export interface CommonDictionary {
  viewMore: string;
  viewDetails: string;
  contactNow: string;
  requestQuote: string;
  search: string;
  searchPlaceholder: string;
  close: string;
  back: string;
  submit: string;
  submitting: string;
  loading: string;
  updating: string;
  all: string;
  other: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  status: string;
  readMore: string;
  share: string;
  download: string;
  hotline: string;
  consultation: string;
  emptyData: string;
  pageNotFound: string;
  backToHome: string;
  previousPage: string;
  nextPage: string;
  results: string;
  filter: string;
  clear: string;
  clearAll: string;
}

export interface HeaderDictionary {
  hotlineLabel: string;
  searchPlaceholder: string;
  consultationCta: string;
  switchLanguage: string;
  viLanguage: string;
  enLanguage: string;
  menuAria: string;
  searchAria: string;
  login: string;
  portal: string;
}

export interface FooterDictionary {
  companyTitle: string;
  taxCodeLabel: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
  newsletterSuccess: string;
  newsletterSubmitting: string;
  navigationTitle: string;
  solutionsAndServicesTitle: string;
  solutionsTitle: string;
  servicesTitle: string;
  headOfficeTitle: string;
  branchesTitle: string;
  workingHoursTitle: string;
  workingHoursValue: string;
  copyright: string;
  privacyPolicy: string;
  termsOfUse: string;
}

export interface HomeDictionary {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroExploreCta: string;
  heroContactCta: string;
  statsClients: string;
  statsYears: string;
  statsProjects: string;
  statsExperts: string;
  featuredSolutionsTitle: string;
  featuredSolutionsSubtitle: string;
  featuredServicesTitle: string;
  featuredServicesSubtitle: string;
  featuredProjectsTitle: string;
  featuredProjectsSubtitle: string;
  latestNewsTitle: string;
  latestNewsSubtitle: string;
  partnersTitle: string;
  partnersSubtitle: string;
  awardsTitle: string;
  awardsSubtitle: string;
}

export interface ProductsDictionary {
  catalogTitle: string;
  catalogSubtitle: string;
  filterTitle: string;
  filterAll: string;
  filterCategory: string;
  filterBrand: string;
  filterApplication: string;
  filterSoftwareType: string;
  filterProductType: string;
  filterSelected: string;
  filterClear: string;
  filterClearAll: string;
  filterKeyword: string;
  filterKeywordPlaceholder: string;
  filterShowMore: string;
  filterShowLess: string;
  filterMobileOpen: string;
  filterMobileClose: string;
  activeFiltersLabel: string;
  sortDefault: string;
  sortNameAsc: string;
  resultsFound: string;
  searchPrompt: string;
  priceContact: string;
  priceLabel: string;
  priceLicenseLabel: string;
  viewProductDetails: string;
  productNotFound: string;
  overviewTab: string;
  featuresTab: string;
  specsTab: string;
  documentsTab: string;
  videosTab: string;
  relatedProducts: string;
  requestPricingTitle: string;
  requestPricingDesc: string;
  downloadBrochure: string;
  downloadTrial: string;
  btnConsult: string;
  btnDownload: string;
  btnBuy: string;
  btnBack: string;
  readMoreContent: string;
  collapseContent: string;
  directContactTitle: string;
  noPhone: string;
  businessSupport: string;
  technicalSupport: string;
  modalConsultTitle: string;
  modalDownloadTitle: string;
  modalBuyTitle: string;
  classificationInfo: string;
}

export interface ServicesDictionary {
  catalogTitle: string;
  catalogSubtitle: string;
  consultationTitle: string;
  consultationSubtitle: string;
  processTitle: string;
  processSubtitle: string;
  relatedProducts: string;
  relatedServices: string;
  serviceDetail: string;
  requestServiceCta: string;
  searchPlaceholder: string;
  backToList: string;
  formNameLabel: string;
  formPhoneLabel: string;
  formEmailLabel: string;
  formServiceLabel: string;
  formNoteLabel: string;
  formSubmitBtn: string;
  formSuccess: string;
  formError: string;
  overview: string;
  workflow: string;
}

export interface ProjectsDictionary {
  catalogTitle: string;
  catalogSubtitle: string;
  filterAllFields: string;
  filterAll: string;
  filterSector: string;
  filterSolution: string;
  filterCustomer: string;
  searchPlaceholder: string;
  clientLabel: string;
  fieldLabel: string;
  solutionLabel: string;
  yearLabel: string;
  locationLabel: string;
  emptyProjectsEn: string;
  viewProject: string;
  projectGallery: string;
  backToList: string;
  relatedProjects: string;
  scopeOfWork: string;
  resultsOutcome: string;
}

export interface NewsDictionary {
  catalogTitle: string;
  catalogSubtitle: string;
  featuredPosts: string;
  latestPosts: string;
  categories: string;
  publishedAt: string;
  author: string;
  readTime: string;
  relatedArticles: string;
  emptyCategory: string;
  searchNewsPlaceholder: string;
  filterAll: string;
  readMore: string;
  backToList: string;
  attachedDocuments: string;
  shareArticle: string;
}

export interface ContactDictionary {
  pageTitle: string;
  pageSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  serviceInterestLabel: string;
  captchaLabel: string;
  captchaPlaceholder: string;
  captchaError: string;
  submitButton: string;
  submittingButton: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  directContactTitle: string;
  headOfficeLabel: string;
  hcmBranchLabel: string;
  danangBranchLabel: string;
  workingHours: string;
  officeMapTitle: string;
  modalConsultationTitle: string;
  modalConsultationSubtitle: string;
  selectNeedPlaceholder: string;
}

export interface AboutDictionary {
  pageTitle: string;
  pageSubtitle: string;
  visionTitle: string;
  missionTitle: string;
  coreValuesTitle: string;
  leadershipTitle: string;
  milestonesTitle: string;
  partnerNetworkTitle: string;
  credentialsTitle: string;
}

export interface LegalDictionary {
  termsOfService: string;
  privacyPolicy: string;
  lastUpdated: string;
  legalContactTitle: string;
}

export interface ErrorsDictionary {
  notFoundCode: string;
  notFoundTitle: string;
  notFoundDescription: string;
  serverErrorCode: string;
  serverErrorTitle: string;
  serverErrorDescription: string;
  backToHomeButton: string;
  backToPreviousButton: string;
  checkUrlNotice: string;
}

export interface SeoDictionary {
  defaultTitle: string;
  defaultDescription: string;
  keywords: string;
  homeTitle: string;
  homeDescription: string;
  productsTitle: string;
  productsDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  projectsTitle: string;
  projectsDescription: string;
  newsTitle: string;
  newsDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
}

export interface TranslationDictionary {
  locale: Locale;
  common: CommonDictionary;
  header: HeaderDictionary;
  footer: FooterDictionary;
  home: HomeDictionary;
  products: ProductsDictionary;
  services: ServicesDictionary;
  projects: ProjectsDictionary;
  news: NewsDictionary;
  contact: ContactDictionary;
  about: AboutDictionary;
  legal: LegalDictionary;
  errors: ErrorsDictionary;
  seo: SeoDictionary;
}
