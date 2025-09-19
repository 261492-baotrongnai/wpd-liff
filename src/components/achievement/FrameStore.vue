<!-- FrameStore.vue -->
<template>
  <div class="page">
    <!-- Header -->
    <section
      class="header-box"
      :style="{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="container header-row">
        <div class="avatar-wrap">
          <div v-if="!profilePic" class="avatar ph">No Image</div>
          <img
            v-else
            :src="profilePic"
            class="avatar"
            alt="profile"
            @load="onImgLoad"
            @error="onImgError"
          />
        </div>

        <div class="meta">
          <p class="name">{{ username || ' ' }}</p>
          <div class="points-card">
            <span class="points">{{ formattedPoints }}</span>
            <span class="unit">แต้ม</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <main class="content">
      <div class="store-grid">
        <div v-for="f in storeInfo.storeItems" :key="f.id" class="tile">
          <div v-if="getFrameSrc(f.imageName)">
            <div class="ring-box">
              <img :src="getFrameSrc(f.imageName)" class="ring-img" alt="" />

              <!-- ราคาโชว์เฉพาะยังไม่แลก -->
              <div v-if="!f.owned" class="price-chip">
                ใช้ {{ f.pointsRequired.toLocaleString('th-TH') }} แต้ม
              </div>

              <!-- ติ๊กถูกกลางกรอบ: โชว์เมื่อแลกแล้ว -->
              <div v-else class="check-center">
                <PhCheck :size="24" weight="bold" />
              </div>
            </div>

            <!-- Footer: ปุ่ม/ข้อความ -->
            <div class="tile-footer">
              <button
                v-if="!f.owned"
                class="redeem-btn"
                :disabled="!canRedeem(f)"
                @click="openConfirm(f)"
              >
                แลกแต้ม
              </button>

              <p v-else class="success-text">ได้รับเรียบร้อย</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Confirm modal -->
    <transition name="fade-zoom">
      <div
        v-if="showConfirm"
        class="overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        @click.self="closeConfirm"
      >
        <div class="dialog">
          <p id="confirm-title" class="dialog-title">ต้องการใช้แต้มแลกใช่ไหมคะ?</p>
          <div class="dialog-actions">
            <button class="btn yes" @click="confirmRedeem">ใช่</button>
            <button class="btn no" @click="closeConfirm">ไม่ใช่</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success modal -->
    <transition name="fade-zoom">
      <div
        v-if="showSuccess"
        class="overlay"
        role="alertdialog"
        aria-live="polite"
        @click.self="showSuccess = false"
      >
        <div class="success-card">
          <div class="success-icon"><PhCheck :size="30" weight="bold" /></div>
          <p class="success-text-modal">แลกแต้มเรียบร้อยค่ะ</p>
        </div>
      </div>
    </transition>

    <!-- Error modal -->
    <transition name="fade-zoom">
      <div
        v-if="showError"
        class="overlay"
        role="alertdialog"
        aria-live="assertive"
        @click.self="showError = false"
      >
        <div class="error-card">
          <div class="error-icon"><PhXCircle :size="30" weight="bold" /></div>
          <p class="error-text-modal">{{ errorText }}</p>
        </div>
      </div>
    </transition>

    <!-- Loading overlay -->
    <transition name="fade-zoom">
      <div v-if="isLoading" class="loading-overlay" role="status" aria-live="polite">
        <div class="saving-box">
          <div class="saving-spinner" />
          <div class="saving-text">กำลังโหลด</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '@/services/liff.service'
import liff from '@line/liff'
import bgUrl from '@/assets/achievement/bg-blue.png'
import { PhCheck, PhXCircle } from '@phosphor-icons/vue'
import type { StoreInfo, StoreItem } from '@/types/achievement.types'
import { getAllStoreItems, redeemStoreItem } from '@/services/achievement.service'

const frameMap = Object.fromEntries(
  Object.entries(
    import.meta.glob('@/assets/frame/*', {
      eager: true,
      import: 'default',
      query: '?url',
    }),
  ).map(([path, url]) => [path.split('/').pop()!, url as string]),
)

