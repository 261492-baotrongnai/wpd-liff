<!-- SharePoster.vue -->
<template>
  <div ref="root" class="poster">
    <div class="poster-bg" aria-hidden="true"></div>

    <div class="poster-inner">
      <!-- โปรไฟล์ -->
      <div class="profile">
        <div class="avatar" :style="ringStyle">
          <img
            v-if="profileImage"
            class="profile-pic"
            :src="profileImage"
            :alt="profileName || 'โปรไฟล์'"
            crossorigin="anonymous"
          />
          <div v-else class="avatar-fallback">{{ initials }}</div>
          <img v-if="frameImage" :src="frameImage" alt="Profile frame" class="profile-frame" />
        </div>
        <div class="profile-name">{{ profileName || 'ผู้ใช้' }}</div>
      </div>

      <!-- การ์ดแต้ม -->
      <div class="points-card">
        <div class="points-col left">สะสม<br />แต้มได้</div>
        <div class="points-col mid">{{ totalPoints }}</div>
        <div class="points-col right">แต้ม</div>
      </div>

      <!-- เหรียญ / coin -->
      <div class="coins">
        <!-- หัวแถว: มงกุฎ + ข้อความ -->
        <div class="coins-header">
          <img :src="icon" alt="" class="coins-icon" />
          <span>สถิติบันทึกนานสุด</span>
        </div>

        <!-- แถวเหรียญ -->
        <div class="coins-list">
          <template v-if="stages && stages.length">
            <div v-for="s in stages" :key="s.threshold" class="coin-img-wrap">
              <img
                :src="streakCurrent >= s.threshold ? s.imgActive : s.imgInactive"
                :alt="`${s.threshold}-day badge`"
                class="coin-img"
                crossorigin="anonymous"
              />
            </div>
          </template>
          <template v-else>
            <div
              v-for="t in defaultThresholds"
              :key="t"
              class="coin"
              :class="{ on: streakCurrent >= t }"
            >
              <span class="coin-num">{{ t }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- เส้นคั่น -->
      <div class="separator" />

      <!-- มะลิ (การ์ด 2 คอลัมน์) -->
      <div class="mali-card">
        <img
          v-if="maliImage"
          :src="maliImage"
          alt="Mali"
          class="mali-thumb"
          crossorigin="anonymous"
        />
        <div class="mali-content">
          <div class="mali-heading">{{ maliTitle }}</div>

          <!-- แถบความคืบหน้า + ตัวเลขอยู่ "กึ่งกลางแถบ" -->
          <div class="mali-track" :style="{ '--pct': maliPercent + '%' }">
            <div class="mali-fill"></div>
            <div class="mali-badge">{{ maliCurrent }}/{{ maliTarget }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import bgUrl from '@/assets/achievement/bg-poster.png'
import icon from '@/assets/achievement/active-stat-icon.png'

type CoinStage = { threshold: number; imgActive: string; imgInactive: string }
type Streaks = number | { current: number; target?: number }

const props = defineProps<{
  profileName?: string
  profileImage?: string
  frameImage?: string

  points?: number
  /* coin */
  streaks?: Streaks
  coinStages?: CoinStage[]

  /* mali */
  maliDays?: number
  maliTarget?: number
  maliImage?: string
}>()

const root = ref<HTMLElement | null>(null)

/* ===== helpers ===== */
const cssBg = computed(() => `url(${bgUrl})`)

// กรอบโปรไฟล์
const ringStyle = computed(
  (): CSSProperties & Record<'--ring-scale' | '--ring-x' | '--ring-y', string> => {
    const scale = 1.6,
      dx = 0,
      dy = 0
    return {
      '--ring-scale': String(scale),
      '--ring-x': `${dx}px`,
      '--ring-y': `${dy}px`,
    }
  },
)
const initials = computed(() => props.profileName?.trim()?.[0] ?? '🙂')

// แต้มรวม
const totalPoints = computed(() => Number(props.points ?? 0))

/* coin */
const defaultThresholds = [10, 30, 60, 90]
const stages = computed<CoinStage[] | null>(() =>
  Array.isArray(props.coinStages) && props.coinStages.length ? props.coinStages : null,
)
const streakCurrent = computed(() => {
  const s = props.streaks
  return typeof s === 'number' ? s : Number(s?.current ?? 0)
})

/* mali */
const maliCurrent = computed(() => Number(props.maliDays ?? 0))
const maliTarget = computed(() => Number(props.maliTarget ?? 60))
const maliImage = computed(() => props.maliImage || '')

const maliPercent = computed(() =>
  Math.min(100, Math.round((maliCurrent.value / maliTarget.value) * 100)),
)

const maliTitle = computed(() => {
  const d = maliCurrent.value
  if (d >= 90) return 'มะลิหอมฟุ้งข้ามรั้ว'
  if (d >= 75) return 'มะลิหอมฟุ้ง'
  if (d >= 60) return 'มะลิดอกบาน'
  if (d >= 30) return 'มะลิดอกตูม'
  if (d >= 10) return 'พุ่มมะลิ'
  if (d >= 1) return 'พุ่มมะลิจิ๋ว'
  return 'ต้นอ่อนมะลิ'
})

/* ===== html2canvas ===== */
function waitForImages(el: HTMLElement) {
  const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[]
  return Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((r) => {
            img.onload = () => r()
            img.onerror = () => r()
          }),
    ),
  )
}

