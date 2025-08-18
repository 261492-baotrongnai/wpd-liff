<template>
  <div class="flex items-center justify-between px-4">
    <div class="progress-nav flex w-full bg-[#ECEFF2] rounded-full overflow-hidden">
      <!-- ปุ่ม 1 -->
      <div
        class="nav-button base-button"
        :class="{ 'is-active': activeSection === 'Diary' }"
        @click="setActiveSection('Diary')"
      >
        <UIcon name="i-lucide-calendar-days" class="w-5 h-5 shrink-0" />
        <span class="tab-label" :class="[activeSection === 'Diary' ? 'nowrap' : 'ellipsis']">
          ดูบันทึกย้อนหลัง
        </span>
      </div>

      <!-- ปุ่ม 2 -->
      <div
        class="nav-button base-button"
        :class="{ 'is-active': activeSection === 'Stats' }"
        @click="setActiveSection('Stats')"
      >
        <UIcon name="i-lucide-chart-column-big" class="w-5 h-5 shrink-0" />
        <span class="tab-label" :class="[activeSection === 'Stats' ? 'nowrap' : 'ellipsis']">
          ดูสถิติที่ผ่านมา
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProgressNav',
  data() {
    return {
      activeSection: 'Diary',
    }
  },
  methods: {
    setActiveSection(section: string) {
      this.activeSection = section
      this.setSection(section)
    },
    setSection(section: string) {
      this.$emit('updateSection', section)
    },
  },
}
</script>
<style scoped>
.base-button {
  flex: 1;
  min-width: 0; /* ป้องกันล้น */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
  border-radius: 12px;
}
/* ถ้าหน้าจอกว้างน้อยกว่า 410px ให้ใช้ flex-wrap และไม่ fix width 1/2 */
@media (max-width: 410px) {
  .base-button {
    width: auto;
    flex: 1 1 0%;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .nowrap {
    white-space: nowrap;
  }
}
/* สี default = เทา (ทั้งตัวอักษรและไอคอน) */
.nav-button {
  color: #898989;
  height: 100%;
  transition:
    background-color 0.3s ease,
    color 0.2s ease;
}

/* ตอน active เปลี่ยนพื้นหลัง + สีตัวอักษร/ไอคอน */
.nav-button.is-active {
  background: #d1e5ff;
  color: #194678;
}

/* เลเบลข้อความ (แทนคลาส .text เดิม) */
.tab-label {
  font-family: 'Noto Looped Thai UI';
  font-size: clamp(16px, 4.5vw, 18px);
  line-height: 1.55; /* หรือใช้ 24/28 ตามต้องการ */
  letter-spacing: 0.18px;
}
.progress-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #eceff2;
  border-radius: 15px;
  height: 60px;
  margin-top: 21px;
  padding: 6px; /* <<< ให้ขอบภายใน */
  gap: 5px; /* <<< ระยะห่างระหว่างปุ่ม */
  width: 100%;
  box-sizing: border-box; /* <<< สำคัญมาก: รวม padding ในความกว้าง */
}

.nav-button {
  height: 100%;
  transition: background-color 0.3s ease;
}

.nav-button.active {
  background-color: #e1e1e1d7; /* Highlight active button */
  color: rgb(64, 64, 64);
}

.text {
  color: #194678;
  text-align: center;

  /* Paragraph2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
</style>
