<template>
  <div v-if="!loading" class="page-bg">
    <div class="menu-section-wrapper">
      <div class="instruction-wrapper">
        <img src="../../assets/menu-input/bg-text.svg" class="bg-text" />
        <p class="instruction">
          กดเลือกเมนูที่ใกล้เคียงเพื่อแก้ไข <br />
          หรือพิมพ์ชื่อเมนูใหม่ก็ได้นะคะ
        </p>
      </div>
      <div class="input-candidates">
        <!-- 2x2 Candidate Grid -->
        <div v-if="candidates.length" class="candidates-grid">
          <div
            v-for="(candidate, index) in candidates.slice(0, 4)"
            :key="index"
            class="candidate-box"
            @click="selectCandidate(candidate)"
          >
            {{ candidate }}
          </div>
          <!-- Fill empty boxes if less than 4 candidates -->
          <div
            v-for="n in 4 - Math.min(candidates.length, 4)"
            :key="'empty-' + n"
            class="candidate-box empty"
          ></div>
        </div>
      </div>
    </div>

    <div class="input-row">
      <div class="input-area">
        <div class="input-header">
          <UIcon name="i-lucide-pencil" class="icon-pencil" />
          <p class="input-label nowrap">ชื่อเมนูที่ถูกต้อง</p>
          <div id="character-count" class="character-count" aria-live="polite" role="status">
            {{ value?.length }}/{{ maxLength }}
          </div>
        </div>
        <textarea
          v-model="value"
          :maxlength="maxLength"
          class="custom-textarea"
          placeholder="เช่น ส้มตำ, ข้าวต้มกุ้ง"
          ref="autoTextarea"
          @input="autoResize"
        />
      </div>
      <div class="clear-button-wrapper">
        <button class="clear-button-custom" @click="showModal = true">
          <div class="icon-wrapper"><PhTrashSimple :size="20" /></div>
          <span class="clear-text nowrap">ลบทั้งหมด</span>
        </button>
      </div>
    </div>
    <div class="submit-button-wrapper">
      <button @click="sendMenu" class="submit-button">
        <div><PhFloppyDisk :size="20" /></div>
        <span class="save-text">บันทึกเมนูนี้</span>
      </button>
    </div>
  </div>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-wrapper">
      <p class="modal-title">ต้องการลบ<br />ชื่อเมนูทั้งหมดใช่ไหมคะ?</p>
      <div class="modal-button-group">
        <button class="modal-button-danger" @click="confirmDelete">ลบทั้งหมด</button>
        <button class="modal-button-cancel" @click="closeModal">ยกเลิก</button>
      </div>
    </div>
  </div>
  <!-- Loading Skeleton (ตรงตามเลย์เอาต์จริง) -->
  <!-- Loading Skeleton (ตรงตามเลย์เอาต์จริง) -->
  <div v-if="loading" class="page-bg">
    <div class="menu-section-wrapper">
      <!-- Instruction (ภาพ + ข้อความทับ) -->
      <div class="relative flex flex-col items-center justify-center">
        <!-- พื้นที่ภาพ bg-text -->
        <USkeleton class="bg-[#e5e7eb] w-[calc(100%-20px)] max-w-[460px] h-[90px]" />
      </div>

      <!-- Candidates 2x2 Grid -->
      <div class="input-candidates mt-0 mb-3">
        <div class="candidates-grid">
          <USkeleton class="skeleton-candidate bg-[#e5e7eb]" />
          <USkeleton class="skeleton-candidate bg-[#e5e7eb]" />
          <USkeleton class="skeleton-candidate bg-[#e5e7eb]" />
          <USkeleton class="skeleton-candidate bg-[#e5e7eb]" />
        </div>
      </div>
    </div>

    <!-- Input Row: header + textarea + clear button -->
    <div class="input-row px-2">
      <div class="input-area">
        <!-- Header: icon + label + counter -->
        <div class="input-header">
          <div class="skeleton-circle bg-[#e5e7eb]" aria-hidden="true"></div>
          <USkeleton class="h-[20px] w-[120px] rounded-[4px] bg-[#e5e7eb]" />
          <div class="ml-auto">
            <USkeleton class="h-[16px] w-[64px] rounded-[4px] bg-[#e5e7eb]" />
          </div>
        </div>

        <!-- Textarea -->
        <USkeleton class="w-full h-[96px] rounded-[6px] bg-[#e5e7eb]" />
      </div>

      <!-- Clear button -->
      <div class="clear-button-wrapper">
        <USkeleton class="h-[36px] w-[50px] rounded-[8px] bg-[#e5e7eb]" />
      </div>
    </div>

    <!-- Submit button -->
    <div class="submit-button-wrapper">
      <USkeleton class="h-[55px] w-[257px] rounded-[15px] bg-[#e5e7eb]" />
    </div>
  </div>

  <!-- Loader Overlay (เต็มจอ) -->
  <teleport to="body">
    <div v-if="isSaving" class="saving-overlay" role="alert" aria-busy="true">
      <div class="saving-box">
        <span class="saving-spinner" aria-hidden="true"></span>
        <div class="saving-text">กำลังบันทึกชื่อเมนูนี้</div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { ref } from 'vue'
