<template>
  <div class="progress-nav border-1 border-neutral bg-neutral">
    <div
      class="nav-button"
      :class="{ active: activeSection === 'Diary' }"
      @click="setActiveSection('Diary')"
    >
      ดูบันทึกย้อนหลัง
    </div>
    <div
      class="nav-button"
      :class="{ active: activeSection === 'Stats' }"
      @click="setActiveSection('Stats')"
    >
      ดูสถิติที่ผ่านมา
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProgressNav',
  data() {
    return {
      activeSection: 'Diary',
    }
  },
  methods: {
    setActiveSection(section: string) {
      this.activeSection = section
      this.setSection(section)
    },
    setSection(section: string) {
      this.$emit('updateSection', section)
    },
  },
}
</script>
<style scoped>
.progress-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: full;
  height: 50px;
  align-items: center;
  border-radius: 8px;
}

.nav-button {
  padding: 10px 20px;
  border-radius: 8px;
  height: full;

  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-button.active {
  background-color: #e1e1e1d7; /* Highlight active button */
  color: rgb(64, 64, 64);
}
</style>