async function renderToBlob(targetWidth = 1200): Promise<Blob> {
  if (!root.value) throw new Error('poster root missing')
  await nextTick()
  await waitForImages(root.value)
  const clone = root.value.cloneNode(true) as HTMLElement
  Object.assign(clone.style, {
    width: `${targetWidth}px`,
    height: `${Math.round((targetWidth * 4) / 3)}px`,
    position: 'fixed',
    left: '-999999px',
    top: '0',
    maxWidth: 'none',
    transform: 'none',
    boxShadow: 'none',
    zIndex: '-1',
  } as CSSStyleDeclaration)
  document.body.appendChild(clone)
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(clone, { useCORS: true, backgroundColor: null, scale: 2 })
  document.body.removeChild(clone)
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob failed'))), 'image/png'),
  )
}
export type AchievePosterExpose = { renderToBlob: (targetWidth?: number) => Promise<Blob> }
defineExpose<AchievePosterExpose>({ renderToBlob })
</script>

<style scoped>
.poster {
  --poster-w: min(900px, 80vw);
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
  align-items: center;
  gap: 18px;
}

/* โปรไฟล์ */
.profile {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}
.avatar {
  margin-top: 30px;
  position: relative;
  width: 250px;
  aspect-ratio: 1/1;
  line-height: 0;
}
.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  display: block;
}
.profile-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 2;
  transform: translate(var(--ring-x, 0), var(--ring-y, 0)) scale(var(--ring-scale, 1));
  transform-origin: center;
}
.avatar-fallback {
  font-size: 34px;
  color: #386496;
  line-height: 1;
}
.profile-name {
  color: #194678;
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 60px;
}

/* คะแนน */
.points-card {
  margin-top: 60px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  column-gap: 80px;
  align-items: center;
}
.points-col {
  text-align: center;
  color: #194678;
  font-family: 'Noto Looped Thai UI';
}
.points-col.left {
  font-size: 50px;
  line-height: 1.5;
}
.points-col.mid {
  font-family: 'gift';
  font-size: 120px;
  margin-top: -60px;
}
.points-col.right {
  font-size: 50px;
}

/* เหรียญ */
.coins {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  width: min(700px, 92%);
  margin-top: 60px;
}
.coins-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  color: #194678;
  font-family: 'Noto Looped Thai UI';
  font-size: 55px;
}
.coins-icon {
  margin-top: 35px;
  width: 80px;
  height: 80px;
}
.coins-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 10px;
}
.coin-img-wrap {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.coin-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.coin {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e9e9e9;
  color: #757575;
  font-family: 'gift';
  font-size: 28px;
}
.coin.on {
  background: #d9ecff;
  color: #2a6fb3;
  box-shadow: 0 0 0 3px #bee1ff inset;
}
.coin-num {
  transform: translateY(2px);
}

/* เส้นคั่น */
.separator {
  width: min(700px, 92%);
  height: 2px;
  background: #e6e4e4;
  border-radius: 999px;
  margin: 30px 0 20px;
}

/* มะลิเป็นการ์ด 2 คอลัมน์ */
.mali-card {
  width: min(700px, 92%);
  display: grid;
  grid-template-columns: 230px 1fr;
  align-items: center;
  gap: 16px;
}
.mali-thumb {
  width: 230px;
  height: auto;
  justify-self: center;
}
.mali-content {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: -75px;
}
.mali-heading {
  color: #194678;
  font-family: 'Noto Looped Thai UI';
  font-size: 55px;
  font-weight: 600;
}

/* แถบความคืบหน้ามะลิ */
.mali-track {
  --pct: 0%;
  position: relative;
  width: 100%;
  height: 40px;
  background: #eef3f7;
  border-radius: 999px;
  overflow: hidden;
}
.mali-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--pct);
  background: linear-gradient(90deg, #cfe6ff, #d9ecff);
}

/* ตัวเลข "อยู่กลางแถบ" เสมอ */
.mali-badge {
  position: absolute;
  top: -30%;
  left: 50%; /* กลางแนวนอน */
  transform: translate(-50%, -50%);
  padding: 2px 12px;
  border-radius: 999px;
  color: #194678;
  font-family: 'merry';
  font-size: 55px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}
</style>
