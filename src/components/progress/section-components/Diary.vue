<template>
  <!-- Date Picker เลือกวันที่ -->
  <div ref="sentinel" aria-hidden="true" style="height: 1px"></div>

  <DatePicker
    :modelValue="modelValue"
    :dateExists="dateExists"
    @update:modelValue="onModelValueUpdate"
    @updateGrade="updateGrade"
  />

  <!-- 🥗 มีข้อมูลมื้ออาหาร -->
  <div v-if="day && !loading && day.meals && day.meals.length > 0" class="diary-wrapper px-4">
    <!-- หัววันที่ -->
    <p class="date-header">
      {{
        modelValue
          ? isToday(modelValue)
            ? 'วันนี้, ' +
              df.format(modelValue.toDate(getLocalTimeZone()))
                .replace(/^วัน[^0-9]* /, '')
                .replace('พ.ศ. ', '')
            : df.format(modelValue.toDate(getLocalTimeZone()))
                .replace('ที่ ', ', ')
                .replace('พ.ศ. ', '')
          : 'Select a date'
      }}
    </p>

    <!-- Timeline -->
    <div class="timeline">
      <div
        v-for="it in timeline"
        :key="String(it.key)"
        class="timeline-item"
        :class="{ 'is-last': it.isLast, 'has-badge': it.showTime }"
      >
        <!-- เวลา -->
        <div class="time-col">
          <div v-if="it.showTime" class="time-badge">{{ it.time }} น.</div>
        </div>

        <!-- Bubble -->
        <div class="bubble" :class="{ 'bubble--left': it.showTime }">
          <div class="bubble-inner">
            <!-- ชื่อมื้อ -->
            <p class="bubble-title">{{ mealTypeTranslations[it.meal.mealType] }}</p>

            <!-- รูป -->
            <div class="bubble-media">
              <div
                v-if="imageLoaded[it.meal.id]"
                class="bubble-img"
                :style="{ backgroundImage: `url(${it.meal.signedUrl})` }"
                role="img"
                :aria-label="it.meal.foodNames"
              />
              <USkeleton v-else class="w-[240px] h-[240px] rounded-[14px]" />
            </div>

            <!-- รายการอาหาร -->
            <p class="bubble-text">
              <span
                v-for="(part, i) in it.meal.foodNames.split(',')"
                :key="i"
                class="food-chunk"
              >
                {{ part.trim() }}
              </span>
            </p>
          </div>

          <!-- Grade panel -->
          <div class="grade-panel" :class="`grade-${(it.meal.avgGrade || 'NA').toString().toUpperCase()}`">
            <div class="grade-score-nurse">
              <img v-if="it.meal.avgGrade === 'A'" class="grade-illu" src="../../../assets/progress/diary/nurse-a.png" />
              <img v-else-if="it.meal.avgGrade === 'B'" class="grade-illu" src="../../../assets/progress/diary/nurse-b.png" />
              <img v-else-if="it.meal.avgGrade === 'C'" class="grade-illu" src="../../../assets/progress/diary/nurse-c.png" />

              <div class="grade-score-col">
                <span class="grade-label" :class="`grade-${(it.meal.avgGrade || 'NA').toString().toUpperCase()}`">เกรด</span>
                <span class="grade-score" :class="`grade-${(it.meal.avgGrade || 'NA').toString().toUpperCase()}`">
                  {{ it.meal.avgGrade ?? '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ปุ่มแชร์ -->
    <div class="share-container">
      <DiaryShareButton
        :date="shareDate"
        :meals="
          (day?.meals ?? [])
            .map((m) => ({
              signedUrl: m.signedUrl,
              name: m.foodNames,
              grade: (['A', 'B', 'C'] as const).includes((m.avgGrade ?? '') as any)
                ? (m.avgGrade as 'A' | 'B' | 'C')
                : null,
            }))
            .filter((x): x is { signedUrl: string; name: string; grade: 'A' | 'B' | 'C' } => !!x.grade)
        "
      />
    </div>
  </div>

  <!-- 📭 ไม่มีข้อมูล -->
  <div v-else-if="day && !loading && (!day.meals || day.meals.length === 0)" class="diary-wrapper flex flex-col px-4">
    <!-- หัววันที่ -->
    <p class="date-header">
      {{
        modelValue
          ? isToday(modelValue)
            ? 'วันนี้, ' +
              df.format(modelValue.toDate(getLocalTimeZone()))
                .replace(/^วัน[^0-9]* /, '')
                .replace('พ.ศ. ', '')
            : df.format(modelValue.toDate(getLocalTimeZone()))
                .replace('ที่ ', ', ')
                .replace('พ.ศ. ', '')
          : 'Select a date'
      }}
    </p>

    <!-- No data image -->
    <div class="flex-1 flex items-center justify-center" style="margin-top: -50px">
      <img
        v-if="isToday(modelValue)"
        src="../../../assets/progress/diary/no-data-today.png"
        alt="No data today"
        class="no-data-today-img"
      />
      <img
        v-else
        src="../../../assets/progress/diary/no-data-selected-date.png"
        alt="No data for selected date"
        class="no-data-selected-date-img"
      />
    </div>
  </div>

  <!-- ⏳ กำลังโหลด (skeleton) -->
  <div v-else-if="loading" class="diary-wrapper loading px-4 py-6">
    <!-- หัววันที่ -->
    <USkeleton class="h-[28px] w-[220px] mt-5 ml-4 rounded-[6px] skel" />

    <!-- Timeline skeleton -->
    <div class="timeline py-4">
      <div v-for="n in 3" :key="n" class="timeline-item skel-item">
        <div class="time-col">
          <USkeleton class="skel-time-badge skel" />
        </div>
        <div class="bubble bubble--left skel">
          <div class="bubble-inner skel">
            <USkeleton class="h-[200px] w-[100px] mx-auto mb-3 rounded-[6px] skel" />
          </div>
        </div>
      </div>
    </div>

    <!-- ปุ่มแชร์ -->
    <div class="share-container mt-6 mb-4">
      <USkeleton class="h-[48px] w-[220px] mx-auto rounded-[14px] skel" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, shallowRef, computed, watchEffect } from 'vue'
import {
  getTodayMealsAndStats,
  getDayMealsAndStats,
  getAllProgress,
  type TimeMeal,
} from '../../../services/progress.service'
import DatePicker from './DatePicker.vue'
import DiaryShareButton from './DiaryShareButton.vue'

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
/** วันที่ส่งให้ปุ่มแชร์/SharePoster แบบ YYYY-MM-DD (ไม่ใช้ toISOString เพื่อกันเลื่อนวัน) */
const shareDate = computed(() => {
  if (!modelValue.value) return ''
  const js = modelValue.value.toDate(getLocalTimeZone())
  const y = js.getFullYear()
  const m = String(js.getMonth() + 1).padStart(2, '0')
  const d = String(js.getDate()).padStart(2, '0')
  const ymd = `${y}-${m}-${d}`
  console.log(
    '[DiaryPage] shareDate ->',
    ymd,
    '| local:',
    js.toString(),
    '| iso:',
    js.toISOString(),
  )
  return ymd
})
/** debug: ดูหัววันที่ที่กำลังจะแสดง */
watchEffect(() => {
  if (!modelValue.value) return
  const js = modelValue.value.toDate(getLocalTimeZone())
  console.log('[DiaryPage] header date preview ->', js.toString())
})
onMounted(async () => {
  loading.value = true
  dateExists.value = await getAllProgress()
  day.value = await getTodayMealsAndStats()
  if (day.value && day.value.stats) {
    updateGrade(day.value.stats.avgGrade)
  }

  console.log(day.value)
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

  // แปลงเป็นวันที่แบบ local (ไม่บวกวัน)
  const js = new Date(newValue.year - 543, newValue.month - 1, newValue.day)
  const ymd = `${js.getFullYear()}-${String(js.getMonth() + 1).padStart(2, '0')}-${String(js.getDate()).padStart(2, '0')}`

  console.log(
    '[DiaryPage] fetch getDayMealsAndStats with ->',
    ymd,
    '| local:',
    js.toString(),
    '| iso:',
    js.toISOString(),
  )

  day.value = await getDayMealsAndStats(ymd)
  if (day.value?.stats) updateGrade(day.value.stats.avgGrade)

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

type TimelineItem = {
  key: string
  time: string
  meal: Meal
  showTime: boolean
  isLast: boolean
}

const timeline = computed<TimelineItem[]>(() => {
  const result: TimelineItem[] = []
  if (!day.value?.formattedMeals?.length) return result

  // เรียงเวลาน้อย -> มาก (รองรับ "HH:mm")
  const groups = [...day.value.formattedMeals].sort((a, b) => a.time.localeCompare(b.time))

  groups.forEach((g, gi) => {
    const meals = [...g.meals]
    meals.forEach((m, mi) => {
      result.push({
        key: String(m.id),
        time: String(g.time),
        meal: m,
        showTime: mi === 0, // โชว์เวลาเฉพาะบล็อกแรกของช่วงเวลาเดียวกัน
        isLast: gi === groups.length - 1 && mi === meals.length - 1,
      })
    })
  })

  return result
})
</script>

<script lang="ts">
export default {
  name: 'DiaryPage',
}
</script>

<style scoped>
.timeline {
  position: relative;
}

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
  flex: 1 0 auto;
  min-height: 0;
  /* overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain; */
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  /* ฉากหลังขาว */
  background: #fff;
  border-radius: 35px 35px 0 0;
  box-sizing: border-box;
  /* กันขอบล่าง (โดยเฉพาะ iPhone ที่มี safe area) */
  /* padding-bottom: max(12px, env(safe-area-inset-bottom)); */
  margin: 0; /* ไม่มี margin */
  position: relative;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
}
/* ===== Layout ต่อหนึ่งมื้อ ===== */
/* ให้กริดยืดความสูงเท่ากัน (bubble สูงเท่าแถว) */
.timeline-item {
  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: stretch; /* ยืดทั้งคอลัมน์ให้สูงเท่ากัน */
  margin-bottom: 23px;
  position: relative;
  margin-left: 16px;
}

/* ===== เวลา + เส้นต่อ ===== */
/* คอลัมน์เวลาให้ลอยอยู่เหนือเส้น */
.time-col {
  position: relative;
  z-index: -1;
}
/* วาดเส้นตั้งเชื่อม “จากกลาง badge ของแถวนี้” ไป “ถึงกลาง badge ของแถวถัดไป” */
.timeline-item .time-col::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 2px;
  background: #cfe0ff;
  transform: translateX(-650%);
  top: 0; /* ค่า default ถ้าไม่มี badge ในแถวนี้ */
  bottom: -23px; /* ให้เลยลงมาตาม margin-bottom */
  z-index: -1;
}
/* ถ้าแถวนั้นมี badge ให้เริ่มเส้นจากกึ่งกลาง badge */
.timeline-item.has-badge .time-col::after {
  top: calc(var(--badge-h, 34px) / 2);
}

/* แถวสุดท้าย “ไม่วาดเส้น” */
.timeline-item.is-last .time-col::after {
  display: none;
}
/* ขนาด badge (ใช้ร่วมกับ calc ด้านบน) */
.time-badge {
  --badge-h: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 11px 3px 13px;
  border: 2px solid #cfe0ff;
  color: #194678;
  border-radius: 999px;
  background: #f4f8ff;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  line-height: 24px;
}
/* ===== Grade Score ===== */
.grade-score.grade-A {
  color: #3d8200;
  text-align: center;
  font-family: star;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 87.5% */
  letter-spacing: 0.32px;
}
.grade-score.grade-B {
  color: #777500;
  text-align: center;
  font-family: star;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 87.5% */
  letter-spacing: 0.32px;
}
.grade-score.grade-C {
  color: #7b4c49;
  text-align: center;
  font-family: star;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 87.5% */
  letter-spacing: 0.32px;
}
/* ===== Grade Label ===== */
.grade-label.grade-A {
  color: #3d8200;
  text-align: center;
  font-family: star;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.grade-label.grade-B {
  color: #777500;
  text-align: center;
  font-family: star;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.grade-label.grade-C {
  color: #7b4c49;
  text-align: center;
  font-family: star;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.bubble-title {
  margin: 0 0 10px;
  text-align: center;
  color: #194678;
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 18px;
  font-style: normal;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.meal-main {
  min-width: 0;
}
/* คำแต่ละชิ้นอยู่ติดกัน ไม่แตกกลางคำ */
.bubble-text .food-chunk {
  display: inline-block; /* สำคัญ: ทำให้เป็น 1 ก้อน */
  white-space: nowrap; /* ไม่ตัดกลางคำ/วลี */
  word-break: keep-all;
  margin-top: 3px;
}
.bubble-text .food-chunk:only-child {
  display: inline; /* ไม่ต้องเป็นก้อน */
  white-space: normal; /* ให้ wrap ตามปกติ */
  word-break: normal; /* ไทยตัดตามพจนานุกรม */
  line-break: auto;
  overflow-wrap: anywhere; /* กันเคสยาวมาก ๆ */
}
/* เติม ", " หลังทุกชิ้น ยกเว้นตัวสุดท้าย
   และเปิดโอกาสให้ตัดบรรทัด "หลัง" จุลภาคได้ */
.bubble-text .food-chunk:not(:last-child)::after {
  content: ','; /* ขึ้นบรรทัดใหม่หลัง , */
}
@supports (overflow-wrap: anywhere) {
  .bubble-text .food-chunk {
    overflow-wrap: anywhere;
  }
}
.bubble-text .food-chunk + .food-chunk {
  margin-left: 0.35em; /* ใส่ช่องไฟด้วย margin ของตัวถัดไปแทน */
}
.grade-panel {
  position: relative;
  overflow: hidden;
}
/* หางสามเหลี่ยม */
.bubble--left::after {
  --tail-w: 20px; /* กว้างตาม Figma */
  --tail-h: 20px; /* สูงตาม Figma */

  content: '';
  position: absolute;
  border-top-left-radius: 10px;
  left: calc(-1 * var(--tail-w)); /* ยื่นออกด้านซ้าย */
  top: 0px; /* ปรับตำแหน่งแนวตั้งได้ */
  width: var(--tail-w);
  height: var(--tail-h);
  background: #f1f7ff; /* สีเดียวกับบับเบิล */
  /* สามเหลี่ยม: (ซ้ายบน) -> (ขวาบน) -> (ขวาล่าง) */
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
.bubble:not(.bubble--left) {
  border-top-left-radius: 10px;
}
.no-data-today-img {
  width: 300px;
  height: auto;
}
.no-data-selected-date-img {
  width: 300px;
  height: auto;
}
.skel-item {
  margin-bottom: 23px;
}

/* skeleton ของ badge เวลา */
.skel-time-badge {
  height: 34px;
  width: 78px;
  border-radius: 9999px;
}

/* skeleton ของรูปในบับเบิล (ใช้สัดส่วนเท่าของจริง) */
.skel-bubble-img {
  width: 100px;
  max-width: 100px;
  aspect-ratio: 1/1;
  border-radius: 5px;
}
.skel-grade-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(100px, 12vw, 120px);
  padding: 8px 0;
}
.skel {
  background-color: #eef0f4 !important; /* เทาอ่อน (Tailwind gray-200) */
}
.diary-wrapper.loading .bubble.skel,
.diary-wrapper.loading .bubble--left.skel::after {
  background: #eef0f4 !important;
}

/* ==== เส้น timeline ตอน skeleton ==== */
.timeline-item.skel-item .time-col::after {
  background-color: #eaecf2 !important; /* เทาอ่อน */
}

@media (min-width: 351px) {
  /* ===== Bubble เป็น 2 คอลัมน์: เนื้อหา + แถบเกรด ===== */
  .bubble {
    --py: 16px;
    --gap: 0px; /* ระยะที่อยากให้มีทั้งซ้ายและขวา (ตั้งเป็น 0 ก็ได้) */
    --grade-w: clamp(72px, 22vw, 200px);

    padding: var(--py) 0; /* ตัด padding ซ้าย/ขวาออก ไม่ให้มีผล */
    display: grid;
    grid-template-columns: var(--gap) minmax(0, 1fr) var(--grade-w);
    column-gap: 0; /* ไม่ต้องมีช่องว่างเพิ่ม */
    background: #f1f7ff;
    border-radius: 0 10px 10px 10px;
    color: #194678;
    align-items: stretch;
    position: relative;
    top: 8px;
    overflow: visible;
  }

  /* เนื้อในบับเบิล: ซ้ายรายละเอียด, ขวาเกรด */
  .bubble-inner {
    grid-column: 2;
    --inner-w: clamp(120px, 48vw, 200px);
    width: min(100%, var(--inner-w));
    max-width: none;
    margin-inline: auto;
    justify-self: center; /* ชิดซ้ายในคอลัมน์ของตัวเอง */
    z-index: 1;
    padding: 0 8px; /* เพิ่ม padding ด้านบนและล่าง */
  }

  .bubble-media {
    width: 100%;
    min-width: 0; /* กันไม่ให้ดันคอลัมน์ */
    display: flex;
    justify-content: center;
  }
  .bubble-img {
    display: block;
    width: 100%;
    max-width: 100px; /* หรือค่าที่ต้องการ */
    aspect-ratio: 1 / 1;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
  }
  .bubble-text {
    color: var(--main-text, #194678);
    /* Paragraph2 */
    font-family: 'Noto Looped Thai UI';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px; /* 155.556% */
    letter-spacing: 0.18px;
    margin: 12px 0 0;
    text-align: center;
    white-space: normal;
    word-break: normal; /* ยอมให้ตัดตามพจนานุกรมของภาษาไทย */
    line-break: auto;
    text-wrap: wrap;
    padding: 0 5px;
  }

  /* ===== Grade Panel ===== */
  .grade-panel {
    --illu-h: clamp(100px, 12vw, 120px);
    --gap: 0px;
    margin-top: calc(-1 * var(--py)); /* ให้เริ่มตั้งแต่ขอบบน bubble */
    margin-bottom: calc(-1 * var(--py)); /* และจบถึงขอบล่าง bubble */
    grid-column: 3;
    align-self: stretch; /* สูงเท่าบับเบิล */
    justify-self: stretch; /* <<< สำคัญ: ยืดเต็มความกว้างคอลัมน์ */
    border-radius: 0 10px 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    z-index: 0;
    /* ตัวแปรพื้นฐาน */
    --decor-size-a: clamp(50px, 45%, 100px); /* ขนาดวงโค้ง ตามความกว้างกล่อง */
    --decor-size-b: clamp(70px, 45%, 90px); /* ขนาดวงโค้ง ตามความกว้างกล่อง */
    --decor-offset: 50%; /* ระยะดันออกนอกขอบ */
    background: var(--grade-bg); /* พื้นหลังหลักของเกรด */
  }
  .grade-panel::before,
  .grade-panel::after {
    content: '';
    position: absolute;
    aspect-ratio: 1 / 1;
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
    z-index: 0; /* อยู่หลังข้อความ */
  }

  /* มุมซ้ายบน */
  .grade-panel::before {
    width: var(--decor-size-a);
    top: 0;
    left: 0;
    background-image: var(--ring1);
    transform: translate(-var(--decor-offset), -var(--decor-offset));
  }

  /* มุมขวาล่าง */
  .grade-panel::after {
    width: var(--decor-size-b);
    right: 0;
    bottom: 80px;
    background-image: var(--ring2);
    transform: translate(var(--decor-offset), var(--decor-offset));
  }
  .grade-panel.grade-A {
    --ring1: url('../../../assets/progress/diary/green1.png');
    --ring2: url('../../../assets/progress/diary/green2.png');
    background: linear-gradient(180deg, #e9ffd5 0%, #d2f3b5 100%);
  }

  .grade-panel.grade-B {
    --ring1: url('../../../assets/progress/diary/yellow1.png');
    --ring2: url('../../../assets/progress/diary/yellow2.png');
    background: linear-gradient(180deg, #fff9c4 0%, #fff59a 100%);
  }

  .grade-panel.grade-C {
    --ring1: url('../../../assets/progress/diary/red1.png');
    --ring2: url('../../../assets/progress/diary/red2.png');
    background: linear-gradient(180deg, #ffd0cd 0%, #ffa8a3 100%);
  }
  .grade-score-col {
    position: absolute;
    left: 50%;
    top: calc((100% - var(--illu-h) - var(--gap)) / 2);
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    z-index: 2; /* อยู่เหนือภาพ */
  }
  .grade-illu {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    height: var(--illu-h);
    z-index: 2; /* อยู่เหนือภาพ */
  }
}

/* มือถือแคบ: เกรดลงล่าง */
@media (max-width: 350px) {
  /* คอลัมน์เดียว + จัดกึ่งกลาง */
  .bubble-inner {
    grid-template-columns: 1fr;
    justify-items: center; /* กึ่งกลางแนวนอนของทุก child */
    text-align: center;
  }
  .bubble {
    margin-top: 5px;
    padding: 16px 10px 0 10px;
    position: relative; /* ให้ ::after ยึดกับกล่องนี้ */
    display: flex;
    height: 100%;
    background: #f1f7ff; /* คืนพื้นหลัง */
    border-radius: 0 10px 10px 10px; /* มุมโค้ง */
    color: #194678;
    z-index: 1; /* ให้อยู่เหนือเส้น timeline */
    flex-direction: column;
    overflow: visible;
  }
  .bubble-text {
    color: var(--main-text, #194678);
    /* Paragraph2 */
    font-family: 'Noto Looped Thai UI';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px; /* 155.556% */
    letter-spacing: 0.18px;
    margin: 10px 0 10px 0;
    text-align: center;
    white-space: normal;
    word-break: normal; /* ยอมให้ตัดตามพจนานุกรมของภาษาไทย */
    line-break: auto;
    text-wrap: wrap;
  }
  /* คำแต่ละชิ้นอยู่ติดกัน ไม่แตกกลางคำ */
  .bubble-text .food-chunk {
    white-space: nowrap;
  }
  .bubble-text .food-chunk:not(:last-child)::after {
    content: ',';
    white-space: normal;
  }
  .bubble-media {
    min-width: 110px;
    max-width: 110px;
    width: 110px;
    justify-content: center;
  }
  .bubble-img {
    min-width: 110px;
    max-width: 110px;
    width: 110px;
    aspect-ratio: 1 / 1;
    height: 110px;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
    display: block;
  }
  .grade-panel {
    isolation: isolate;
    border-radius: 0 0 10px 10px;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-bottom: -5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
    --decor-size-a: clamp(30px, 58%, 40px); /* มุมซ้ายบน */
    --decor-size-b: clamp(40px, 62%, 60px); /* มุมขวาล่าง */
    --decor-offset: 38%;
    background: var(--grade-bg); /* พื้นหลังหลักของเกรด */
  }
  /* พื้นหลังวงโค้ง */
  .grade-panel::before,
  .grade-panel::after {
    content: '';
    position: absolute;
    width: var(--decor-size-a); /* (::after จะใช้ var(--decor-size-b)) */
    aspect-ratio: 1/1;
    background-repeat: no-repeat;
    background-size: contain;
    z-index: 0; /* อยู่หลังข้อความ/รูป */
    pointer-events: none;
  }

  /* มุมซ้ายบน – ชดเชยระยะ margin ที่ดึงพาเนลขึ้น */
  .grade-panel::before {
    top: 20px; /* <<< ชดเชย */
    left: 20px;
    width: var(--decor-size-a);
    background-image: var(--ring1);
    transform: translate(-50%, -50%) rotate(90deg); /* ชิดมุม ไม่ต้องกำหนด px เอง */
  }

  /* มุมขวาล่าง – ชดเชยฝั่งล่าง */
  .grade-panel::after {
    right: 30px;
    bottom: 0px; /* <<< ชดเชย */
    width: var(--decor-size-b);
    background-image: var(--ring2);
    transform: translate(50%, 50%) rotate(90deg);
  }

  /* เลือกรูปตามเกรด (ชุดสำหรับหน้าจอเล็ก) */
  .grade-panel.grade-A {
    --ring1: url('../../../assets/progress/green1.png');
    --ring2: url('../../../assets/progress/green2.png');
    background: linear-gradient(180deg, #e9ffd5 0%, #d2f3b5 100%);
  }
  .grade-panel.grade-B {
    --ring1: url('../../../assets/progress/yellow1.png');
    --ring2: url('../../../assets/progress/yellow2.png');
    background: linear-gradient(180deg, #fff9c4 0%, #fff59a 100%);
  }
  .grade-panel.grade-C {
    --ring1: url('../../../assets/progress/red1.png');
    --ring2: url('../../../assets/progress/red2.png');
    background: linear-gradient(180deg, #ffd0cd 0%, #ffa8a3 100%);
  }

  .grade-score-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px; /* ระยะห่างระหว่าง label กับ score */
    padding-bottom: 15px;
    z-index: 2;
  }
  .grade-score-nurse {
    display: flex;
    flex-direction: row;
    align-items: flex-end; /* ให้ทุกอย่างชิดขอบล่าง */
    justify-content: center;
    gap: 15px;
    padding-top: 10px;
    height: 100%; /* ให้ row สูงเต็มกล่อง */
  }

  .grade-illu {
    margin-bottom: 0px;
    height: 70px;
    z-index: 2;
  }
}
</style>
