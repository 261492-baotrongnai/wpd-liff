<template>
  <h3 class="greeting">ยินดีต้อนรับสู่ "หวานพอดี" นะคะ</h3>
  <span class="instruction">ก่อนเข้าใช้งาน กรุณากดเพื่อเลือกประเภทของคุณค่ะ</span>
  <div class="button-container">
    <button
      @click="selectButton('common')"
      :class="['box', 'common-user', { selected: commonSelected }]"
    >
      ผู้ใช้งานทั่วไป
    </button>
    <button @click="selectButton('test')" :class="['box', 'test-user', { selected: testSelected }]">
      กลุ่มทดสอบ
    </button>
  </div>

  <div v-if="commonSelected" class="next-container">
    <p class="instruction next">ข้อมูลของคุณจะถูกเก็บเป็นส่วนตัว</p>
    <button @click="commonSuccess" class="next-button common-user">เข้าใช้งานได้เลย !</button>
  </div>
  <div v-if="testSelected" class="next-container">
    <p class="instruction next">ผู้ดูแลระบบจะสามารถดูข้อมูลการบันทึกเพื่อติดตามและพัฒนาระบบได้</p>
    <button @click="showEnterCode = true" class="next-button test-user">ใส่โค้ด</button>
  </div>

  <!-- Use the PopupEnterCode component -->
  <PopupEnterCode :visible="showEnterCode" @close="showEnterCode = false" @submit="enterCode" />
</template>

<script lang="ts">
import { initializeLiff } from '../../utility/liffUtils'
import liff from '@line/liff'
import PopupEnterCode from './PopupEnterCode.vue'

export default {
  name: 'UserClassification',
  components: {
    PopupEnterCode,
  },
  data() {
    return {
      commonSelected: false,
      testSelected: false,
      showEnterCode: false,
    }
  },
  methods: {
    selectButton(type: string) {
      if (type === 'common') {
        this.commonSelected = true
        this.testSelected = false
      } else if (type === 'test') {
        this.commonSelected = false
        this.testSelected = true
      }
    },
    enterCode(code: string) {
      console.log('Code entered:', code)
      // Add navigation logic here
    },
    commonSuccess() {
      liff.closeWindow()
    },
  },
  mounted() {
    initializeLiff('VITE_LIFF_ID_USER_CLASSIFICATION')
      .then(() => {})
      .catch((err) => {
        console.error(err.message)
      })
  },
}
</script>
<style scoped>
.greeting {
  text-align: center;
  font-size: 20px;
  margin: 10px 0;
  color: #333;
  padding: 10px;
  background: #e9fea9;
  border-radius: 28px;
}
.instruction {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
  color: #666;
}
.next {
  width: 70%;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.box {
  color: rgb(49, 49, 49);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 2px 2px;
  cursor: pointer;
  border-radius: 12px;
  border: white solid 1px;
  height: 200px;
  width: 200px;
  transition: border 0.3s ease;
}
.common-user {
  background-color: #d8f4ae;
}
.test-user {
  background-color: #9be6e6;
}
.selected {
  border: black solid 1px;
}
.next-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.next-button {
  color: rgb(48, 48, 48);
  padding: 10px 20px;
  margin: 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}
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
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  text-align: center;
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
</style>
