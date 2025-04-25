<template>
  <div class="popup-code" v-if="visible">
    <div class="head">🧪กลุ่มทดสอบ</div>
    <div v-if="!showTestTerm" class="flex flex-col">
      <button @click="$emit('close')" class="back-button">กลับ</button>
      <p class="instruction">
        หากคุณเข้าร่วมโครงการกับโรงพยาบาลหรือเจ้าหน้าที่ <br />
        กรุณากรอกรหัสที่ได้รับไว้ตรงนี้เลยนะคะ☺️
      </p>

      <input
        type="text"
        placeholder="ใส่โค้ดที่นี่"
        v-model="code"
        :class="{ 'text-input': true, 'input-error': showError }"
      />

      <p v-if="showError" class="error-message">กรุณากรอกรหัสก่อนยืนยัน</p>

      <button @click="submitCode" class="enter-code-button" :disabled="!code.trim()">ยืนยัน</button>
    </div>

    <TestTerm v-if="showTestTerm" :code="code" @close="showTestTerm = false" />
  </div>
</template>

<script lang="ts">
import TestTerm from './TestTerm.vue'
export default {
  name: 'PopupEnterCode',
  components: {
    TestTerm,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      code: '',
      showError: false,
      showTestTerm: false,
    }
  },
  methods: {
    submitCode() {
      if (!this.code.trim()) {
        this.showError = true
        return
      }
      this.showError = false
      this.showTestTerm = true
    },
  },
}
</script>

<style scoped>
.popup-code {
  padding-top: 30px;
  background-color: white;
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.head {
  font-size: 20px;
  color: #393939;
  margin-bottom: 30px;

  background-color: rgb(196, 244, 255);
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 60px;
  width: fit-content;
}
.text-input {
  width: 50%;
  height: 40px;
  padding: 10px;
  margin: 20px auto;
  border-radius: 2px;
  border: 1px solid #828282;
  text-align: center;
}
.input-error {
  border-color: red;
  background-color: #ffe6e6;
}
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  color: #4caf50;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.instruction {
  font-size: 16px;
  font-weight: bold;
  color: #393939;
  margin-bottom: 20px;
}
.enter-code-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #c7f18f;
  color: rgb(39, 39, 39);
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease,
    visibility 0.3s ease;
  opacity: 1;
  visibility: visible;
}
.enter-code-button:disabled {
  background-color: #ccc;
  color: #999;
  cursor: not-allowed;
  opacity: 0;
  visibility: hidden;
}
.error-message {
  color: rgb(255, 78, 102);
  font-size: 14px;
  margin-top: 10px;
}
</style>
