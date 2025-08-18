<template>
  <div class="share-button-wrapper">
    <button type="button" class="share-button bt-text" @click="isOpen = true">
      บันทึกภาพให้เพื่อนดู<Download :size="20" />
    </button>
  </div>

  <UModal
    v-model:open="isOpen"
    teleport
    :ui="{
      wrapper: 'z-[100]',
      overlay: 'fixed inset-0 bg-black/40 z-[110]',
      content: 'bg-white rounded-2xl max-w-[640px] w-[92vw] p-0 z-[120]',
    }"
  >
    <template #body>
      <div class="p-3 pb-0">
        <SharePoster ref="posterRef" :date="date" :meals="meals" />
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-center p-3">
        <UButton color="neutral" variant="outline" size="lg" @click="download">
          บันทึกรูปภาพ
        </UButton>
        <UButton color="neutral" size="lg" @click="isOpen = false"> ปิดหน้านี้ </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download } from 'lucide-vue-next'
import SharePoster from './SharePoster.vue'

type Grade = 'A' | 'B' | 'C'
type PosterMeal = { signedUrl: string; name: string; grade: Grade }

const { date, meals } = defineProps<{
  date: string
  meals: PosterMeal[]
}>()

const isOpen = ref(false)
const posterRef = ref<InstanceType<typeof SharePoster> | null>(null)

async function download() {
  await posterRef.value?.downloadPng()
}
</script>

<style scoped>
.share-button-wrapper {
  display: flex;
  justify-content: center;
  margin: 36px 0 15px;
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
</style>
