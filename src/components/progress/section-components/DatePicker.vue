<template>
  <UModal
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <div class="date-container flex flex-row justify-between items-center px-2">
      <p>
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
        v-model="internalModelValue"
        class="p-2"
        size="xl"
        locale="th-TH"
        @update:model-value="handleModelValueUpdate"
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
        @click="updateValue(day.calendarDate)"
      >
        <div class="weekday-label">{{ day.weekday }}</div>
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, shallowRef } from 'vue'
import {
  CalendarDate,
  BuddhistCalendar,
  getLocalTimeZone,
  DateFormatter,
} from '@internationalized/date'

const props = defineProps<{
  modelValue: CalendarDate
  dateExists: { date: string; grade: string }[] | undefined
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: CalendarDate): void
  (event: 'updateGrade', grade: string): void
}>()

const internalModelValue = shallowRef(props.modelValue)
watch(
  () => props.modelValue,
  (newVal) => {
    internalModelValue.value = newVal
  },
)

function updateValue(value: CalendarDate) {
  internalModelValue.value = value
  emit('update:modelValue', value)
}

const selectedWeek = computed(() => {
  if (!internalModelValue.value) return []
  const weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
  const selectedDate = new Date(
    internalModelValue.value.year - 543,
    internalModelValue.value.month - 1,
    internalModelValue.value.day,
  )
  const startOfWeek = new Date(selectedDate)
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return {
      date,
      weekday: weekdays[date.getDay()],
      calendarDate: new CalendarDate(
        new BuddhistCalendar(),
        date.getFullYear() + 543,
        date.getMonth() + 1,
        date.getDate(),
      ),
    }
  })
})

function toLocalISOString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0]
}

function getColorByDate(date: Date, comp?: string) {
  const dateString = toLocalISOString(date)
  const selected = new Date(
    internalModelValue.value.year - 543,
    internalModelValue.value.month - 1,
    internalModelValue.value.day + 1,
  )
  const todayString = new Date().toLocaleDateString('en-CA', { timeZone: getLocalTimeZone() })
  const currentSelectedString = selected.toISOString().split('T')[0]

  let temp = ''
  if (dateString === currentSelectedString && comp === 'horizontal-calendar') temp = `outline-1`

  const foundDate = props.dateExists?.find((item) => item.date === dateString)
  switch (foundDate?.grade) {
    case 'A':
      return dateString === todayString && comp === 'datepicker'
        ? `outline-1 outline-[#90caf9]`
        : `bg-[#90caf9]/50 ${temp}`
    case 'B':
      return dateString === todayString && comp === 'datepicker'
        ? `outline-1 outline-[#ffd180]`
        : `bg-[#ffd180]/50 ${temp}`
    case 'C':
      return dateString === todayString && comp === 'datepicker'
        ? `outline-1 outline-[#ef9a9a]`
        : `bg-[#ef9a9a]/50 ${temp}`
  }
  return temp
}

function handleModelValueUpdate(value: unknown) {
  if (value) {
    updateValue(value as CalendarDate)
  }
}
</script>

<script lang="ts">
export default {
  name: 'DatePicker',
}
</script>

<style scoped>
.date-container {
  display: flex;
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
  transition: outline 0.1s ease;
}
</style>
