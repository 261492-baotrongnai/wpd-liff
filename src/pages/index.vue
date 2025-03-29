<template>
  <div>
    <h1>create-liff-app</h1>
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
import { initializeLiff } from '@/utility/liffUtils'
import axios from 'axios'

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
    async verifyIdToken(idtoken: string) {
      try {
        const response = await axios.post('/api/users/verify', {
          idToken: idtoken, // Match the backend's expected key
        })

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`API error: ${response.statusText}`)
        }

        const user = response.data
        console.log('Verification successful:', user)
        return user
      } catch (err) {
        console.error('Failed to verify ID token:', err)
        this.error = 'Failed to verify ID token.'
      }
    },
    logout() {
      liff.logout() // Log out the user
      window.location.reload() // Reload the page to reset the app state
    },
  },
  mounted() {
    console.log('Mounted')
    initializeLiff('2007135016-8GpyXVpN')
      .then(() => {
        liff
          .getProfile()
          .then((profile) => {
            this.message = `Hello, ${profile.displayName}`
          })
          .then(() => {
            this.idtoken = liff.getIDToken() || ''
            if (this.idtoken) {
              this.verifyIdToken(this.idtoken).then((user) => {
                this.user = user // Assign the resolved value to this.user
              })
            }
          })
          .catch(() => {
            this.message = 'Failed to retrieve profile.'
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
