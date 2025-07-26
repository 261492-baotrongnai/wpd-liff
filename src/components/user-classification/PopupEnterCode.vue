<template>
  <div class="popup-code" v-if="displayEnterCode">
    <div class="head flex">
      <img src="../../assets/user-classification/testUserIcon.svg"
      style="height:20%; width: 20%; margin-inline: auto;"/>
      <span class="flex" style="margin-inline: auto;">
        ผู้เข้าร่วมโครงการ
      </span>
    </div>
    <div v-if="!showTestTerm" class="flex flex-col">
      <button @click="$emit('close'); code='';" class="back-button">กลับ</button>
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

      <p>กดปุ่ม เพื่ออ่านข้อตกลงการใช้งาน</p>

      <p v-if="showError" class="error-message">กรุณากรอกรหัสก่อนยืนยัน</p>

      <button @click="submitCode" class="enter-code-button" :disabled="!code.trim()">
        <div class="flex"
        style="
        align-items: center;
        justify-items: center;
        text-align: center;
        color:#333;">
          <span style="margin-left: auto; font-size: 18px;">ยืนยันและไปต่อ</span>
          <UIcon name="i-lucide-arrow-right" class="size-5" style="margin-right: auto;" />
        </div>
      </button>
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
    displayEnterCode: {
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
  /* color: #393939; */
  margin-bottom: 30px;

  /* background-color: rgb(196, 244, 255); */
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: fit-content;
  align-items: center;
  justify-items: center;

  /* border-radius: 60px; */
  border-radius: 12px;
  background: #EFE6FF;
}
.text-input {
  width: 50%;
  height: 40px;
  padding: 10px;
  margin: 20px auto;
  text-align: center;

  border-radius: 12px;
  border: 2px solid #4270A3;
  background: #FFF;
}
.input-error {
  border-color: red;
  background-color: #ffe6e6;
}

.instruction {
  font-size: 16px;
  font-weight: bold;
  color: #393939;
  margin-bottom: 20px;
}
.enter-code-button {
  margin-top: 20px;
  margin-inline: auto;
  padding: 10px 20px;
  color: rgb(39, 39, 39);
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease,
    visibility 0.3s ease;
  opacity: 1;
  visibility: visible;
  border-radius: 15px;
  background: #D2ECC0;
  box-shadow: -4px -4px 2px 0px #CCE5BB inset, 4px 4px 2px 0px #E0F0D5 inset;
  width: 60%;
}
.enter-code-button:disabled {
  background-color: #ECEFF2;
  color: #ECEFF2;
  cursor: not-allowed;
  opacity: 1;
  box-shadow: -4px -4px 2px 0px #ECEFF2 inset, 4px 4px 2px 0px #ECEFF2 inset;
  /* visibility: hidden; */
}
.error-message {
  color: rgb(255, 78, 102);
  font-size: 14px;
  margin-top: 10px;
}

</style>
