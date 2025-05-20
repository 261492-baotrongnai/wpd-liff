<template>
  <div class="progress-section">
    <h1 class="header-content">บันทึกอาหารย้อนหลัง</h1>
    <DayProgress />
  </div>
</template>

<script lang="ts">
import DayProgress from './DayProgress.vue';

export default {
  name: 'ProgressSection',
  components: {
    DayProgress,
  },
  props: {
    selectedPeriod: {
      type: String,
      required: true,
    },
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
