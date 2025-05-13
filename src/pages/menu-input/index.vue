<template>
  <div class="menu-input">
    <h2 class="header">บันทึกเมนูอาหาร</h2>
    <div class="input-container">
      <input
        type="text"
        v-model="menu_name"
        placeholder="กรุณากรอกชื่อเมนูอาหาร"
        class="text-input"
      />
      <button @click="sendMenu" class="submit-button">บันทึก</button>
    </div>
  </div>
</template>

<script lang="ts">
import { liffInitMenuInput } from '@/utility/liffUtils'
import liff from '@line/liff'
export default {
  name: 'MenInput',
  data() {
    return {
      menu_name: '',
    }
  },

  methods: {
    sendMenu() {
      if (this.menu_name.trim()) {
        console.log('Sending menu name:', this.menu_name)
        liff.sendMessages([
          {
            type: 'text',
            text: `${this.menu_name}`,
          },
        ])
          .then(() => {
            console.log('Message sent successfully')
            this.menu_name = '' // Clear the input field after sending
          })
          .catch((error) => {
            console.error('Error sending message:', error)
          })

      } else {
        console.error('Menu name cannot be empty')
      }
    },
  },
  mounted() {
    liffInitMenuInput()
  },
}
</script>

<style></style>
