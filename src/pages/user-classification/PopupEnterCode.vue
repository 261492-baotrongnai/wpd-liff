<template>
  <div class="popup-overlay" v-if="visible">
    <div class="popup-content">
      <div class="head">🧪กลุ่มทดสอบ</div>
      <button @click="$emit('close')" class="back-button">กลับ</button>
      <p class="instruction">
        หากคุณเข้าร่วมโครงการกับโรงพาบาลหรือเจ้าหน้าที่ <br />
        กรุณากรอกรหัสที่ได้รับไว้ตรงนี้เลยนะคะ☺️
      </p>

      <input type="text" placeholder="ใส่โค้ดที่นี่" v-model="code" class="text-input" />

      <!-- Terms & Service Checkbox -->
      <div class="terms-container">
        <input type="checkbox" id="terms" v-model="agreedToTerms" />
        <label for="terms">ฉันยอมรับ <a href="#">ข้อกำหนดและเงื่อนไข</a></label>
      </div>

      <button @click="submitCode" class="next-button test-user">ยืนยัน</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PopupEnterCode',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      code: '',
      agreedToTerms: false,
    }
  },
  methods: {
    submitCode() {
      if (this.agreedToTerms) {
        this.$emit('submit', this.code)
      }
    },
  },
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-content {
  padding-top: 50px;
  position: fixed;
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
  margin-bottom: 70px;

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
.terms-container {
  margin: 20px 0;
  font-size: 14px;
  color: #393939;
}
.terms-container input {
  margin-right: 10px;
}
.terms-container a {
  color: #2196f3;
  text-decoration: none;
}
.terms-container a:hover {
  text-decoration: underline;
}
.next-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.next-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
