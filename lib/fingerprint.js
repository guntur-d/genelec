import FingerprintJS from "@fingerprintjs/fingerprintjs"

let cachedId = null

export const getFingerprint = async () => {
  if (cachedId) return cachedId

  const fpPromise = FingerprintJS.load()
  const fp = await fpPromise // ✅ this resolves the agent correctly
  const result = await fp.get()

  cachedId = result.visitorId
  return cachedId
}