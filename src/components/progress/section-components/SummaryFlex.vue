<template>
  <div class="summary">
    <h2>{{ getPeriodText().text }}</h2>
    <div class="flex flex-col gap-2">
      <div class="grade-box">
        <div class="grade-section">
          <p>เกรดเฉลี่ย</p>
          <p>{{ getPeriodText().label }}</p>
        </div>

        <div v-if="stats?.totalFood !== 0" class="grade-section text-xl">
          <p>{{ stats?.avgGrade }}</p>
        </div>

        <div v-if="stats?.totalFood !== 0" class="grade-section">
          <div style="background-color: #ccc">image char</div>
        </div>

        <div v-else class="grade-section text-xl">
          <p>ยังไม่มีข้อมูลการบันทึกค่ะ</p>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="flex-1 count-box bg-[#ebfeaf]">
          <p class="count-label">ได้รับเกรด A</p>
          {{ stats?.countA }}
          <p class="count-label">ครั้ง</p>
        </div>
        <div class="flex-1 count-box bg-[#faeeb2]">
          <p class="count-label">ได้รับเกรด B</p>
          {{ stats?.countB }}
          <p class="count-label">ครั้ง</p>
        </div>
        <div class="flex-1 count-box bg-[#f2c1ba]">
          <p class="count-label">ได้รับเกรด C</p>
          {{ stats?.countC }}
          <p class="count-label">ครั้ง</p>
        </div>
      </div>
    </div>

    <div class="separator"></div>
  </div>
</template>

<script lang="ts">
import type { MealStats } from '../../../types/meal.types'
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
  methods: {
    getPeriodText() {
      switch (this.type) {
        case 'day':
          const today = new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          return { text: `วันนี้ (${today})`, label: 'วันนี้' }
        case 'week':
          const startOfWeek = new Date()
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
          const endOfWeek = new Date()
          endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()))
          if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
            return {
              text: `สัปดาห์นี้ (${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }).replace('พ.ศ. ', '')})`,
              label: 'สัปดาห์นี้',
            }
          } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
            const startMonth = startOfWeek.toLocaleDateString('th-TH', { month: 'long' })
            const endMonth = endOfWeek.toLocaleDateString('th-TH', { month: 'long' })
            const year = startOfWeek
              .toLocaleDateString('th-TH', { year: 'numeric' })
              .replace('พ.ศ. ', '')
            return {
              text: `สัปดาห์นี้ (${startOfWeek.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth} ${year}) `,
              label: 'สัปดาห์นี้',
            }
          } else {
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
        case 'month':
          const month = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })
          return { text: `เดือนนี้ (${month})`, label: 'เดือนนี้' }
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
  height: 70px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #333;
  border: 1px solid #8a8a8a;
  padding: 10px;
}

.grade-section {
  flex: 1;
  text-align: center;
}

.summary {
  padding: 1px;
  display: flex;
  flex-direction: column;
}
.separator {
  width: 100%;
  height: 1px;
  background-color: #898989;
  margin-top: 10px;
  margin-bottom: 10px;
}
.count-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100px;
  border: 1px solid #8a8a8a;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
.count-label {
  flex: 1;
  align-content: center;
  font-size: 14px;
  color: #333;
}
</style>
