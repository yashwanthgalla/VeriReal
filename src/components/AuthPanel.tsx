import { useState } from 'react'
import { LoaderCircle, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export function AuthPanel() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.65)] backdrop-blur">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Secure Access</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">VeriReal Authentication</h2>
      <p className="mt-1 text-sm text-slate-600">Use a real Firebase email/password account to continue.</p>

      <div className="mt-4 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
        />

        {error && <p className="rounded-lg bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={busy || !email || !password}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : mode === 'login' ? (
            <>
              <LogIn className="h-4 w-4" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create Account
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
          className="w-full text-center text-xs font-semibold text-slate-600 underline-offset-2 hover:underline"
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
