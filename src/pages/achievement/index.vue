<template>
  <div class="page-wrapper">
    <!-- ส่วนหัว (พื้นหลังรูปภาพแบบ full-bleed) -->
    <section class="header-section" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="header-inner">
        <div class="profile-pic-container" :style="ringStyle">
          <img v-if="profilePic" :src="profilePic" alt="Profile Picture" class="profile-pic" />
          <div v-else class="placeholder">No Image</div>
          <img
            v-if="currentFrame?.imageName"
            :src="getFrameSrc(currentFrame.imageName)"
            alt="Profile frame"
            class="profile-frame"
          />
        </div>

        <p v-if="username" class="username">{{ username }}</p>
      </div>
    </section>

    <!-- การ์ดสรุปที่ลอยทับ bg -->
    <div class="overlap-card">
      <DuoStatus :points="pageInfo?.totalPoints ?? 0" :streaks="pageInfo?.streakDays ?? 0" />
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
          <button @click="showUserFrame = false" class="back-button">
            <PhArrowLeft :size="20" />กลับ
          </button>
          <UserFrame @update-info="updateInfo" />
        </div>
      </div>

      <div v-if="showFrameStore" class="popup-overlay">
        <div class="popup-content">
          <button @click="showFrameStore = false" class="back-button">
            <PhArrowLeft :size="20" />กลับ
          </button>
          <FrameStore @update-info="updateInfo" />
        </div>
      </div>

      <ProgressCoin
        :coinAchieves="
          Array.isArray(pageInfo?.streakMedalAchievement) ? pageInfo.streakMedalAchievement : []
        "
        :streaks="Number(normalizedCoin.current)"
      />

      <Mali :totalDays="normalizedMali.current" />

      <!-- Share Button + โปสเตอร์ (ส่งรูป coin + มะลิ + target ที่ถูกต้อง) -->
      <AchieveShareButton
        :profile-name="username"
        :profile-image="profilePic"
        :frame-image="currentFrame?.imageName ? getFrameSrc(currentFrame.imageName) : ''"
        :points="pageInfo?.totalPoints ?? 0"
        :streaks="normalizedCoin"
        :coin-stages="coinStagesForPoster"
        :mali-days="normalizedMali.current"
        :mali-target="normalizedMali.target"
        :mali-image="maliImageForPoster"
      />
    </main>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import DuoStatus from '../../components/achievement/DuoStatus.vue'
import UserFrame from '../../components/achievement/UserFrame.vue'
import FrameStore from '../../components/achievement/FrameStore.vue'
import ProgressCoin from '../../components/achievement/ProgressCoin.vue'
import Mali from '../../components/achievement/Mali.vue'
import AchieveShareButton from '../../components/achievement/AchieveShareButton.vue'
import bgUrl from '@/assets/achievement/bg-blue.png'
import { PhUserFocus, PhCoins, PhArrowLeft } from '@phosphor-icons/vue'
import { getAchievementsPageInfo } from '@/services/achievement.service'
import type { AchievementPageInfo } from '@/types/achievement.types'
import { initializeLiff } from '@/services/liff.service'
import type { StoreItem } from '@/types/achievement.types'
import type { CSSProperties } from 'vue'

/* รูปเหรียญ coin (on/off) */
import b10On from '@/assets/achievement/badges/10-on.png'
import b30On from '@/assets/achievement/badges/30-on.png'
import b60On from '@/assets/achievement/badges/60-on.png'
import b90On from '@/assets/achievement/badges/90-on.png'
import b10Off from '@/assets/achievement/badges/10-off.png'
import b30Off from '@/assets/achievement/badges/30-off.png'
import b60Off from '@/assets/achievement/badges/60-off.png'
import b90Off from '@/assets/achievement/badges/90-off.png'

/* รูปมะลิ */
import m0 from '@/assets/mali-level/mali level 0.png'
import m1 from '@/assets/mali-level/mali level 1.png'
import m2 from '@/assets/mali-level/mali level 2.png'
import m3 from '@/assets/mali-level/mali level 3.png'
import m4 from '@/assets/mali-level/mali level 4.png'
import m5 from '@/assets/mali-level/mali level 5.png'

/* helper types (ไม่ใช้ any) */
type CoinProgress = number | { current: number; target?: number }
type CoinStage = { threshold: number; imgActive: string; imgInactive: string }

function isCoinObj(v: unknown): v is { current: number; target?: number } {
  return (
    typeof v === 'object' &&
    v !== null &&
    'current' in (v as Record<string, unknown>) &&
    typeof (v as Record<string, unknown>).current === 'number'
  )
}

const frameMap = Object.fromEntries(
  Object.entries(
    import.meta.glob('@/assets/frame/*', { eager: true, import: 'default', query: '?url' }),
  ).map(([path, url]) => [path.split('/').pop()!, url as string]),
)

