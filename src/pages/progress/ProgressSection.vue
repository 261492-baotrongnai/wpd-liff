<template>
  <h2 class="header">บันทึกอาหารย้อนหลัง</h2>
  <ProgressDays />
</template>

<script lang="ts">
import type { Meal } from '../types/meal.types'
import { getTodayProgress } from './progress.service'
import ProgressDays from './ProgressDays.vue'

export default {
  name: 'ProgressSection',
  components: {
    ProgressDays,
  },
  data() {
    return {
      meals: null as Meal[] | null | undefined,
    }
  },
  methods: {},
  async mounted() {
    this.meals = await getTodayProgress()
  },
}
</script>

<style scoped>
.header {
  font-weight: 600;
  align-self: center;
}
</style>
