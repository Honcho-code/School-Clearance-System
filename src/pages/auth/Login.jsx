import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import toast from 'react-hot-toast'

const DEMO = [
  { role:'Student',         email:'samuel@oui.edu.ng' },
  { role:'Admin',           email:'admin@oui.edu.ng' },
  { role:'Medical Manager', email:'medical@oui.edu.ng' },
  { role:'Library Manager', email:'library@oui.edu.ng' },
  { role:'H.O.D',           email:'hod@oui.edu.ng' },
]

const ROLE_MAP = {
  student: '/student',
  admin:   '/admin',
  medical: '/medical',
  library: '/library',
  hod:     '/hod',
}

export default function Login() {
  const { login, dark, setDark } = useApp()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in your email and password.')
      return
    }

    setLoading(true)
    const res = await login(email.trim(), password)   // ← await is critical
    setLoading(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`)
    navigate(ROLE_MAP[res.user.role] || '/student')
  }

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail)
    setPassword('demo123')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#FEFCF8] dark:bg-[#0B0D17] flex flex-col lg:flex-row">

      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden bg-[#0D1B3E]">
        <img
          src="https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=800&q=85"
          alt="Graduate"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B3E]/80 to-[#0D1B3E]/60"/>
        <div className="relative z-10 p-10">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap size={18} className="text-white" strokeWidth={2}/>
            </div>
            <span className="font-serif text-lg font-semibold text-white">OUI Clearance</span>
          </Link>
        </div>
        <div className="relative z-10 p-10">
          <blockquote className="font-serif text-2xl italic text-white/90 leading-relaxed mb-3">
            "The entire clearance process, done from my phone."
          </blockquote>
          <p className="text-white/50 text-sm">Oduduwa University · Class of 2026</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">

        <div className="flex items-center justify-between p-5 sm:p-7">
          <Link to="/" className="lg:hidden flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center">
              <GraduationCap size={15} className="text-white dark:text-[#0D1B3E]" strokeWidth={2}/>
            </div>
            <span className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">OUI Clearance</span>
          </Link>
          <div className="lg:ml-auto flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-xl border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] bg-white dark:bg-[#161924] cursor-pointer text-[#4B5680] dark:text-[#8B97B8]"
            >
              {dark ? <Sun size={15}/> : <Moon size={15}/>}
            </button>
            <span className="text-sm text-[#4B5680] dark:text-[#8B97B8]">No account?</span>
            <Link to="/register" className="btn-outline py-2 px-4 text-sm">Register</Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="w-full max-w-[400px]">

            <div className="mb-7">
              <h1 className="font-serif text-[clamp(26px,4vw,36px)] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-[#4B5680] dark:text-[#8B97B8]">
                Sign in to your OUI Clearance account.
              </p>
            </div>

            {/* Demo accounts */}
            <div className="bg-[#F3F0E6] dark:bg-[#111320] border border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] rounded-2xl p-4 mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8A94B0] mb-3">
                Demo Accounts — click to fill
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO.map(d => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => fillDemo(d.email)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-[#161924] border border-[rgba(13,27,62,0.10)] dark:border-[rgba(237,233,223,0.10)] text-[#4B5680] dark:text-[#8B97B8] hover:border-[#0D1B3E] dark:hover:border-[#EDE9DF] transition-colors cursor-pointer"
                  >
                    {d.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@oui.edu.ng"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    className="input pr-11"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94B0] cursor-pointer bg-transparent border-none p-1"
                  >
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary justify-center py-3 text-[15px] mt-1 disabled:opacity-60"
              >
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow"/>Signing in…</span>
                  : <><span>Sign In</span><ArrowRight size={15}/></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-[#4B5680] dark:text-[#8B97B8] mt-6">
              New student?{' '}
              <Link to="/register" className="font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] no-underline hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}