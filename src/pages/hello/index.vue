<template>
  <div>
    <h1>this is hello page</h1>
    <p v-if="message">{{ message }}</p>
    <p v-if="idtoken">{{ idtoken }}</p>
    <p v-if="error">
      <code>{{ error }}</code>
    </p>
    <p v-if="user">{{ user }}</p>
    <button v-if="idtoken" @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import liff from '@line/liff'
import { initializeLiff, logout, verifyIdToken } from '../../utility/liffUtils'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      message: '',
      error: '',
      idtoken: '',
      user: '',
    }
  },
  methods: {
    logout() {
      logout()
    },
  },
  mounted() {
    console.log('Mounted')
    initializeLiff('VITE_LIFF_ID_2')
      .then(() => {
        liff
          .getProfile()
          .then((profile) => {
            this.message = `Hello, ${profile.displayName}`
          })
          .then(() => {
            this.idtoken = liff.getIDToken() || ''
            if (this.idtoken) {
              verifyIdToken(this.idtoken).then((user) => {
                this.user = user // Assign the resolved value to this.user
              })
            }
          })
      })
      .catch((err) => {
        this.error = err.message
      })
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
