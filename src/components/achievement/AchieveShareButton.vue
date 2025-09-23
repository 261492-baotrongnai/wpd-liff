<template>
  <div class="share-button-wrapper">
    <button type="button" class="share-button bt-text" @click="openModal">
      บันทึกภาพให้เพื่อนดู <Download :size="20" />
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
    <!-- overlay โหลดเฉพาะตอน “ส่งรูป” -->
    <teleport to="body">
      <div v-if="isLoading" class="loading-overlay" role="alert" aria-busy="true">
        <div class="loading-box">
          <span class="loading-spinner" aria-hidden="true"></span>
          <div class="loading-text">กำลังส่งรูป <br />ไปยังห้องแชต</div>
        </div>
      </div>
    </teleport>

    <template #body>
      <div class="preview-box">
        <img v-if="previewUrl" :src="previewUrl" class="preview-img" alt="Poster preview" />
        <div v-else class="preview-skeleton">
          กำลังสร้างรูปภาพ <br />
          กรุณารอสักครู่นะคะ
        </div>
      </div>

      <!-- เรนเดอร์ AchievePoster แบบซ่อนไว้เพื่อเรียก renderToBlob -->
      <AchievePoster
        ref="posterRef"
        :profile-name="props.profileName"
        :profile-image="props.profileImage"
        :frame-image="props.frameImage"
        :points="props.points ?? 0"
        :streaks="props.streaks"
        :coin-stages="props.coinStages ?? []"
        :mali-days="props.maliDays"
        :mali-target="props.maliTarget"
        :mali-image="props.maliImage || ''"
        style="position: fixed; left: -99999px; top: 0; pointer-events: none"
      />
    </template>

    <template #footer>
      <div class="actions">
        <button
          type="button"
          class="send-button"
          :disabled="!previewUrl"
          :class="{ 'is-disabled': !previewUrl }"
          @click="download"
        >
          ส่งรูปทางแชต <Forward class="icon" aria-hidden="true" />
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
import { ref, nextTick, watch, onBeforeUnmount } from 'vue'
import AchievePoster, { type AchievePosterExpose } from './AchievePoster.vue'
import liff from '@line/liff'
import { uploadExportPoster } from '@/services/progress.service'

type CoinStage = { threshold: number; imgActive: string; imgInactive: string }

const props = defineProps<{
  profileName?: string
  profileImage?: string
  frameImage?: string
  points?: number
  /* สมุดเหรียญ */
  streaks?: number | { current: number; target?: number }
  coinStages?: CoinStage[]
  /* มะลิ */
  maliDays?: number
  maliTarget?: number
  maliImage?: string
  /* อื่น ๆ */
  date?: string
}>()

const isOpen = ref(false)
const posterRef = ref<AchievePosterExpose | null>(null)
const previewUrl = ref<string | null>(null)
const isLoading = ref(false)

/** เปิดโมดัลทันที แล้วค่อยเรนเดอร์รูปแบบ async */
async function openModal() {
  isOpen.value = true
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null

  await nextTick()
  try {
    if (!posterRef.value) return
    const blob = await posterRef.value.renderToBlob(1200)
    previewUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    console.error('render poster error:', e)
  }
}

/** ปิดโมดัลแล้วเคลียร์ URL */
watch(isOpen, (open) => {
  if (!open && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
})
onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

async function download() {
  if (!previewUrl.value || isLoading.value) return
  isLoading.value = true
  const context = liff.getContext()
  const isLiff = !!(context && context.type !== 'external')
  try {
    if (isLiff) {
      const blob = await (await fetch(previewUrl.value)).blob()
      await saveToState(blob)
    } else {
      const a = document.createElement('a')
      a.href = previewUrl.value
      a.download = `meals_${props.date ?? ''}.png`
      a.click()
    }
  } finally {
    isLoading.value = false
  }
}

async function saveToState(blob: Blob) {
  const file = new File([blob], `meals_${props.date ?? ''}.png`, { type: 'image/png' })
  await uploadExportPoster(file, liff.getContext()?.userId || '')
  await liff.sendMessages([{ type: 'text', text: 'โปสเตอร์บันทึกอาหาร' }])
  liff.closeWindow()
}
</script>

<style scoped>
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
  margin: 25px 0 15px 0;
}
.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 50px;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;
  border: 0;
  color: #2f2f2f;
  font-size: 16px;
  gap: 5px;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
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
.bt-text {
  color: #333;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
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
.send-button,
.close-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 50px;
  border-radius: 15px;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.18px;
}
.send-button {
  padding: 0 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;
  color: #333;
}
.send-button.is-disabled,
.send-button:disabled {
  background: #cfcfcf !important;
  color: #7a7a7a !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  box-shadow:
    -2px -2px 1px 0 #c6c6c6 inset,
    2px 2px 1px 0 #e0e0e0 inset !important;
}
.close-button {
  padding: 0 25px;
  background: #ffcdcd;
  box-shadow:
    -4px -4px 2px 0 #e7baba inset,
    4px 4px 2px 0 #ffdada inset;
  color: #333;
}

.icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  vertical-align: -0.05em;
  stroke-width: 1.75;
}

/* โหลดตอนส่งแชตเท่านั้น */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: grid;
  place-items: center;
  pointer-events: all;
}
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-align: center;
}
.loading-text {
  font-size: 18px;
  font-weight: 500;
}
.loading-spinner {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, #9ac8ea 94%, #0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, #9ac8ea);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
