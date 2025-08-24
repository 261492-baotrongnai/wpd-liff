<!-- Stat.vue -->
<template>
  <SummaryFlex type="day" :stats="today" />
  <StatShareButton
    type="day"
    :stats="today"
    :profile-name="profile?.displayName"
    :profile-image="profile?.pictureUrl"
  />

  <div class="separator"></div>

  <SummaryFlex type="week" :stats="week" />
  <StatShareButton
    type="week"
    :stats="week"
    :profile-name="profile?.displayName"
    :profile-image="profile?.pictureUrl"
  />

  <div class="separator"></div>

  <SummaryFlex type="month" :stats="month" />
  <StatShareButton
    type="month"
    :stats="month"
    :profile-name="profile?.displayName"
    :profile-image="profile?.pictureUrl"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'ProgressStats' })
import { ref, onMounted } from 'vue'
import type { MealStats } from '../../../types/meal.types'
import {
  getMonthSummary,
  getTodaySummary,
  getWeekSummary,
} from '../../../services/progress.service'
import SummaryFlex from './SummaryFlex.vue'
import StatShareButton from './StatShareButton.vue'
import liff from '@line/liff'

// รับ props สำหรับข้อมูล profile จาก parent component
// defineProps<{
//   profileName?: string
//   profileImage?: string
// }>()

const emit = defineEmits<{
  updateGrade: [grade: string]
}>()

const today = ref<MealStats | undefined>(undefined)
const week = ref<MealStats | undefined>(undefined)
const month = ref<MealStats | undefined>(undefined)
const profile = ref<
  | {
      displayName: string
      pictureUrl: string
      statusMessage: string
      userId: string
    }
  | undefined
>(undefined)

onMounted(async () => {
  try {
    profile.value = (await liff.getProfile()) as {
      displayName: string
      pictureUrl: string
      statusMessage: string
      userId: string
    }
    console.log('User profile:', profile)
    today.value = await getTodaySummary()
    week.value = await getWeekSummary()
    month.value = await getMonthSummary()

    // ส่ง grade กลับไปยัง parent component
    const grade = today.value?.avgGrade ?? week.value?.avgGrade ?? month.value?.avgGrade
    if (grade) {
      emit('updateGrade', grade)
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
})
</script>

<style scoped>
.separator {
  height: 2px;
  background-color: #eceff2;
  border-radius: 9999px;
  margin: 30px 20px;
}
</style>
