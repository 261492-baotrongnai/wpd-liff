<template>
  <div class="overlay" role="dialog" aria-modal="true">
    <header class="overlay-header">
      <button class="overlay-back" @click="$emit('back')"><PhArrowLeft :size="22" /> กลับ</button>
      <img class="bg" src="@/assets/how-to-use/bg.png" alt="" aria-hidden="true" />

      <p class="overlay-title">วิดีโอสาธิตการใช้</p>
    </header>

    <!-- เนื้อหาสกรอลล์ได้ -->
    <div class="overlay-body">
        <h2 class="criteria-intro">สามารถเลื่อนจอดูฟีเจอร์อื่นๆได้นะคะ</h2>
        <p class="desc-sub">* หากวิดีโอดูไม่ได้ ลองปิด แล้วเปิดใหม่ดูนะคะ *</p>
      <div class="criteria-box">
        <h2 class="criteria-title">วิดีโอสาธิต "บันทึกอาหารที่ทาน"</h2>
        <div class="video-frame">
          <iframe
            class="player"
            src="https://www.youtube.com/embed/CTsm-t2D17o"
            title="วิดีโอสาธิตการใช้"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <div class="separator"></div>

        <h2 class="criteria-title">วิดีโอสาธิต "กินได้ก่อ"</h2>
        <div class="video-frame">
          <iframe
            class="player"
            src="https://www.youtube.com/embed/zhFuvVKQuwA"
            title="วิดีโอสาธิตการใช้"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <div class="separator"></div>
        <h2 class="criteria-title">วิดีโอสาธิต "ดูบันทึกย้อนหลัง"</h2>
        <div class="video-frame">
          <iframe
            class="player"
            src="https://www.youtube.com/embed/pQKJFqqpYIM"
            title="วิดีโอสาธิตการใช้"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <div class="separator"></div>
        <h2 class="criteria-title">วิดีโอสาธิต "แต้มสะสม"</h2>
        <div class="video-frame">
          <iframe
            class="player"
            src="https://www.youtube.com/embed/k6topDOD6MY"
            title="วิดีโอสาธิตการใช้"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PhArrowLeft } from '@phosphor-icons/vue'

export default defineComponent({
  name: 'TutorialVDO',
  components: { PhArrowLeft },
  emits: ['back'],
})
</script>

<style scoped>
/* ใน <style scoped> ของไฟล์เดียวกัน */
.intro strong,
.intro b {
  font-weight: 800; /* ลอง 700/800/900 ตามฟอนต์ที่มี */
}
.intro {
  margin: 0 0 12px;
  color: #2b4f7d;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  line-height: 1.65;
}
.criteria-list strong {
  font-weight: 700;
}
.criteria-list {
  margin: 10px 0 12px 18px;
  padding: 0;
  color: #2b4f7d;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  line-height: 1.65;
}
.criteria-image {
  width: 100%;
  max-width: 400px;
  display: block;
  margin: 20px auto 10px;
}
.para {
  text-indent: 1.5em;
}
/* ===== Overlay เต็มจอ ===== */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9990;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

/* Header ติดบน */
.overlay-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(70px + env(safe-area-inset-top, 0px)) 12px 45px;
  min-height: 56px;
  background: #f9fbff;
}

.overlay-back {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(34, 78, 126, 0.12);
}
.overlay-back:active {
  transform: translateY(1px);
}

.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  pointer-events: none;
  background: #fff;
}

.overlay-title {
  margin: 0;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 23px;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  background: #fff;
  padding: 15px 20px;
  border-radius: 20px;
}
.overlay-spacer {
  width: 48px;
  height: 1px;
}

/* พื้นที่สกรอลล์ */
.overlay-body {
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 0 24px;
}
.criteria-intro{
  margin: 0 0 5px;
  color: #2b4f7d;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  line-height: 1.65;
  text-align: center;
}
.desc-sub {
  margin: 0 0 20px;
  color: #5b6b7a;
  font-family: 'Noto Looped Thai UI';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
}
/* กล่องเนื้อหา */
.criteria-box {
  width: min(92vw, 560px);
  margin: 0 auto;
}

/* ตัวอักษร */
.criteria-title {
  margin: 0 0 6px;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 19px;
  font-weight: 700;
  text-align: left;
}
.criteria-note {
  margin: 25px 0;
  color: #2b4f7d;
  font-family: 'Noto Looped Thai UI';
  font-size: 15px;
  line-height: 1.65;
}
.criteria-list {
  margin: 10px 0 12px 18px;
  padding: 0;
  color: #2b4f7d;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  line-height: 1.65;
}
.criteria-list li {
  margin: 4px 0;
}
/* กรอบวิดีโอให้ responsive 16:9 และโค้งมน */
.video-frame {
  aspect-ratio: 9 / 16;
  width: 85%;
  max-width: 960px; /* จะขยายเต็มกว้างคอลัมน์ได้ */
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
}
.player {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}
.separator {
  width: calc(100% - 60px);
  height: 2px;
  background: #e6e4e4;
  border-radius: 10px;
  margin: 19px;
}
/* Responsive เล็กน้อย */
@media (min-width: 426px) {
  .overlay-title {
    font-size: 23px;
  }
}
@media (max-width: 330px) {
  .criteria-box {
    width: 94vw;
  }
}
</style>
