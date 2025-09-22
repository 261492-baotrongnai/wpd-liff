<!-- HowToUsePage.vue -->
<template>
  <div class="page">
    <!-- Banner -->
    <section class="hero">
      <img class="bg" src="@/assets/how-to-use/bg.png" alt="" aria-hidden="true" />
      <img class="banner-img" src="@/assets/how-to-use/nurse.png" alt="คู่มือใช้งาน หวานพอดี" />
    </section>
    <p class="intro">
      แต่ละฟีเจอร์ใช้ยังไง กดดูวิดีโอได้เลย
      <PhArrowCircleDown :size="24" class="icon-arrow" />
    </p>
    <section class="vdo" v-if="!activeFeature">
      <button
        type="button"
        class="feature-card"
        :class="{ 'is-pressed': pressedMore }"
        @click="openTutorial"
        @pointerdown="pressedMore = true"
        @pointerup="pressedMore = false"
        @pointerleave="pressedMore = false"
        @touchend="pressedMore = false"
        @keydown.space.prevent="
          pressedMore = true;
          openTutorial()
        "
        @keydown.enter.prevent="
          pressedMore = true;
          openTutorial()
        "
      >
        <span class="icon-wrap">
          <PhYoutubeLogo :size="56" class="icon-svg" aria-hidden="true" />
        </span>
        <span class="text-wrap">
          <h2 class="feat-title">วิดีโอสาธิตการใช้</h2>
        </span>
      </button>
    </section>

    <div class="separator-vdo"></div>

    <!-- Intro -->
    <p class="intro">
      แต่ละฟีเจอร์ใช้ยังไง กดอ่านได้เลย
      <PhArrowCircleDown :size="24" class="icon-arrow" />
    </p>

    <!-- Features -->
    <main class="features" v-if="!activeFeature">
      <button
        v-for="(f, i) in features"
        :key="f.key"
        type="button"
        class="feature-card"
        :class="{ 'is-pressed': pressedIndex === i }"
        @click="onFeatureClick(f)"
        @pointerdown="onPressStart(i)"
        @pointerup="onPressEnd"
        @pointerleave="onPressEnd"
        @touchend="onPressEnd"
        @keydown.space.prevent="onKeyPress(i)"
        @keydown.enter.prevent="onKeyPress(i)"
      >
        <span class="icon-wrap">
          <img
            :src="f.icon"
            :alt="f.title"
            :class="[
              'icon',
              { 'icon--record': f.key === 'record', 'icon--history': f.key === 'history' },
            ]"
          />
        </span>
        <span class="text-wrap">
          <h2 class="feat-title">{{ f.title }}</h2>
          <p class="feat-sub">{{ f.subtitle }}</p>
        </span>
      </button>
    </main>

    <!-- แสดงคอมโพเนนต์ย่อย (กรณี record / can-eat / history / points) -->
    <section v-else-if="activeFeature !== 'criteria'" class="feature-detail">
      <RecordFood v-if="activeFeature === 'record'" @back="activeFeature = null" />
      <EatCheck v-else-if="activeFeature === 'can-eat'" @back="activeFeature = null" />
      <HistoryHowToUse v-else-if="activeFeature === 'history'" @back="activeFeature = null" />
      <AchievementHowToUse v-else-if="activeFeature === 'points'" @back="activeFeature = null" />
      <TutorialVDO v-else-if="activeFeature === 'tutorial'" @back="activeFeature = null" />
    </section>

    <div class="separator"></div>

    <!-- หัวข้อเกณฑ์ -->
    <p class="intro">
      เกณฑ์การจัดเกรด กดดูได้เลย <PhArrowCircleDown :size="24" class="icon-arrow" />
    </p>

    <!-- ปุ่มแยก “ดูข้อมูลเพิ่มเติม” (สไตล์เดียวกับปุ่มด้านบน) -->
    <section class="more-info" v-if="!activeFeature">
      <button
        type="button"
        class="feature-card"
        :class="{ 'is-pressed': pressedMore }"
        @click="openCriteria"
        @pointerdown="pressedMore = true"
        @pointerup="pressedMore = false"
        @pointerleave="pressedMore = false"
        @touchend="pressedMore = false"
        @keydown.space.prevent="
          pressedMore = true;
          openCriteria()
        "
        @keydown.enter.prevent="
          pressedMore = true;
          openCriteria()
        "
      >
        <span class="icon-wrap">
          <PhInfo :size="56" class="icon-svg" aria-hidden="true" />
        </span>
        <span class="text-wrap">
          <h2 class="feat-title">ดูรายละเอียดเกณฑ์</h2>
        </span>
      </button>
    </section>

    <!-- ✅ OVERLAY เต็มหน้า สำหรับ FYI -->
    <transition name="fade">
      <div v-if="activeFeature === 'criteria'" class="overlay" role="dialog" aria-modal="true">
        <FYIInfo @back="activeFeature = null" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PhArrowCircleDown, PhInfo, PhYoutubeLogo } from '@phosphor-icons/vue'
