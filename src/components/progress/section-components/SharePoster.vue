<!-- SharePoster.vue -->
<template>
  <div ref="root" class="poster">
    <div class="poster-bg" aria-hidden="true"></div>

    <div class="poster-inner">
      <div class="poster-header">
        <div class="title">ภาพรวมมื้ออาหาร</div>
        <div class="date">{{ displayDate }}</div>
      </div>

      <div class="meals">
        <div v-for="(m, i) in meals" :key="m.signedUrl || i" class="meal-card">
          <div class="grade grade-text" :class="'grade-' + m.grade">{{ m.grade }}</div>

          <div
            class="thumb-box"
            :style="{ backgroundImage: `url(${m.signedUrl})` }"
            role="img"
            :aria-label="m.name"
          />
          <!-- ใช้ชื่อที่ถูกตัดตามจำนวนตัวอักษร: ถ้ายาวเกิน MAX_CHARS ตัด 4 ตัวท้าย แล้วเติม ... -->
          <div class="name" :title="m.name">{{ cutByChars(m.name) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import bgUrl from '@/assets/progress/stat/poster-bg.jpg'

type Grade = 'A' | 'B' | 'C'
type PosterMeal = { signedUrl: string; name: string; grade: Grade }

const props = defineProps<{ date: string; meals: PosterMeal[] }>()
const root = ref<HTMLElement | null>(null)

/* ===== helpers ===== */
const cssBg = computed(() => `url(${bgUrl})`)
const displayDate = computed(() => {
  if (!props.date) return ''
  const [y, m, d] = props.date.split('-').map(Number)
  const local = new Date(y, m - 1, d)
  return local.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
})

function waitForImages(el: HTMLElement) {
  const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[]
  return Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }),
    ),
  )
}

async function recomputeForClone() {
  const d = document as Document & { fonts?: FontFaceSet }
  if (d.fonts?.ready) await d.fonts.ready
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type, quality)
  })
}

async function renderToBlob(targetWidth = 1200): Promise<Blob> {
  if (!root.value) throw new Error('poster root missing')
  await nextTick()
  await waitForImages(root.value)
  const d = document as Document & { fonts?: FontFaceSet }
  if (d.fonts?.ready) await d.fonts.ready

  const TARGET_W = targetWidth
  const TARGET_H = Math.round((TARGET_W * 4) / 3)

  const clone = root.value.cloneNode(true) as HTMLElement
  Object.assign(clone.style, {
    width: `${TARGET_W}px`,
    height: `${TARGET_H}px`,
    position: 'fixed',
    left: '-999999px',
    top: '0',
    maxWidth: 'none',
    transform: 'none',
    boxShadow: 'none',
    zIndex: '-1',
  } as CSSStyleDeclaration)
  document.body.appendChild(clone)

  await recomputeForClone()

  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(clone, { useCORS: true, backgroundColor: null, scale: 2 })
  document.body.removeChild(clone)

  return canvasToBlob(canvas)
}

export type SharePosterExpose = { renderToBlob: (targetWidth?: number) => Promise<Blob> }
defineExpose<SharePosterExpose>({ renderToBlob })

/* ===== ตัดชื่อแบบ “ลบ 4 ตัวท้ายแล้วเติม … ถ้ายาวเกินขีดจำกัด” ===== */
const MAX_CHARS = 13
const REPLACE_TAIL = 3

function cutByChars(name: string): string {
  if (!name) return ''
  const cleaned = name.replace(/\(.*?\)|\[.*?\]|（.*?）/g, '').trim()
  if (cleaned.length <= MAX_CHARS) return cleaned
  const keep = Math.max(0, MAX_CHARS - REPLACE_TAIL)
  return cleaned.slice(0, keep) + '...'
}
</script>

<style scoped>
/* ===== โครงโปสเตอร์ (คงเดิม) ===== */
.poster {
  --pad: 20px;
  --poster-w: min(900px, 80vw);
  --card-max: 300px;
  --gap-x: 80px;
  --gap-y: 60px;
  width: var(--poster-w);
  aspect-ratio: 3/4;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.poster-bg {
  position: absolute;
  inset: 0;
  background-image: v-bind(cssBg);
  background-size: cover;
  background-position: center;
}
.poster-inner {
  position: absolute;
  inset: 40px;
  display: flex;
  flex-direction: column;
}
.poster-header {
  text-align: left;
  margin-top: -15px;
}
.title {
  color: #386496;
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 70px;
  font-weight: 400;
  padding-left: 25px;
}
.date {
  padding-left: 25px;
  color: #386496;
  font-family: 'Noto Looped Thai UI';
  font-size: 55px;
  font-weight: 500;
}

/* ===== การ์ด ===== */
.meals {
  padding-top: 180px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: var(--gap-x);
  row-gap: var(--gap-y);
  max-width: calc(3 * var(--card-max) + var(--gap-x));
  margin: 0 auto;
  /* ไม่ต้องใส่ justify-content หรือ justify-items */
}
.meal-card {
  --card-bg: #e6f2ff;
  --card-bg-rgb: 230 242 255;
  position: relative;
  padding: 20px 30px;
  width: 100%;
  max-width: var(--card-max);
  background-color: var(--card-bg);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.thumb-box {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 5px solid #f5faff;
  background-size: cover;
  background-position: center;
}

/* ===== ชื่อเมนู ===== */
.meal-card .name {
  margin-top: -5px;
  display: block;
  min-width: 0;
  max-width: 100%;
  margin-inline: auto;
  padding: 0 10px;
  color: #386496;
  font-family: 'Noto Looped Thai UI';
  font-size: 35px;
  line-height: 2.3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* กันเคสที่พื้นที่แคบมาก ๆ อีกชั้น */
  position: relative;
}

/* ===== ป้ายเกรด (คงเดิม) ===== */
.grade-A {
  top: -25px;
  right: -40px;
  width: 85px;
  height: 85px;
  border-radius: 50%;
  position: absolute;
  background: #d7f4bc;
  color: #3d8200;
  margin: 0 20px 15px 20px;
  padding: 0;
  z-index: 2;
  font-family: star;
  font-size: 60px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.15px;
}
.grade-B {
  top: -25px;
  right: -40px;
  width: 85px;
  height: 85px;
  border-radius: 50%;
  position: absolute;
  background: #fff59b;
  color: #777500;
  margin: 0 20px 15px 20px;
  padding: 0;
  z-index: 2;
  font-family: star;
  font-size: 60px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.15px;
}
.grade-C {
  top: -25px;
  right: -40px;
  width: 85px;
  height: 85px;
  border-radius: 50%;
  position: absolute;
  background: #ffc7c4;
  color: #7b4c49;
  margin: 0 20px 15px 20px;
  padding: 0;
  z-index: 2;
  font-family: star;
  font-size: 60px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.15px;
}
</style>
