<template>
  <div class="progress-page">
    <ProgressNav @updatePeriod="updatePeriod" />
    <div class="flex flex-col">
      <ProgressGrade :grade="grade" :period="period" />
      <button class="share-button">แชร์ให้คนอื่นดู</button>
    </div>

    <USeparator orientation="horizontal" size="xs" color="black" />
    <ProgressSection />
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '../../utility/liffUtils'
import liff from '@line/liff'
import ProgressNav from './ProgressNav.vue'
import ProgressGrade from './ProgressGrade.vue'
import ProgressSection from './ProgressSection.vue'

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
    }
  },
  methods: {
    updatePeriod(newPeriod: string) {
      this.period = newPeriod
    },
  },
  mounted() {
    initializeLiff('VITE_LIFF_ID_PROGRESS').then(() => {
      liff.getProfile().then((profile) => {
        console.log('Profile:', profile)
      })
    })
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
  margin-top: 8px;

  text-align: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  width: 100px;
  height: 30px;
}
</style>
