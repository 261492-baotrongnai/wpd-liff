<template>
  <div class="progress-page">
    <ProgressNav @updatePeriod="updatePeriod" />
    <div class="flex flex-col">
      <ProgressGrade :grade="grade" :period="period" />
      <button class="share-button">แชร์ให้คนอื่นดู</button>
      <div class="section-separator"></div>
    </div>

    <ProgressSection :selectedPeriod="period" />
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '../../services/liff.service'
import ProgressNav from './ProgressNav.vue'
import ProgressGrade from './ProgressGrade.vue'
import ProgressSection from './ProgressSection.vue'
import type { Meal } from '../types/meal.types'

export default {
  name: 'ProgressPage',
  components: {
    // Add your components here
    ProgressNav,
    ProgressGrade,
    ProgressSection,
  },
  data() {
    return {
      grade: '',
      period: 'วันนี้',
      meals: null as Meal[] | null | undefined,
    }
  },
  methods: {
    updatePeriod(newPeriod: string) {
      this.period = newPeriod
    },
  },
  async mounted() {
    await initializeLiff('VITE_LIFF_ID_PROGRESS')
  },
}
</script>

<style scoped>
.progress-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.share-button {
  background-color: #b5e1c2;
  border: #747474 1px solid;
  border-radius: 10px;
  color: rgb(47, 47, 47);
  padding: auto;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;

  text-align: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  width: 100px;
  height: 30px;
}

.section-separator {
  width: 100%;
  height: 1px;
  background-color: #bbbbbb;
}
</style>
