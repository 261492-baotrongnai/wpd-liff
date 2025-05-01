import liff from '@line/liff'
import axios from 'axios'

const API = import.meta.env.VITE_PRODUCTION ? import.meta.env.VITE_API_URL : '/api'
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
  // try {
  const liffId = getEnvVariable(liffIdEnv) || 'liffId not found'
  await liff.init({ liffId })
  console.log('LIFF initialized')
  if (liff.isLoggedIn()) {
    const idtoken = (await liff.getIDToken()) || ''
    console.log('ID Token:', idtoken)
    const isValid = await verifyIdToken(idtoken)
    console.log('ID Token is valid:', isValid)
    if (isValid) {
      login(idtoken)
        .then((token) => {
          const access_token = token
          console.log('Access Token:', access_token)

          getUserProfile(access_token).then((internalId) => {
            const test_iid = internalId
            console.log('Internal ID:', test_iid)
          })
        })
        .catch((error) => {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error(
              'Non registered user, please agree with terms and conditions first',
              error,
            )
            // liff.openWindow({ url: `https://liff.line.me/${liff_user_classification}` })
            window.location.href = `https://liff.line.me/${liff_user_classification}`
          } else {
            console.error('Unexpected error:', error)
            liff.logout()
          }
        })
    } else {
      console.log('ID Token is not valid, log in again')
      liff.logout()
      liff.login()
    }
  } else {
    liff.login()
  }
}

export async function login(idToken: string) {
  console.log('Logging in user with ID token')
  const response = await axios.post(`${API}/auth/login`, { idToken })

  const acct = response.data.access_token
  console.log('User logged in successfully:', '\n access_token:', acct)
  return acct
}

export async function verifyIdToken(id_token: string) {
  console.log('Verifying ID token:', id_token)
  const response = await axios.post(`${API}/users/verify`, {
    idToken: id_token, // Match the backend's expected key
  })
  console.log('ID token verified successfully:', response.data)
  if (response.status < 200 || response.status >= 300) {
    return false
  }
  const result = response.data
  return result
}

export async function initUserClassificationliff() {
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
  console.log('Getting user profile with access token: ', acct)
  try {
    const response = await axios.get(`${API}/users/profile`, {
      headers: {
        Authorization: `Bearer ${acct}`,
      },
    })
    console.log('getUserProfile.data: ', response.data)
    return response.data.internalId
  } catch (error) {
    console.error('Failed to get user profile:', error)
  }
}
