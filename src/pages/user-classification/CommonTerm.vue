<template>
  <div class="flex flex-col gap-2 justify-center items-center">
    <!-- <div>Code ของคุณ: {{ code }}</div> -->
    <div class="head">👤ผู้ใช้งานทั่วไป</div>
    <div class="flex flex-col gap-2 px-8">
      <p class="text-left">ข้อตกลงในการใช้บริการ</p>

      <p class="px-4 text-left">
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
      <UCheckbox
        v-model="isAgreed"
        required
        label="ฉันได้อ่านและยอมรับ ข้อตกลงในการใช้บริการ"
        class="gap-2"
      />

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
  methods: {
    async commonSuccess() {
      const idToken = liff.getIDToken()
      console.log('Common success with ID token:', idToken)
      if (idToken) {
        await register(idToken)
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

  background-color: #e9fea9;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 60px;
  width: fit-content;
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
</style>
