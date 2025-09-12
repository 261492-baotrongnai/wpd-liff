<!-- UserFrame.vue -->
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
      <div class="header-inner container">
        <div class="profile-pic-container" :style="ringStyle">
          <div class="placeholder" v-if="!profilePic">No Image</div>
          <img
            v-else
            :src="profilePic"
            alt="Profile Picture"
            class="profile-pic"
            @load="onImgLoad"
            @error="onImgError"
          />
          <img
            v-if="selectedFrame?.img"
            :src="selectedFrame.img"
            alt="Profile frame"
            class="profile-frame"
          />
        </div>
        <p v-if="username" class="username">{{ username }}</p>
      </div>
    </section>

    <!-- Content -->
    <main class="content-section container">
      <div class="frame-grid">
        <!-- ไม่ใส่กรอบ -->
        <button class="frame-tile" :class="{ selected: selectedId === null }" @click="select(null)">
          <div class="ring dashed">ไม่ใส่กรอบ</div>

          <!-- selected & current -->
          <div v-if="selectedId === null && currentId === null" class="using-pill-center">
            <PhCheck :size="16" weight="bold" />
            <span>ใช้งานอยู่</span>
          </div>
          <!-- selected only -->
          <div v-else-if="selectedId === null" class="check-center">
            <PhCheck :size="20" weight="bold" />
          </div>
          <!-- current only -->
          <div v-else-if="currentId === null" class="using-pill-center">
            <span>ใช้งานอยู่</span>
          </div>
        </button>

        <!-- กรอบอื่น ๆ (เฉพาะ owned) -->
        <button
          v-for="f in visibleFrames"
          :key="f.id"
          class="frame-tile"
          :class="{ selected: selectedId === f.id }"
          @click="select(f.id)"
        >
          <img :src="f.img" alt="" class="frame-img" />

          <!-- selected & current -->
          <div v-if="selectedId === f.id && currentId === f.id" class="using-pill-center">
            <PhCheck :size="18" weight="bold" />
            <span>ใช้งานอยู่</span>
          </div>
          <!-- selected only -->
          <div v-else-if="selectedId === f.id" class="check-center">
            <PhCheck :size="20" weight="bold" />
          </div>
          <!-- current only -->
          <div v-else-if="currentId === f.id" class="using-pill-center">
            <span>ใช้งานอยู่</span>
          </div>
        </button>
      </div>

      <div class="action-row">
        <button class="save-btn" @click="save">
          <PhFloppyDisk :size="20" weight="fill" />
          <span>เปลี่ยนกรอบ</span>
        </button>
      </div>
    </main>

    <!-- Success Modal -->
    <transition name="fade-zoom">
      <div
        v-if="showSaved"
        class="save-overlay"
        role="dialog"
        aria-modal="true"
        @click.self="showSaved = false"
      >
        <div class="save-card">
          <div class="save-icon"><PhCheck :size="40" weight="bold" /></div>
          <p class="save-text">เปลี่ยนกรอบเรียบร้อยค่ะ</p>
        </div>
      </div>
    </transition>

    <transition name="fade-zoom">
      <div
        v-if="isLoading"
        class="loading-overlay"
        role="status"
        aria-live="polite"
        aria-label="กำลังโหลดโปรไฟล์"
      >
        <div class="saving-box">
          <div class="saving-spinner" />
          <div class="saving-text">กำลังโหลด</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '../../utility/liffUtils'
import liff from '@line/liff'
import bgUrl from '@/assets/achievement/bg-blue.png'
import { PhFloppyDisk, PhCheck } from '@phosphor-icons/vue'
import type { CSSProperties } from 'vue'
import frameAdult1 from '@/assets/frame/frameAdult1.png'
import frameAdult2 from '@/assets/frame/frameAdult2.png'
import frameElder1 from '@/assets/frame/frameElder1.png'
import frameElder2 from '@/assets/frame/frameElder2.png'

