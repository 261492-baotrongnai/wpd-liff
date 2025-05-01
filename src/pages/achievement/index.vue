<template>
  <div style="display: flex; flex-direction: column; justify-content: center">
    <div style="justify-items: center; display: flex; flex-direction: column; align-items: center">
      <div v-if="profilePic" class="profile-pic-container">
        <img :src="profilePic" alt="Profile Picture" class="profile-pic" />
      </div>
      <div v-else class="placeholder">No Image</div>

      <p v-if="username" style="margin-top: 20px">{{ username }}</p>
    </div>

    <DuoStatus :points="12" :streaks="13" />

    <!-- Buttons to trigger popups -->
    <div style="display: flex; flex-direction: row; justify-content: center; margin-top: 5px">
      <button @click="showUserFrame = true" class="popup-button">เปลี่นกรอบภาพ</button>
      <button @click="showFrameStore = true" class="popup-button">แลกแต้มสะสม</button>
    </div>

    <!-- Popup UserFrame -->
    <div v-if="showUserFrame" class="popup-overlay">
      <div class="popup-content">
        <button @click="showUserFrame = false" class="back-button">กลับ</button>
        <UserFrame />
      </div>
    </div>

    <!-- Popup FrameStore -->
    <div v-if="showFrameStore" class="popup-overlay">
      <div class="popup-content">
        <button @click="showFrameStore = false" class="back-button">กลับ</button>
        <FrameStore />
      </div>
    </div>

    <!-- Progress Coin -->
    <ProgressCoin :streaks="65" />

    <!-- Mali -->
    <Mali :streaks="10" />
  </div>
</template>

<script lang="ts">
import { initializeLiff } from '../../utility/liffUtils'
import liff from '@line/liff'
import DuoStatus from './DuoStatus.vue'
import UserFrame from './UserFrame.vue'
import FrameStore from './FrameStore.vue'
import ProgressCoin from './ProgressCoin.vue'
import Mali from './Mali.vue'

export default {
  name: 'AchievementIndex',
  components: {
    DuoStatus,
    UserFrame,
    FrameStore,
    ProgressCoin,
    Mali,
  },
  data() {
    return {
      username: '',
      profilePic: '',
      showUserFrame: false,
      showFrameStore: false,
    }
  },
  mounted() {
    initializeLiff('VITE_LIFF_ID_ACHIEVEMENT').then(() => {
      liff.getProfile().then((profile) => {
        this.username = profile.displayName
        this.profilePic = profile.pictureUrl || ''
      })
    })
  },
}
</script>

<style scoped>
.profile-pic-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgb(216, 216, 216);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.popup-button {
  margin: 10px;
  width: 150px;
  padding: 10px 20px;
  color: black;
  border: black solid 1px;
  border-radius: 50px;
  cursor: pointer;
}

.popup-button:hover {
  background-color: #a7e1e2;
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
  z-index: 1000;
}

.popup-content {
  background-color: white;
  /* padding: 20px; */
  border-radius: 10px;
  height: 100%;
  width: 100%;

  text-align: center;
  /* width: 80%; */
  /* max-width: 400px; */
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

.back-button:hover {
  color: #388e3c;
}
</style>
