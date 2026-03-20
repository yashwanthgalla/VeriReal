import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { auth, firebaseConfigError } from '../lib/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!firebaseConfigError)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        if (!auth) {
          throw new Error(firebaseConfigError ?? 'Firebase auth is not configured')
        }
        await signInWithEmailAndPassword(auth, email, password)
      },
      signup: async (email: string, password: string) => {
        if (!auth) {
          throw new Error(firebaseConfigError ?? 'Firebase auth is not configured')
        }
        await createUserWithEmailAndPassword(auth, email, password)
      },
      logout: async () => {
        if (!auth) {
          return
        }
        await signOut(auth)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
