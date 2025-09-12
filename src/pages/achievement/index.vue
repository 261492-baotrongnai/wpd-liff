<template>
  <div class="page-wrapper">
    <!-- ส่วนหัว (พื้นหลังรูปภาพแบบ full-bleed) -->
    <section class="header-section" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="header-inner">
        <div v-if="profilePic" class="profile-pic-container">
          <img :src="profilePic" alt="Profile Picture" class="profile-pic" />
        </div>
        <div v-else class="placeholder">No Image</div>
        <p v-if="username" class="username">{{ username }}</p>
      </div>
    </section>

    <!-- การ์ดสรุปที่ลอยทับ bg -->
    <div class="overlap-card">
      <DuoStatus :points="10" :streaks="43" />
    </div>

    <!-- เนื้อหาอื่น ๆ -->
    <main class="content-section">
      <div class="btn-row">
        <button @click="showUserFrame = true" class="popup-button">
          <PhUserFocus :size="20" class="btn-icon" />เปลี่ยนกรอบรูป
        </button>
        <button @click="showFrameStore = true" class="popup-button">
          <PhCoins :size="20" class="btn-icon" />แลกแต้มสะสม
        </button>
      </div>

      <div v-if="showUserFrame" class="popup-overlay">
        <div class="popup-content">
          <button @click="showUserFrame = false" class="back-button"><PhArrowLeft :size="20" />กลับ</button>
          <UserFrame />
        </div>
      </div>

      <div v-if="showFrameStore" class="popup-overlay">
        <div class="popup-content">
          <button @click="showFrameStore = false" class="back-button"><PhArrowLeft :size="20" />กลับ</button>
          <FrameStore />
        </div>
      </div>

      <ProgressCoin :streaks="75" />
      <Mali :streaks="1" />
      <AchieveShareButton />
    </main>
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '../../utility/liffUtils'
import liff from '@line/liff'
import DuoStatus from '../../components/achievement/DuoStatus.vue'
import UserFrame from '../../components/achievement/UserFrame.vue'
import FrameStore from '../../components/achievement/FrameStore.vue'
import ProgressCoin from '../../components/achievement/ProgressCoin.vue'
import Mali from '../../components/achievement/Mali.vue'
import bgUrl from '@/assets/achievement/bg-blue.png'
import { PhUserFocus, PhCoins, PhArrowLeft } from '@phosphor-icons/vue'

export default {
  name: 'AchievementIndex',
  components: { DuoStatus, UserFrame, FrameStore, ProgressCoin, Mali, PhUserFocus, PhCoins, PhArrowLeft },
  data() {
    return {
      username: '',
      profilePic: '',
      showUserFrame: false,
      showFrameStore: false,
      bgUrl,
    }
  },
  mounted() {
    initializeLiff('VITE_LIFF_ID_ACHIEVEMENT').then(() => {
      liff.getProfile().then((profile) => {
        this.username = profile.displayName
        this.profilePic = profile.pictureUrl || ''
      })
    })
  },
}
</script>

<!-- reset เล็ก ๆ แบบ global เพื่อกัน overflow-x จาก margin เริ่มต้นของ body -->
<style>
html,
body,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}
* {
  box-sizing: border-box;
}
</style>

<style scoped>
/* ---- layout หลัก ---- */
.page-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;

  /* ให้สูงเท่าหน้าจอ และสกอลล์ที่ตัวมันเอง */
  height: 100dvh;                 /* ใช้ height แทน min-height */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
}


/* ---- พื้นหลังส่วนหัว (full-bleed) ---- */
.header-section {
  position: relative;
  /* ทำให้ bg กว้างเท่า viewport เสมอ ไม่พึ่งความกว้างของ content */
  width: 100vw;
  left: 50%;
  margin-left: -50vw;

  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;

  padding-top: 28px; /* เว้นที่สำหรับโปรไฟล์ */
  padding-bottom: 72px; /* เผื่อซ้อนการ์ด */
}

.header-inner {
  /* กรอบคอนเทนต์จริง */
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- การ์ดลอยทับ bg ---- */
.overlap-card {
  width: min(360px, calc(100% - 32px)); /* ย่อหดสองข้างเท่ากัน */
  margin: -55px auto 0; /* ลอยขึ้นไปซ้อน header */
  z-index: 2;
  position: relative;
  border-radius: 14px;
}

/* ---- เนื้อหาที่เหลือ ---- */
.content-section {
  padding-top: 17px;
  /* ย่อ-หดแบบเดียวกับ DuoStatus: เหลือขอบ 16px ต่อข้างเสมอ */
  width: min(360px, calc(100% - 32px));
  margin: 0 auto 24px;
  background: #fff;
}

/* ปุ่ม */
.btn-row {
  display: flex;
  gap: 12px;
  width: 100%;
  /* อยากให้สองปุ่มอยู่บรรทัดเดียวเมื่อพอที่ */
  justify-content: space-between;
}

/* ---- ของเดิม ---- */
.profile-pic-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgb(216, 216, 216);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
}
.username {
  margin-top: 16px;
  color: #194678;
  font-family: 'Noto Looped Thai UI Semibold';
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.2px;
}

.popup-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  flex: 1 1 0; /* ยืดได้ตามที่เหลือ */
  min-width: 0; /* ป้องกัน overflow */
  padding: 10px 10px;

  color: #194678;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.16px;
  border-radius: 15px;
  background: #e2f3ff;
  box-shadow:
    -4px -4px 2px 0 #cbe7fb inset,
    4px 4px 2px 0 #eff8ff inset;
}
/* ซ้อนปุ่มเมื่อจอแคบมาก (กันอัดแน่น/ขึ้นบรรทัดใหม่ไม่สวย) */
@media (max-width: 330px) {
  .btn-row {
    flex-direction: column;
  }
  .popup-button {
    width: 100%;
  }
}

.btn-icon {
  line-height: 0; /* กันช่องว่างแนวตั้งรอบ SVG */
  flex-shrink: 0; /* ไม่ให้ไอคอนถูกบีบ */
}
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
}
.popup-content {
  background: #fff;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  text-align: center;
  max-height: 100dvh; overflow: auto;
}
.back-button {
  display: inline-flex;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  color: #194678;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 7px;
  border-radius: 10px;
  gap: 5px;
  /* button1 */
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  z-index: 1;
}
</style>
