<template>
  <div class="popup-code" v-if="visible && !showTestTerm">
    <div class="back-button-box">
      <button @click="$emit('close')" class="back-button">
        <PhCaretLeft size="24" />
        <span>กลับ</span>
      </button>
    </div>
    <div class="head flex">
      <img src="../../assets/user-classification/testUserIcon.svg" style="height: 36px" />
      <p class="head-text-style">ผู้เข้าร่วมโครงการ</p>
    </div>
    <div v-if="!showTestTerm" class="flex flex-col">
      <p class="instruction">
        หากเข้าร่วมโครงการกับโรงพยาบาล<br />
        กรุณากรอกรหัสที่ได้รับไว้ตรงนี้ได้เลยนะคะ
      </p>
      <div class="input-container">
        <input
          type="text"
          placeholder="กรุณากรอกรหัส เช่น ABC-123"
          v-model="code"
          :class="{ 'text-input': true, 'input-error': showError }"
          maxlength="7"
          @input="formatCode"
        />
        <p class="error-message" v-show="!!showError || codeError">{{ showError }}</p>
      </div>

      <button @click="submitCode" class="enter-code-button" :disabled="!code.trim()">ยืนยัน</button>
    </div>
  </div>
</template>

<script lang="ts">
import { apiService } from '@/services/api.service'
import { PhCaretLeft } from '@phosphor-icons/vue'
export default {
  name: 'PopupEnterCode',
  components: {
    PhCaretLeft,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    codeError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      code: '',
      showError: '',
      showTestTerm: false,
    }
  },
  methods: {
    async submitCode() {
      const codeParts = this.code.split('-')
      const firstPart = codeParts[0]
      const secondPart = codeParts[1]

      const firstIsAlpha = /^[A-Z]{3}$/.test(firstPart)
      const secondIsNum = /^[0-9]{3}$/.test(secondPart)

      if (!firstIsAlpha && !secondIsNum) {
        this.showError = 'กรุณากรอกตัวอักษร 3 ตัว และตัวเลข 3 ตัว เช่น ABC-123'
        return
      }
      if (!firstIsAlpha) {
        this.showError = 'กรุณากรอก 3 ตัวแรกเป็นตัวอักษรภาษาอังกฤษเท่านั้น'
        return
      }
      if (!secondIsNum) {
        this.showError = 'กรุณากรอก 3 ตัวสุดท้ายเป็นตัวเลขเท่านั้น'
        return
      }
      this.showError = ''

      // แก้ไข: เพิ่ม method สำหรับจัดการรหัสที่ป้อนเข้ามา หลังจากกดปุ่มยืนยัน

      // this.enteredCode = code
      // this.showEnterCode = false
      await apiService
        .get('/programs/validate-code', { params: { code: this.code } })
        .then(() => {
          this.$emit('showTestTerm')
        })
        .catch((error) => {
          console.error('Error validating code อิอิ:', error)
          this.showError = 'ไม่มีโครงการนี้' // แสดงข้อความแสดงข้อผิดพลาด
          this.$emit('showTestTerm') // เดี๋ยวมาแก้ไข
        })
    },
    handleTestTermClose() {
      this.showTestTerm = false
      this.$emit('reopen-code')
    },
    resetState() {
      this.code = ''
      this.showError = ''
      this.showTestTerm = false
    },
    formatCode(e: Event) {
      const target = e.target as HTMLInputElement
      let val = target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
      val = val.slice(0, 6)
      const part1 = val.slice(0, 3)
      const part2 = val.slice(3, 6)
      let formatted = part1
      if (part2.length > 0) formatted += '-' + part2
      this.code = formatted
      this.showError = ''
    },
    handleCodeError(isError: boolean) {
      if (isError) {
        this.showError = 'ไม่มีโครงการนี้'
        this.showTestTerm = false
      } else {
        this.showError = ''
        this.showTestTerm = true
      }
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) this.resetState()
    },
  },
  mounted() {
    console.log('PopupEnterCode mounted')
    // this.showError = localStorage.getItem('validationError') || ''
  },
}
</script>

<style scoped>
.popup-code {
  position: fixed; /* เพิ่มตรงนี้เพื่อให้ทับทั้งหน้าจอ */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999; /* ให้สูงกว่า element ปกติ */
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
}

.head {
  margin-top: 26px; /* ✅ center ทั้งซ้าย-ขวา */
  padding: 12px 10px;
  border-radius: 12px;
  background: #efe6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 9px;
}
.head-text-style {
  color: #194678;
  text-align: center;

  /* H3 */
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px; /* 145.455% */
  letter-spacing: 0.22px;
}
.text-input {
  width: 280px;
  height: 45px;
  padding: 10px;
  margin: auto;
  margin-top: 31px;
  border-radius: 12px;
  border: 1px solid #eceff2;
  text-align: center;
  background: #fff;
  transition:
    background 0.2s,
    border 0.2s;

  font-size: 18px;
  font-family: 'Noto Looped Thai UI';
  font-weight: 400;
  color: #333333;
}
.input-error {
  border-color: red;
  background-color: #ffe6e6;
}
.text-input::placeholder {
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
.text-input:focus {
  border: 2px solid #4270a3; /* เปลี่ยนเป็นสีที่ต้องการ เช่น เขียวอ่อน */
  outline: none; /* ลบขอบสีฟ้าอัตโนมัติของ browser */
}
.back-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px; /* หรือ 2px ถ้าต้องการให้แน่นยิ่งขึ้น */
  color: #194678;
  font-size: 18px;
}

.back-button-box {
  align-self: flex-start;
  margin-top: 10px;
  padding-left: 13px;
}
.instruction {
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
  color: #194678;
  margin-top: 24px;
}
.enter-code-button {
  margin: 20px auto 0 auto; /* margin-top: 20px; margin ซ้ายขวา auto */
  display: block;
  padding: 10px 20px;
  color: #333;
  text-align: center;
  /* button1 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0 #cce5bb inset,
    4px 4px 2px 0 #e0f0d5 inset;
  width: 184px;
  height: 55px;
  flex-shrink: 0;
  opacity: 1;
  visibility: visible;
}
.enter-code-button:disabled {
  opacity: 0;
  visibility: hidden;
}
.input-container {
  width: 280px;
  margin: 0 auto;
  min-height: 115px; /* ป้องกัน error ดันปุ่มลงมา */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-message {
  color: rgb(255, 78, 102);
  font-size: 16px;
  text-align: center;
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
  /* ✅ บังคับให้แสดงแค่ 1 บรรทัด */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 22px; /* ✅ ความสูงคงที่ */
  line-height: 22px;
}
.error-message[style*='display: none'] {
  opacity: 0;
}
</style>
