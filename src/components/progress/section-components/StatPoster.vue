<!-- StatPoster.vue -->
<template>
  <div ref="root" class="stat-poster">
    <div class="stat-poster-bg" aria-hidden="true"></div>

    <div class="stat-poster-inner">
      <!-- Header -->
      <div class="period">
        <div class="title">สถิติของ{{ getPeriodText().label }}</div>
        <div class="date">{{ displayDate }}</div>
      </div>

      <!-- Profile (ใหม่) -->
      <div class="profile">
        <div class="avatar">
          <img v-if="profileImage" :src="profileImage" :alt="profileName || 'โปรไฟล์'" />
          <div v-else class="avatar-fallback">{{ initials }}</div>
        </div>
        <div class="profile-name">{{ profileName || 'ผู้ใช้' }}</div>
      </div>

      <!-- Grade Box (ธีมเดียวกับ SummaryFlex) -->
      <div class="grade-box" :style="gradeStyle">
        <div class="grade-section">
          <div class="grade-label">
            <p>เกรดเฉลี่ย</p>
            <p class="period-label">{{ getPeriodText().label }}</p>
          </div>
        </div>

        <div class="grade-section grade-center" v-if="hasData">
          <div class="grade-badge">
            <p class="grade-value">{{ normalizedGrade }}</p>
          </div>
        </div>

        <div class="grade-section grade-art" v-if="hasData">
          <img v-if="currentNurse" class="nurse-img" :src="currentNurse" alt="พยาบาลมะลิ" />
        </div>

        <div class="grade-section" v-else>
          <p class="grade-value na-grade">ยังไม่มีข้อมูล <br />การบันทึกนะคะ</p>
        </div>
      </div>

      <!-- Breakdown A/B/C -->
      <div class="breakdown">
        <div class="count-box bg-a">
          <p class="count-label color-a">ได้เกรด A</p>
          <p class="count-value color-a">{{ stats?.countA ?? 0 }}</p>
          <p class="times-label color-a">ครั้ง</p>
        </div>

        <div class="count-box bg-b">
          <p class="count-label color-b">ได้เกรด B</p>
          <p class="count-value color-b">{{ stats?.countB ?? 0 }}</p>
          <p class="times-label color-b">ครั้ง</p>
        </div>

        <div class="count-box bg-c">
          <p class="count-label color-c">ได้เกรด C</p>
          <p class="count-value color-c">{{ stats?.countC ?? 0 }}</p>
          <p class="times-label color-c">ครั้ง</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import bgUrl from '@/assets/progress/stat/stat-bg.jpg'

type StatType = 'day' | 'week' | 'month'
type MealStats = {
  avgGrade: string
  countA: number
  countB: number
  countC: number
  totalFood?: number
  totalMeals?: number
}

const props = defineProps<{
  type: StatType
  date: string
  stats?: MealStats
  profileName?: string
  profileImage?: string
}>()

const root = ref<HTMLElement | null>(null)
const cssBg = computed(() => `url(${bgUrl})`)

/* assets แบบเดียวกับ SummaryFlex */
const nurseMap = {
  A: new URL('@/assets/progress/stat/nurse-a.png', import.meta.url).href,
  B: new URL('@/assets/progress/stat/nurse-b.png', import.meta.url).href,
  C: new URL('@/assets/progress/stat/nurse-c.png', import.meta.url).href,
} as const
const flowerMap = {
  A: [
    new URL('@/assets/progress/stat/green-1.svg', import.meta.url).href,
    new URL('@/assets/progress/stat/green-2.svg', import.meta.url).href,
  ],
  B: [
    new URL('@/assets/progress/stat/yellow-1.svg', import.meta.url).href,
    new URL('@/assets/progress/stat/yellow-2.svg', import.meta.url).href,
  ],
  C: [
    new URL('@/assets/progress/stat/red-1.svg', import.meta.url).href,
    new URL('@/assets/progress/stat/red-2.svg', import.meta.url).href,
  ],
} as const

// ใช้ Intl.DateTimeFormat แทน toLocaleDateString เพื่อควบคุม timezone ได้ดีกว่า
function formatDateThai(date: Date): string {
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok', // บังคับใช้เวลาไทย
  }).format(date)
}

