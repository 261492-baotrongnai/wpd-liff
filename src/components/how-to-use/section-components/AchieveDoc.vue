<template>
  <section class="section-root">
    <div class="container">
      <p class="title">ขั้นตอนที่ 1</p>
      <p class="desc">กด “แต้มสะสม” ตรงเมนู</p>
      <img
        src="@/assets/how-to-use/achievement1.png"
        class="step-image"
        alt="ขั้นตอนที่ 1 กด “แต้มสะสม” ตรงเมนู"
      />
    </div>
    <div class="separator"></div>
    <div class="container">
      <p class="title">ขั้นตอนที่ 2</p>
      <p class="desc">ดูจำนวนวันที่บันทึก จำนวนแต้มที่มี หรือแลกแต้มได้</p>
      <img
        src="@/assets/how-to-use/achievement2.png"
        class="step-image"
        alt="ขั้นตอนที่ 2 ดูจำนวนวันที่บันทึก จำนวนแต้มที่มี หรือแลกแต้มได้"
      />
    </div>

    <div class="container">
      <p class="title">1) แต้มสะสม และจำนวนวันบันทึกต่อเนื่อง</p>
      <img
        src="@/assets/how-to-use/achievement3.png"
        class="step-image"
        alt="1) แต้มสะสม และจำนวนวันบันทึกต่อเนื่อง"
      />
    </div>

    <div class="container">
      <p class="title">2) เปลี่ยนกรอบโปรไฟล์</p>
      <img
        src="@/assets/how-to-use/achievement4.png"
        class="step-image"
        alt="2) เปลี่ยนกรอบโปรไฟล์"
      />
    </div>

    <div class="container">
      <p class="title">3) แลกแต้มสะสม</p>
      <img src="@/assets/how-to-use/achievement5.png" class="step-image" alt="3) แลกแต้มสะสม" />
    </div>

    <div class="container">
      <p class="title">4) สถิติบันทึกนานสุด</p>
      <p class="desc">บอกว่าเราบันทึกติดต่อกันได้นานสุดกี่วัน จะมีทั้งหมด 4 เหรียญ คือ</p>
      <img
        src="@/assets/how-to-use/achievement6.png"
        class="step-image"
        alt="4) สถิติบันทึกนานสุด"
      />
    </div>

    <div class="container">
      <p class="title">5) ต้นมะลิ</p>
      <img
        src="@/assets/how-to-use/achievement7.png"
        class="step-image"
        alt="5) ต้นมะลิ"
      />
    </div>

    <div class="container">
      <p class="title">5) บันทึกภาพให้เพื่อนดู</p>
      <img
        src="@/assets/how-to-use/achievement8.png"
        class="step-image"
        alt="5) บันทึกภาพให้เพื่อนดู"
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
