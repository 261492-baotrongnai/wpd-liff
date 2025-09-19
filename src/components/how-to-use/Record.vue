<template>
  <div class="page">
    <section class="hero">
      <button class="back-chip" @click="$emit('back')"><PhArrowLeft :size="20" />กลับ</button>

      <!-- BG ครอบเต็ม hero -->
      <img class="bg" src="@/assets/how-to-use/bg.png" alt="" aria-hidden="true" />

      <!-- แคปซูลหัวข้อ + ไอคอนเล่มสมุด -->
      <div class="title-chip">
        <img class="chip-icon" src="@/assets/how-to-use/record.png" alt="" />
        <span class="chip-text">บันทึกอาหารที่ทาน</span>
      </div>
    </section>

    <!-- แถบนำทาง -->
    <div class="nav-wrap">
      <div class="nav flex rounded-full overflow-hidden">
        <div
          class="nav-button base-button"
          :class="[isDoc ? 'bg-[#D1E5FF] text-[#194678] flex-grow' : 'text-[#898989] flex-shrink']"
          @click="setActiveSection('RecordDoc')"
        >
          <PhNotepad class="w-[20px] h-[20px] shrink-0" />
          <span :class="['nav-title', { nowrap: isDoc, ellipsis: !isDoc }]">คู่มือวิธีใช้</span>
        </div>

        <div
          class="nav-button base-button"
          :class="[isVDO ? 'bg-[#D1E5FF] text-[#194678] flex-grow' : 'text-[#898989] flex-shrink']"
          @click="setActiveSection('RecordVDO')"
        >
          <PhYoutubeLogo weight="fill" class="w-[20px] h-[20px] shrink-0 scale-[1.15]" />
          <span :class="['nav-title', { nowrap: isVDO, ellipsis: !isVDO }]">วิดีโอสาธิต</span>
        </div>
      </div>
    </div>

    <!-- เนื้อหา -->
    <div class="content">
      <RecordDoc v-if="isDoc" @updateGrade="emitGradeUpdate" />
      <RecordVDO v-else-if="isVDO" @updateGrade="emitGradeUpdate" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RecordDoc from './section-components/RecordDoc.vue'
import RecordVDO from './section-components/RecordVDO.vue'
import { PhNotepad, PhYoutubeLogo, PhArrowLeft } from '@phosphor-icons/vue'

type SectionKey = 'RecordDoc' | 'RecordVDO'

export default defineComponent({
  name: 'RecordFood',
  components: { RecordDoc, RecordVDO, PhNotepad, PhYoutubeLogo, PhArrowLeft },
  emits: ['back', 'updateGrade'],
  data() {
    return {
      activeSection: 'RecordDoc' as SectionKey,
      heroHeight: 0 as number,
      scrollHandler: null as EventListener | null,   // ✅ type ชัด ไม่ใช้ any
    }
  },
  computed: {
    isDoc(): boolean {
      return this.activeSection === 'RecordDoc'
    },
    isVDO(): boolean {
      return this.activeSection === 'RecordVDO'
    },
  },
  methods: {
    setActiveSection(key: SectionKey) {
      this.activeSection = key
    },
    emitGradeUpdate(payload: unknown) {
      this.$emit('updateGrade', payload)
    },
    _updateHeroHeight(): void {
      const hero = this.$el.querySelector('.hero') as HTMLElement | null
      this.heroHeight = hero ? hero.offsetHeight : 0
    },
    _onScroll(): void {
      const root = this.$el as HTMLElement // .page
      const nav = this.$el.querySelector('.nav-wrap') as HTMLElement | null
      if (!nav) return
      const stuck = root.scrollTop >= Math.max(0, this.heroHeight - 1)
      nav.classList.toggle('with-shadow', stuck)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this._updateHeroHeight()
      this._onScroll()
      window.addEventListener('resize', this._updateHeroHeight)
      // ✅ เก็บ handler ที่มี type EventListener ไว้ เพื่อลบตอน unmount
      this.scrollHandler = () => this._onScroll()
      ;(this.$el as HTMLElement).addEventListener('scroll', this.scrollHandler, { passive: true })
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this._updateHeroHeight)
    const el = this.$el as HTMLElement
    if (this.scrollHandler) {
      el.removeEventListener('scroll', this.scrollHandler)
      this.scrollHandler = null
    }
  },
})
</script>

<style scoped>
.page {
  position: fixed; /* ✅ ครอบเต็มจอ */
  inset: 0;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;       /* ✅ ให้เลื่อนใน .page */
  overflow-x: hidden;
}

/* ===== HERO (responsive) ===== */
.hero {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 16px 16px 22px;
  min-height: clamp(140px, 28vw, 240px);
  overflow: hidden;

  /* กว้างเท่า viewport */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  background: #fff;
}

/* BG ครอบเต็มกรอบ hero */
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  background: #fff;
}

/* ปุ่มกลับแบบแคปซูล ลอยบนซ้าย */
.back-chip {
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
.back-chip .arrow { font-size: 18px; line-height: 1; }

/* ===== Title + Icon ===== */
.title-chip {
  position: relative;
  display: inline-block;
  margin-top: 22px;
  padding: 0;
  --pad-x: 20px;
  --pad-y: 8px;
  --icon-w: clamp(65px, 8vw, 70px);
  --gap: 5px;
  --overlap: 20px;
}
.chip-text {
  position: relative;
  display: inline-block;
  margin: 27px 0 0 0;
  padding: var(--pad-y) var(--pad-x) var(--pad-y) calc(var(--icon-w) + var(--gap));
  border-radius: 999px;
  background: #fff;
  color: #2d6fb9;
  font-family: 'Noto Looped Thai UI';
  font-size: clamp(24px, 5vw, 26px);
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}
.chip-icon {
  position: absolute;
  bottom: -0.5px;
  left: calc(var(--pad-x) - var(--overlap));
  width: var(--icon-w);
  height: auto;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 4px 10px rgba(48, 113, 187, 0.18));
  z-index: 3;
}

/* ===== NAV ===== */
.nav-wrap {
  position: sticky;
  top: clamp(140px, 28vw, 240px);
  z-index: 19;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding-inline: 15px;
  box-sizing: border-box;
  background: #f8fcff;

  /* เงา: ปิดโดยค่าเริ่มต้น และเปิดเมื่อ .with-shadow */
  box-shadow: none;
  transition: box-shadow .2s ease;
}
.nav-wrap.with-shadow{
  box-shadow: 0 8px 20px rgba(34, 78, 126, 0.12);
}

.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #eceff2;
  border-radius: 15px;
  height: 55px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 6px;
  gap: 5px;
  width: 100%;
  box-sizing: border-box;
}

.base-button {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  transition: background 0.2s, color 0.2s;
}

.nav-button { height: 100%; transition: background-color 0.3s ease; }
.nav-button.active { background-color: #e1e1e1d7; color: rgb(64, 64, 64); }

.ellipsis {
  display: inline-block;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nowrap { white-space: nowrap; }

.nav-title {
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.18px;
}

/* ===== CONTENT ===== */
.content {
  width: 100%;
  padding-inline: 25px;
  box-sizing: border-box;
  text-align: left;
}
</style>
