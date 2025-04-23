<template>
  <h2 class="header">บันทึกอาหารย้อนหลัง</h2>
  <ProgressDays />
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
.header {
  font-weight: 600;
  align-self: center;
}
</style>
