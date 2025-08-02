<template>
  <div class="page-bg">
    <div class="banner" v-if="!showEnterCode && !showCommonTerm && !showTestTerm">
      <img
        src="https://wpd-bucket.sgp1.cdn.digitaloceanspaces.com/assets/wpdLogo.png"
        class="logo-img"
        alt="WanPorDee Logo"
      />
    </div>
    <div class="content-wrapper">
      <!-- <img src="https://i.postimg.cc/Yq1bKt42/logo.png" class="px-30"/> -->
      <div v-if="!showEnterCode && !showCommonTerm && !showTestTerm">
        <div class="instruction">
          ก่อนเข้าใช้งาน <br />
          กรุณากดเพื่อเลือกประเภทของคุณค่ะ
        </div>
        <div class="button-container">
          <!-- ผู้ใช้งานทั่วไป -->
          <button
            @click="selectButton('common')"
            :class="['box', 'common-user', { commonUserSelected: commonSelected }]"
          >
            <img src="../../assets/user-classification/commonUserIcon.svg" />
            <div>
              <p class="text-inside-classification-button" style="font-size: 20px">
                ผู้ใช้งานทั่วไป
              </p>
              <p
                class="text-inside-classification-button nowrap"
                style="font-size: 16px; margin-top: 4px"
              >
                (ไม่อยู่ในโครงการใดๆ)
              </p>
            </div>
          </button>
          <!-- ผู้เข้าร่วมโครงการกับโรงพยาบาล -->
          <button
            @click="selectButton('test')"
            :class="['box', 'test-user', { testUserSelected: testSelected }]"
            style="margin-top: 20px"
          >
            <img
              src="../../assets/user-classification/testUserIcon.svg"
              style="margin-right: 5px"
            />
            <div class="text-wrapper">
              <p class="text-inside-classification-button" style="font-size: 20px">
                ผู้เข้าร่วมโครงการ
              </p>
              <p
                class="text-inside-classification-button nowrap"
                style="font-size: 20px; margin-top: 4px"
              >
                กับโรงพยาบาล
              </p>
            </div>
          </button>
        </div>

        <div class="next-section">
          <div v-show="commonSelected" class="next-container">
            <div class="instruction next nowrap">กดปุ่ม เพื่ออ่านข้อตกลงการใช้งาน</div>
            <button @click="showCommonTerm = true" class="next-button">
              อ่านข้อตกลง
              <UIcon name="i-lucide-arrow-right" class="size-5" />
            </button>
          </div>

          <div v-show="testSelected" class="next-container">
            <div class="instruction next nowrap">กดปุ่ม เพื่อใส่รหัสที่ได้รับมา</div>
            <button @click="showEnterCode = true" class="next-button">
              ใส่รหัส
              <UIcon name="i-lucide-arrow-right" class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- แก้ไข: เพิ่ม @code-entered event handler -->
    <PopupEnterCode
      :visible="showEnterCode"
      :codeError="showEnterCodeError"
      @close="handlePopupClose"
      @code-entered="handleCodeEntered"
      @showTestTerm="handleShowTestTerm"
    />

    <TestTerm v-if="showTestTerm" :code="enteredCode" @close="handleTestTermClose" />
    <CommonTerm v-if="showCommonTerm" @close="handleCommonTermClose" />
  </div>
</template>

<script lang="ts">
import { liffInitUserClassification } from '../../services/liff.service'
// import liff from '@line/liff'
import PopupEnterCode from '../../components/user-classification/PopupEnterCode.vue'
import CommonTerm from '../../components/user-classification/CommonTerm.vue'
import TestTerm from '../../components/user-classification/TestTerm.vue'
export default {
  name: 'UserClassification',
  components: {
    PopupEnterCode,
    CommonTerm,
    TestTerm,
  },
  data() {
    return {
      commonSelected: false,
      testSelected: false,
      showEnterCode: false,
      showCommonTerm: false,
      showTestTerm: false,
      enteredCode: '',
      showEnterCodeError: false,
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

    // แก้ไข: เพิ่ม method สำหรับจัดการรหัสที่ป้อนเข้ามา หลังจากกดปุ่มยืนยัน
    async handleCodeEntered(code: string) {
      this.enteredCode = code
    },

    handlePopupClose() {
      this.showEnterCode = false
      // ไม่ต้อง reset showTestTerm และ showCommonTerm ที่นี่
    },

    handleTestTermClose() {
      this.showTestTerm = false
      this.showEnterCode = true
    },

    handleCommonTermClose() {
      this.showCommonTerm = false
      // กลับไปสถานะเริ่มต้น
      this.resetAllStates()
    },

    // แก้ไข: เพิ่ม method สำหรับ reset state
    resetAllStates() {
      this.commonSelected = false
      this.testSelected = false
      this.showEnterCode = false
      this.showCommonTerm = false
      this.showTestTerm = false
      this.enteredCode = ''
    },

    handleShowTestTerm() {
      this.showTestTerm = true
      this.showEnterCode = false
    },
  },
  mounted() {
    // liffInitUserClassification()
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
  justify-content: center;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 480px;
  width: 100%;
  margin: auto;
}
.greeting {
  text-align: center;
  font-size: 20px;
  margin: 10px 0;
  color: #333;
  padding: 10px;
  background: #e9fea9;
  border-radius: 28px;
}
@media (max-height: 640px) {
  .next-section {
    min-height: 100px;
  }
}
@media (min-height: 641px) {
  .next-section {
    min-height: 140px;
  }
}
.instruction {
  text-align: center;
  color: #194678;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
  display: block;
}
.next {
  width: 100%;
}

.instruction.nowrap {
  white-space: nowrap;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 27px;
  margin-bottom: 37px;
  flex-direction: column;
  align-items: center;
}
.box {
  color: rgb(49, 49, 49);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 2px 2px;
  cursor: pointer;
  border-radius: 12px;
  border: white solid 1px;
  height: 120px;
  width: 300px;
  transition: border 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.common-user {
  border-radius: 12px;
  background: #d1e5ff;
  box-shadow:
    -6px -6px 2px 0px #c8e1ff inset,
    6px 6px 2px 0px #deedff inset;
}
.test-user {
  border-radius: 12px;
  background: #e0ceff;
  box-shadow:
    -6px -6px 2px 0px #d5c4f0 inset,
    6px 6px 2px 0px #eadeff inset;
}
.commonUserSelected {
  border: 2px solid #96b1d4;
}
.testUserSelected {
  border: 2px solid #ab96cf;
}
.next-container {
  min-height: 100px; /* ป้องกันความสูงเปลี่ยน */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: opacity 0.3s ease;
}

[v-show='false'] {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.next-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: rgb(48, 48, 48);
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  width: fit-content;

  border-radius: 15px;
  background: #d2ecc0;
  box-shadow:
    -4px -4px 2px 0px #cce5bb inset,
    4px 4px 2px 0px #e0f0d5 inset;
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

.text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-inside-classification-button {
  color: var(--main-text, #194678);
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 150% */
  letter-spacing: 0.2px;
  width: 170px;
}

.text-inside-classification-button.nowrap {
  white-space: nowrap;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #ddecff 0%, #f8ffde 100%);
  width: 100vw;
  max-width: 100vw;
  height: 85px;
}

.logo-img {
  background: transparent;
  width: 148px;
  height: 65px;
  object-fit: contain;
}
</style>