function formatWeekRangeTh(baseDate?: Date): string {
  const base = baseDate ? new Date(baseDate) : new Date()

  // สร้าง Date ในเวลาไทยเพื่อหลีกเลี่ยงปัญหา timezone
  const start = new Date(base.getFullYear(), base.getMonth(), base.getDate())

  // หาวันอาทิตย์ของสัปดาห์นั้น
  const dayOfWeek = start.getDay()
  start.setDate(start.getDate() - dayOfWeek)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const monthYear = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Bangkok',
    }).format(start)
    return `${start.getDate()} - ${end.getDate()} ${monthYear}`
  } else if (start.getFullYear() === end.getFullYear()) {
    const startMonth = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
      month: 'long',
      timeZone: 'Asia/Bangkok',
    }).format(start)
    const endMonth = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
      month: 'long',
      timeZone: 'Asia/Bangkok',
    }).format(end)
    const year = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
      year: 'numeric',
      timeZone: 'Asia/Bangkok',
    }).format(start)
    return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${year}`
  } else {
    const startFull = formatDateThai(start)
    const endFull = formatDateThai(end)
    const startParts = startFull.split(' ')
    const endParts = endFull.split(' ')
    return `${start.getDate()} ${startParts[1]} ${startParts[2]} - ${end.getDate()} ${endParts[1]} ${endParts[2]}`
  }
}

// แก้ไข computed displayDate
const displayDate = computed(() => {
  if (!props.date) {
    return ''
  }

  try {
    if (props.type === 'day') {
      const [y, m, d] = props.date.split('-').map(Number)

      // ใช้ UTC เพื่อหลีกเลี่ยงปัญหา timezone shift
      const date = new Date(Date.UTC(y, m - 1, d))

      return formatDateThai(date)
    }

    if (props.type === 'week') {
      const match = props.date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (!match) {
        return props.date
      }

      const [, y, m, d] = match
      const baseDate = new Date(Date.UTC(+y, +m - 1, +d))

      return formatWeekRangeTh(baseDate)
    }

    if (props.type === 'month') {
      const [y, m] = props.date.split('-').map(Number)
      const date = new Date(Date.UTC(y, m - 1, 1))

      return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Bangkok',
      }).format(date)
    }

    return props.date
  } catch (error) {
    console.error('Date parsing error:', error, 'for date:', props.date)
    return props.date
  }
})

function getPeriodText() {
  switch (props.type) {
    case 'day':
      return { text: `วันนี้ (${displayDate.value})`, label: 'วันนี้' }
    case 'week':
      return { text: `สัปดาห์นี้ (${displayDate.value})`, label: 'สัปดาห์นี้' }
    case 'month':
      return { text: `เดือนนี้ (${displayDate.value})`, label: 'เดือนนี้' }
    default:
      return { text: '', label: '' }
  }
}

/* ===== ธีม/เกรด ===== */
const hasData = computed(() => {
  const s = props.stats
  if (!s) return false
  const total =
    (s.totalFood ?? s.totalMeals ?? 0) || (s.countA ?? 0) + (s.countB ?? 0) + (s.countC ?? 0)
  return total > 0
})

const normalizedGrade = computed<'A' | 'B' | 'C' | 'NA'>(() => {
  if (!hasData.value) return 'NA'
  const g = String(props.stats?.avgGrade ?? '')
    .trim()
    .toUpperCase()
  return g === 'A' || g === 'B' || g === 'C' ? (g as 'A' | 'B' | 'C') : 'NA'
})

const palette = {
  A: { color: '#3D8200', bg: '#F8FFF2', border: '#C0E99B', badge: '#D7F4BC' },
  B: { color: '#777500', bg: '#FFFACE', border: '#EDDE5B', badge: '#F5EEAB' },
  C: { color: '#7B4C49', bg: '#FFEAE8', border: '#ECBCB8', badge: '#FFD2CF' },
  NA: { color: '#626262', bg: '#F8F8F8', border: '#A3A3A3', badge: '#E0E0E0' },
} as const

const gradeStyle = computed<Record<string, string>>(() => {
  const th = palette[normalizedGrade.value]
  const style: Record<string, string> = {
    '--grade-color': th.color,
    '--grade-bg': th.bg,
    '--grade-border': th.border,
    '--badge-bg': th.badge,
  }
  const g = normalizedGrade.value
  if (g === 'A' || g === 'B' || g === 'C') {
    style['--flower-1'] = `url("${flowerMap[g][0]}")`
    style['--flower-2'] = `url("${flowerMap[g][1]}")`
  }
  return style
})

const currentNurse = computed<string | null>(() => {
  const g = normalizedGrade.value
  return g === 'A' || g === 'B' || g === 'C' ? nurseMap[g] : null
})

/* โปรไฟล์: ตัวย่อ fallback */
const initials = computed(() => props.profileName?.trim()?.[0] ?? '🙂')

/* ===== export เป็นภาพ ===== */
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
  if (!root.value) throw new Error('stat poster root missing')
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

export type StatPosterExpose = {
  renderToBlob: (targetWidth?: number) => Promise<Blob>
}
defineExpose<StatPosterExpose>({ renderToBlob })
</script>

<style scoped>
/* พื้นหลัง */
.stat-poster {
  --pad: 50px;
  --poster-w: min(900px, 80vw);
  width: var(--poster-w);
  aspect-ratio: 3/4;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.stat-poster-bg {
  position: absolute;
  inset: 0;
  background-image: v-bind(cssBg);
  background-size: cover;
  background-position: center;
}
.stat-poster-inner {
  position: absolute;
  inset: var(--pad);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* หัวข้อ */
.period {
  margin-left: 20px;
}
.period .title {
  color: #386496;
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 80px;
  margin: 2px 0 4px 6px;
}
.period .date {
  color: #386496;
  font-family: 'Noto Looped Thai UI';
  font-size: 50px;
  margin-left: 6px;
}

/* โปรไฟล์ */
.profile {
  margin-top: 265px;
  display: flex;
  align-self: center;
  align-items: center;
  gap: 120px;
  padding: 0 6px;
}
.avatar {
  width: 190px !important;
  height: 190px !important;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-fallback {
  font-size: 34px;
  color: #386496;
  line-height: 1;
}
.profile-name {
  color: #194678;
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 55px !important;
  font-weight: 500;
  margin-bottom: 30px;
}

/* Grade Box */
/* แทนที่ความกว้าง fix เป็นแบบยืดหยุ่น และจัดให้อยู่กึ่งกลาง */
.grade-box {
  width: min(930px, 100%); /* ไม่ล้น และยังล็อกไม่เกิน 900px */
  margin-inline: auto; /* จัดกลางแนวนอน */
  height: 250px;
  background: var(--grade-bg);
  border: 5px solid var(--grade-border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-top: 80px;
}

.grade-section {
  flex: 1;
  text-align: center;
}
.grade-label {
  color: #194678;
  font-family: 'Noto Looped Thai UI' !important;
  font-size: 50px;
  line-height: 75px;
  letter-spacing: 0.18px;
  margin-bottom: 40px;
}
.period-label {
  margin-right: 5px;
}
.grade-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
}
.grade-badge {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--badge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.grade-value {
  margin: 0;
  color: var(--grade-color);
  font-family: 'star';
  font-size: 76px;
  line-height: 1;
  letter-spacing: 0.36px;
  margin-bottom: 70px;
  margin-left: 10px;
}
.na-grade {
  color: #626262;
  font-family: 'Noto Looped Thai UI';
  font-size: 40px;
  line-height: 60px;
  margin-top: 45px;
}
.grade-art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 240px !important;
}
.grade-art::before,
.grade-art::after {
  content: '';
  position: absolute;
  aspect-ratio: 1/1;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.9;
  pointer-events: none;
  z-index: 1;
  width: 40px;
}
.grade-art::before {
  background-image: var(--flower-1);
  right: 30px;
  top: 6px;
  width: 50px;
  height: 50px;
}
.grade-art::after {
  background-image: var(--flower-2);
  left: 40px;
  bottom: 0;
  width: 40px;
  height: 40px;
}
.nurse-img {
  position: relative;
  z-index: 2;
  width: 140px;
  height: 140px;
}

/* Breakdown */
.breakdown {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: min(930px, 100%);
  align-self: center;
}
.count-box {
  border-radius: 12px;
  border: 5px solid transparent;
  padding: 8px 16px;
  text-align: center;
}
.count-label {
  font-family: 'Noto Looped Thai UI';
  font-size: 40px;
  line-height: 60px;
}
.times-label {
  font-family: 'Noto Looped Thai UI';
  font-size: 40px;
  line-height: 60px;
  margin-top: 40px;
  padding-bottom: 20px;
}
.count-value {
  transform: translateY(-17px);
  font-family: 'gift';
  font-size: 100px; /* ขนาดตามต้องการ */
  line-height: 1; /* ไม่ให้เด้งลงล่าง */
  width: auto; /* เอาค่าคงที่ 40px ออก */
  height: auto; /* เอาค่าคงที่ 40px ออก */
}
.bg-a {
  background: #f8fff2;
  border-color: #c0e99b;
}
.bg-b {
  background: #ffface;
  border-color: #edde5b;
}
.bg-c {
  background: #ffeae8;
  border-color: #ecbcb8;
}
.color-a {
  color: #3d8200;
}
.color-b {
  color: #777500;
}
.color-c {
  color: #7b4c49;
}
</style>
