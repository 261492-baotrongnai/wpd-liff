<template>
  <div class="page-wrapper">
    <!-- ส่วนบน -->
    <div class="header-section">
      <div class="back-button-box">
        <button @click="$emit('close')" class="back-button">
          <PhCaretLeft size="24" />
          <span>กลับ</span>
        </button>
      </div>

      <div class="head flex">
        <img src="../../assets/user-classification/commonUserIcon.svg" style="height: 36px" />
        <p class="head-text-style">ผู้ใช้งานทั่วไป</p>
      </div>

      <p class="term-header">ข้อตกลงในการใช้บริการ</p>
    </div>

    <!-- กล่อง scroll ได้ -->
    <div class="term-detail-bg">
      <div class="term-detail">
        <p class="term-paragraph"><strong>วันที่มีผลบังคับใช้:</strong> 1 เมษายน 2568</p>
        <p class="term-paragraph">
          กรุณาอ่านข้อกำหนดในการให้บริการต่อไปนี้อย่างละเอียดก่อนการใช้งานบริการของเรา
          การเข้าใช้งานหรือใช้บริการถือว่าคุณยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดเหล่านี้<br /><br />
        </p>

        <p class="term-paragraph"><strong class="highlight">1. การใช้บริการ</strong><br /></p>
        <p class="term-paragraph">
          ผู้ใช้ต้องมีอายุอย่างน้อย 18 ปี หรือได้รับความยินยอมจากผู้ปกครองในการใช้งาน<br />
          คุณตกลงว่าจะใช้บริการอย่างถูกต้องตามกฎหมาย และไม่กระทำการใด ๆ
          ที่อาจก่อให้เกิดความเสียหายต่อระบบหรือบุคคลอื่น<br /><br />
        </p>
        <p class="term-paragraph"><strong class="highlight">2. บัญชีผู้ใช้งาน</strong><br /></p>
        <p class="term-paragraph">
          คุณอาจต้องลงทะเบียนบัญชีเพื่อเข้าใช้งานบางส่วนของบริการ
          คุณมีหน้าที่รับผิดชอบในการเก็บรักษาข้อมูลการเข้าสู่ระบบของคุณให้ปลอดภัย
          และรับผิดชอบต่อการใช้งานใด ๆ ที่เกิดขึ้นภายใต้บัญชีของคุณ<br /><br />
        </p>
        <p class="term-paragraph"><strong class="highlight">3. ความเป็นส่วนตัว</strong><br /></p>
        <p class="term-paragraph">
          การใช้งานบริการของคุณอยู่ภายใต้นโยบายความเป็นส่วนตัวของเรา
          กรุณาศึกษานโยบายดังกล่าวเพื่อทราบวิธีที่เรารวบรวม ใช้ และเก็บรักษาข้อมูลของคุณ<br /><br />
        </p>
        <p class="term-paragraph">
          <strong class="highlight">4. การเปลี่ยนแปลงบริการ</strong><br />
        </p>
        <p class="term-paragraph">
          เราอาจปรับปรุง เปลี่ยนแปลง
          หรือระงับบริการทั้งหมดหรือบางส่วนโดยไม่ต้องแจ้งให้ทราบล่วงหน้า<br /><br />
        </p>
        <p class="term-paragraph"><strong class="highlight">5. การยกเลิกบัญชี</strong><br /></p>
        <p class="term-paragraph">
          เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของคุณหากตรวจพบว่าคุณละเมิดข้อกำหนดเหล่านี้<br /><br />
        </p>
        <p class="term-paragraph">
          หากคุณมีคำถามเกี่ยวกับข้อกำหนดเหล่านี้ กรุณาติดต่อเราได้ที่ wanpordee@gmail.com
        </p>
      </div>
    </div>

    <!-- ปุ่มด้านล่าง -->
    <div class="agree-row">
      <UCheckbox v-model="isAgreed" required size="xl" />
      <label class="checkbox-text">
        ฉันได้อ่านและยอมรับ <span class="underline">ข้อตกลงในการใช้บริการ</span>
      </label>
    </div>

    <div class="agree-button-container">
      <UButton
        trailing-icon="i-lucide-arrow-right"
        size="xl"
        :disabled="!isAgreed"
        :style="{
          backgroundColor: isAgreed ? '#D2ECC0' : '#ECEFF2 !important',
          boxShadow: isAgreed
            ? '4px 4px 2px 0 #E0F0D5 inset, -4px -4px 2px 0 #CCE5BB inset'
            : 'none',
        }"
        class="text-[18px] text-[#333333]"
        @click="commonSuccess"
      >
        เข้าใช้งานได้เลย
      </UButton>
    </div>
  </div>
</template>

<script lang="ts">
import { register } from '../../services/liff.service'
import liff from '@line/liff'
import { PhCaretLeft } from '@phosphor-icons/vue'
export default {
  components: { PhCaretLeft },
  name: 'CommonTerm',

  data() {
    return {
      isAgreed: false,
    }
  },
  methods: {
    async commonSuccess() {
      const idToken = liff.getIDToken()
      console.log('Common success with ID token:', idToken)
      if (idToken) {
        const response = await register(idToken)
        if (response.type === 'NewUser')
          await liff.sendMessages([{ type: 'text', text: 'ยืนยันการบันทึกผู้ใช้' }])

        liff.closeWindow()
      } else {
        console.error('ID token is null')
      }
    },
  },
}
</script>

<style scoped>
.head {
  margin: 17px auto; /* ✅ center ทั้งซ้าย-ขวา */
  padding: 12px 10px;
  border-radius: 12px;
  background: #deedff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
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

.underline {
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
}

.term-header {
  color: #194678;
  text-align: left;

  /* Paragraph2 */
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}

.term-detail {
  color: #194678;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: 0.16px;
}

.term-detail-bg {
  flex: 1; /* ยืดเต็มพื้นที่ที่เหลือ */
  min-height: 0;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 5px;
  margin-bottom: 12px;
  margin-right: 20px;
  margin-left: 20px;
  padding: 16px 16px 16px 16px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
}

.back-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #194678;
  font-size: 18px;
}

.back-button-box {
  align-self: flex-start;
  margin-top: 10px;
}

.term-paragraph {
  text-indent: 2em; /* ย่อบรรทัดแรก */
  line-height: 1.6;
  color: #194678;
  font-size: 16px;
  font-family: 'Noto Looped Thai UI';
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header-section {
  padding: 13px;
}

.highlight {
  font-weight: 700;
  color: #194678;
}

.agree-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
  text-align: left;
  margin-top: 10px;
}

.agree-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px 20px 20px;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
}

.checkbox-text {
  font-size: 16px;
  color: #194678;
  font-family: 'Noto Looped Thai UI';
  line-height: 1.5;
  white-space: normal; /* ให้ข้อความยืดหลายบรรทัดถ้าจอแคบ */
  word-break: break-word;
  max-width: 80%;
}

p {
  font-family: 'Noto Looped Thai UI';
}

span {
  font-family: 'Noto Looped Thai UI';
}
</style>