import iconRecord from '@/assets/how-to-use/record.png'
import iconEat from '@/assets/how-to-use/eat.png'
import iconDiary from '@/assets/how-to-use/diary.png'
import iconAchievement from '@/assets/how-to-use/achievement.png'
import RecordFood from '@/components/how-to-use/Record.vue'
import EatCheck from '@/components/how-to-use/EatCheck.vue'
import HistoryHowToUse from '@/components/how-to-use/History.vue'
import AchievementHowToUse from '@/components/how-to-use/Achievement.vue'
import FYIInfo from '@/components/how-to-use/FYI.vue' // ✅ ใช้งานจริง
import TutorialVDO from '@/components/how-to-use/TutorialVDO.vue'
type FeatureKey = 'record' | 'can-eat' | 'history' | 'points' | 'criteria' | 'tutorial'
interface Feature {
  key: FeatureKey
  title: string
  subtitle: string
  icon: string
}

export default defineComponent({
  name: 'HowToUsePage',
  components: {
    PhArrowCircleDown,
    PhInfo,
    RecordFood,
    PhYoutubeLogo,
    EatCheck,
    HistoryHowToUse,
    AchievementHowToUse,
    FYIInfo,
    TutorialVDO,
  },
  data() {
    return {
      features: [
        {
          key: 'record',
          title: 'บันทึกอาหารที่ทาน',
          subtitle: 'เพิ่มเมนูที่คุณกินในแต่ละมื้อ',
          icon: iconRecord,
        },
        {
          key: 'can-eat',
          title: 'กินได้ก่อ',
          subtitle: 'อยากรู้ว่าเมนูนี้ทานดีไหม',
          icon: iconEat,
        },
        {
          key: 'history',
          title: 'ดูบันทึกย้อนหลัง',
          subtitle: 'เปิดดูเมนูที่เคยบันทึกไว้',
          icon: iconDiary,
        },
        {
          key: 'points',
          title: 'แต้มสะสม',
          subtitle: 'สะสมแต้มจากการบันทึก',
          icon: iconAchievement,
        },
      ] as Feature[],
      pressedIndex: null as number | null,
      activeFeature: null as FeatureKey | null,
      pressedMore: false as boolean,
      activeTutorial: false as boolean,
    }
  },
  methods: {
    onPressStart(i: number) {
      this.pressedIndex = i
    },
    onPressEnd() {
      this.pressedIndex = null
    },
    onKeyPress(i: number) {
      this.pressedIndex = i
      setTimeout(() => (this.pressedIndex = null), 120)
      this.onFeatureClick(this.features[i])
    },
    onFeatureClick(f: Feature) {
      this.activeFeature = f.key
    },
    openCriteria() {
      this.activeFeature = 'criteria'
      this.pressedMore = false
    },
    openTutorial() {
      this.activeFeature = 'tutorial'
      this.pressedMore = false
    },
  },
})
</script>

<style scoped>
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 28px;
  background: #f8fcff;
  overflow-x: hidden;
  --content-w: min(90vw, 320px);
}

/* ===== HERO ===== */
.hero {
  position: relative;
  display: grid;
  place-items: start center;
  overflow: visible;
  background: #f8fcff;
  padding-bottom: 20px;
}
.bg,
.banner-img {
  grid-area: 1 / 1;
}
.bg {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
}
.banner-img {
  z-index: 1;
  width: min(85vw, 425px);
  height: auto;
  margin-inline: auto;
  transform: translateY(18px) translateX(10px);
}

/* ===== INTRO ===== */
.intro {
  color: #2863a5;
  text-align: center;
  display: inline-flex;
  gap: 5px;
  margin-top: 5px;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.18px;
}
.icon-arrow {
  margin-top: 4px;
}
/* ===== FEATURES ===== */
.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: var(--content-w);
  margin: 18px 0 24px 0;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
}
.features-separator {
  width: var(--content-w);
  margin: 12px auto 0;
  display: block;
}

