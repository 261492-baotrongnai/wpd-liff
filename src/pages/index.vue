<template>
  <div>
    <h1>create-liff-app</h1>
    <p v-if="message">{{ message }}</p>
    <p v-if="idtoken">{{ idtoken }}</p>
    <p v-if="error">
      <code>{{ error }}</code>
    </p>
    <p v-if="user">{{ user }}</p>
    <p v-if="access_token">access_token: {{ access_token }}</p>
    <p v-if="test_iid">test_iid: {{ test_iid }}</p>
    <!-- <button v-if="idtoken" @click="logout">Logout</button> -->
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
