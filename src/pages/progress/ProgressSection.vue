<template>
  <div class="progress-section">
    <h1 class="header-content">บันทึกอาหารย้อนหลัง</h1>
    <DayProgress v-if="selectedPeriod === 'Days'" />
    <WeekProgress v-if="selectedPeriod === 'Weeks'" />
    <MonthProgress v-if="selectedPeriod === 'Months'" />
  </div>
</template>

<script lang="ts">
import DayProgress from './section-components/DayProgress.vue'
import MonthProgress from './section-components/MonthProgress.vue'
import WeekProgress from './section-components/WeekProgress.vue'

export default {
  name: 'ProgressSection',
  components: {
    DayProgress,
    WeekProgress,
    MonthProgress,
  },
  props: {
    selectedPeriod: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {
    console.log('ProgressSection mounted', this.selectedPeriod)
  },
}
</script>

<style scoped>
.header-content {
  font-size: 16px;
  font-weight: 600;
  align-self: center;
}
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
