<template>
  <div class="page-bg">
    <div class="progress-page" v-if="!loading">
      <ProgressNav  @updateSection="updateSection" />
      <ProgressSection :selectedSection="section" @updateGrade="updateGrade" />
    </div>
    <div v-else class="flex flex-col gap-4 w-full items-center justify-center py-6">
      <USkeleton class="h-[62px] w-[433px] rounded-lg bg-[#ECEFF2]" />
      <USkeleton class="h-[100px] w-[433px] rounded-lg bg-[#ECEFF2] pt-5" />
      <USkeleton class="h-[30px] w-[103px] rounded-lg bg-[#ECEFF2]" />
      <USkeleton class="h-[1px] w-[80%] rounded-lg bg-[#ECEFF2]" />
      <USkeleton class="h-[20px] w-[123px] rounded-lg bg-[#ECEFF2]" />
      <USkeleton class="h-[30px] w-[153px] rounded-lg bg-[#ECEFF2]" />
      <div class="flex flex-row gap-2 w-full mt-12">
        <USkeleton class="h-[100px] w-[100px] rounded-lg bg-[#ECEFF2]" />
        <USkeleton class="h-[30px] w-[100px] rounded-lg bg-[#ECEFF2]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '../../services/liff.service'
import ProgressNav from '../../components/progress/ProgressNav.vue'
import ProgressSection from '../../components/progress/ProgressSection.vue'
import type { Meal } from '../../types/meal.types'

export default {
  name: 'ProgressPage',
  components: {
    ProgressNav,
    ProgressSection,
  },
  data() {
    return {
      grade: '',
      section: 'Diary',
      meals: null as Meal[] | null | undefined,
      loading: true, // Add a loading state
    }
  },
  methods: {
    updateSection(newSection: string) {
      this.section = newSection
    },
    updateGrade(newGrade: string) {
      this.grade = newGrade
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
html,
body,
#app {
  height: 100svh;
  margin: 0;
}
* {
  box-sizing: border-box;
}
.page-bg {
  background-color: #f2f8fc;
  min-height: 100dvh;
  overflow-x: hidden;
}
.progress-page {
  height: 100vh; /* ให้เต็ม viewport */
  max-height: 100svh;
  display: flex;
  flex-direction: column;
  gap: 13px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  position: relative;
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
