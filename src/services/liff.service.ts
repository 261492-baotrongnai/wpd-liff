import liff from '@line/liff'
import axios from 'axios'
import { authService } from './auth.service'

// const API = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_URL : '/api'
const liff_user_classification = import.meta.env.VITE_LIFF_ID_USER_CLASSIFICATION

/**
 * Retrieves the value of an environment variable from import.meta.env.
 */
export function getEnvVariable(key: string): string | undefined {
  return (import.meta.env as Record<string, string | undefined>)[key]
}

/**
 * Initialize LIFF and handle login with proper authentication
 */
export async function initializeLiff(liffIdEnv: string): Promise<void> {
  const liffId = getEnvVariable(liffIdEnv) || 'liffId not found'

  // Initialize LIFF
  await liff.init({ liffId })
  console.log('LIFF initialized')

  // Check if user is logged in to LIFF
  if (!liff.isLoggedIn()) {
    liff.login()
    return
  }

  // Get ID token from LIFF
  const idToken = liff.getIDToken()
  if (!idToken) {
    console.error('ID Token is null')
    liff.logout()
    return
  }

  // Verify ID token
  const isValid = await verifyIdToken(idToken)
  if (!isValid) {
    console.log('ID Token is not valid, logging in again')
    liff.logout()
    liff.login()
    return
  }

  // Attempt to login with the backend using the ID token
  try {
    const loginSuccess = await authService.loginWithLineIdToken(idToken)
    if (!loginSuccess) {
      throw new Error('Login failed')
    }

    // Login successful, you can redirect to app main page if needed
    console.log('Login successful')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Non registered user, please agree with terms and conditions first')
      window.location.href = `https://liff.line.me/${liff_user_classification}`
    } else {
      console.error('Unexpected error:', error)
      liff.logout()
      authService.logout()
    }
  }
}

export async function liffInitUserClassification(): Promise<void> {
  await liff
    .init({
      liffId: liff_user_classification,
    })
    .then(async () => {
      if (!liff.isLoggedIn()) {
        liff.login()
      }
      const idtoken = await liff.getIDToken()
      if (!idtoken) throw new Error('ID token not found')
      const isValid = await verifyIdToken(idtoken)
      console.log('ID Token is valid:', isValid)
      if (!isValid) {
        console.log('ID Token is not valid, log in again')
        liff.logout()
        liff.login()
      }
    })
}

/**
 * Verify ID token with the backend
 */
export async function verifyIdToken(idToken: string): Promise<boolean> {
  try {
    const exp = liff.getDecodedIDToken()?.exp
    console.log('exp:', exp)
    console.log('Current time:', Date.now())
    if (exp && Date.now() / 1000 < parseInt(exp.toString())) {
      // const response = await axios.post(`${API}/users/verify`, {
      //   idToken: idToken,
      // })
      // if (!(response.status >= 200 && response.status < 300)) throw new Error(response.statusText)
      return true
    } else throw new Error('ID token is expired')
  } catch (error) {
    console.error('Error verifying ID token:', error)
    return false
  }
}

export async function register(idToken: string, program_code?: string) {
  return authService.register(idToken, program_code)
}

/**
 * Logout from both LIFF and the application
 */
export function logout(): void {
  liff.logout() // Log out from LIFF
  authService.logout() // Log out from our app
}
