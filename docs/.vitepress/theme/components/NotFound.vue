<script setup lang="ts">
import type { LangCode } from '../utils/error404I18n'
import { useRouter, withBase } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { get404Config } from '../utils/error404I18n'

const router = useRouter()

const ERROR_CODE = '404' as const

const lang = ref<LangCode>('zh-CN')
const title = ref('404 - 迷路啦 🐾')
const desc = ref('唔… 页面跑去喝奶茶了？再看看首页吧 🍵')
const countdownTotal = ref(10)
const countdown = ref(10)
const redirectURL = ref(withBase('/'))
const countdownTail = ref('秒后将自动跳转到首页。')
const dir = ref<'ltr' | 'rtl'>('ltr')
const goHomeLabel = ref('返回首页')
const goBackLabel = ref('返回上一页')
const actionsLabel = ref('可用操作')
const noRedirectHint = ref('如果没有自动跳转，请点击「返回首页」按钮～')

// aria text based on countdown
const countdownAria = computed(() => `${countdown.value} 秒后将自动跳转到首页`)

const homeHref = computed(() => redirectURL.value)

function goHome() {
  router.go(redirectURL.value.replace(window.location.origin, '')) // Relative to base
}

function goBack() {
  if (history.length > 1 && document.referrer) {
    history.back()
  }
  else {
    goHome()
  }
}

let timer: number | undefined
let robotsMeta: HTMLMetaElement | null = null
let errorCodeMeta: HTMLMetaElement | null = null

onMounted(() => {
  const { lang: l, cfg } = get404Config()

  lang.value = l
  title.value = cfg.title
  desc.value = cfg.desc
  countdownTotal.value = cfg.countdown
  countdown.value = cfg.countdown
  redirectURL.value = withBase(cfg.redirectURL || '/')
  countdownTail.value = cfg.countdownTail
  dir.value = cfg.dir
  goHomeLabel.value = cfg.goHome
  goBackLabel.value = cfg.goBack
  actionsLabel.value = cfg.actionsLabel
  noRedirectHint.value = cfg.noRedirectHint

  document.title = cfg.title
  document.documentElement.lang = l
  document.documentElement.dir = cfg.dir

  const head = document.head

  // robots
  robotsMeta = head.querySelector('meta[name="robots"][data-404]') as HTMLMetaElement | null
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.name = 'robots'
    robotsMeta.setAttribute('data-404', '1')
    head.appendChild(robotsMeta)
  }
  robotsMeta.content = 'noindex, nofollow, noarchive'

  // error-code
  errorCodeMeta = head.querySelector('meta[name="error-code"][data-404]') as HTMLMetaElement | null
  if (!errorCodeMeta) {
    errorCodeMeta = document.createElement('meta')
    errorCodeMeta.name = 'error-code'
    errorCodeMeta.setAttribute('data-404', '1')
    head.appendChild(errorCodeMeta)
  }
  errorCodeMeta.content = ERROR_CODE

  // Count down & auto redirect
  timer = window.setInterval(() => {
    if (countdown.value <= 1) {
      window.clearInterval(timer)
      goHome()
    }
    else {
      countdown.value -= 1
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer != null) {
    window.clearInterval(timer)
  }
})
</script>

<template>
  <div class="nf-root">
    <a class="nf-skip" href="#nf-main">
      {{ /* cfg.skip */ '跳到主内容' }}
    </a>

    <main
      id="nf-main"
      class="nf-main"
      role="main"
      :dir="dir"
      aria-labelledby="nf-title"
    >
      <header class="nf-header">
        <p class="nf-badge">
          {{ ERROR_CODE }}
        </p>
        <h1 id="nf-title" class="nf-title">
          {{ title }}
        </h1>
      </header>

      <p id="nf-desc" class="nf-desc">
        {{ desc }}
      </p>

      <p
        class="nf-countdown"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          class="nf-countdown-number"
          role="status"
          :aria-label="countdownAria"
        >
          {{ countdown }}
        </span>
        <span class="nf-countdown-tail">
          {{ countdownTail }}
        </span>
      </p>

      <nav
        class="nf-actions"
        :aria-label="actionsLabel"
      >
        <a
          :href="homeHref"
          class="nf-btn nf-btn-primary"
        >
          {{ goHomeLabel }}
        </a>
        <button
          type="button"
          class="nf-btn nf-btn-secondary"
          aria-describedby="nf-desc"
          @click="goBack"
        >
          {{ goBackLabel }}
        </button>
      </nav>

      <p class="nf-hint">
        {{ noRedirectHint }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.nf-root {
  min-height: 70vh;
  padding: 2rem 1.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* Skip link */
.nf-skip {
  position: absolute;
  left: -999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.nf-skip:focus-visible {
  left: 1.5rem;
  top: 1.25rem;
  width: auto;
  height: auto;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-2);
  color: var(--vp-c-text-1);
  z-index: 20;
}

/* Card */
.nf-main {
  max-width: 640px;
  width: 100%;
  border-radius: 20px;
  padding: 2.2rem 2.4rem 2rem;
  border: 1px solid color-mix(in oklab, var(--vp-c-border) 85%, transparent);
  background: color-mix(in oklab, var(--vp-c-bg-soft) 88%, var(--vp-c-brand-soft) 12%);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.dark .nf-main {
  border-color: color-mix(in oklab, var(--vp-c-border) 65%, var(--vp-c-brand-3) 35%);
  background: color-mix(in oklab, var(--vp-c-bg-soft) 80%, var(--vp-c-brand-soft) 20%);
}

/* Header */
.nf-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}

.nf-badge {
  margin: 0;
  padding: 0.18rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-brand-3);
  background: color-mix(in oklab, var(--vp-c-brand-soft) 80%, transparent);
  border: 1px solid color-mix(in oklab, var(--vp-c-brand-2) 55%, var(--vp-c-border) 45%);
}

.nf-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
}

/* Description */
.nf-desc {
  margin: 0.4rem 0 0.9rem;
  font-size: 0.96rem;
  color: var(--vp-c-text-2);
}

/* Countdown */
.nf-countdown {
  margin: 0.25rem 0 1.4rem;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
}

.nf-countdown-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  margin-right: 0.3rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--vp-c-brand-soft) 75%, transparent);
  color: var(--vp-c-brand-3);
  font-weight: 600;
}

