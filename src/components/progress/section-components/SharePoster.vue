<template>
  <!-- ขนาดโปสเตอร์แนะนำ: อัตราส่วน 3:4 -->
  <div ref="root" class="poster">
    <div class="poster-header">
      <div class="app-badge">หวานพอดี</div>
      <div class="date">{{ displayDate }}</div>
      <div class="title">ภาพรวมมื้ออาหาร</div>
    </div>

    <div class="meals">
      <div v-for="(m, i) in meals" :key="i" class="meal-card">
        <div class="grade" :class="'grade-' + m.grade">{{ m.grade }}</div>
        <!-- ใช้ <img> เพื่อให้ html2canvas ดึงรูปได้ และใส่ crossorigin -->
        <img :src="m.signedUrl" crossorigin="anonymous" class="thumb" />
        <div class="name">{{ m.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import bgUrl from '@/assets/progress/stat/poster-bg.png'
const cssBg = computed(() => `url(${bgUrl})`)
type Grade = 'A' | 'B' | 'C'
type PosterMeal = { signedUrl: string; name: string; grade: Grade }

const props = defineProps<{ date: string; meals: PosterMeal[] }>()
const root = ref<HTMLElement | null>(null)

const displayDate = computed(() => {
  const d = new Date(props.date)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
})

function waitForImages(el: HTMLElement) {
  const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[]
  return Promise.all(
    imgs.map(img =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }),
    ),
  )
}

async function downloadPng() {
  if (!root.value) return
  await nextTick()
  await waitForImages(root.value)

  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(root.value, {
    useCORS: true,
    backgroundColor: null,
    scale: Math.min(3, window.devicePixelRatio || 2),
  })
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `meals_${props.date}.png` 
  link.click()
}
defineExpose({ downloadPng })
</script>


<style scoped>
/* ขนาดรวมโปสเตอร์ */
.poster{
width: 600px;
  aspect-ratio: 3 / 4;
    width: 100%;
  max-width: 600px;      /* กันแตกบนจอใหญ่ */
  border-radius: 16px;
  padding: 20px;
  box-sizing: border-box;

  /* ใช้ template BG จากไฟล์ — ผูกด้วย v-bind() */
  background-image: v-bind(cssBg);
  background-size: cover;
  background-position: center;
  background-color: #f7fbff;

  position: relative;
  box-shadow: 0 12px 24px rgba(0,0,0,.08);
}

.poster-header{
  text-align: center;
  margin-bottom: 8px;
}
.app-badge{
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #E6F3FF;
  color: #194678;
  font-weight: 600;
  font-size: 14px;
}
.date{
  margin-top: 6px;
  color: #194678;
  font-size: 16px;
}
.title{
  color: #194678;
  font-size: 22px;
  font-weight: 700;
  margin-top: 2px;
}

/* การ์ดมื้ออาหาร */
.meals{
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.meal-card{
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(25,70,120,.06);
}
.thumb{
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
}
.name{
  margin-top: 6px;
  color: #194678;
  font-size: 14px;
  line-height: 1.25;
  word-break: break-word;
}
.grade{
  position: absolute;
  transform: translateY(-10px) translateX(6px);
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #194678;
  background: #f1f7ff;
}
.grade-A{ background: #d2f3b5; }
.grade-B{ background: #fff59a; }
.grade-C{ background: #ffa8a3; }
</style>
