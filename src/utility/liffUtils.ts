import liff from "@line/liff";

export async function initializeLiff(liffId: string): Promise<void> {
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  } catch (error) {
    throw new Error(`LIFF initialization failed: ${(error as Error).message}`);
  }
}