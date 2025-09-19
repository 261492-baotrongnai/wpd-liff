<template>
  <section class="section-root">
    <div class="container">
      <p class="title">ขั้นตอนที่ 1</p>
      <p class="desc">กด “ดูบันทึกย้อนหลัง” ตรงเมนู</p>
      <img
        src="@/assets/how-to-use/diary1.png"
        class="step-image"
        alt="ขั้นตอนที่ 1 กด “ดูบันทึกย้อนหลัง” ตรงเมนู"
      />
    </div>
    <div class="separator"></div>
    <div class="container">
      <p class="title">ขั้นตอนที่ 2</p>
      <p class="desc">มี 2 หน้าที่สามารถกดดูข้อมูลต่างๆได้ คือ</p>
      <div class="list-desc">
        <p class="desc">1) ดูบันทึกย้อนหลัง</p>
        <p class="desc">2) ดูประวัติการบันทึก</p>
      </div>
      <img
        src="@/assets/how-to-use/diary2.png"
        class="step-image"
        alt="ขั้นตอนที่ 2 มี 2 หน้าที่สามารถกดดูข้อมูลต่างๆได้ คือ 1) ดูบันทึกย้อนหลัง 2) ดูประวัติการบันทึก"
      />
    </div>

    <div class="container">
      <p class="title">1) ดูบันทึกย้อนหลัง</p>
      <img
        src="@/assets/how-to-use/diary3.png"
        class="step-image"
        alt="1) ดูบันทึกย้อนหลัง"
      />
    </div>

    <div class="container">
      <p class="title">2) ดูสถิติที่ผ่านมา</p>
      <p class="desc">มีทั้งสถิติรายวัน รายสัปดาห์ และรายเดือน</p>
      <img
        src="@/assets/how-to-use/diary4.png"
        class="step-image"
        alt="2) ดูสถิติที่ผ่านมา"
      />
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'RecordDoc',
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

.list-desc {
  margin-left: 20px;
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
