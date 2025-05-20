<template>
  <div class="progress-section">
    <h1 class="header-content">บันทึกอาหารย้อนหลัง</h1>
    <ProgressDays />
  </div>
</template>

<script lang="ts">
import ProgressDays from './ProgressDays.vue'

export default {
  name: 'ProgressSection',
  components: {
    ProgressDays,
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
