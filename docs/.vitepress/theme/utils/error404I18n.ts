export type LangCode = 'zh-CN' | 'zh-HK' | 'en' | 'ja' | 'ar'

interface Error404Config {
  title: string
  desc: string
  countdownTail: string
  countdownAria: (n: number) => string
  goHome: string
  goBack: string
  skip: string
  actionsLabel: string
  noRedirectHint: string
  redirectURL: string
  countdown: number
  dir: 'ltr' | 'rtl'
}

/* ---------- translations & per-code overrides ---------- */
/* base keys: title, desc, countdownTail, countdownAria(n), goHome, goBack, skip, actionsLabel, dir, redirectURL, countdown */
const PACK_404: Record<LangCode, Error404Config> = {
  'zh-CN': {
    dir: 'ltr',
    title: '404 - 迷路啦 🐾',
    desc: '唔… 页面跑去喝奶茶了？再看看首页吧 🍵',
    countdownTail: '秒后将自动跳转到首页。',
    countdownAria: n => `${n} 秒后将自动跳转到首页`,
    goHome: '返回首页',
    goBack: '返回上一页',
    skip: '跳到主内容',
    actionsLabel: '可用操作',
    noRedirectHint: '如果没有自动跳转，请点击「返回首页」按钮～',
    redirectURL: '/',
    countdown: 10,
  },
  'en': {
    dir: 'ltr',
    title: '404 - Lost your way 🐾',
    desc: 'Hmm… looks like this page ran off for bubble tea 🍵',
    countdownTail: 'seconds before redirecting to the homepage.',
    countdownAria: n => `${n} seconds before redirecting to the homepage`,
    goHome: 'Go Home',
    goBack: 'Go Back',
    skip: 'Skip to main content',
    actionsLabel: 'Available actions',
    noRedirectHint: 'If not redirected automatically, please click the "Go Home" button~',
    redirectURL: '/',
    countdown: 10,
  },
  'ja': {
    dir: 'ltr',
    title: '404 - 迷子になっちゃった 🐾',
    desc: 'ページがお出かけ中みたい…タピオカでも飲みに行ったかな🍵',
    countdownTail: '秒後にホームページへリダイレクトします。',
    countdownAria: n => `${n} 秒後にホームページへリダイレクトします`,
    goHome: 'ホームに戻る',
    goBack: '前のページに戻る',
    skip: 'メインコンテンツへスキップ',
    actionsLabel: '利用可能な操作',
    noRedirectHint: '自動的にリダイレクトされない場合は、「ホームに戻る」ボタンをクリックしてください～',
    redirectURL: '/',
    countdown: 10,
  },
  'ar': {
    dir: 'rtl',
    title: '404 - تائه قليلاً 🐾',
    desc: 'يبدو أن الصفحة خرجت لتشرب شاي الفقاعات 🍵',
    countdownTail: 'ثانية قبل إعادة التوجيه إلى الصفحة الرئيسية.',
    countdownAria: n => `سيتم إعادة التوجيه إلى الصفحة الرئيسية خلال ${n} ثانية`,
    goHome: 'الصفحة الرئيسية',
    goBack: 'عودة',
    skip: 'التخطي إلى المحتوى الرئيسي',
    actionsLabel: 'إجراءات متاحة',
    noRedirectHint: 'إذا لم يتم إعادة التوجيه تلقائيًا، يرجى النقر على زر "الصفحة الرئيسية"~',
    redirectURL: '/',
    countdown: 10,
  },
  'zh-HK': {
    dir: 'ltr',
    title: '404 - 迷路囉 🐾',
    desc: '唔… 這個頁面好像跑去喝珍奶了？🍵',
    countdownTail: '秒後將自動跳轉到首頁。',
    countdownAria: n => `${n} 秒後將自動跳轉到首頁`,
    goHome: '返回首頁',
    goBack: '返回上一頁',
    skip: '跳到主內容',
    actionsLabel: '可用操作',
    noRedirectHint: '如果沒有自動跳轉，請點擊「返回首頁」按鈕～',
    redirectURL: '/',
    countdown: 10,
  },
}

// ---- Language / Error Code Detection (with SSR protection) ----
export function pickLang(): LangCode {
  if (typeof window === 'undefined') {
    // simply use en in SSR, wait for client to refine
    return 'en'
  }

  try {
    const qs = new URLSearchParams(window.location.search)
    const q = qs.get('lang')
    if (q !== null && ['zh-CN', 'zh-HK', 'en', 'ja', 'ar'].includes(q)) {
      window.localStorage.setItem('lang', q)
      return q as LangCode
    }

    const stored = window.localStorage.getItem('lang')
    if (stored !== null && ['zh-CN', 'zh-HK', 'en', 'ja', 'ar'].includes(stored)) {
      return stored as LangCode
    }

    const nav = (window.navigator.language || 'en').toLowerCase()
    if (nav.startsWith('zh-tw') || nav.startsWith('zh-hk') || nav.startsWith('zh-mo')) {
      return 'zh-HK'
    }
    if (nav.startsWith('zh')) {
      return 'zh-CN'
    }
    if (nav.startsWith('ar')) {
      return 'ar'
    }
    if (nav.startsWith('ja') || nav.startsWith('jp')) {
      return 'ja'
    }
    return 'en'
  }
  catch {
    return 'en'
  }
}

export function get404Config(options?: {
  lang?: LangCode
  defaultCode?: string
}): { lang: LangCode, cfg: Error404Config } {
  const lang = options?.lang ?? pickLang()
  const cfg = PACK_404[lang] ?? PACK_404.en
  return { lang, cfg }
}
