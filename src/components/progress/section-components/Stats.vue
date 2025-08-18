<template>
  <SummaryFlex type="day" :stats="today" />
  <StatShareButton />
  <div class="separator"></div>
  <SummaryFlex type="week" :stats="week" />
  <StatShareButton />
  <div class="separator"></div>
  <SummaryFlex type="month" :stats="month" />
  <StatShareButton />
</template>

<script lang="ts">
import type { MealStats } from '../../../types/meal.types'
import {
  getMonthSummary,
  getTodaySummary,
  getWeekSummary,
} from '../../../services/progress.service'
import SummaryFlex from './SummaryFlex.vue'

export default {
  name: 'StatsPage',
  components: {
    SummaryFlex,
  },
  emits: {
    updateGrade: (g: string) => typeof g === 'string',
  },
  data() {
    return {
      today: undefined as MealStats | undefined,
      week: undefined as MealStats | undefined,
      month: undefined as MealStats | undefined,
    }
  },
  async mounted() {
    this.today = await getTodaySummary()
    this.week = await getWeekSummary()
    this.month = await getMonthSummary()
    const grade = this.today?.avgGrade ?? this.week?.avgGrade ?? this.month?.avgGrade
    if (grade) this.$emit('updateGrade', grade)
  },
}
</script>

<style>
.separator {
  height: 2px; /* กำหนดความหนาของเส้น */
  background-color: #eceff2; /* สีเส้น */
  border-radius: 9999px; /* ทำให้ปลายโค้งมน */
  margin: 30px 20px; /* ระยะขอบซ้ายขวาเท่ากับคอนเทนต์ */
}
</style>