import { getMenuCandidates } from '../../services/menuinput.service'
import liff from '@line/liff'
import { initializeLiff } from '../../services/liff.service'
import { PhTrashSimple } from '@phosphor-icons/vue'
import { PhFloppyDisk } from '@phosphor-icons/vue'

export default {
  components: { PhTrashSimple, PhFloppyDisk },
  name: 'MenInput',
  data() {
    return {
      menu_name: '',
      candidates: [] as string[],
      loading: true,
      value: ref(''),
      maxLength: 200,
      showModal: false,
      isSaving: false,
    }
  },

  methods: {
    selectCandidate(candidate: string) {
      // Insert the selected candidate into the textarea
      this.value = candidate
      this.menu_name = candidate
    },

    clearTextarea() {
      // Clear the textarea content
      this.showModal = true
    },
    confirmDelete() {
      this.value = ''
      this.menu_name = ''
      this.autoResize()
      this.showModal = false
    },
    closeModal() {
      this.showModal = false
    },

    sendMenu() {
      // Use value from textarea (v-model)
      const menuText = this.value || this.menu_name

      if (menuText.trim()) {
        console.log('Sending menu name:', menuText)
        this.isSaving = true
        liff
          .sendMessages([
            {
              type: 'text',
              text: `${menuText}`,
            },
          ])
          .then(() => {
            console.log('Message sent successfully')
            this.value = '' // Clear the input field after sending
            this.menu_name = ''
            this.isSaving = false
            liff.closeWindow() // Close the LIFF window
          })
          .catch((error) => {
            console.error('Error sending message:', error)
            this.isSaving = false
          })
      } else {
        console.error('Menu name cannot be empty')
      }
    },
    autoResize() {
      this.$nextTick(() => {
        const textarea = this.$refs.autoTextarea as HTMLTextAreaElement
        if (textarea) {
          textarea.style.height = 'auto'
          textarea.style.height = textarea.scrollHeight + 'px'
        }
      })
    },
  },

  watch: {
    // Sync the v-model value with menu_name
    value(newValue) {
      this.menu_name = newValue
    },
  },

  async mounted() {
    await initializeLiff('VITE_LIFF_ID_MENU_INPUT')
    await getMenuCandidates().then((candidates) => {
      this.candidates = candidates
    })
    this.loading = false
  },
}
</script>

<style scoped>
.page-bg {
  min-height: 100vh;
  background: #f2f8fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}
.menu-section-wrapper {
  width: 100%;
  max-width: 480px;
}
.input-container {
  margin: 0;
}
.instruction-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; /* จัดให้อยู่ตรงกลางแนวนอน */
  width: fit-content;
  margin: -50px auto 10px auto;
}

.instruction-wrapper img {
  display: block;
  width: 100%;
  height: auto;
  margin-left: -20px;
}

.instruction {
  position: absolute;
  top: 63px;
  left: 0px;
  right: 0;
  bottom: 0;
  padding: 20px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #194678;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.18px;
  white-space: pre-line;
}
.bg-text {
  display: block;
  margin: 0 0;
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: contain;
  padding: 0;
}

.input-candidates {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}
/* 2x2 Grid for candidates */
.candidates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  padding: 10px;
}

.candidate-box {
  background-color: #e5e5e5;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  color: #434343;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px; /* 160% */
  letter-spacing: 0.2px;
  transition: all 0.1s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  hyphens: auto;
  width: 100%;
}

