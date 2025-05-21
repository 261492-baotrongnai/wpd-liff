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
        locale="th"
      />
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
import { getTodayMealsAndStats, getDayMealsAndStats } from '../progress.service'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

// Thai translations for meal types
const mealTypeTranslations: Record<string, string> = {
  breakfast: 'มื้อเช้า',
  lunch: 'มื้อกลางวัน',
  dinner: 'มื้อเย็น',
  snack: 'ของว่าง',
}

const day = shallowRef<{ meals: Meal[]; stats: MealStats } | null | undefined>(null)
const df = new DateFormatter('th-TH', { dateStyle: 'medium' })
const modelValue = shallowRef(
  new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
)
// เปิดมาให้โหลดเอาของวันนี้มาโชว์ก่อน
onMounted(async () => {
  day.value = await getTodayMealsAndStats()
  if (day.value && day.value.stats) {
    updateGrade(day.value.stats.avgGrade)
  }
})

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
    const date = new Date(newValue.year, newValue.month - 1, newValue.day + 1)
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
</style>
