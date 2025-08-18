<template>
  <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
  <!-- ส่วนหัว: แสดงเดือนและปีของวันที่เลือก -->
  <div ref="stickyEl" class="sticky-date" :class="{ 'is-stuck': isStuck }">
    <div class="flex items-center justify-between px-4 mb-2">
      <div class="date-container flex flex-row justify-between items-center px-1">
        <p>
          {{
            modelValue
              ? new DateFormatter('th-TH', { month: 'long', year: 'numeric' }).format(
                  modelValue.toDate(getLocalTimeZone()),
                )
              : 'Select a date'
          }}
        </p>
      </div>

      <!-- ปุ่มเปิดปฏิทิน -->
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-calendar"
        class="w-fit justify-center"
        size="lg"
        @click="isOpen = true"
      />
    </div>

    <!-- แสดงวันในสัปดาห์แบบแนวนอน -->
    <div class="w-full px-1 py-4">
      <div class="horizontal-calendar flex justify-between">
        <div
          v-for="(day, idx) in selectedWeek"
          :key="day.date.toISOString()"
          class="date-inline"
          :class="[
            getColorByDate(day.date, 'horizontal-calendar'),
            {
              'selected-border-wrapper': isSameDate(day.date, modelValue),
              'non-clickable': isFutureDate({
                year: day.date.getFullYear(),
                month: day.date.getMonth() + 1,
                day: day.date.getDate(),
              }),
              'first-inline': idx === 0,
              'last-inline': idx === selectedWeek.length - 1,
            },
          ]"
          @click="
            !isFutureDate({
              year: day.date.getFullYear(),
              month: day.date.getMonth() + 1,
              day: day.date.getDate(),
            }) && updateValue(day.calendarDate)
          "
        >
          <div class="weekday-label">{{ day.weekday }}</div>
          {{ day.date.getDate() }}
          <div v-if="hasDateExists(day.date)" class="date-dot"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div v-if="isFixed" :style="{ height: headerH + 'px' }"></div> -->
  <!-- Modal แสดงปฏิทิน -->
  <UModal
    v-model:open="isOpen"
    teleport
    :close="{ color: 'neutral', variant: 'outline', class: 'rounded-full' }"
    :ui="{
      wrapper: 'z-[15]', // ชั้นนอกสุด
      overlay: 'fixed inset-0 z-[5] bg-black/40', // พื้นหลังเทาโปร่ง
      content: 'bg-white rounded-2xl z-[950]', // พื้นหลังกล่อง
    }"
  >
    <template #body>
      <UCalendar
        v-model="internalModelValue"
        class="p-2 text-lg"
        size="lg"
        locale="th-TH"
        color="neutral"
        :is-date-disabled="isFutureDate"
      >
        <!-- render แต่ละวันในปฏิทิน -->
        <template #day="{ day }">
          <div
            class="date-inline-calendar"
            :class="[
              getColorByDate(day.toDate(getLocalTimeZone()), 'datepicker'),
              {
                'non-clickable': isFutureDate({
                  year: day.year,
                  month: day.month,
                  day: day.day,
                }),
                'selected-border-wrapper': isSameDate(
                  day.toDate(getLocalTimeZone()),
                  internalModelValue,
                ),
              },
            ]"
            @click.stop="
              !isFutureDate({ year: day.year, month: day.month, day: day.day }) &&
              onCalendarDayClick(day.toDate(getLocalTimeZone()))
            "
          >
            <div
              class="day-circle"
              :class="getColorByDate(day.toDate(getLocalTimeZone()), 'datepicker')"
            >
              {{ day.day }}
            </div>
          </div>
        </template>
      </UCalendar>
    </template>

    <!-- ปุ่มยืนยันการเลือกวัน -->
    <template #footer>
      <div class="flex justify-center w-full mt-2">
        <UButton
          color="neutral"
          variant="outline"
          class="text-lg"
          trailing-icon="i-lucide-arrow-right"
          size="lg"
          @click="handleConfirmClick"
        >
          ดูวันที่เลือก
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
// import library ต่างๆ ที่ใช้จัดการวันที่และ reactive state
import { computed, watch, shallowRef, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  CalendarDate,
  BuddhistCalendar,
  getLocalTimeZone,
  DateFormatter,
} from '@internationalized/date'

// state สำหรับ modal ปฏิทิน
const isOpen = ref(false)
const closedByUserAction = ref(false)

