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

  <div v-if="meals" class="progress-days">
    <div v-for="meal in meals" :key="meal.id" class="meal-item">
      <p>{{ meal.id }}</p>
      <p v-for="food in meal.foods" :key="food.id" class="food-item">{{ food.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import type { Meal } from '../types/meal.types'
import { getTodayProgress, getDayProgress } from './progress.service'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const meals = shallowRef<Meal[] | null | undefined>(null)
const df = new DateFormatter('th-TH', { dateStyle: 'medium' })
const modelValue = shallowRef(
  new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
)
// เปิดมาให้โหลดเอาของวันนี้มาโชว์ก่อน
onMounted(async () => {
  meals.value = await getTodayProgress()
})

function handleModelValueUpdate(value: unknown) {
  onModelValueUpdate(value as CalendarDate)
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
    meals.value = await getDayProgress(date.toISOString().split('T')[0])
    // modal should close after selecting a date
  } else {
    console.warn('Unsupported type received:', newValue)
  }
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DayProgress',
})
</script>

<style scoped>
.date-container {
  display: flex;
  justify-content: center;
}
</style>