.dark .nf-countdown-number {
  background: color-mix(in oklab, var(--vp-c-brand-soft) 55%, transparent);
  color: var(--vp-c-brand-1);
}

.nf-countdown-tail {
  vertical-align: middle;
}

/* Actions */
.nf-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
  margin-bottom: 0.6rem;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
  padding: 0.5rem 1.4rem;
  border-radius: 999px;
  font-size: 0.86rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background 0.16s ease-out,
    border-color 0.16s ease-out,
    transform 0.12s ease-out,
    box-shadow 0.16s ease-out,
    color 0.16s ease-out;
}

/* Primary: filled */
.nf-btn-primary {
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  border-color: color-mix(in oklab, var(--vp-c-brand-3) 80%, var(--vp-c-border) 20%);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}

.nf-btn-primary:hover {
  transform: translateY(-1px);
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.nf-btn-primary:active {
  transform: translateY(0);
  background: var(--vp-c-brand-1);
}

/* Secondary: ghost */
.nf-btn-secondary {
  background: transparent;
  color: var(--vp-c-text-1);
  border-color: color-mix(in oklab, var(--vp-c-border) 80%, var(--vp-c-brand-soft) 20%);
}

.nf-btn-secondary:hover {
  background: color-mix(in oklab, var(--vp-c-brand-soft) 75%, transparent);
  border-color: color-mix(in oklab, var(--vp-c-brand-2) 60%, var(--vp-c-border) 40%);
}

.dark .nf-btn-secondary {
  color: var(--vp-c-text-1);
  border-color: color-mix(in oklab, var(--vp-c-border) 65%, var(--vp-c-brand-3) 35%);
}

.dark .nf-btn-secondary:hover {
  background: color-mix(in oklab, var(--vp-c-brand-soft) 55%, transparent);
}

/* Small hint text */
.nf-hint {
  margin: 0.4rem 0 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

/* Responsive */
@media (max-width: 640px) {
  .nf-root {
    padding: 2.5rem 1.1rem 3rem;
  }

  .nf-main {
    padding: 1.8rem 1.5rem 1.7rem;
  }

  .nf-title {
    font-size: 1.4rem;
  }
}
</style>
