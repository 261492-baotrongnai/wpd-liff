<template>
  <div class="overlay" role="dialog" aria-modal="true">
    <header class="overlay-header">
      <button class="overlay-back" @click="$emit('back')"><PhArrowLeft :size="22" /> กลับ</button>
      <img class="bg" src="@/assets/how-to-use/bg.png" alt="" aria-hidden="true" />

      <h1 class="overlay-title">
        ข้อมูลการจัดเกรดอาหาร <br />
        กลุ่มเสี่ยงโรคเบาหวานชนิดที่ 2
      </h1>
    </header>

    <!-- เนื้อหาสกรอลล์ได้ -->
    <div class="overlay-body">
      <div class="criteria-box">
        <h2 class="criteria-title">เกณฑ์การจัดเกรด</h2>
        <p class="intro para">
          ผู้ที่เสี่ยงเบาหวานควรเลือกกินตาม <strong>“กลุ่มค่ามวลน้ำตาล”</strong> ของอาหาร
          ซึ่งค่านี้คำนวณจาก <strong>ค่า GI</strong>
          <strong> ร่วมกับปริมาณที่กินในมื้อนั้น</strong>
        </p>
        <img class="criteria-image" src="@/assets/how-to-use/criteria.png" alt="เกณฑ์การจัดเกรด" />
        <ul >
          <li class="criteria-list"><strong>เกรด A</strong> – เลือกทานได้บ่อย</li>
          <li class="criteria-list"><strong>เกรด B</strong> – ทานได้พอประมาณ ควรดูปริมาณที่เหมาะสม</li>
          <li class="criteria-list"><strong>เกรด C</strong> – ควรงด หรือลดความถี่หรือปริมาณ</li>
        </ul>
        <p class="criteria-note">
          * เกรดเป็นตัวช่วยตัดสินใจอย่างรวดเร็ว โปรดพิจารณาร่วมกับบริบทสุขภาพของแต่ละคน
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PhArrowLeft } from '@phosphor-icons/vue'

export default defineComponent({
  name: 'FYIInfo',
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
.criteria-list strong{
  font-weight: 700;
}
.criteria-list{
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
.para{
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
  padding: calc(70px + env(safe-area-inset-top, 0px)) 12px 25px;
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
  font-size: 19px;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  background: #fff;
  padding: 5px 20px;
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
  text-align: center;
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

/* Responsive เล็กน้อย */
@media (min-width: 426px) {
  .overlay-title {
    font-size: 20px;
  }
}
@media (max-width: 330px) {
  .criteria-box {
    width: 94vw;
  }
}
</style>