export default {
  name: 'FrameStore',
  components: { PhCheck, PhXCircle },
  emits: ['update-info'],
  data() {
    return {
      bgUrl,
      username: '',
      profilePic: '',
      profileLoading: true,
      imageLoading: false,

      // แต้มผู้ใช้
      points: null as number | null,

      showConfirm: false,
      showSuccess: false,
      showError: false,
      pendingFrame: null as StoreItem | null,
      successTimer: null as number | null,
      errorTimer: null as number | null, // auto-hide

      storeInfo: {} as StoreInfo,

      redeemError: null as Error | null,
    }
  },
  beforeUnmount() {
    if (this.successTimer) window.clearTimeout(this.successTimer)
    if (this.errorTimer) window.clearTimeout(this.errorTimer)
    document.body.classList.remove('modal-open')
  },
  watch: {
    showConfirm(v: boolean) {
      document.body.classList.toggle('modal-open', v)
    },
    showSuccess(v: boolean) {
      document.body.classList.toggle('modal-open', v)
    },
    showError(v: boolean) {
      document.body.classList.toggle('modal-open', v)
    },
  },
  computed: {
    isLoading(): boolean {
      return this.profileLoading || this.imageLoading
    },
    formattedPoints(): string {
      if (this.points === null) return 'ไม่พบข้อมูล'
      return this.points.toLocaleString('th-TH')
    },
    errorText(): string {
      // + message to show
      return 'เกิดข้อผิดพลาดในการแลกแต้ม กรุณาลองใหม่ค่ะ'
    },
  },
  async mounted() {
    try {
      await initializeLiff('VITE_LIFF_ID_ACHIEVEMENT')
      const profile = await liff.getProfile()
      this.username = profile.displayName
      this.profilePic = profile.pictureUrl || ''
      this.imageLoading = !!this.profilePic
      this.storeInfo = await getAllStoreItems()
      this.points = this.storeInfo.userPoints
    } finally {
      this.profileLoading = false
    }
  },
  methods: {
    getFrameSrc(imageName: string): string {
      return frameMap[imageName] ?? ''
    },

    onImgLoad() {
      this.imageLoading = false
    },
    onImgError() {
      this.imageLoading = false
      this.profilePic = ''
    },

    canRedeem(f: StoreItem) {
      if (this.points === null) return false
      return !f.owned && this.points >= f.pointsRequired
    },
    openConfirm(f: StoreItem) {
      if (!this.canRedeem(f)) return
      this.pendingFrame = f
      this.showConfirm = true
      console.log('Open confirm for', f)
    },
    closeConfirm() {
      this.showConfirm = false
      this.pendingFrame = null
    },
    async confirmRedeem() {
      if (!this.pendingFrame) return
      if (this.points === null) return
      try {
        // ปิด confirm
        this.showConfirm = false
        this.imageLoading = true
        // api แลกของรางวัล
        this.storeInfo = await redeemStoreItem(this.pendingFrame.id)
        this.points = this.storeInfo.userPoints
        this.$emit('update-info') // แจ้ง parent ให้รีเฟรชข้อมูล
        // แสดง success แปปนึง
        this.imageLoading = false
        this.showSuccess = true
        if (this.successTimer) window.clearTimeout(this.successTimer)
        this.successTimer = window.setTimeout(() => (this.showSuccess = false), 1200)
      } catch (error) {
        console.error('Error redeeming store item:', error)
        this.imageLoading = false
        this.redeemError = error as Error
        this.showError = true // + open error modal
        if (this.errorTimer) window.clearTimeout(this.errorTimer)
        this.errorTimer = window.setTimeout(() => (this.showError = false), 2200) // auto-hide
      }
      this.pendingFrame = null
    },
  },
}
</script>

<style scoped>
/* ===== Layout ===== */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #fff;
  overflow-x: hidden;
}
.container {
  /* กึ่งกลางและทำ padding ขอบซ้าย–ขวาเท่ากัน */
  width: 100%;
  max-width: 420px;
  padding-inline: 16px;
  margin: 35px auto 15px;
}

