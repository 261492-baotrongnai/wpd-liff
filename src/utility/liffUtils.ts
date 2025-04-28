import liff from '@line/liff'
import axios from 'axios'

const API = import.meta.env.NODE_ENV != 'production' ? '/api' : process.env.VITE_API_URL
const liff_user_classification = import.meta.env.VITE_LIFF_ID_USER_CLASSIFICATION

/**
 * Retrieves the value of an environment variable from import.meta.env.
 * @param key - The key of the environment variable (e.g., 'VITE_LIFF_ID').
 * @returns The value of the environment variable or undefined if not found.
 */
export function getEnvVariable(key: string): string | undefined {
  return (import.meta.env as Record<string, string | undefined>)[key]
}

export async function initializeLiff(liffIdEnv: string): Promise<void> {
  try {
    const liffId = getEnvVariable(liffIdEnv) || 'liffId not found'
    await liff.init({ liffId })

    const idToken = liff.getIDToken()
    if (
      idToken &&
      (await verifyIdToken(idToken)) &&
      liffIdEnv !== 'VITE_LIFF_ID_USER_CLASSIFICATION'
    ) {
      login(idToken)
    } else {
      if (!liff.isLoggedIn() || (idToken && !(await verifyIdToken(idToken)))) {
        liff.login()
      }
    }
  } catch (error) {
    console.error('LIFF initialization failed:', error)
  }
}

export async function login(idToken: string) {
  try {
    const response = await axios.post(`${API}/auth/login`, { idToken })

    const acct = response.data.access_token
    console.log('User logged in successfully:', '\n access_token:', acct)
    const result = await getUserProfile(acct)
    console.log('User internalId:', result)
    return acct
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.location.href = `https://liff.line.me/${liff_user_classification}`
      // liff.openWindow({ url: `https://liff.line.me/${liff_user_classification}`, external: false })
    }
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      logout()
    }

    console.error('Failed to login user:', error)
  }
}

export async function verifyIdToken(id_token: string) {
  try {
    const response = await axios.post(`${API}/users/verify`, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      idToken: id_token, // Match the backend's expected key
    })

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const result = response.data

    return result
  } catch {
    logout()
    console.error('Failed to verify ID token')
  }
}

export async function register(idToken: string, program_code?: string) {
  try {
    const payload: { idToken: string; program_code?: string } = { idToken }
    if (program_code !== undefined) {
      payload.program_code = program_code
    }
    console.log('Registering user with payload:', payload.idToken)

    const response = await axios.post(`${API}/users/register`, payload)

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const user = response.data
    console.log('User registered successfully:', user)
    return user
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      logout()
    }
    console.error('Failed to register user:', error)
  }
}

export function logout() {
  liff.logout() // Log out the user
  // window.location.reload() // Reload the page to reset the app state
}

export async function getUserProfile(acct: string) {
  try {
    const response = await axios.get(`${API}/users/profile`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${acct}`,
      },
    })
    // console.log(response.data)
    return response.data.internalId
  } catch (error) {
    console.error('Failed to get user profile:', error)
  }
}
