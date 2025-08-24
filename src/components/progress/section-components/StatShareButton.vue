<!-- StatShareButton.vue -->
<template>
  <div class="share-button-wrapper">
    <button type="button" class="share-button bt-text" @click="isOpen = true">
      บันทึกภาพให้เพื่อนดู<Download :size="20" />
    </button>
  </div>

  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'z-[1000] w-[min(1100px,92vw)] h-auto max-h-[90vh] flex flex-col overflow-hidden',
      overlay: 'z-[1000] bg-black/50',
      body: 'z-[1001] p-0',
      header: 'hidden',
      close: 'hidden',
      footer: 'z-[1001] border-gray-200 bg-white p-0 flex justify-center py-3 px-2',
    }"
  >
    <template #body>
      <div class="preview-box">
        <img v-if="previewUrl" :src="previewUrl" class="preview-img" alt="Stat poster preview" />
        <div v-else class="preview-skeleton">กำลังสร้างรูปภาพ<br />กรุณารอสักครู่นะคะ</div>
      </div>

      <!-- mount ตัวเรนเดอร์ออฟสกรีนไว้ แต่ไม่ต้องโชว์ -->
      <StatPoster
        ref="posterRef"
        :type="type"
        :date="currentDate"
        :stats="stats"
        :profile-name="profileName"
        :profile-image="profileImage"
        style="position: fixed; left: -99999px; top: 0"
      />
    </template>

    <template #footer>
      <div class="actions">
        <button type="button" class="send-button" :disabled="!previewUrl" @click="download">
          ส่งรูปทางแชท <Forward class="icon" aria-hidden="true" />
        </button>

        <button type="button" class="close-button" @click="isOpen = false">
          ปิดหน้านี้ <X class="icon" aria-hidden="true" />
        </button>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { Download, Forward, X } from 'lucide-vue-next'
import { ref, watch, nextTick, computed } from 'vue'
import StatPoster, { type StatPosterExpose } from './StatPoster.vue'

type StatType = 'day' | 'week' | 'month'
// type Grade = 'A' | 'B' | 'C'
type MealStats = {
  avgGrade: string
  countA: number
  countB: number
  countC: number
  totalMeals?: number
}

const props = defineProps<{
  type: StatType
  stats?: MealStats
  profileName?: string
  profileImage?: string
}>()

const isOpen = ref(false)
const posterRef = ref<StatPosterExpose | null>(null)
const previewUrl = ref<string | null>(null)

// แก้ไข: สร้างวันที่ในรูปแบบที่ StatPoster ต้องการ
const currentDate = computed(() => {
  // ใช้เวลาไทย (Bangkok timezone)
  const now = new Date()
  const bangkokTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))

  if (props.type === 'day') {
    // รูปแบบ: YYYY-MM-DD
    const year = bangkokTime.getFullYear()
    const month = String(bangkokTime.getMonth() + 1).padStart(2, '0')
    const day = String(bangkokTime.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    return dateStr
  }

  if (props.type === 'week') {
    // รูปแบบ: YYYY-MM-DD (วันใดก็ได้ในสัปดาห์ปัจจุบัน - ใช้วันปัจจุบันเลย)
    const year = bangkokTime.getFullYear()
    const month = String(bangkokTime.getMonth() + 1).padStart(2, '0')
    const day = String(bangkokTime.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    return dateStr
  }

  if (props.type === 'month') {
    // รูปแบบ: YYYY-MM
    const year = bangkokTime.getFullYear()
    const month = String(bangkokTime.getMonth() + 1).padStart(2, '0')
    const dateStr = `${year}-${month}`
    return dateStr
  }

  // fallback
  const year = bangkokTime.getFullYear()
  const month = String(bangkokTime.getMonth() + 1).padStart(2, '0')
  const day = String(bangkokTime.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const defaultStats: MealStats = { avgGrade: 'B', countA: 0, countB: 0, countC: 0 }

const stats = computed(() => props.stats || defaultStats)

watch(isOpen, async (open) => {
  if (!open) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
    return
  }

  await nextTick() // ให้ลูก mount ก่อน
  if (!posterRef.value) return

  try {
    const blob = await posterRef.value.renderToBlob(1200)
    previewUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error creating poster:', error)
  }
})

function download() {
  if (!previewUrl.value) return

  const filename = `stats_${props.type}_${currentDate.value.replace(/[\/\s:]/g, '-')}.png`
  const a = document.createElement('a')
  a.href = previewUrl.value
  a.download = filename
  a.click()
}
</script>

<style scoped>
/* คำนวณให้รูปไม่สูงจนชน footer */
:root {
  --footer-h: 68px;
}

.preview-box {
  display: grid;
  place-items: center;
  max-width: 100vw;
  max-height: calc(100vh - var(--footer-h));
  box-sizing: border-box;
}

.preview-img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: auto;
  object-fit: contain;
}

.preview-skeleton {
  padding: 40px;
  opacity: 0.6;
  text-align: center;
}

.share-button-wrapper {
  display: flex;
  justify-content: center;
  margin: 21px 0 15px 0;
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;
  border: 0;
  color: #2f2f2f;
  font-size: 16px;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
  gap: 5px;
  cursor: pointer;
}

.share-button:hover {
  filter: brightness(1.02);
}

.share-button:active {
  transform: translateY(1px);
  box-shadow:
    -2px -2px 1px 0 #cce5bb inset,
    2px 2px 1px 0 #e0f0d5 inset;
}

.share-button:focus-visible {
  outline: 2px solid #19467833;
  outline-offset: 2px;
}

.bt-text {
  color: #333;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.18px;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(8px, 4vw, 20px);
}

.send-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 15px 0 15px;
  height: 50px;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;
  color: #333;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.18px;
  border: 0;
  cursor: pointer;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
  filter: brightness(1.02);
}

.send-button:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow:
    -2px -2px 1px 0 #cce5bb inset,
    2px 2px 1px 0 #e0f0d5 inset;
}

.close-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 25px 0 25px;
  height: 50px;
  border-radius: 15px;
  background: #ffcdcd;
  box-shadow:
    -4px -4px 2px 0 #e7baba inset,
    4px 4px 2px 0 #ffdada inset;
  color: #333;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.18px;
  border: 0;
  cursor: pointer;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.close-button:hover {
  filter: brightness(1.02);
}

.close-button:active {
  transform: translateY(1px);
  box-shadow:
    -2px -2px 1px 0 #e7baba inset,
    2px 2px 1px 0 #ffdada inset;
}

.icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  vertical-align: -0.05em;
  stroke-width: 1.75;
}

@media (max-width: 375px) {
  .close-button,
  .send-button {
    font-size: 16px;
    padding: 0 15px;
  }

  .icon {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 320px) {
  .close-button,
  .send-button {
    font-size: 14px;
  }

  .icon {
    width: 14px;
    height: 14px;
  }
}
</style>
