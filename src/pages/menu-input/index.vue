<template>
  <div class="menu-input">
    <div class="input-candidates">
      <p class="instruction">กรุณาเลือกเมนูอาหารที่ต้องการบันทึก</p>
      <div v-if="candidates.length" class="candidates-list">
        <ul>
          <li v-for="(candidate, index) in candidates" :key="index">
            {{ candidate }}
          </li>
        </ul>
      </div>
    </div>
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
import { getMenuCandidates } from '@/pages/menu-input/menuUtils'
import liff from '@line/liff'
export default {
  name: 'MenInput',
  data() {
    return {
      menu_name: '',
      candidates: [],
    }
  },

  methods: {
    sendMenu() {
      if (this.menu_name.trim()) {
        console.log('Sending menu name:', this.menu_name)
        liff
          .sendMessages([
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
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id) {
      console.error('ID parameter is missing in the URL')
      return
    }
    getMenuCandidates(id).then((candidates) => {
      this.candidates = candidates
    })
  },
}
</script>

<style></style>