/* ปุ่มการ์ด (ใช้ซ้ำกับปุ่มดูรายละเอียดเกณฑ์) */
.feature-card {
  --icon-col: 70px;
  display: grid;
  grid-template-columns: var(--icon-col) 1fr;
  column-gap: 12px;
  align-items: center;
  justify-content: start;
  justify-items: start;
  width: 100%;
  padding: 15px 25px;

  border: 0;
  border-radius: 25px;
  background: #dcebff;
  box-shadow:
    -6px -6px 2px 0 #d1e6ff inset,
    6px 6px 2px 0 #deedff inset;

  cursor: pointer;
  appearance: none;
  touch-action: manipulation;
  user-select: none;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    filter 0.12s ease;
}
.feature-card.is-pressed {
  transform: translateY(2px) scale(0.995);
  box-shadow:
    inset 3px 3px 6px rgba(169, 196, 235, 0.9),
    inset -3px -3px 6px rgba(242, 249, 255, 0.95);
  filter: brightness(0.98);
}
.feature-card:focus-visible {
  outline: 3px solid #a7c9ff;
  outline-offset: 2px;
  box-shadow:
    inset 3px 3px 6px rgba(169, 196, 235, 0.9),
    inset -3px -3px 6px rgba(242, 249, 255, 0.95),
    0 0 0 4px rgba(167, 201, 255, 0.35);
}

/* ไอคอน + ข้อความ */
.icon-wrap {
  display: grid;
  place-items: center;
}
.icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
  display: block;
}
.icon--record,
.icon--history {
  margin-left: 6px;
}
.icon-svg {
  width: 56px;
  height: 56px;
  color: #1e5898;
  display: block;
}

.text-wrap {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
}
.feat-title {
  margin: 0 0 2px;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 22px;
  font-weight: 500;
  line-height: 1.4;
}
.feat-sub {
  margin: 0;
  color: #4a79ac;
  font-family: 'Noto Looped Thai UI';
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.14px;
}

/* เส้นคั่น */
.separator {
  width: calc(100% - 60px);
  height: 2px;
  background: #e6e4e4;
  border-radius: 10px;
  margin-bottom: 19px;
}

.separator-vdo {
  width: calc(100% - 60px);
  height: 2px;
  background: #e6e4e4;
  border-radius: 10px;
  margin-bottom: 19px;
  margin-top: 24px;
}

/* ปุ่มดูรายละเอียดเกณฑ์ (คงสไตล์การ์ด) */
.more-info,
.vdo {
  width: var(--content-w);
  margin: 18px 0 0;
  display: flex;
  justify-content: center;
}

/* หน้ารายละเอียดฟีเจอร์ทั่วไป */
.feature-detail {
  width: 100%;
  display: grid;
  place-items: center;
}

/* =========================
   ✅ OVERLAY เต็มหน้า FYI
   ========================= */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 999; /* อยู่บนสุด */
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #eaeef5;
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
.overlay-title {
  margin: 0;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-weight: 700;
}
.overlay-spacer {
  width: 48px;
  height: 1px;
} /* เพื่อบาลานซ์ layout ฝั่งขวา */

.overlay-body {
  flex: 1 1 auto;
  overflow-y: auto; /* เลื่อนใน overlay */
  -webkit-overflow-scrolling: touch;
  padding: 12px 16px 24px;
}

/* เผื่อกรณี CriteriaDoc มี .page แบบ overlay ของตัวเอง ให้คืนค่าปกติ */
.overlay :deep(.page) {
  position: static !important;
  inset: auto !important;
  height: auto !important;
  overflow: visible !important;
}

/* ปุ่มกลับในหน้าลูกทั่วไป */
.back-btn {
  margin-top: 10px;
  background: #e7f0ff;
  color: #194678;
  border: 0;
  padding: 8px 12px;
  border-radius: 10px;
  font-family: 'Noto Looped Thai UI';
  cursor: pointer;
}

@media screen and (max-width: 330px) {
  .feat-title {
    font-size: 20px;
  }
}
@media screen and (min-width: 426px) {
  .hero {
    position: relative;
    display: grid;
    place-items: center;
    overflow: visible;
    background: #f8fcff;
    padding-bottom: 20px;
  }
  .banner-img {
    z-index: 1;
    width: min(85vw, 425px);
    height: auto;
    margin-inline: auto;
    transform: translateX(10px);
  }
}
</style>
