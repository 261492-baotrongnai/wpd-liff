<template>
    <img src = "../../assets/user-classification/wpdLogo.svg"
    class = "banner px-30"/>
    <!-- <img src="https://i.postimg.cc/Yq1bKt42/logo.png" class="px-30"/> -->
  <div v-if="!showEnterCode && !showCommonTerm" style="margin-top: 30px">
    <!-- <h3 class="greeting">ยินดีต้อนรับสู่ "หวานพอดี" นะคะ</h3> -->
    <span class="instruction">ก่อนเข้าใช้งาน กรุณากดเพื่อเลือกประเภทของคุณค่ะ</span>
    <div class="button-container">
        <!-- ผู้ใช้งานทั่วไป -->
        <button
        @click="selectButton('common')"
        :class="['box', 'common-user', { commonUserSelected: commonSelected }]"
        >
          <img src="../../assets/user-classification/commonUserIcon.svg"/>
          <div>
            <p class = "text-inside-classification-button">
              ผู้ใช้งานทั่วไป
            </p>
            <p class = "text-inside-classification-button" style="font-size: 16px;">
              (ไม่อยู่ในโครงการใดๆ)
            </p>
          </div>
        </button>
        <!-- ผู้เข้าร่วมโครงการกับโรงพยาบาล -->
        <button
          @click="selectButton('test')"
          :class="['box', 'test-user', { testUserSelected: testSelected }]"
          style="margin-top: 25px;"
        >
          <img src="../../assets/user-classification/testUserIcon.svg"/>
          <p class = "text-inside-classification-button">
            ผู้เข้าร่วมโครงการกับโรงพยาบาล
          </p>
        </button>
    </div>

    <div v-if="commonSelected || testSelected">
      <div v-if="commonSelected" class="next-container">
        <p class="instruction next">กดปุ่ม เพื่ออ่านข้อตกลงการใช้งาน</p>
        <button @click="showCommonTerm = true" class="next-button">
          อ่านข้อตกลง
          <UIcon name="i-lucide-arrow-right" class="size-5" />
        </button>
      </div>
      <div v-if="testSelected" class="next-container">
        <p class="instruction next">กดปุ่ม เพื่อใส่รหัสที่ได้รับมา</p>
        <button @click="showEnterCode = true" class="next-button">
          ใส่รหัส
          <UIcon name="i-lucide-arrow-right" class="size-5" />
        </button>
      </div>
    </div>

  </div>

  <!-- Use the PopupEnterCode component -->
  <PopupEnterCode :visible="showEnterCode" @close="showEnterCode = false" />

  <CommonTerm v-if="showCommonTerm" />
</template>

<script lang="ts">
import { liffInitUserClassification } from '../../services/liff.service'
// import liff from '@line/liff'
import PopupEnterCode from '../../components/user-classification/PopupEnterCode.vue'
import CommonTerm from '../../components/user-classification/CommonTerm.vue'

export default {
  name: 'UserClassification',
  components: {
    PopupEnterCode,
    CommonTerm,
  },
  data() {
    return {
      commonSelected: false,
      testSelected: false,
      showEnterCode: false,
      showCommonTerm: false,
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
  },
  mounted() {
    // liffInitUserClassification()
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
  margin-top: 20px;
  color: #194678;
  font-family: "Noto Looped Thai UI";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;

}
.next {
  width: 70%;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
  background: #D1E5FF;
  box-shadow: -6px -6px 2px 0px #C8E1FF inset, 6px 6px 2px 0px #DEEDFF inset;
}
.test-user {
  border-radius: 12px;
  background: #E0CEFF;
  box-shadow: -6px -6px 2px 0px #D5C4F0 inset, 6px 6px 2px 0px #EADEFF inset;
}
.commonUserSelected {
  border: 2px solid #96B1D4;
}
.testUserSelected {
  border: 2px solid #AB96CF;
}
.next-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.next-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: rgb(48, 48, 48);
  padding: 10px 20px;
  margin: 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  width: fit-content;

  border-radius: 15px;
  background: #D2ECC0;
  box-shadow: -4px -4px 2px 0px #CCE5BB inset, 4px 4px 2px 0px #E0F0D5 inset;
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

.text-inside-classification-button {
  color: var(--main-text, #194678);
  text-align: center;
  font-family: "Noto Looped Thai UI";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 150% */
  letter-spacing: 0.2px;
  width: 150px;
}

.banner {

  background: linear-gradient(90deg, #DDECFF 0%, #F8FFDE 100%);
  width:100%;
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