// props ที่รับเข้ามา
const props = defineProps<{
  modelValue: CalendarDate // วันที่ที่เลือก
  dateExists: { date: string; grade: string }[] | undefined // ข้อมูลวันและ grade ที่เคยบันทึก
}>()

// emit event ออกไปให้ parent component
const emit = defineEmits<{
  (event: 'update:modelValue', value: CalendarDate): void
  (event: 'updateGrade', grade: string): void
}>()

// state สำหรับใช้ภายใน component (ไม่ส่งออกทันที)
const internalModelValue = shallowRef(props.modelValue)

// sync ค่าระหว่าง prop และ internal value
watch(
  () => props.modelValue,
  (newVal) => {
    internalModelValue.value = newVal
  },
)

// รีเซ็ตค่าเมื่อปิด modal ถ้าไม่ได้ปิดโดยผู้ใช้กด confirm
watch(isOpen, (newVal) => {
  if (newVal) {
    internalModelValue.value = props.modelValue
  } else if (!closedByUserAction.value) {
    internalModelValue.value = props.modelValue
  }
  closedByUserAction.value = false
})

// กดวันในปฏิทินแนวนอน
function updateValue(value: CalendarDate) {
  emit('update:modelValue', value)
  internalModelValue.value = value
}

// ฟังก์ชันเมื่อเลือกวันจาก calendar
function onCalendarDayClick(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const clicked = new Date(date)
  clicked.setHours(0, 0, 0, 0)

  // ห้ามเลือกวันในอนาคต
  if (clicked > today) return

  const calDate = new CalendarDate(
    new BuddhistCalendar(),
    clicked.getFullYear() + 543,
    clicked.getMonth() + 1,
    clicked.getDate(),
  )
  internalModelValue.value = calDate
}

// ปุ่มยืนยันการเลือกวัน
function handleConfirmClick() {
  closedByUserAction.value = true
  confirmSelectedDate()
  isOpen.value = false
}

// อัปเดตวันจริงเมื่อกด confirm
function confirmSelectedDate() {
  emit('update:modelValue', internalModelValue.value)
  closedByUserAction.value = true
  isOpen.value = false
}

