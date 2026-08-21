import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import toast from 'react-hot-toast'

const DEPTS = [
  'Computer Science','Biochemistry','Accounting','Law',
  'Medicine & Surgery','Nursing','Civil Engineering',
  'Mass Communication','Business Administration','Agricultural Science',
]
const FACULTIES = [
  'Sciences','Social & Management Sciences','Law',
  'Health Sciences','Engineering','Arts & Humanities','Agriculture',
]
const LEVELS = ['100','200','300','400','500']

const ROLE_MAP = {
  student: '/onboarding',
  admin:   '/admin',
  medical: '/medical',
  library: '/library',
  hod:     '/hod',
}

export default function Register() {
  const { register, dark, setDark } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:'', email:'', matric:'',
    department:'', faculty:'', level:'',
    password:'', confirm:'',
  })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { name, email, matric, department, faculty, level, password, confirm } = form
    if (!name || !email || !matric || !department || !faculty || !level || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const res = await register({ name, email, matric, department, faculty, level, password })  // ← await
    setLoading(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    toast.success('Account created successfully!')
    navigate(ROLE_MAP[res.user.role] || '/onboarding')
  }

  return (
    <div className="min-h-screen bg-[#FEFCF8] dark:bg-[#0B0D17] flex flex-col lg:flex-row">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden bg-[#0D1B3E]">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=85"
          alt="Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
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
          <div className="text-[#A67C00] text-xs font-semibold uppercase tracking-widest mb-3">Oduduwa University</div>
          <h2 className="font-serif text-3xl text-white font-semibold leading-tight mb-3">
            Begin your clearance journey the right way.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Create your account and start the clearance process — all in one place.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col">
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
            <span className="text-sm text-[#4B5680] dark:text-[#8B97B8]">Have an account?</span>
            <Link to="/login" className="btn-outline py-2 px-4 text-sm">Sign In</Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="w-full max-w-[480px]">
            <div className="mb-7">
              <h1 className="font-serif text-[clamp(24px,4vw,34px)] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-2">
                Create your account
              </h1>
              <p className="text-sm text-[#4B5680] dark:text-[#8B97B8]">
                Student registration for OUI Clearance System.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="Oyibo Samuel" value={form.name} onChange={e => set('name', e.target.value)}/>
                </div>
                <div>
                  <label className="label">Matric Number</label>
                  <input className="input" placeholder="OUI/2021/0042" value={form.matric} onChange={e => set('matric', e.target.value)}/>
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <input className="input" type="email" placeholder="you@oui.edu.ng" value={form.email} onChange={e => set('email', e.target.value)}/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Department</label>
                  <select className="input" value={form.department} onChange={e => set('department', e.target.value)}>
                    <option value="">Select department</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Faculty</label>
                  <select className="input" value={form.faculty} onChange={e => set('faculty', e.target.value)}>
                    <option value="">Select faculty</option>
                    {FACULTIES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Current Level</label>
                <select className="input" value={form.level} onChange={e => set('level', e.target.value)}>
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}L</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input
                      className="input pr-11"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94B0] cursor-pointer bg-transparent border-none p-1">
                      {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={e => set('confirm', e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary justify-center py-3 text-[15px] mt-1 disabled:opacity-60"
              >
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow"/>Creating account…</span>
                  : <><span>Create Account</span><ArrowRight size={15}/></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-[#4B5680] dark:text-[#8B97B8] mt-5">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] no-underline hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}