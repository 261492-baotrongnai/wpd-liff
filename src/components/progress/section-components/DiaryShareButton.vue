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
    <!-- fullscreen loading overlay -->
    <teleport to="body">
      <div v-if="isLoading" class="loading-overlay" role="alert" aria-busy="true">
        <div class="loading-box">
          <span class="loading-spinner" aria-hidden="true"></span>
          <div class="loading-text">กำลังส่งรูป <br/>ไปยังห้องแชต</div>
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
      <!-- mount ตัวเรนเดอร์ออฟสกรีนไว้ แต่ไม่ต้องโชว์ -->
      <SharePoster
        ref="posterRef"
        :date="date"
        :meals="meals"
        style="position: fixed; left: -99999px; top: 0"
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
import { ref, watch, nextTick } from 'vue'
import SharePoster, { type SharePosterExpose } from './SharePoster.vue'
import liff from '@line/liff'
import { uploadExportPoster } from '@/services/progress.service'

const props = defineProps<{
  date: string
  meals: { signedUrl: string; name: string; grade: 'A' | 'B' | 'C' }[]
}>()

const isOpen = ref(false)
const posterRef = ref<SharePosterExpose | null>(null) // <<<< ใช้ type ที่ export มา
const previewUrl = ref<string | null>(null)
const isLoading = ref(false)

watch(isOpen, async (open) => {
  if (!open) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
    return
  }
  await nextTick() // ให้ลูก mount ก่อน
  if (!posterRef.value) return
  const blob = await posterRef.value.renderToBlob(1200)
  previewUrl.value = URL.createObjectURL(blob)
})

async function download() {
  if (!previewUrl.value || isLoading.value) return
  try {
    isLoading.value = true
    const a = document.createElement('a')
    a.href = previewUrl.value
    a.download = `meals_${props.date}.png`
    a.click()

    const blob = await (await fetch(previewUrl.value)).blob()
    const file = new File([blob], `meals_${props.date}.png`, { type: 'image/png' })
    const uploadResponse = await uploadExportPoster(file, liff.getContext()?.userId || '')
    console.log('uploadResponse', uploadResponse)
    await liff.sendMessages([
      {
        type: 'text',
        text: 'โปสเตอร์บันทึกอาหาร',
      },
    ])
    console.log('Sent message')
    liff.closeWindow()
  } catch (error) {
    console.error('Error during download/upload:', error)
    isLoading.value = false
  }
}
</script>

<style scoped>
/* คำนวณให้รูปไม่สูงจนชน footer: กำหนดความสูง footer ไว้คร่าว ๆ */
:root {
  --footer-h: 68px;
} /* ปรับตามดีไซน์จริง */

.preview-box {
  display: grid;
  place-items: center;
  /* กว้างสูงสุดเท่าขอบจอ แต่ตัว modal เองจะ auto-fit รูป */
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
  object-fit: contain; /* รักษาสัดส่วน ไม่ครอป ไม่ล้น */
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

  /* พื้นหลังปุ่มตามที่ต้องการ */
  width: 210px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;

  /* อื่น ๆ */
  border: 0;
  color: #2f2f2f;
  font-size: 16px;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
  gap: 5px;
}

/* เอฟเฟกต์เล็กน้อย */
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
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
}
.bt-text:hover {
  filter: brightness(1.02);
}
.bt-text:active {
  transform: translateY(1px);
}
.bt-text:focus-visible {
  outline: 2px solid #19467833;
  outline-offset: 2px;
}
.actions {
  display: flex;
  justify-content: center; /* <<< เปลี่ยนจาก space-between */
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
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
}
.share-button:hover {
  filter: brightness(1.02);
}
.send-button:active {
  transform: translateY(1px);
  box-shadow:
    -2px -2px 1px 0 #cce5bb inset,
    2px 2px 1px 0 #e0f0d5 inset;
}
.send-button:disabled,
.send-button.is-disabled {
  background: #cfcfcf !important;
  color: #7a7a7a !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  box-shadow:
    -2px -2px 1px 0 #c6c6c6 inset,
    2px 2px 1px 0 #e0e0e0 inset !important;
  filter: none !important;
  transform: none !important;
  opacity: 1; /* หรือ 0.8 ถ้าอยากจางลง */
}

/* กัน hover/active */
.send-button:disabled:hover,
.send-button.is-disabled:hover {
  filter: none !important;
}

.send-button:disabled:active,
.send-button.is-disabled:active {
  transform: none !important;
  box-shadow:
    -2px -2px 1px 0 #c6c6c6 inset,
    2px 2px 1px 0 #e0e0e0 inset !important;
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
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
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
  vertical-align: -0.05em; /* จูน baseline ให้ไอคอนนั่งสวยกับข้อความ */
  stroke-width: 1.75; /* ให้เส้นไม่หนาไปตอนย่อ */
}
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7); /* ดำ 70% */
  z-index: 2000; /* ต้องมากกว่า z-[1000] ของ UModal */
  display: grid;
  place-items: center;
  pointer-events: all;
}

/* กล่องเนื้อหาโหลด */
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
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
    radial-gradient(farthest-side,#9AC8EA 94%,#0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%,#9AC8EA);
  -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
  mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13{
  100%{transform: rotate(1turn)}
}
@media (max-width: 375px) {
  /* tablet/มือถือแนวนอน */
  .close-button {
    color: #333;
    font-family: 'Noto Looped Thai UI';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px; /* 144.444% */
    letter-spacing: 0.18px;
    padding: 0 15px 0 15px;
  }
  .send-button {
    color: #333;
    font-family: 'Noto Looped Thai UI';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px; /* 144.444% */
    letter-spacing: 0.18px;
    padding: 0 15px 0 15px;
  }
  .icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    vertical-align: -0.05em; /* จูน baseline ให้ไอคอนนั่งสวยกับข้อความ */
    stroke-width: 1.75; /* ให้เส้นไม่หนาไปตอนย่อ */
  }
}
@media (max-width: 320px) {
  /* tablet/มือถือแนวนอน */
  .close-button {
    color: #333;
    font-family: 'Noto Looped Thai UI';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px; /* 144.444% */
    letter-spacing: 0.18px;
    padding: 0 15px 0 15px;
  }
  .send-button {
    color: #333;
    font-family: 'Noto Looped Thai UI';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px; /* 144.444% */
    letter-spacing: 0.18px;
    padding: 0 15px 0 15px;
  }
  .icon {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    vertical-align: -0.05em; /* จูน baseline ให้ไอคอนนั่งสวยกับข้อความ */
    stroke-width: 1.75; /* ให้เส้นไม่หนาไปตอนย่อ */
  }
}
</style>
