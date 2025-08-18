<template>
  <div class="summary">
    <p class="period-text">{{ getPeriodText().text }}</p>
    <div class="flex flex-col gap-2" :style="{ marginLeft: '20px', marginRight: '20px' }">
      <div class="grade-box" :style="gradeStyle">
        <div class="grade-section">
          <div class="grade-label">
            <p>เกรดเฉลี่ย</p>
            <p>{{ getPeriodText().label }}</p>
          </div>
        </div>

        <div v-if="hasData" class="grade-section grade-center">
          <div class="grade-badge">
            <p class="grade-value">{{ stats?.avgGrade }}</p>
          </div>
        </div>

        <!-- ขวา: พยาบาลมะลิ + ดอกไม้ -->
        <div v-if="hasData" class="grade-section grade-art">
          <img v-if="currentNurse" class="nurse-img" :src="currentNurse" alt="พยาบาลมะลิ" />
        </div>

        <!-- กรณีไม่มีข้อมูล -->
        <div v-else class="grade-section">
          <p class="grade-value" :class="{ 'na-grade': normalizedGrade === 'NA' }">
            {{ 'ยังไม่มีข้อมูลการบันทึกนะคะ' }}
          </p>
        </div>
      </div>

      <div class="flex flex-row gap-2">
        <!-- เกรด A -->
        <div class="flex-1 count-box bg-[#F8FFF2] border-2 border-[#C0E99B]">
          <p class="count-label" :style="{ color: '#3D8200' }">ได้เกรด A</p>
          <p class="count-value" :style="{ color: '#3D8200' }">
            {{ stats?.countA }}
          </p>
          <p class="count-label" :style="{ color: '#3D8200' }">ครั้ง</p>
        </div>
        <!-- เกรด B -->
        <div class="flex-1 count-box bg-[#FFFACE] border-2 border-[#EDDE5B]">
          <p class="count-label" :style="{ color: '#777500' }">ได้เกรด B</p>
          <p class="count-value" :style="{ color: '#777500' }">
            {{ stats?.countB }}
          </p>
          <p class="count-label" :style="{ color: '#777500' }">ครั้ง</p>
        </div>
        <!-- เกรด C -->
        <div class="flex-1 count-box bg-[#FFEAE8] border-2 border-[#ECBCB8]">
          <p class="count-label" :style="{ color: '#7B4C49' }">ได้เกรด C</p>
          <p class="count-value" :style="{ color: '#7B4C49' }">
            {{ stats?.countC }}
          </p>
          <p class="count-label" :style="{ color: '#7B4C49' }">ครั้ง</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { MealStats } from '../../../types/meal.types'
const nurseMap = {
  A: new URL('@/assets/progress/stat/nurse-a.png', import.meta.url).href,
  B: new URL('@/assets/progress/stat/nurse-b.png', import.meta.url).href,
  C: new URL('@/assets/progress/stat/nurse-c.png', import.meta.url).href,
} as const
// เพิ่มใต้ nurseMap
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
export default {
  name: 'SummaryFlex',
  props: {
    stats: {
      type: Object as () => MealStats | undefined,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      gradeData: [
        {
          key: 'A',
          label: 'เกรด A',
          color: '#3D8200',
          bg: '#F8FFF2',
          border: '#C0E99B',
          badgeBg: '#D7F4BC',
        }, // เขียว
        {
          key: 'B',
          label: 'เกรด B',
          color: '#777500',
          bg: '#FFFACE',
          border: '#EDDE5B',
          badgeBg: '#F5EEAB',
        }, // เหลือง
        {
          key: 'C',
          label: 'เกรด C',
          color: '#7B4C49',
          bg: '#FFEAE8',
          border: '#ECBCB8',
          badgeBg: '#FFD2CF',
        }, // แดง
        {
          key: 'NA',
          label: 'ไม่ทราบ',
          color: '#626262',
          bg: '#F8F8F8',
          border: '#A3A3A3',
          badgeBg: '#E0E0E0',
        }, // fallback
      ],
    }
  },
  computed: {
    // มีข้อมูลจริงไหม
    hasData(): boolean {
      return !!(this.stats && typeof this.stats.totalFood === 'number' && this.stats.totalFood > 0)
    },

    // คืน A/B/C ก็ต่อเมื่อมีข้อมูลเท่านั้น ไม่งั้นเป็น NA
    normalizedGrade(): 'A' | 'B' | 'C' | 'NA' {
      if (!this.hasData) return 'NA'
      const g = String(this.stats?.avgGrade ?? '')
        .trim()
        .toUpperCase()
      return g === 'A' || g === 'B' || g === 'C' ? (g as 'A' | 'B' | 'C') : 'NA'
    },

    currentGrade() {
      return this.gradeData.find((g) => g.key === this.normalizedGrade) || this.gradeData[3]
    },

    gradeStyle() {
      const style: Record<string, string> = {
        '--grade-color': this.currentGrade.color,
        '--grade-bg': this.currentGrade.bg,
        '--grade-border': this.currentGrade.border,
        '--badge-bg': this.currentGrade.badgeBg,
      }
      if (this.currentFlowers) {
        style['--flower-1'] = `url("${this.currentFlowers[0]}")`
        style['--flower-2'] = `url("${this.currentFlowers[1]}")`
      }
      return style
    },
    currentNurse(): string | null {
      const g = this.normalizedGrade
      if (g === 'A' || g === 'B' || g === 'C') {
        return nurseMap[g] // <-- ตอนนี้ TS รู้ว่า g เป็น GradeKey แล้ว
      }
      return null
    },
    // ดอกไม้ตามเกรด
    currentFlowers(): [string, string] | null {
      const g = this.normalizedGrade
      if (g === 'A' || g === 'B' || g === 'C') return flowerMap[g] as [string, string]
      return null
    },
  },
  methods: {
    getPeriodText() {
      switch (this.type) {
        case 'day': {
          const today = new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          return { text: `วันนี้ (${today})`, label: 'วันนี้' }
        }

        case 'week': {
          const startOfWeek = new Date()
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
          const endOfWeek = new Date()
          endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()))

          if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
            // อยู่เดือนเดียวกัน
            const monthYear = startOfWeek
              .toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
              .replace('พ.ศ. ', '')
            return {
              text: `สัปดาห์นี้ (${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthYear})`,
              label: 'สัปดาห์นี้',
            }
          } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
            // ข้ามเดือนแต่ปีเดียวกัน
            const startMonth = startOfWeek.toLocaleDateString('th-TH', { month: 'long' })
            const endMonth = endOfWeek.toLocaleDateString('th-TH', { month: 'long' })
            const year = startOfWeek
              .toLocaleDateString('th-TH', { year: 'numeric' })
              .replace('พ.ศ. ', '')
            return {
              text: `สัปดาห์นี้ (${startOfWeek.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth} ${year})`,
              label: 'สัปดาห์นี้',
            }
          } else {
            // ข้ามปี
            const startMonth = startOfWeek.toLocaleDateString('th-TH', {
              month: 'long',
              year: 'numeric',
            })
            const endMonth = endOfWeek.toLocaleDateString('th-TH', {
              month: 'long',
              year: 'numeric',
            })
            return {
              text: `สัปดาห์นี้ (${startOfWeek.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth})`,
              label: 'สัปดาห์นี้',
            }
          }
        }

        case 'month': {
          const month = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })
          return { text: `เดือนนี้ (${month})`, label: 'เดือนนี้' }
        }

        default:
          return { text: '', label: '' }
      }
    },
  },
}
</script>