export default {
  name: 'UserFrame',
  components: { PhFloppyDisk, PhCheck },
  data() {
    return {
      username: '',
      profilePic: '',
      profileLoading: true, // ระหว่างดึงข้อมูล LIFF
      imageLoading: false, // ระหว่างโหลดไฟล์รูป
      bgUrl,
      frames: [
        // สามารถเพิ่ม dx/dy/scale ต่อกรอบเพื่อจูนตำแหน่ง overlay บนโปรไฟล์ได้
        { id: 1, img: frameAdult1, owned: true, scale: 1.6, dx: 0, dy: 0 },
        { id: 2, img: frameAdult2, owned: true, scale: 1.6, dx: 0, dy: 0 },
        { id: 3, img: frameElder1, owned: true, scale: 1.6, dx: 0, dy: 0 },
        { id: 4, img: frameElder2, owned: false, scale: 1.6, dx: 0, dy: 0 },
      ],
      currentId: null as number | null,
      selectedId: null as number | null,
      showSaved: false,
      timer: null as number | null,
    }
  },
  computed: {
    isLoading(): boolean {
      return this.profileLoading || this.imageLoading
    },
    visibleFrames() {
      return this.frames.filter((f) => f.owned)
    },
    selectedFrame(): { id: number; img: string; scale?: number; dx?: number; dy?: number } | null {
      if (this.selectedId == null) return null
      return this.visibleFrames.find((f) => f.id === this.selectedId) || null
    },

    // ✅ no any
    ringStyle(): CSSProperties & Record<'--ring-scale' | '--ring-x' | '--ring-y', string> {
      const scale = this.selectedFrame?.scale ?? 1.6
      const dx = this.selectedFrame?.dx ?? 0
      const dy = this.selectedFrame?.dy ?? 0
      return {
        '--ring-scale': String(scale),
        '--ring-x': `${dx}px`,
        '--ring-y': `${dy}px`,
      }
    },
  },
  async mounted() {
    try {
      await initializeLiff('VITE_LIFF_ID_ACHIEVEMENT')
      const profile = await liff.getProfile()
      this.username = profile.displayName
      this.profilePic = profile.pictureUrl || ''
      // ถ้ามีรูปค่อยรอโหลดรูปให้เสร็จก่อน
      this.imageLoading = !!this.profilePic
    } finally {
      this.profileLoading = false
    }

    this.currentId = null
    this.selectedId = this.currentId
  },
  watch: {
    showSaved(v: boolean) {
      document.body.classList.toggle('modal-open', v)
    },
  },
  beforeUnmount() {
    if (this.timer) window.clearTimeout(this.timer)
    document.body.classList.remove('modal-open')
  },
  methods: {
    select(id: number | null) {
      if (id !== null && !this.visibleFrames.some((f) => f.id === id)) return
      this.selectedId = id
    },
    save() {
      // TODO: call API บันทึกจริง
      this.currentId = this.selectedId
      this.showSaved = true
      if (this.timer) window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => (this.showSaved = false), 1200)
    },

    onImgLoad() {
      this.imageLoading = false
    },
    onImgError() {
      // โหลดรูปไม่ขึ้น ให้ใช้ placeholder และปิดโหลดดิ้ง
      this.imageLoading = false
      this.profilePic = ''
    },
  },
}
</script>

<style scoped>
/* ===== Layout / Container ===== */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
  background: #fff;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.header-box {
  padding: 32px 0 24px;
  width: 100%;
  position: relative;
}
.container {
  width: min(420px, calc(100% - 32px));
  margin-inline: auto;
  margin-top: 10px;
}

.header-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.username {
  margin-top: 16px;
  color: #194678;
  font-family: 'Noto Looped Thai UI Semibold';
  font-size: 20px;
  font-weight: 600;
}

.content-section {
  padding: 8px 0 24px;
}

/* ===== Profile & Frame (responsive) ===== */
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
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #d8d8d8;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
}

/* ===== Frames Grid ===== */
.frame-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
}
.frame-tile {
  position: relative;
  display: grid;
  place-items: center;
  padding: 10px;
  background: #fff;
  border-radius: 14px;
  border: 1px dashed #e3e3e3;
}
.frame-tile.selected {
  border: 2px solid #7ac943; /* ไม่ dashed แล้ว */
}

.frame-img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: contain;
  display: block;
}

/* วง dashed “ไม่ใส่กรอบ” */
.ring {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #fafafa;
}
.ring.dashed {
  border: 2px dashed #c8c8c8;
  background: transparent;
  color: #8d8d8d;
  font-size: 13px;
}

/* ===== Overlays ===== */
.check-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  background: #d2ecc0;
  color: #2f7d32;
  display: grid;
  place-items: center;
  z-index: 3;
  pointer-events: none;
}
.using-pill-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  border-radius: 9999px;
  background: #d2ecc0;
  color: #2f7d32;
  font-size: 14px;
  white-space: nowrap;
  line-height: 1;
  z-index: 3;
  pointer-events: none;
}

/* ===== Save button ===== */
.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  width: 200px;
  height: 55px;
  border: 0;
  border-radius: 15px;
  background: #d2ecc0;
  color: #333;
  font:
    600 18px/26px 'Noto Looped Thai UI Medium',
    sans-serif;
  box-shadow:
    -4px -4px 2px #cce5bb inset,
    4px 4px 2px #e0f0d5 inset;
}

/* ===== Success Modal ===== */
.save-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
  display: grid;
  place-items: center;
}
.save-card {
  width: min(86vw, 360px);
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}
.save-icon {
  width: 88px;
  height: 88px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #d2ecc0;
  color: #2f7d32;
  font-size: 44px;
  display: grid;
  place-items: center;
  font-weight: 700;
}
.save-text {
  margin: 0;
  color: #194678;
  font:
    18px/1.3 'Noto Looped Thai UI',
    sans-serif;
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

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 6000; /* สูงกว่าอย่างอื่น */
  display: grid;
  place-items: center;
  backdrop-filter: blur(1px);
  background: rgba(0, 0, 0, 0.55);
}
.saving-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
}
/* spinner ที่ให้มา */
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
  font-size: 18px;
  font-weight: 500;
}
</style>

<!-- ต้องอยู่นอก scoped เพื่อคุม body ได้ -->
<style>
body.modal-open {
  overflow: hidden;
}
</style>
