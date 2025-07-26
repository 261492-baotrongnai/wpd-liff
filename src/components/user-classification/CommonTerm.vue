<template>
  <div class="flex flex-col gap-2 justify-center items-center" v-if="displayCommon">
    <button @click="$emit('close')" class="back-button">กลับ</button>
    <!-- <div>Code ของคุณ: {{ code }}</div> -->
    <div class="head flex">
      <img src="../../assets/user-classification/commonUserIcon.svg" style="height: 36px;"/>
      <p class="head-text-style">ผู้ใช้งานทั่วไป</p>
    </div>
    <div class="flex flex-col gap-2 px-8">
      <p class="term-header">
        ข้อตกลงในการใช้บริการ
      </p>

      <p class="term-detail px-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies nulla ante, non
        pretium ipsum congue et. Aliquam condimentum, eros et mollis scelerisque, leo massa tempus
        est, nec vestibulum dolor turpis ac arcu. Morbi pretium est non lectus volutpat laoreet.
        Nunc sit amet varius ante. Nullam eleifend ex ante, sodales bibendum velit rhoncus ut. Sed
        ut porta ipsum. Vestibulum quis mi vitae quam volutpat finibus. Nam congue nulla eu sodales
        ultrices. Duis ut feugiat arcu. Vivamus non eleifend arcu. Aenean eleifend sit amet erat non
        semper. Pellentesque ut arcu quis velit tincidunt dapibus. Quisque condimentum commodo
        nulla. Vivamus condimentum ut lorem at gravida.
      </p>
    </div>

    <div class="agree-bottom-bar">
      <div class="flex">
        <UCheckbox
          v-model="isAgreed"
          required
          class="gap-2 px-2"
          style="height: 25px; width: 25px;"
        />
        <div>
          <span>ฉันได้อ่านและยอมรับ</span>
          <span class="underline">ข้อตกลงในการใช้บริการ</span>
        </div>
      </div>


      <UButton
        trailing-icon="i-lucide-arrow-right"
        size="lg"
        :disabled="!isAgreed"
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
export default {
  name: 'CommonTerm',

  data() {
    return {
      isAgreed: false,
    }
  },
  props: {
    displayCommon: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    async commonSuccess() {
      const idToken = liff.getIDToken()
      console.log('Common success with ID token:', idToken)
      if (idToken) {
        const response = await register(idToken)
        if (response.type === 'NewUser')
          await liff.sendMessages([{ type: 'text', text: 'ยันยันการบันทึกผู้ใช้' }])

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
  font-size: 20px;
  color: #393939;
  margin-block: 30px;

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 60px;
  width: fit-content;

  border-radius: 12px;
  background: #DEEDFF;
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
.agree-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background-color: white; /* Optional: Add a background color */
  padding: 16px; /* Optional: Add padding for spacing */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Optional: Add a shadow for better visibility */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; /* Space between checkbox and button */
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
  color: var(--main-text, #194678);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: 0.16px;
}


</style>
