<template>
  <UModal
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <div class="date-container flex flex-row justify-between items-center px-2">
      <p class="">
        {{
          modelValue
            ? new DateFormatter('th-TH', { month: 'long', year: 'numeric' }).format(
                modelValue.toDate(getLocalTimeZone()),
              )
            : 'Select a date'
        }}
      </p>
      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-calendar"
        class="w-fit justify-center"
        size="sm"
      />
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
            class="mx-auto size-full rounded-full justify-center align-middle flex items-center"
            :class="getColorByDate(day.toDate('UTC'), 'datepicker')"
          >
            {{ day.day }}
          </div>
        </template>
      </UCalendar>
    </template>
  </UModal>

  <div class="w-full px-2">
    <div class="horizontal-calendar flex justify-between">
      <div
        v-for="day in selectedWeek"
        :key="day.date.toISOString()"
        class="date-inline"
        :class="getColorByDate(day.date, 'horizontal-calendar')"
        @click="onModelValueUpdate(day.calendarDate)"
      >
        <div class="wekkday-label">{{ day.weekday }}</div>
        {{ day.date.getDate() }}
      </div>
    </div>
    <!-- <UCalendar
      v-model="modelValue"
      class="p-2"
      size="lg"
      v-on:update:model-value="handleModelValueUpdate"
      locale="th-TH"
    >
      <template #day="{ day }">
        <div
          class="mx-auto size-full rounded-full justify-center align-middle flex items-center"
          :class="getColorByDate(day.toDate('UTC'))"
        >
          {{ day.day }}
        </div>
      </template>
    </UCalendar> -->
  </div>

  <div v-if="day" class="px-2">
    <p>
      {{
        modelValue
          ? df
              .format(modelValue.toDate(getLocalTimeZone()))
              .replace('ที่ ', ', ')
              .replace('พ.ศ. ', '')
          : 'Select a date'
      }}
    </p>
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
import { computed } from 'vue'

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
const df = new DateFormatter('th-TH', { dateStyle: 'full' })
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

const selectedWeek = computed(() => {
  if (!modelValue.value) return []
  const weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  const selectedDate = new Date(
    modelValue.value.year - 543,
    modelValue.value.month - 1,
    modelValue.value.day,
  )

  const startOfWeek = new Date(selectedDate)
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()) // Start of the week (Sunday)

  const week = []
  for (let i = 0; i < 7; i++) {
    const day = {
      date: new Date(startOfWeek),
      weekday: '',
      calendarDate: null as CalendarDate | null,
    }
    day.date.setDate(startOfWeek.getDate() + i)
    day.weekday = weekdays[(startOfWeek.getDay() + i) % 7]
    day.calendarDate = new CalendarDate(
      new BuddhistCalendar(),
      day.date.getFullYear() + 543,
      day.date.getMonth() + 1,
      day.date.getDate(),
    )
    week.push(day)
  }

  return week
})

function toLocalISOString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset() * 60000 // Offset in milliseconds
  const localDate = new Date(date.getTime() - timezoneOffset) // Adjust to local time
  return localDate.toISOString().split('T')[0] // Return only the date part (YYYY-MM-DD)
}

function getColorByDate(date: Date, comp?: string) {
  const dateString = toLocalISOString(date)
  const currentSelected = new Date(
    modelValue.value.year - 543,
    modelValue.value.month - 1,
    modelValue.value.day + 1,
  )
  const todayString = new Date().toLocaleDateString('en-CA', { timeZone: getLocalTimeZone() })
  const currentSelectedString = currentSelected.toISOString().split('T')[0]

  let temp = ''
  if (dateString === currentSelectedString)
    switch (comp) {
      case 'datepicker':
        return undefined
      case 'horizontal-calendar':
        temp = `outline-1`
      default:
    }
  if (dateExists.value) {
    const foundDate = dateExists.value.find((item) => item.date === dateString)
    switch (foundDate?.grade) {
      case 'A':
        if (dateString === todayString && comp === 'datepicker')
          return `outline-1 outline-[#90caf9]`
        else return `bg-[#90caf9]/50 ` + temp

      case 'B':
        if (dateString === todayString && comp === 'datepicker')
          return `outline-1 outline-[#ffd180]`
        else return `bg-[#ffd180]/50 ` + temp

      case 'C':
        if (dateString === todayString && comp === 'datepicker')
          return `outline-1 outline-[#ef9a9a]`
        else return `bg-[#ef9a9a]/50 ` + temp

      default:
        break
    }
  }
  return temp
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
    modelValue.value = newValue
  } else {
    console.warn('Unsupported type received:', newValue)
  }
}
</script>

<script lang="ts">
export default {
  name: 'DiaryPage',
}
</script>

<style scoped>
.date-container {
  display: flex;
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

.horizontal-calendar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  height: 50px;
}

.date-inline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
  border-radius: 20%;
  font-size: 14px;
  transition: outline 0.3s ease;
}
</style>

<!-- <UChip
  :show="!!getColorByDate(day.toDate('UTC'))"
  :color="getColorByDate(day.toDate('UTC'))"
  size="lg"
>
  {{ day.day }}
</UChip> -->