// สร้าง array 7 วันจากวันปัจจุบัน (เพื่อแสดงแนวนอน)
const selectedWeek = computed(() => {
  if (!props.modelValue) return []

  const weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
  const selectedDate = new Date(
    props.modelValue.year - 543,
    props.modelValue.month - 1,
    props.modelValue.day,
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

// แปลง date เป็น string format YYYY-MM-DD เพื่อใช้เทียบกับข้อมูล
function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// เช็คว่าเป็นวันอนาคตหรือไม่ (รองรับ DateValue เช่น CalendarDate)
function isFutureDate(date: { year: number; month: number; day: number }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // แปลง CalendarDate เป็น Date ปกติ
  const compareDate = new Date(date.year - 543, date.month - 1, date.day)
  compareDate.setHours(0, 0, 0, 0)

  return compareDate > today
}

// เช็คว่าเป็นวันเดียวกันหรือไม่ (ระหว่าง Date กับ CalendarDate)
function isSameDate(d1: Date, d2?: CalendarDate) {
  if (!d1 || !d2) return false
  return (
    d1.getDate() === d2.day && d1.getMonth() === d2.month - 1 && d1.getFullYear() === d2.year - 543
  )
}

// คืน class CSS สำหรับแต่ละวัน (สีพื้นหลังตาม grade / ห้ามคลิก / วันอนาคต)
function getColorByDate(date: Date, comp?: string) {
  const dateKey = toLocalDateKey(date)
  const sourceDate = comp === 'horizontal-calendar' ? props.modelValue : internalModelValue.value

  const selected = new Date(sourceDate.year - 543, sourceDate.month - 1, sourceDate.day)
  selected.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  const isFuture = compareDate > today

  const baseClass: string[] = []

  if (comp === 'horizontal-calendar' || comp === 'datepicker') {
    if (isFuture) baseClass.push('future-date')

    const foundDate = props.dateExists?.find((item) => item.date === dateKey)
    switch (foundDate?.grade) {
      case 'A':
        baseClass.push('grade-a')
        break
      case 'B':
        baseClass.push('grade-b')
        break
      case 'C':
        baseClass.push('grade-c')
        break
    }
  }

  return baseClass.join(' ')
}
// ตรวจสอบว่าวันที่นี้มีข้อมูลใน dateExists หรือไม่
function hasDateExists(date: Date): boolean {
  const dateKey = toLocalDateKey(date)
  return !!props.dateExists?.find((item) => item.date === dateKey)
}

// === Sticky header state (type-safe, no any) ===
const sentinel = ref<HTMLElement | null>(null)
const isStuck = ref(false)

let io: IntersectionObserver | null = null
// ...existing code...
onMounted(async () => {
  await nextTick()
  // find the scroll container; must match the element that scrolls (progress-page)
  const rootEl = document.querySelector('.progress-page') as HTMLElement | null

  io = new IntersectionObserver(
    (entries) => {
      const e = entries[0]
      isStuck.value = !e.isIntersecting
    },
    {
      root: rootEl,
      threshold: 0,
      rootMargin: '0px 0px 0px 0px',
    },
  )

  if (sentinel.value) {
    io.observe(sentinel.value)
  }
})

onBeforeUnmount(() => {
  if (io && sentinel.value) io.unobserve(sentinel.value)
  io = null
})
</script>

<style scoped>
/* ส่วนแสดงเดือน/ปี */
.date-container {
  display: flex;
  color: var(--main-text, #194678);
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
}

/* ปฏิทินแนวนอน */
.horizontal-calendar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 16px;
}
.sticky-date {
  position: sticky;
  top: var(--app-nav-offset, 0px); /* ใช้ค่าที่วัดได้ */
  z-index: 5; /* ให้ต่ำกว่า Nav */
  background: transparent;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  will-change: transform, backdrop-filter;
  padding-top: 8px;
  padding-bottom: 8px;
}
.sticky-date.is-stuck {
  box-shadow: 0 8px 12px -8px rgba(195, 195, 195, 0.6);
  background: rgba(242, 248, 252, 0.9);
  -webkit-backdrop-filter: blur(5px); /* Safari */
  backdrop-filter: blur(5px);
}
/* กล่องวันที่ในแนวนอน */
.date-inline {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1 1 0; /* responsive width */
  min-width: 32px; /* กำหนดขั้นต่ำ */
  font-size: 18px;
  border-radius: 10px;
  height: 70px;
  margin: 0 7px; /* ระยะห่างซ้ายขวา */
  box-sizing: border-box;
  color: #194678;
  background-color: #eeeaea;
}

.first-inline {
  margin-left: 0 !important;
  margin-right: 7px !important;
}
.last-inline {
  margin-right: 0 !important;
  margin-left: 7px !important;
}
.horizontal-calendar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* กรอบวันที่ที่ถูกเลือก */
.selected-border-wrapper {
  outline: 2px solid #98acc3;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* สีพื้นหลังตามระดับเกรด */
.grade-a.date-inline {
  background-color: #d2f3b5;
  color: #194678;
}
.grade-b.date-inline {
  background-color: #f8f0a6;
  color: #194678;
}
.grade-c.date-inline {
  background-color: #ffd0cd;
  color: #194678;
}

/* สีวันในอนาคตหรือที่กดไม่ได้ */
.future-date.date-inline,
.non-clickable.date-inline {
  background-color: #f0f0f0;
  color: #898989;
  opacity: 0.6;
  pointer-events: none;
}
.day-circle {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin: 0 auto;
}

/* สีพื้นหลังตามระดับเกรด */
.grade-a.day-circle {
  background-color: #d2f3b5;
  color: #194678;
}
.grade-b.day-circle {
  background-color: #f8f0a6;
  color: #194678;
}
.grade-c.day-circle {
  background-color: #ffd0cd;
  color: #194678;
}

/* สีวันในอนาคตหรือที่กดไม่ได้ */
.non-clickable .day-circle {
  background-color: #f0f0f0;
  color: #898989;
  opacity: 0.6;
}
/* จุดแสดงสถานะการบันทึก */
.date-dot {
  width: 4px;
  height: 4px;
  background-color: #194678; /* ใช้สีที่เข้ากับธีม */
  border-radius: 50%;
  margin-top: 2px;
}

.date-inline-calendar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 33px;
  border-radius: 120px;
}
.date-inline-calendar.non-clickable {
  background-color: #f0f0f0;
  color: #898989;
  opacity: 0.6;
  pointer-events: none;
}
@media (max-width: 320px) {
  .date-inline {
    margin: 0 3px; /* ลดจาก 7px เหลือ 3px */
  }

  .first-inline {
    margin-left: 0 !important;
    margin-right: 3px !important;
  }

  .last-inline {
    margin-right: 0 !important;
    margin-left: 3px !important;
  }
}
</style>
