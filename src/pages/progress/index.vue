<template>
  <div class="progress-page" v-if="!loading">
    <ProgressNav @updatePeriod="updatePeriod" />
    <div class="flex flex-col">
      <ProgressGrade :grade="grade" :period="period" />
      <button class="share-button">แชร์ให้คนอื่นดู</button>
      <div class="section-separator"></div>
    </div>

    <ProgressSection :selectedPeriod="period" />
  </div>
  <div v-else class="flex flex-col gap-4 w-full items-center justify-center">
    <USkeleton class="h-[62px] w-[433px] rounded-lg" />
    <USkeleton class="h-[100px] w-[433px] rounded-lg" />
    <USkeleton class="h-[30px] w-[103px] rounded-lg" />
    <USkeleton class="h-[1px] w-[80%] rounded-lg" />
    <USkeleton class="h-[20px] w-[123px] rounded-lg" />
    <USkeleton class="h-[30px] w-[153px] rounded-lg" />
    <div class="flex flex-row gap-2 w-full mt-12">
      <USkeleton class="h-[100px] w-[100px] rounded-lg" />
      <USkeleton class="h-[30px] w-[100px] rounded-lg" />
    </div>
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
    ProgressNav,
    ProgressGrade,
    ProgressSection,
  },
  data() {
    return {
      grade: '',
      period: 'Days',
      meals: null as Meal[] | null | undefined,
      loading: true, // Add a loading state
    }
  },
  methods: {
    updatePeriod(newPeriod: string) {
      this.period = newPeriod
    },
  },
  async mounted() {
    try {
      await initializeLiff('VITE_LIFF_ID_PROGRESS')
      this.loading = false
    } catch (error) {
      console.error('Error initializing LIFF:', error)
      this.loading = false
    }
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

.loading-indicator {
  text-align: center;
  font-size: 16px;
  color: #747474;
  margin-top: 20px;
}
</style>
