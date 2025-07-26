<template>
  <div>
    <h1>create-liff-app</h1>
    <!-- <p v-if="message">{{ message }}</p>
    <p v-if="idtoken">{{ idtoken }}</p>
    <p v-if="error">
      <code>{{ error }}</code>
    </p>
    <p v-if="user">{{ user }}</p>
    <p v-if="access_token">access_token: {{ access_token }}</p>
    <p v-if="test_iid">test_iid: {{ test_iid }}</p> -->
    <!-- <button v-if="idtoken" @click="logout">Logout</button> -->
    <img
      src="https://wpd-bucket.sgp1.digitaloceanspaces.com/meal_images/559974204943630764.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO00KJ49KBQ6AXKZERKR%2F20250507%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20250507T071936Z&X-Amz-Expires=86400&X-Amz-Signature=da08d820d618356f12ce672be59a11b3e2e85ef0b04566f6456f6f5fab1c4a78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
      alt="LIFF"
      width="200"
      height="200"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import liff from '@line/liff'
import { initializeLiff } from '../utility/liffUtils'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      message: '',
      error: '',
      idtoken: '',
      user: '',
      access_token: '',
      test_iid: '',
    }
  },
  mounted() {
    initializeLiff('VITE_LIFF_ID')
  },
})
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
