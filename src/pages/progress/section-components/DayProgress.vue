<template>
  <UModal
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <div class="date-container">
      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-calendar"
        class="w-fit justify-center"
      >
        {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Select a date' }}
      </UButton>
    </div>

    <template #body>
      <UCalendar
        v-model="modelValue"
        class="p-2"
        size="xl"
        v-on:update:model-value="handleModelValueUpdate"
        locale="th-TH"
      >
        <template #day="{ day }">
          <div
            class="z-99 mx-auto w-full h-full rounded-full justify-center align-middle flex items-center"
            :class="getColorByDate(day.toDate('UTC'))"
          >
            {{ day.day }}
          </div>
        </template>
      </UCalendar>
    </template>
  </UModal>

  <div v-if="day" class="progress-days">
    <div v-for="meal in day.meals" :key="meal.id" class="meal-item">
      <div class="fixed-image" :style="{ backgroundImage: `url(${meal.signedUrl})` }"></div>
      <div class="flex flex-col">
        <p>{{ mealTypeTranslations[meal.mealType] }}</p>
        <p>{{ meal.foodNames }}</p>
        <p>{{ meal.avgGrade }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import type { Meal, MealStats } from '../../types/meal.types'
import { getTodayMealsAndStats, getDayMealsAndStats, getAllProgress } from '../progress.service'
import {
  BuddhistCalendar,
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

// Thai translations for meal types
const mealTypeTranslations: Record<string, string> = {
  breakfast: 'มื้อเช้า',
  lunch: 'มื้อกลางวัน',
  dinner: 'มื้อเย็น',
  snack: 'ของว่าง',
}

const day = shallowRef<{ meals: Meal[]; stats: MealStats } | null | undefined>(null)
const dateExists = shallowRef<{ date: string; grade: string }[] | undefined>(undefined)
const df = new DateFormatter('th-TH', { dateStyle: 'medium' })
const modelValue = shallowRef(
  new CalendarDate(
    new BuddhistCalendar(),
    new Date().getFullYear() + 543,
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
)
// เปิดมาให้โหลดเอาของวันนี้มาโชว์ก่อน
onMounted(async () => {
  dateExists.value = await getAllProgress()
  day.value = await getTodayMealsAndStats()
  if (day.value && day.value.stats) {
    updateGrade(day.value.stats.avgGrade)
  }
})

function getColorByDate(date: Date) {
  const dateString = date.toISOString().split('T')[0]
  const currentSelected = new Date(
    modelValue.value.year - 543,
    modelValue.value.month - 1,
    modelValue.value.day + 1,
  )
  const todayString = new Date().toLocaleDateString('en-CA', { timeZone: getLocalTimeZone() })
  const currentSelectedString = currentSelected.toISOString().split('T')[0]


  if (dateString === currentSelectedString) return undefined
  if (dateExists.value) {
    const foundDate = dateExists.value.find((item) => item.date === dateString)
    switch (foundDate?.grade) {
      case 'A':
        if (dateString === todayString) return `outline-1 outline-[#90caf9]`
        else return 'bg-[#90caf9]/50'

      case 'B':
        if (dateString === todayString) return `outline-1 outline-[#ffd180]`
        else return 'bg-[#ffd180]/50'

      case 'C':
        if (dateString === todayString) return `outline-1 outline-[#ef9a9a]`
        else return 'bg-[#ef9a9a]/50'

      default:
        break
    }
  }
  return undefined
}

function handleModelValueUpdate(value: unknown) {
  onModelValueUpdate(value as CalendarDate)
}

const emit = defineEmits<{
  (event: 'updateGrade', newGrade: string): void
}>()

function updateGrade(newGrade: string) {
  // Emit the grade update event to the parent
  emit('updateGrade', newGrade)
}

// เลือกดูวันอื่น
async function onModelValueUpdate(newValue: CalendarDate | null | undefined) {
  if (!newValue || !(newValue instanceof CalendarDate)) {
    console.warn('Unsupported type received:', newValue)
    return
  }
  if (newValue instanceof CalendarDate) {
    console.log('Model value updated:', newValue.month)
    const date = new Date(newValue.year - 543, newValue.month - 1, newValue.day + 1)
    console.log('Selected date:', date.toISOString())
    day.value = await getDayMealsAndStats(date.toISOString().split('T')[0])
    if (day.value && day.value.stats) {
      updateGrade(day.value.stats.avgGrade)
    }
  } else {
    console.warn('Unsupported type received:', newValue)
  }
}
</script>

<script lang="ts">
export default {
  name: 'DayProgress',
}
</script>

<style scoped>
.date-container {
  display: flex;
  justify-content: center;
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

.day-highlight {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}
</style>

<!-- <UChip
  :show="!!getColorByDate(day.toDate('UTC'))"
  :color="getColorByDate(day.toDate('UTC'))"
  size="lg"
>
  {{ day.day }}
</UChip> -->