<style scoped>
.grade-box {
  width: 100%;
  height: 100px;
  background-color: var(--grade-bg);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--grade-border);
  padding: 10px;

  /* Paragraph2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.grade-section {
  flex: 1;
  text-align: center;
}
.grade-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.grade-badge {
  width: 50px;
  height: 50px;
  aspect-ratio: 1/1;
  background: var(--badge-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.grade-label {
  color: #194678;
  text-align: center;

  /* Paragraph2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.grade-value {
  margin-top: -13px;
  margin-left: 5px;
  color: var(--grade-color);
  text-align: center;
  font-family: 'star';
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 77.778% */
  letter-spacing: 0.36px;
}

/* ให้กรอบ/พื้นหลังของกราฟเข้าธีมเดียวกัน */
.grade-chart-placeholder {
  padding: 8px;
  border: 1px dashed var(--grade-color, #8a8a8a);
  background: var(--grade-bg, #f3f4f6);
  border-radius: 6px;
}
.na-grade {
  color: #626262;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
  margin-top: 0px;
}
.summary {
  margin-top: 25px;
  padding: 1px;
  display: flex;
  flex-direction: column;
}
.count-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 110px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 7px;
}
.count-label {
  flex: 1;
  align-content: center;
  text-align: center;
  /* Paragraph2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.count-value {
  margin-bottom: 10px;
  text-align: center;
  font-family: 'gift';
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 70% */
  letter-spacing: 0.4px;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}
@media (max-width: 380px) {
  .count-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 130px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    padding: 4px;
  }
  .count-value {
    text-align: center;
    font-family: 'gift';
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px; /* 70% */
    letter-spacing: 0.4px;
  }
}
.period-text {
  color: var(--main-text, #194678);
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.2px;
  text-align: center;
  padding-bottom: 16px;
}
.grade-art {
  position: relative; /* ให้วาง pseudo ในช่องนี้ */
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 100px; /* คอลัมน์ขวากว้างคงที่ */
  max-width: 100px;
}
/* วาดดอกไม้ 2 ดอก ด้วยรูปจาก --flower-1/--flower-2 */
.grade-art::before,
.grade-art::after {
  content: '';
  position: absolute;
  aspect-ratio: 1 / 1;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.9;
  pointer-events: none;
  z-index: 1; /* อยู่หลังพยาบาล */
  width: clamp(38px, 18vw, 90px);
}
/* ดอกบนขวา */
.grade-art::before {
  background-image: var(--flower-1);
  right: 4px; /* ปรับตำแหน่งได้ */
  top: 3px;
  width: 27px;
  height: 31px;
}
/* ดอกล่างขวา */
.grade-art::after {
  background-image: var(--flower-2);
  left: 7px;
  bottom: 0px;
  width: 22px;
  height: 25px;
}
.nurse-img {
  position: relative;
  z-index: 2; /* ให้อยู่หน้า ดอกไม้ */
  width: 72px;
  height: 72px;
}
</style>