.candidate-box:hover {
  background-color: #cce2ff;
  transform: translateY(-1px);
}

.candidate-box:active {
  transform: translateY(0);
  background-color: #cce2ff;
}

.candidate-box.empty {
  background-color: #e5e5e5;
}

.candidate-box.empty:hover {
  background-color: transparent;
  border-color: #e5e5e5;
  transform: none;
  box-shadow: none;
}

.input-container {
  width: 100%;
  max-width: 350px;
  margin: 10px auto;
  box-sizing: border-box;
}

.submit-button-wrapper {
  width: 100%;
  max-width: 350px;
  margin-top: 20px;
  display: flex;
  justify-content: center; /* จัดปุ่มให้อยู่กลาง */
}

.submit-button {
  /* ขนาด + พื้นหลังตามที่ขอ */
  width: 257px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;

  /* โครงสร้างปุ่ม */
  border: 0;
  color: #333333;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

/* เอฟเฟกต์เล็กน้อย */
.submit-button:hover {
  filter: brightness(1.02);
}
.submit-button:active {
  transform: translateY(1px);
  box-shadow:
    -2px -2px 1px 0 #cce5bb inset,
    2px 2px 1px 0 #e0f0d5 inset;
}
.submit-button:focus-visible {
  outline: 2px solid #19467833;
  outline-offset: 2px;
}

.save-text {
  color: #333;
  text-align: center;
  /* button2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
}

/* Remove old candidate list styles */
.candidates-list {
  display: none;
}
/* จัดระยะรวม */
.input-label {
  color: var(--main-text, #194678);
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.nowrap {
  white-space: nowrap;
}
/* จัดแนวนอน textarea + ปุ่มลบ */
.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  gap: 10px;
}

/* ส่วนที่เป็นกล่อง input */
.input-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* หัวแถว: ไอคอน + label + counter */
.input-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.input-container * {
  margin: 0 !important;
}

.icon-pencil {
  width: 18px;
  height: 18px;
  color: #194678;
  flex-shrink: 0;
  aspect-ratio: 1/1;
}

/* ตัวนับตัวอักษร */
.character-count {
  font-size: 12px;
  color: #999;
  text-align: right;
  width: 100%;
  padding-right: 8px;
}

/* ปุ่มลบด้านขวา */
.clear-button-wrapper {
  display: flex;
  align-items: center;
  width: fit-content; /* หรือ width: auto; */
  align-self: flex-end; /* ให้ปุ่มชิดขวาใน input-row */
}

/* textarea */
.custom-textarea {
  width: 100%;
  font-size: 18px;
  padding: 4px 12px;
  font-family: 'Noto Looped Thai UI';
  line-height: 1.2;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;
  padding: 10px 10px;
}

.clear-button-custom {
  display: flex;
  align-content: center;
  border-radius: 8px;
  border: 1px solid #faa;
  background: #fff4f4;
  padding: 6px;
  gap: 4px;
}

.clear-text {
  color: #ff6969;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  letter-spacing: 0.16px;
}

.icon-wrapper {
  color: #ff6969;
  margin-top: auto;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  background: white;
  border-radius: 20px;
  padding: 25px 26px;
  width: 90%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-family: 'Noto Looped Thai UI';
  font-size: 20px;
  font-weight: 500;
  color: #194678;
  margin-bottom: 24px;
  line-height: 32px;
}

.modal-button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-button-danger {
  border: 1.5px solid #ff6969;
  background-color: #fff4f4;
  color: #ff6969;
  border-radius: 12px;
  padding: 10px 20px;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}

.modal-button-cancel {
  border: 1.5px solid #d0d0d0;
  background-color: #f1f1f1;
  color: #555;
  border-radius: 12px;
  padding: 10px 20px;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}
/* ให้ขนาดสเกเลตันของ candidate เท่ากับการ์ดจริง */
.skeleton-candidate {
  width: 100%;
  min-height: 60px;
  border-radius: 10px;
}

/* วงกลมแทนไอคอนดินสอ (18px) */
.skeleton-circle {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background-color: #e5e7eb; /* เทาอ่อนคล้าย USkeleton */
  flex-shrink: 0;
}

/* ปรับตำแหน่ง instruction-wrapper เวลาโหลด เพื่อกัน shift */
.instruction-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: -50px auto 10px auto;
}

.saving-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2000;
  display: grid;
  place-items: center;
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
