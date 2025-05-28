<template>
  <div v-if="!loading" class="menu-input">
    <div class="input-candidates">
      <p class="instruction text-balance text-center">
        เลือกเมนู 1 อย่างเพื่อแก้ไขเพิ่มเติม
        <br />
        หรือถ้ายังไม่ตรงใจ สามารถพิมพ์ชื่อเมนูใหม่ใน
        <br />
        กล่องข้อความด้านล่างได้เลยค่ะ
      </p>

      <!-- 2x2 Candidate Grid -->
      <div v-if="candidates.length" class="candidates-grid">
        <div
          v-for="(candidate, index) in candidates.slice(0, 4)"
          :key="index"
          class="candidate-box"
          @click="selectCandidate(candidate)"
        >
          {{ candidate }}
        </div>
        <!-- Fill empty boxes if less than 4 candidates -->
        <div
          v-for="n in 4 - Math.min(candidates.length, 4)"
          :key="'empty-' + n"
          class="candidate-box empty"
        ></div>
      </div>
    </div>

    <div class="input-container">
      <div class="flex flex-row gap-2">
        <div class="flex-1">
          <div class="flex flex-row gap-2 mb-2 items-center">
            <UIcon name="i-lucide-pencil" class="size-8" />
            <p class="w-full">ชื่อเมนูที่ถูกต้อง</p>
            <div
              id="character-count"
              class="text-xs text-muted tabular-nums w-full text-right px-2"
              aria-live="polite"
              role="status"
            >
              {{ value?.length }}/{{ maxLength }}
            </div>
          </div>

          <UTextarea
            v-model="value"
            :rows="1"
            :maxlength="maxLength"
            :autoresize="true"
            :color="'info'"
            :size="'xl'"
            aria-describedby="character-count"
            placeholder="เช่น ส้มตำ, ข้าวต้มกุ้ง"
            class="max-h-fit w-full"
          >
          </UTextarea>
        </div>
        <div class="flex-none content-end">
          <UButton
            icon="i-lucide-trash"
            size="md"
            color="error"
            variant="outline"
            class="max-h-[30px]"
            @click="clearTextarea"
          >
            ลบทั้งหมด
          </UButton>
        </div>
      </div>

      <button @click="sendMenu" class="submit-button">บันทึก</button>
    </div>
  </div>
  <div v-else class="flex flex-col gap-2">
    <div class="flex flex-col mt-4 gap-2 justify-center items-center">
      <USkeleton class="w-[250px] h-[20px]" />
      <USkeleton class="w-[300px] h-[20px]" />
      <USkeleton class="w-[250px] h-[20px]" />
    </div>
    <div class="flex flex-col gap-2 justify-center items-center">
      <div class="flex flex-row gap-2 mb-2 items-center">
        <USkeleton class="w-[150px] h-[80px]" />
        <USkeleton class="w-[150px] h-[80px]" />
      </div>
      <div class="flex flex-row gap-2 mb-2 items-center">
        <USkeleton class="w-[150px] h-[80px]" />
        <USkeleton class="w-[150px] h-[80px]" />
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-center items-center m-4">
      <div class="flex flex-row gap-2">
        <div class="flex flex-col gap-2 justify-start">
          <USkeleton class="w-[100px] h-[20px]" />
          <USkeleton class="w-[300px] h-[30px]" />
        </div>
        <div class="content-end">
          <USkeleton class="w-[80px] h-[30px]" />
        </div>
      </div>
      <USkeleton class="w-[300px] h-[40px]" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { getMenuCandidates } from '../../services/menuinput.service'
import liff from '@line/liff'
import { initializeLiff } from '../../services/liff.service'

export default {
  name: 'MenInput',
  data() {
    return {
      menu_name: '',
      candidates: [] as string[],
      loading: true,
      value: ref(''),
      maxLength: 200,
    }
  },

  methods: {
    selectCandidate(candidate: string) {
      // Insert the selected candidate into the textarea
      this.value = candidate
      this.menu_name = candidate
    },

    clearTextarea() {
      // Clear the textarea content
      this.value = ''
      this.menu_name = ''
    },

    sendMenu() {
      // Use value from textarea (v-model)
      const menuText = this.value || this.menu_name

      if (menuText.trim()) {
        console.log('Sending menu name:', menuText)
        liff
          .sendMessages([
            {
              type: 'text',
              text: `${menuText}`,
            },
          ])
          .then(() => {
            console.log('Message sent successfully')
            this.value = '' // Clear the input field after sending
            this.menu_name = ''
            liff.closeWindow() // Close the LIFF window
          })
          .catch((error) => {
            console.error('Error sending message:', error)
          })
      } else {
        console.error('Menu name cannot be empty')
      }
    },
  },

  watch: {
    // Sync the v-model value with menu_name
    value(newValue) {
      this.menu_name = newValue
    },
  },

  async mounted() {
    await initializeLiff('VITE_LIFF_ID_MENU_INPUT')
    await getMenuCandidates().then((candidates) => {
      this.candidates = candidates
    })
    this.loading = false
  },
}
</script>

<style>
.instruction {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.label {
  display: flex;
  flex-direction: row;
  gap: 10px;
  font-size: 16px;
  margin-bottom: 5px;
}

/* 2x2 Grid for candidates */
.candidates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
  max-width: 100%;
}

.candidate-box {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  hyphens: auto;
}

.candidate-box:hover {
  background-color: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.candidate-box:active {
  transform: translateY(0);
  background-color: #bbdefb;
}

.candidate-box.empty {
  background-color: transparent;
  border: 2px dashed #dee2e6;
  cursor: default;
}

.candidate-box.empty:hover {
  background-color: transparent;
  border-color: #dee2e6;
  transform: none;
  box-shadow: none;
}

.input-container {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.submit-button {
  background-color: #3dd54a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-inline: 10%;
  margin-top: 30px;
  height: 50px;
  text-align: center;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #2dc540;
}

.submit-button:active {
  background-color: #28b138;
}

/* Remove old candidate list styles */
.candidates-list {
  display: none;
}
</style>
