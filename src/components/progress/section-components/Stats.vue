<template>
  <SummaryFlex type="day" :stats="today" />
  <SummaryFlex type="week" :stats="week" />
  <SummaryFlex type="month" :stats="month" />
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
  },
}
</script>

<style></style>
