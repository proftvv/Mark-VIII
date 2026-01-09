export async function checkBiometricAvailability(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  if (!window.PublicKeyCredential) {
    return false
  }
  
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch (error) {
    console.error('Biometric check failed:', error)
    return false
  }
}

export async function registerBiometric(username: string): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Mark-VIII Encryption",
        id: window.location.hostname
      },
      user: {
        id: new TextEncoder().encode(username),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "none"
    }
    
    const credential = await navigator.credentials.create({
      publicKey: publicKeyOptions
    })
    
    if (credential) {
      localStorage.setItem(`biometric_${username}`, 'registered')
      return true
    }
    return false
  } catch (error) {
    console.error('Biometric registration failed:', error)
    return false
  }
}

export async function authenticateWithBiometric(username: string): Promise<boolean> {
  try {
    const registered = localStorage.getItem(`biometric_${username}`)
    if (!registered) return false
    
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: window.location.hostname,
      timeout: 60000,
      userVerification: "required"
    }
    
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyOptions
    })
    
    return assertion !== null
  } catch (error) {
    console.error('Biometric authentication failed:', error)
    return false
  }
}
