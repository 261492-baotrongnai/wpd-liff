import liff from '@line/liff'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api' // Default to localhost if not set
// Extend the Window interface to include the 'env' property

/**
 * Retrieves the value of an environment variable from import.meta.env.
 * @param key - The key of the environment variable (e.g., 'VITE_LIFF_ID').
 * @returns The value of the environment variable or undefined if not found.
 */
export function getEnvVariable(key: string): string | undefined {
  return (import.meta.env as Record<string, string | undefined>)[key]
}

/**
 * Initializes the LIFF (LINE Front-end Framework) application with the specified LIFF ID.
 *
 * This function retrieves the LIFF ID from the environment variable, initializes the LIFF app,
 * and ensures the user is logged in. If the LIFF ID is not found or initialization fails,
 * an error is thrown.
 *
 * @param liffIdEnv - The name of the environment variable containing the LIFF ID.
 * @returns A promise that resolves when the LIFF app is successfully initialized.
 * @throws {Error} If the LIFF initialization fails or the LIFF ID is not found.
 */
export async function initializeLiff(liffIdEnv: string): Promise<void> {
  try {
    const liffId = getEnvVariable(liffIdEnv) || 'liffId not found'
    await liff.init({ liffId })
    if (!liff.isLoggedIn()) {
      liff.login()
    }
  } catch (error) {
    throw new Error(`LIFF initialization failed: ${(error as Error).message}`)
  }
}

/**
 * Verifies the provided ID token by sending it to the backend API for validation.
 *
 * @param idtoken - The ID token to be verified.
 * @returns A promise that resolves to the user data if the verification is successful.
 *          If the verification fails, it logs an error and returns undefined.
 * @throws An error if the API response status indicates a failure.
 */
export async function verifyIdToken(idtoken: string) {
  try {
    const response = await axios.post(`${API_URL}/users/verify`, {
      idToken: idtoken, // Match the backend's expected key
    })

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const user = response.data
    return user
  } catch {
    logout()
  }
}

/**
 * Logs the user out of the LIFF (LINE Front-end Framework) application
 * and reloads the page to reset the app state.
 *
 * This function performs the following actions:
 * 1. Calls `liff.logout()` to log the user out of the LIFF session.
 * 2. Reloads the current page using `window.location.reload()` to ensure
 *    the application state is reset.
 */
export function logout() {
  liff.logout() // Log out the user
  window.location.reload() // Reload the page to reset the app state
}
