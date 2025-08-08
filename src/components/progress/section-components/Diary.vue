<template>
  <DatePicker
    :modelValue="modelValue"
    :dateExists="dateExists"
    @update:modelValue="onModelValueUpdate"
    @updateGrade="updateGrade"
  />

  <div v-if="day && !loading" class="diary-wrapper px-4">
    <p class="date-header">
      {{
        modelValue
          ? isToday(modelValue)
            ? 'วันนี้, ' +
              df
                .format(modelValue.toDate(getLocalTimeZone()))
                .replace(/^วัน[^0-9]* /, '')
                .replace('พ.ศ. ', '')
            : df
                .format(modelValue.toDate(getLocalTimeZone()))
                .replace('ที่ ', ', ')
                .replace('พ.ศ. ', '')
          : 'Select a date'
      }}
    </p>

    <div v-for="time_sent in day.formattedMeals" :key="time_sent.time" class="meal-item">
      <div>{{ time_sent.time }}</div>
      <div v-for="meal in time_sent.meals" :key="meal.id" class="flex items-center gap-2">
        <div
          v-if="imageLoaded[meal.id]"
          class="fixed-image"
          :style="{ backgroundImage: `url(${meal.signedUrl})` }"
        ></div>
        <USkeleton v-else class="w-[100px] h-[100px]" />
        <div class="flex flex-col">
          <p>{{ mealTypeTranslations[meal.mealType] }}</p>
          <p>{{ meal.foodNames }}</p>
          <p>{{ meal.avgGrade }}</p>
        </div>
      </div>
    </div>
    <div class="share-container">
      <ShareButton />
    </div>
  </div>

  <div v-else class="flex flex-col gap-2">
    <USkeleton class="w-[170px] h-[25px] bg-[#ECEFF2]" />
    <div class="p-2 flex flex-row mt-2 gap-2">
      <USkeleton class="w-[100px] h-[100px] bg-[#ECEFF2]" />
      <div class="flex flex-col gap-2 ml-2">
        <USkeleton class="w-[200px] h-[25px] bg-[#ECEFF2]" />
        <USkeleton class="w-[100px] h-[25px] bg-[#ECEFF2]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import {
  getTodayMealsAndStats,
  getDayMealsAndStats,
  getAllProgress,
  type TimeMeal,
} from '../../../services/progress.service'
import DatePicker from './DatePicker.vue'
import ShareButton from './ShareButton.vue'

import {
  DateFormatter,
  getLocalTimeZone,
  CalendarDate,
  BuddhistCalendar,
} from '@internationalized/date'
import type { Meal, MealStats } from '../../../types/meal.types'
import { reactive, nextTick } from 'vue'

const imageLoaded = reactive<{ [key: string]: boolean }>({})

const mealTypeTranslations: Record<string, string> = {
  breakfast: 'มื้อเช้า',
  lunch: 'มื้อกลางวัน',
  dinner: 'มื้อเย็น',
  snack: 'ของว่าง',
}

const loading = shallowRef(false)
const day = shallowRef<
  { meals: Meal[]; stats: MealStats; formattedMeals: TimeMeal[] | null } | null | undefined
>(null)
const dateExists = shallowRef<{ date: string; grade: string }[] | undefined>(undefined)
const df = new DateFormatter('th-TH', { dateStyle: 'full' })
const modelValue = shallowRef(
  new CalendarDate(
    new BuddhistCalendar(),
    new Date().getFullYear() + 543,
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
)

onMounted(async () => {
  loading.value = true
  dateExists.value = await getAllProgress()
  day.value = await getTodayMealsAndStats()
  if (day.value && day.value.stats) {
    updateGrade(day.value.stats.avgGrade)
  }
  loading.value = false
  await handleImagesLoaded()
})

const emit = defineEmits<{
  (event: 'updateGrade', newGrade: string): void
}>()

function updateGrade(newGrade: string) {
  emit('updateGrade', newGrade)
}

async function handleImagesLoaded() {
  await nextTick()

  if (!day.value?.meals?.length) return

  for (const meal of day.value.meals) {
    imageLoaded[meal.id] = false
    const img = new Image()
    img.src = meal.signedUrl
    img.onload = () => {
      imageLoaded[meal.id] = true
    }
    img.onerror = () => {
      imageLoaded[meal.id] = true // You could optionally flag errors differently
    }
  }
}

async function onModelValueUpdate(newValue: CalendarDate) {
  loading.value = true
  const date = new Date(newValue.year - 543, newValue.month - 1, newValue.day + 1)
  day.value = await getDayMealsAndStats(date.toISOString().split('T')[0])
  if (day.value && day.value.stats) {
    updateGrade(day.value.stats.avgGrade)
  }
  modelValue.value = newValue
  loading.value = false
  await handleImagesLoaded()
}

function isToday(modelDate: CalendarDate): boolean {
  const today = new Date()
  const model = new Date(modelDate.year - 543, modelDate.month - 1, modelDate.day)
  return (
    today.getFullYear() === model.getFullYear() &&
    today.getMonth() === model.getMonth() &&
    today.getDate() === model.getDate()
  )
}
</script>

<script lang="ts">
export default {
  name: 'DiaryPage',
}
</script>

<style scoped>
.date-header {
  color: var(--main-text, #194678);

  /* Paragraph1 */
  font-family: 'Noto Looped Thai UI';
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 160% */
  letter-spacing: 0.2px;
  margin: 20px 0 20px 16px;
}
.meal-item {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 10px;
}
.fixed-image {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
  border-radius: 10%;
}

.diary-wrapper {
  width: 100vw; /* กว้างเต็มจอ */
  min-height: 100vh; /* สูงอย่างน้อยเต็มจอ */
  background: #ffffff;
  border-radius: 0; /* ถ้าไม่ต้องการขอบมน ให้เป็น 0 */
  margin: 0; /* ไม่มี margin */
  box-sizing: border-box;
  position: relative;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  border-radius: 35px;
}
</style>
