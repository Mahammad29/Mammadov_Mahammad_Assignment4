import { signout } from './api.js'

const auth = {
  isAuthenticated() {
    if (typeof window === 'undefined') return false
    const value = sessionStorage.getItem('jwt')
    return value ? JSON.parse(value) : false
  },

  authenticate(data) {
    sessionStorage.setItem('jwt', JSON.stringify(data))
  },

  async clearJWT() {
    sessionStorage.removeItem('jwt')
    try {
      await signout()
    } catch (err) {
      console.log(err.message)
    }
  }
}

export default auth
