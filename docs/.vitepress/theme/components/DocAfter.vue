<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const { site } = useData()

// Only /docs/* and not the root path /docs/ show the footer
const isApiSubpage = computed(() => {
  const path = route.path
  return path.startsWith('/docs/') && path !== '/docs/'
})

const footerMessage = computed(() => {
  const footer = site.value.themeConfig?.footer
  return footer && 'message' in footer ? footer.message : ''
})

const copyright = computed(() => {
  const footer = site.value.themeConfig?.footer
  return footer && 'copyright' in footer ? footer.copyright : ''
})
</script>

<template>
  <footer
    v-if="isApiSubpage"
    class="zla-doc-footer"
    aria-labelledby="zla-doc-footer-title"
    aria-describedby="zla-doc-footer-disclaimer"
  >
    <!-- Auto generation message + contribution -->
    <div class="zla-doc-footer-card">
      <div class="zla-doc-footer-top">
        <div class="zla-doc-footer-label">
          <span
            class="zla-doc-footer-dot"
            aria-hidden="true"
            role="presentation"
          />
          <div class="zla-doc-footer-text">
            <span
              id="zla-doc-footer-title"
              class="zla-doc-footer-title"
            >
              This page is auto generated based on source code.
            </span>
            <span
              id="zla-doc-footer-sub"
              class="zla-doc-footer-sub"
            >
              If something looks incorrect or underspecified, please open a documentation issue to help us improve.
            </span>
          </div>
        </div>

        <div class="zla-doc-footer-actions">
          <a
            href="https://github.com/ZL-Asica/React/issues/new?template=+documentation_update.yml"
            class="zla-doc-footer-chip"
            aria-describedby="zla-doc-footer-sub"
          >
            <span class="zla-doc-footer-chip-label">
              Open documentation issue
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Legal / distribution -->
    <p
      v-if="footerMessage"
      id="zla-doc-footer-disclaimer"
      class="zla-doc-footer-disclaimer"
      v-html="footerMessage"
    />

    <!-- Copyright from VitePress config -->
    <p
      v-if="copyright"
      class="zla-doc-footer-copyright"
      v-html="copyright"
    />
  </footer>
</template>

<style scoped>
.zla-doc-footer {
  margin: 2.5rem 0 -6rem;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in oklab, var(--vp-c-border) 80%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Card */

.zla-doc-footer-card {
  padding: 1rem 1.25rem 0.9rem;
  border-radius: 14px;
  border: 1px solid color-mix(in oklab, var(--vp-c-border) 85%, transparent);
  background: color-mix(in oklab, var(--vp-c-bg-soft) 88%, var(--vp-c-brand-soft) 12%);
}

.dark .zla-doc-footer-card {
  border-color: color-mix(in oklab, var(--vp-c-border) 65%, var(--vp-c-brand-3) 35%);
  background: color-mix(in oklab, var(--vp-c-bg-soft) 80%, var(--vp-c-brand-soft) 20%);
}

.zla-doc-footer-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.zla-doc-footer-label {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.zla-doc-footer-dot {
  position: relative;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--vp-c-brand-2);
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--vp-c-brand-soft) 70%, transparent);
  /* Breathing animation */
  animation: zla-dot-breathe 2.4s ease-in-out infinite;
}

.dark .zla-doc-footer-dot {
  background: var(--vp-c-brand-3);
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--vp-c-brand-soft) 55%, transparent);
}

/* Outer ring diffusion effect, overlaid outside the dot */
.zla-doc-footer-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  border: 1px solid color-mix(in oklab, var(--vp-c-brand-soft) 85%, transparent);
  opacity: 0;
  pointer-events: none;
  animation: zla-dot-ring 2.4s ease-out infinite;
}

/* Animation keyframes */
@keyframes zla-dot-breathe {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--vp-c-brand-soft) 65%, transparent);
  }
  50% {
    transform: scale(1.12);
    box-shadow: 0 0 0 6px color-mix(in oklab, var(--vp-c-brand-soft) 85%, transparent);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--vp-c-brand-soft) 65%, transparent);
  }
}

@keyframes zla-dot-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.35;
  }
  60% {
    transform: scale(1.25);
    opacity: 0;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}

/* Respect system "reduce motion" setting: turn off animations if needed */
@media (prefers-reduced-motion: reduce) {
  .zla-doc-footer-dot,
  .zla-doc-footer-dot::after {
    animation: none;
  }
}

.zla-doc-footer-text {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
}

.zla-doc-footer-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.zla-doc-footer-sub {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.zla-doc-footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.zla-doc-footer-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--vp-c-brand-2) 60%, var(--vp-c-border) 40%);
  background: color-mix(in oklab, var(--vp-c-brand-soft) 65%, var(--vp-c-bg) 35%);
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  color: var(--vp-c-brand-3);
  transition:
    background 0.16s ease-out,
    border-color 0.16s ease-out,
    transform 0.12s ease-out,
    box-shadow 0.16s ease-out;
}

.dark .zla-doc-footer-chip {
  border-color: color-mix(in oklab, var(--vp-c-brand-3) 70%, var(--vp-c-border) 30%);
  background: color-mix(in oklab, var(--vp-c-brand-soft) 40%, var(--vp-c-bg-soft) 60%);
  color: var(--vp-c-brand-1);
}

.zla-doc-footer-chip:hover {
  transform: translateY(-1px);
  border-color: var(--vp-c-brand-2);
  background: color-mix(in oklab, var(--vp-c-brand-soft) 80%, var(--vp-c-bg) 20%);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}

.dark .zla-doc-footer-chip:hover {
  border-color: var(--vp-c-brand-3);
  background: color-mix(in oklab, var(--vp-c-brand-soft) 55%, var(--vp-c-bg-soft) 45%);
}

.zla-doc-footer-chip-label {
  white-space: nowrap;
}

.zla-doc-footer-disclaimer {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.zla-doc-footer-copyright {
  margin: 0;
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
}

/* Responsive */
@media (max-width: 640px) {
  .zla-doc-footer-top {
    align-items: flex-start;
  }

  .zla-doc-footer-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