/* ===== Header ===== */
.header-box {
  padding: 20px 0 14px;
}
.header-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.avatar-wrap {
  flex: 0 0 auto;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.avatar.ph {
  display: grid;
  place-items: center;
  background: #d8d8d8;
  color: #fff;
}
.meta {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  flex-direction: column;
}
.name {
  margin: 0;
  color: #194678;
  font-family: 'Noto Looped Thai UI Semibold';
  font-size: 20px;
  font-weight: 600;
}
.points-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 10px;
  background-color: #fff;
  filter: drop-shadow(0 4px 2px rgba(193, 193, 193, 0.25));
}
.points {
  color: #194678;
  font-family: 'meejai Thin';
  font-size: 35px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 80% */
  letter-spacing: 0.4px;
  margin-bottom: 5px;
}
.unit {
  color: #194678;
  font: 500 18px/1 'Noto Looped Thai UI';
}

/* ===== Grid ===== */
.content {
  padding: 12px 10px 24px;
}
.store-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  justify-items: center; /* ให้ไอเท็มอยู่กลางคอลัมน์ */
}
/* โครง tile */
.tile {
  width: 100%;
  display: grid;
  place-items: center;
}

/* กล่องกรอบ + รูป */
.ring-box {
  position: relative;
  width: 100%; /* กว้างเท่าคอลัมน์ */
  max-width: 180px; /* แต่ไม่เกิน 180px */
  aspect-ratio: 1 / 1; /* เป็นสี่เหลี่ยมจัตุรัสเสมอ */
  margin-inline: auto; /* กลางคอลัมน์ (กันเผื่อ) */
}

.ring-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ป้ายแต้ม */
.price-chip {
  position: absolute;
  left: 55%;
  top: 50%;
  transform: translate(-55%, -50%);
  padding: 6px 10px;
  border-radius: 14px;
  color: #194678;
  font-size: 16px;
  white-space: nowrap;
}

/* ติ๊กถูกกลางกรอบเมื่อแลกแล้ว */
.check-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #d2ecc0;
  color: #2f7d32;
  display: grid;
  place-items: center;
  font-size: 26px; /* ถ้าใช้ตัวอักษร ✓ */
  font-weight: 700;
}

/* ปุ่ม/ข้อความด้านล่าง */
.tile-footer {
  min-height: 44px;
}
.redeem-btn {
  padding: 10px 25px;
  border-radius: 12px;
  border: 0;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;
  font-size: 16px;
  font-weight: 600;

  color: #333;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  top: -15%;
  transform: translateY(-15%);
}
.redeem-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-text {
  margin: 0;
  top: -10%;
  transform: translateY(-10%);
  color: #6f6f6f;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-style: normal;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
  text-align: center;
}
.success-text-modal {
  margin: 0;
  color: #194678;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-style: normal;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
  text-align: center;
}

/* ===== Loading overlay (ใช้สปินเนอร์ของคุณ) ===== */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(1px);
}
.saving-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
}
.saving-spinner {
  width: 52px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, #9ac8ea 94%, #0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, #9ac8ea);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: saving-rotate 1s linear infinite;
}
@keyframes saving-rotate {
  100% {
    transform: rotate(1turn);
  }
}
.saving-text {
  font: 500 18px/1 'Noto Looped Thai UI';
}

/* Transition */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: 160ms ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
/* Overlay & Dialogs */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
  display: grid;
  place-items: center;
}
.dialog {
  width: min(86vw, 360px);
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}
.dialog-title {
  margin: 8px 0 14px;
  color: #194678;
  text-align: center;
  /* Paragraph1 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 160% */
  letter-spacing: 0.2px;
}
.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 8px;
}
.btn {
  min-width: 120px;
  padding: 5px;
  border-radius: 10px;
  font-family: 'Noto Looped Thai UI';
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  border: 1px solid transparent;
}
.btn.yes {
  background: #f4ffec;
  color: #657859;
  border-color: #93a885;
}
.btn.no {
  background: #eceff2;
  color: #4b5563;
  border-color: #5e5e5e;
}

/* Success card */
.success-card {
  width: min(86vw, 320px);
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}
.success-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #d2ecc0;
  color: #2f7d32;
  display: grid;
  place-items: center;
  font-size: 42px;
  font-weight: 700;
}

/* Error card */
.error-card {
  width: min(86vw, 320px);
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}
.error-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #fde2e2;
  color: #c13535;
  display: grid;
  place-items: center;
  font-size: 42px;
  font-weight: 700;
}
.error-text-modal {
  margin: 0;
  color: #c13535;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.18px;
  text-align: center;
}

/* prevent background scroll when modal open */
:global(body.modal-open) {
  overflow: hidden;
}
</style>
