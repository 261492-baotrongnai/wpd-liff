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
  <div v-if="loading" class="flex flex-col gap-2">
    <div class="flex flex-col mt-4 gap-2 justify-center items-center">
      <USkeleton class="w-[250px] h-[20px]" />
      <USkeleton class="w-[300px] h-[20px]" />
      <USkeleton class="w-[250px] h-[20px]" />
    </div>
    <div class="flex flex-col gap-2 justify-center items-center">
      <div class="flex flex-row gap-2 mb-2 items-center">
        <USkeleton class="w-[150px] h-[80px]" />
        <USkeleton class="w-[150px] h-[80px]" />
      </div>
      <div class="flex flex-row gap-2 mb-2 items-center">
        <USkeleton class="w-[150px] h-[80px]" />
        <USkeleton class="w-[150px] h-[80px]" />
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-center items-center m-4">
      <div class="flex flex-row gap-2">
        <div class="flex flex-col gap-2 justify-start">
          <USkeleton class="w-[100px] h-[20px]" />
          <USkeleton class="w-[300px] h-[30px]" />
        </div>
        <div class="content-end">
          <USkeleton class="w-[80px] h-[30px]" />
        </div>
      </div>
      <USkeleton class="w-[300px] h-[40px]" />
    </div>
  </div>
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
            liff.closeWindow() // Close the LIFF window
          })
          .catch((error) => {
            console.error('Error sending message:', error)
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

.submit-button-wrapper{
  width: 100%;
  max-width: 350px;
  margin-top: 20px;
  display: flex;
  justify-content: center;  /* จัดปุ่มให้อยู่กลาง */
}

.submit-button{
  /* ขนาด + พื้นหลังตามที่ขอ */
  width: 257px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #D2ECC0;
  box-shadow: -4px -4px 2px 0 #CCE5BB inset, 4px 4px 2px 0 #E0F0D5 inset;

  /* โครงสร้างปุ่ม */
  border: 0;
  color: #333333;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform .06s ease, box-shadow .2s ease, filter .2s ease;
}

/* เอฟเฟกต์เล็กน้อย */
.submit-button:hover{ filter: brightness(1.02); }
.submit-button:active{
  transform: translateY(1px);
  box-shadow: -2px -2px 1px 0 #CCE5BB inset, 2px 2px 1px 0 #E0F0D5 inset;
}
.submit-button:focus-visible{
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
</style>