export default {
  name: 'AchievementIndex',
  components: {
    DuoStatus,
    UserFrame,
    FrameStore,
    ProgressCoin,
    Mali,
    AchieveShareButton,
    PhUserFocus,
    PhCoins,
    PhArrowLeft,
  },
  data(): {
    username: string
    profilePic: string
    showUserFrame: boolean
    showFrameStore: boolean
    bgUrl: string
    pageInfo: AchievementPageInfo | null
    currentFrame: StoreItem | null
  } {
    return {
      username: '',
      profilePic: '',
      showUserFrame: false,
      showFrameStore: false,
      bgUrl,
      pageInfo: null,
      currentFrame: null,
    }
  },
  async mounted() {
    await initializeLiff('VITE_LIFF_ID_ACHIEVEMENT').then(async () => {
      const p = await liff.getProfile()
      this.username = p.displayName
      this.profilePic = p.pictureUrl || ''
      this.pageInfo = await getAchievementsPageInfo()
      this.currentFrame = this.pageInfo?.currentFrame || null
    })
  },
  methods: {
    getFrameSrc(imageName: string): string {
      return frameMap[imageName] ?? ''
    },
    async updateInfo() {
      this.pageInfo = await getAchievementsPageInfo()
      this.currentFrame = this.pageInfo?.currentFrame || null
    },
  },
  computed: {
    ringStyle(): CSSProperties & Record<'--ring-scale' | '--ring-x' | '--ring-y', string> {
      return { '--ring-scale': '1.6', '--ring-x': '0px', '--ring-y': '0px' }
    },

    /* ปรับให้อยู่ในรูปแบบ {current, target} เสมอ (target coin = 90) */
    normalizedCoin(): { current: number; target: number } {
      const raw: CoinProgress | undefined = this.pageInfo?.coinProgress as CoinProgress | undefined
      const current = isCoinObj(raw) ? Number(raw.current) : Number(raw ?? 0)
      return { current, target: 90 }
    },

    /* totalDays / target ของมะลิแบบ type-safe */
    normalizedMali(): { current: number; target: number } {
      const raw = this.pageInfo?.maliProgress as
        | number
        | { current: number; target: number }
        | undefined
      const current =
        typeof raw === 'object' && raw !== null && 'current' in raw
          ? (raw as { current: number }).current
          : Number(raw ?? 0)

      // ด่านของมะลิตามที่ใช้ในคอมโพเนนต์ Mali
      // (0 คือเลเวลเริ่มต้น จึงไม่ใช่ "เป้าหมายถัดไป")
      const THRESHOLDS = [1, 10, 30, 60, 75, 90]

      // หาเป้าหมายถัดไป; ถ้าเลยสูงสุดแล้ว ให้เท่ากับ 90
      const next = THRESHOLDS.find((t) => current < t) ?? 90

      return { current, target: next }
    },

    /* เลือกรูปมะลิตามวัน */
    maliImageForPoster(): string {
      const days = this.normalizedMali.current
      if (days >= 90) return m5
      if (days >= 75) return m5
      if (days >= 60) return m4
      if (days >= 30) return m3
      if (days >= 10) return m2
      if (days >= 1) return m1
      return m0
    },

    /* รูปเหรียญสำหรับโปสเตอร์ */
    coinStagesForPoster(): CoinStage[] {
      return [
        { threshold: 10, imgActive: b10On, imgInactive: b10Off },
        { threshold: 30, imgActive: b30On, imgInactive: b30Off },
        { threshold: 60, imgActive: b60On, imgInactive: b60Off },
        { threshold: 90, imgActive: b90On, imgInactive: b90Off },
      ]
    },
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
  height: 100dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
}

/* ---- พื้นหลังส่วนหัว (full-bleed) ---- */
.header-section {
  position: relative;
  width: 100vw;
  left: 50%;
  margin-left: -50vw;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  padding-top: 28px;
  padding-bottom: 72px;
}
.header-inner {
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- การ์ดลอยทับ bg ---- */
.overlap-card {
  width: min(360px, calc(100% - 32px));
  margin: -55px auto 0;
  z-index: 2;
  position: relative;
  border-radius: 14px;
}

/* ---- เนื้อหาที่เหลือ ---- */
.content-section {
  padding-top: 17px;
  width: min(360px, calc(100% - 32px));
  margin: 0 auto 24px;
  background: #fff;
}

/* ปุ่ม */
.btn-row {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
}

/* โปรไฟล์ */
.profile-pic-container {
  position: relative;
  width: clamp(88px, 30vw, 100px);
  aspect-ratio: 1/1;
  line-height: 0;
}
.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  position: relative;
  z-index: 1;
}
.profile-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 2;
  transform: translate(var(--ring-x, 0), var(--ring-y, 0)) scale(var(--ring-scale, 1));
  transform-origin: center;
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
  flex: 1 1 0;
  min-width: 0;
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
@media (max-width: 330px) {
  .btn-row {
    flex-direction: column;
  }
  .popup-button {
    width: 100%;
  }
}
.btn-icon {
  line-height: 0;
  flex-shrink: 0;
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
  max-height: 100dvh;
  overflow: auto;
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
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0.18px;
  z-index: 1;
}
</style>
