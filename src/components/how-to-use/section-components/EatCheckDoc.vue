<template>
  <section class="section-root">
    <div class="container">
      <p class="title">ขั้นตอนที่ 1</p>
      <p class="desc">กด “กินได้ก่อ” ตรงเมนู</p>
      <img
        src="@/assets/how-to-use/eat1.png"
        class="step-image"
        alt="ขั้นตอนที่ 1 กด “กินได้ก่อ” ตรงเมนู"
      />
    </div>
    <div class="separator"></div>
    <div class="container">
      <p class="title">ขั้นตอนที่ 2</p>
      <p class="desc">
        ส่งรูปอาหารให้มะลิ ด้วยการถ่ายรูป <br />
        หรือส่งรูปจากอัลบั้ม
      </p>
      <img
        src="@/assets/how-to-use/eat2.png"
        class="step-image"
        alt="ขั้นตอนที่ 2 ส่งรูปอาหารให้มะลิ ด้วยการถ่ายรูป หรือส่งรูปจากอัลบั้ม"
      />
    </div>
    <div class="separator"></div>
    <div class="container">
      <p class="title">ขั้นตอนที่ 3</p>
      <p class="desc">
        เลือกชื่ออาหารที่ถูกต้อง 1 รายการ หรือพิมพ์ชื่ออาหารเองได้
      </p>
      <img
        src="@/assets/how-to-use/eat3.png"
        class="step-image"
        alt="ขั้นตอนที่ 3 เลือกชื่ออาหารที่ถูกต้อง 1 รายการ หรือพิมพ์ชื่ออาหารเองได้"
      />
    </div>
    <div class="separator"></div>
    <div class="container">
      <p class="title">ขั้นตอนที่ 4</p>
      <p class="desc">ลองดูว่าเมนูนี้ทานดีไหม จากเกรดที่ได้ และสังเกตการเปลี่ยนแปลงของเกรดเฉลี่ย</p>
      <img
        src="@/assets/how-to-use/eat4.png"
        class="step-image"
        alt="ขั้นตอนที่ 4 ลองดูว่าเมนูนี้ทานดีไหม จากเกรดที่ได้ และสังเกตการเปลี่ยนแปลงของเกรดเฉลี่ย"
      />
    </div>
    <div class="separator"></div>
    <div class="container">
      <p class="title">ขั้นตอนที่ 5</p>
      <p class="desc">กดเลือกว่าต้องการบันทึกอาหารที่ส่งไปถามหรือไม่</p>
      <img
        src="@/assets/how-to-use/eat5.png"
        class="step-image"
        alt="ขั้นตอนที่ 5 กดเลือกว่าต้องการบันทึกอาหารที่ส่งไปถามหรือไม่"
      />
    </div>
    <div class="separator"></div>
    <p class="suggestion-title"><PhLightbulbFilament :size="20" />ข้อแนะนำ</p>
    <p class="suggestion-desc">
      ถ้าอยากเริ่มบันทึกใหม่หรือใช้ฟีเจอร์อื่น <br />กรุณากด”ยกเลิกการบันทึก”ก่อนนะคะ
    </p>
    <img
      src="@/assets/how-to-use/record6.png"
      class="step-image"
      alt="ข้อแนะนำ ถ้าอยากเริ่มบันทึกใหม่หรือใช้ฟีเจอร์อื่น กรุณากด”ยกเลิกการบันทึก”ก่อนนะคะ">
  </section>
</template>

<script lang="ts">
import { PhLightbulbFilament } from '@phosphor-icons/vue'
export default {
  name: 'RecordDoc',
  components: { PhLightbulbFilament },
}
</script>

<style scoped>
.section-root {
  padding: 0; /* เอา padding ซ้าย-ขวาออก */
  text-align: left; /* บังคับข้อความชิดซ้าย */
}

.container {
  padding: 25px 0; /* เพิ่ม padding ซ้าย-ขวา */
}

.title {
  display: block;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 900;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  text-align: left;
}

.desc {
  display: block;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  margin-top: 4px;
  text-align: left;
}

.step-image {
  width: 90%;
  height: auto;
  margin: 15px auto 0 auto; /* auto ซ้ายขวา = center */
  border-radius: 12px;
  display: block; /* สำคัญ: เปลี่ยน img จาก inline เป็น block */
}

.separator {
  width: 100%;
  height: 2px; /* ความหนา (weight) */
  background-color: #e6e4e4; /* สีเส้น */
  margin: 0; /* ระยะห่างบน-ล่าง */
  border-radius: 10px; /* มุมโค้งนิดๆ */
}

.suggestion-title {
  margin-top: 25px;
  display: inline-flex; /* ไอคอน + ข้อความ อยู่บรรทัดเดียวกัน */
  align-items: center; /* จัดกึ่งกลางแนวตั้งให้เสมอ */
  gap: 8px; /* ระยะห่าง */
  padding: 4px 12px;
  background: #87b6f1;
  color: #fff;
  border-radius: 20px;
  font: 700 18px/26px 'Noto Looped Thai UI';
  letter-spacing: 0.18px;
}

.suggestion-desc {
  display: block;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  margin-top: 10px;

  text-align: center;
}
</style>
