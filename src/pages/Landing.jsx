import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap, Sun, Moon, Menu, X, ArrowRight, ChevronRight,
  Award, Upload, Shield, Stethoscope, BookOpen, Building2,
  Bell, CheckCircle, FileText, Clock, AlertCircle, BarChart2,
  Lock, RefreshCw, Download, Star, UserCheck, Users
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { FadeUp } from '../components/ui'

function useOnScreen(ref) {
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting) setV(true) }, { threshold:0.1 })
    if(ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return v
}

const roles = [
  { icon:GraduationCap, label:'Student',         accent:'#2563EB', desc:'Submits all receipts, tracks live progress at every stage, and downloads the official clearance letter once granted.', tasks:['Submit school fees receipts 100L–400L','Submit medical receipts 100L–400L','Submit library receipt','Track every stage in real time','Receive instant notifications','Download official clearance letter PDF'] },
  { icon:Shield,        label:'Admin',            accent:'#059669', desc:'Reviews school fees receipts, and as the final authority, does the last overall check and issues the official clearance letter.', tasks:['Review school fees receipts per level','Approve or query with remarks','Receive notification after HOD sign-off','Do final overall review','Grant clearance to the student','Generate and issue the clearance letter PDF'] },
  { icon:Stethoscope,   label:'Medical Manager',  accent:'#DC2626', desc:'Reviews and verifies all medical receipts submitted from 100L through 400L.', tasks:['Review medical receipts per level','Verify receipt authenticity','Approve or reject with remarks','Student notified instantly'] },
  { icon:BookOpen,      label:'Library Manager',  accent:'#7C3AED', desc:'Confirms the library receipt and ensures all library obligations have been fully settled.', tasks:['Review library receipt','Check for outstanding fines','Approve or query submission','Notify student in real time'] },
  { icon:Building2,     label:'H.O.D',            accent:'#D97706', desc:'Reviews the full file after all three managers approve, and gives the departmental final sign-off.', tasks:['View summary of all three approvals','Review clearance file holistically','Give departmental final sign-off','Clearance returns to Admin for issuance'] },
]

const steps = [
  { n:'01', icon:Upload,    title:'Submit Receipts',   desc:'Upload school fees, medical and library receipts for every level from 100L to 400L.', color:'#2563EB' },
  { n:'02', icon:Users,     title:'Parallel Review',   desc:'Admin, Medical and Library managers all review their documents simultaneously.',      color:'#7C3AED' },
  { n:'03', icon:Bell,      title:'Live Notifications',desc:'Every approval or query triggers an instant notification — in-app and via email.',    color:'#059669' },
  { n:'04', icon:UserCheck, title:'HOD Sign-off',      desc:'All three approved — HOD receives the file and gives departmental confirmation.',      color:'#D97706' },
  { n:'05', icon:Shield,    title:'Admin Final Check', desc:'Admin reviews everything one last time, then clicks Grant Clearance.',                color:'#DC2626' },
  { n:'06', icon:Award,     title:'Clearance Letter',  desc:'A personalised university-branded PDF letter is generated and ready to download.',    color:'#A67C00' },
]

const timeline = [
  { label:'Application submitted',   time:'9:14 AM',  status:'done',    icon:Upload },
  { label:'Admin approved fees',     time:'10:02 AM', status:'done',    icon:Shield },
  { label:'Medical receipt cleared', time:'10:45 AM', status:'done',    icon:Stethoscope },
  { label:'Library confirmed',       time:'11:30 AM', status:'active',  icon:BookOpen },
  { label:'HOD sign-off',            time:'Pending',  status:'pending', icon:Building2 },
  { label:'Admin final check',       time:'Pending',  status:'pending', icon:Shield },
  { label:'Clearance letter ready',  time:'Pending',  status:'pending', icon:Award },
]

export default function Landing() {
  const { dark, setDark, user } = useApp()
  const navigate = useNavigate()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeRole, setActiveRole] = useState(0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const r    = roles[activeRole]
  const RIcon = r.icon

  const navLinks = [['How It Works','#how'],['Roles','#roles'],['Preview','#preview'],['Features','#features']]

  const handleStart = () => {
    if (user) { navigate('/dashboard') }
    else { navigate('/onboarding') }
  }

  return (
    <div className="min-h-screen bg-[#FEFCF8] dark:bg-[#0B0D17] text-[#0D1B3E] dark:text-[#EDE9DF] font-sans overflow-x-hidden">

      {/* ══ NAV ══ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FEFCF8]/95 dark:bg-[#0B0D17]/95 backdrop-blur-lg border-b border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
            <div className="w-9 h-9 rounded-xl bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center">
              <GraduationCap size={18} className="text-[#FEFCF8] dark:text-[#0D1B3E]" strokeWidth={2} />
            </div>
            <span className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">OUI Clearance</span>
          </Link>

          {/* Desktop nav — truly centred */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(([l,h]) => (
              <a key={l} href={h} className="text-sm font-medium text-[#4B5680] dark:text-[#8B97B8] hover:text-[#0D1B3E] dark:hover:text-[#EDE9DF] transition-colors no-underline">{l}</a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme */}
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full border border-[rgba(13,27,62,0.14)] dark:border-[rgba(237,233,223,0.14)] bg-white dark:bg-[#161924] flex items-center justify-center cursor-pointer text-[#4B5680] dark:text-[#8B97B8]">
              {dark ? <Sun size={15}/> : <Moon size={15}/>}
            </button>
            {/* Desktop: login + start */}
            <Link to="/login" className="hidden sm:flex btn-outline text-sm">Log in</Link>
            <button onClick={handleStart} className="hidden sm:flex btn-primary text-sm">
              Get Started <ChevronRight size={13}/>
            </button>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(true)} className="flex md:hidden w-9 h-9 rounded-xl border border-[rgba(13,27,62,0.14)] dark:border-[rgba(237,233,223,0.14)] bg-white dark:bg-[#161924] items-center justify-center cursor-pointer text-[#0D1B3E] dark:text-[#EDE9DF]">
              <Menu size={17}/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}

      {/* Mobile drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-[min(280px,80vw)] bg-white dark:bg-[#0B0D17] border-l border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center">
              <GraduationCap size={15} className="text-[#FEFCF8] dark:text-[#0D1B3E]" strokeWidth={2}/>
            </div>
            <span className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">OUI Clearance</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg cursor-pointer border-none bg-transparent text-[#8A94B0]"><X size={18}/></button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map(([l,h]) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-[#4B5680] dark:text-[#8B97B8] py-3 border-b border-[rgba(13,27,62,0.06)] dark:border-[rgba(237,233,223,0.06)] no-underline block">{l}</a>
          ))}
        </nav>
        <div className="p-4 mt-auto flex flex-col gap-3">
          <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline justify-center">Log in</Link>
          <button onClick={() => { setMobileOpen(false); handleStart() }} className="btn-primary justify-center">Get Started <ArrowRight size={14}/></button>
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section className="max-w-[1200px] mx-auto px-5 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <FadeUp delay={0.05}>
              <div className="gold-chip mb-6"><Award size={11}/>Official Digital Clearance — Oduduwa University</div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <h1 className="font-serif text-[clamp(44px,7vw,74px)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#0D1B3E] dark:text-[#EDE9DF] mb-5">
                Graduate<br/>Without<br/><em className="text-[#A67C00] dark:text-[#D4A030] italic">the Queue.</em>
              </h1>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-[clamp(14px,2vw,16px)] text-[#4B5680] dark:text-[#8B97B8] leading-[1.82] mb-8 max-w-[460px]">
                Submit your receipts, watch every approval happen in real time, and receive your official clearance letter — entirely online, from any device.
              </p>
            </FadeUp>
            <FadeUp delay={0.35}>
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={handleStart} className="btn-primary px-7 py-3 text-[15px]">Start Clearance <ArrowRight size={16}/></button>
                <a href="#how" className="btn-outline px-7 py-3 text-[15px]">Learn More</a>
              </div>
            </FadeUp>
            <FadeUp delay={0.45}>
              <div className="grid grid-cols-4 border-t border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] pt-6">
                {[{n:'6',s:'Steps'},{n:'5',s:'Roles'},{n:'3',s:'Receipts'},{n:'1',s:'PDF Letter'}].map((x,i) => (
                  <div key={x.s} className={`${i>0?'pl-4 border-l border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]':''}`}>
                    <div className="font-serif text-[clamp(22px,4vw,36px)] font-bold leading-none text-[#0D1B3E] dark:text-[#EDE9DF]">{x.n}</div>
                    <div className="text-[11px] text-[#8A94B0] mt-1">{x.s}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Hero image stack */}
          <div className="hidden lg:block relative h-[540px]">
            <div className="absolute top-0 left-[8%] right-0 bottom-[8%] rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=720&q=85" alt="Graduate" className="w-full h-full object-cover object-top"/>
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-[#FEFCF8]/30 dark:to-[#0B0D17]/50"/>
            </div>
            <div className="absolute bottom-[14%] right-[-4%] w-[105px] h-[132px] rounded-2xl overflow-hidden border-[3px] border-white dark:border-[#161924] shadow-2xl">
              <img src="https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=220&q=80" alt="Student" className="w-full h-full object-cover"/>
            </div>
            {/* float progress */}
            <div className="animate-float absolute bottom-[4%] left-[-2%] bg-white dark:bg-[#161924] border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] rounded-2xl p-4 shadow-2xl min-w-[200px]">
              <div className="flex items-center gap-2 mb-3"><BarChart2 size={12} className="text-[#A67C00] dark:text-[#D4A030]"/><span className="text-[11px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Clearance Progress</span></div>
              {[['Admin','done'],['Medical','done'],['Library','active'],['HOD','pending'],['Final','pending']].map(([l,st]) => (
                <div key={l} className="flex items-center gap-2 mb-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st==='done'?'bg-emerald-500':st==='active'?'bg-amber-400':'bg-gray-200 dark:bg-gray-700'}`}/>
                  <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className={`h-full rounded-full ${st==='done'?'bg-emerald-500 w-full':st==='active'?'bg-amber-400 w-[52%]':'w-0'}`}/>
                  </div>
                  <span className={`text-[9px] font-semibold min-w-[30px] ${st==='done'?'text-emerald-600':st==='active'?'text-amber-500':'text-[#8A94B0]'}`}>{l}</span>
                </div>
              ))}
            </div>
            {/* toast */}
            <div className="absolute top-[4%] left-0 bg-white dark:bg-[#161924] border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] rounded-xl p-3 shadow-xl flex items-center gap-2.5">
              <div className="animate-blink w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"/>
              <div><div className="text-[12px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Medical Approved</div><div className="text-[10px] text-[#8A94B0]">Just now · Dr. Adeyemi</div></div>
              <CheckCircle size={13} className="text-emerald-500"/>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(13,27,62,0.12)] dark:via-[rgba(237,233,223,0.12)] to-transparent mx-5"/>

      {/* ══ STEPS ══ */}
      <section id="how" className="bg-[#F3F0E6] dark:bg-[#111320] py-16 px-5">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp><div className="text-center mb-11">
            <span className="text-[10px] font-semibold tracking-[.16em] uppercase text-[#A67C00] dark:text-[#D4A030] block mb-2">The Process</span>
            <h2 className="font-serif text-[clamp(26px,4vw,46px)] font-semibold tracking-[-0.02em] text-[#0D1B3E] dark:text-[#EDE9DF]">Six Steps to Fully Cleared</h2>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mt-3 max-w-[420px] mx-auto leading-relaxed">Designed around how OUI actually operates — every step mirrors the real university process.</p>
          </div></FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {steps.map((s,i) => { const Icon=s.icon; return (
              <FadeUp key={s.n} delay={i*0.06}>
                <div className="card-hover p-5 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:s.color+'18'}}>
                      <Icon size={19} color={s.color} strokeWidth={1.75}/>
                    </div>
                    <span className="font-serif text-[38px] font-bold leading-none" style={{color:dark?'#252836':'#EBE7DA'}}>{s.n}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-2">{s.title}</h3>
                  <p className="text-[12.5px] text-[#4B5680] dark:text-[#8B97B8] leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            )})}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(13,27,62,0.12)] dark:via-[rgba(237,233,223,0.12)] to-transparent mx-5"/>

      {/* ══ ROLES ══ */}
      <section id="roles" className="max-w-[1200px] mx-auto py-16 px-5">
        <FadeUp><div className="mb-8">
          <span className="text-[10px] font-semibold tracking-[.16em] uppercase text-[#A67C00] dark:text-[#D4A030] block mb-2">Access Levels</span>
          <h2 className="font-serif text-[clamp(26px,4vw,44px)] font-semibold tracking-[-0.02em] text-[#0D1B3E] dark:text-[#EDE9DF]">Five Roles, One System</h2>
          <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mt-2 max-w-[460px] leading-relaxed">Every person gets a dashboard built exactly for what they need — nothing more, nothing less.</p>
        </div></FadeUp>
        {/* role pills (always visible) */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {roles.map((ro,i) => { const Icon=ro.icon; const active=activeRole===i; return (
            <button key={ro.label} onClick={()=>setActiveRole(i)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all border"
              style={{ background:active?ro.accent+'16':'transparent', borderColor:active?ro.accent+'48':'rgba(13,27,62,0.12)', color:active?ro.accent:'' }}>
              <Icon size={13} strokeWidth={1.75}/>{ro.label}
            </button>
          )})}
        </div>
        {/* panel */}
        <div key={activeRole} className="card p-6 animate-fadeIn">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:r.accent+'16'}}>
              <RIcon size={22} color={r.accent} strokeWidth={1.6}/>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{r.label}</h3>
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{color:r.accent}}>Dashboard Access</span>
            </div>
          </div>
          <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] leading-relaxed mb-5">{r.desc}</p>
          <div className="border-t border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] pt-4">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-[#8A94B0] mb-3">Responsibilities</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {r.tasks.map(t => (
                <div key={t} className="flex items-start gap-2">
                  <CheckCircle size={13} color={r.accent} className="mt-0.5 flex-shrink-0"/>
                  <span className="text-[13px] text-[#4B5680] dark:text-[#8B97B8] leading-snug">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(13,27,62,0.12)] dark:via-[rgba(237,233,223,0.12)] to-transparent mx-5"/>

      {/* ══ PREVIEW ══ */}
      <section id="preview" className="bg-[#F3F0E6] dark:bg-[#111320] py-16 px-5">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp><div className="text-center mb-10">
            <span className="text-[10px] font-semibold tracking-[.16em] uppercase text-[#A67C00] dark:text-[#D4A030] block mb-2">Live Preview</span>
            <h2 className="font-serif text-[clamp(26px,4vw,44px)] font-semibold tracking-[-0.02em] text-[#0D1B3E] dark:text-[#EDE9DF]">What the student sees</h2>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mt-3 max-w-[380px] mx-auto leading-relaxed">A clean, real-time dashboard that shows exactly where you are at all times.</p>
          </div></FadeUp>
          <FadeUp delay={0.1}>
            <div className="card overflow-hidden shadow-2xl">
              {/* browser chrome */}
              <div className="bg-[#F3F0E6] dark:bg-[#111320] border-b border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">{['#DC2626','#F59E0B','#10B981'].map(c=><div key={c} style={{background:c}} className="w-2.5 h-2.5 rounded-full"/>)}</div>
                <div className="flex-1 max-w-[260px] mx-auto bg-white dark:bg-[#161924] border border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] rounded-md px-3 py-1 flex items-center gap-2">
                  <Lock size={9} className="text-[#8A94B0]"/>
                  <span className="text-[10px] text-[#8A94B0]">clearance.oui.edu.ng/dashboard</span>
                </div>
              </div>
              {/* dashboard layout */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] min-h-[400px]">
                {/* sidebar */}
                <div className="hidden sm:flex flex-col border-r border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] p-3 bg-white dark:bg-[#0B0D17]">
                  <div className="flex items-center gap-2 px-2 mb-5 pt-1">
                    <div className="w-6 h-6 rounded-md bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center"><GraduationCap size={12} className="text-white dark:text-[#0D1B3E]"/></div>
                    <span className="font-serif text-[12px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">OUI Clearance</span>
                  </div>
                  {[{icon:BarChart2,l:'Overview',a:true},{icon:Upload,l:'My Receipts',a:false},{icon:Bell,l:'Notifications',a:false,b:2},{icon:FileText,l:'My Letter',a:false}].map(item => {
                    const Icon=item.icon; return (
                    <div key={item.l} className={`flex items-center justify-between px-2 py-2 rounded-lg mb-0.5 ${item.a?'bg-[#0D1B3E] dark:bg-[#EDE9DF]':''}`}>
                      <div className="flex items-center gap-2">
                        <Icon size={12} className={item.a?'text-white dark:text-[#0D1B3E]':'text-[#8A94B0]'} strokeWidth={1.75}/>
                        <span className={`text-[11px] font-${item.a?'semibold':'normal'} ${item.a?'text-white dark:text-[#0D1B3E]':'text-[#4B5680] dark:text-[#8B97B8]'}`}>{item.l}</span>
                      </div>
                      {item.b&&<span className="bg-amber-500 text-white text-[8px] font-bold rounded-full px-1 py-0.5">{item.b}</span>}
                    </div>
                  )})}
                  <div className="mt-auto pt-3 border-t border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-[8px] font-bold text-blue-600">OS</span></div>
                      <div><div className="text-[10px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Oyibo Samuel</div><div className="text-[9px] text-[#8A94B0]">OUI/2021/0042</div></div>
                    </div>
                  </div>
                </div>
                {/* main */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                    <div><h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Clearance Overview</h3><p className="text-[11px] text-[#8A94B0] mt-0.5">Session 2024/2025 · Computer Science</p></div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1.5">
                      <div className="animate-blink w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">In Progress</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[{l:'Admin',s:'School Fees',st:'approved',icon:Shield},{l:'Medical',s:'Medical Rec.',st:'approved',icon:Stethoscope},{l:'Library',s:'Library Rec.',st:'reviewing',icon:BookOpen},{l:'H.O.D',s:'Sign-off',st:'waiting',icon:Building2},{l:'Admin',s:'Final Check',st:'waiting',icon:Shield},{l:'Letter',s:'Clearance PDF',st:'waiting',icon:Award}].map((item,i)=>{
                      const Icon=item.icon; const st=item.st
                      return (
                        <div key={i} className={`rounded-xl p-2.5 border ${st==='approved'?'bg-emerald-50/70 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30':st==='reviewing'?'bg-amber-50/70 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30':'bg-[#F3F0E6] dark:bg-[#111320] border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]'}`}>
                          <div className="flex justify-between mb-2">
                            <Icon size={11} className={st==='approved'?'text-emerald-600':st==='reviewing'?'text-amber-500':'text-[#8A94B0]'} strokeWidth={1.75}/>
                            {st==='approved'&&<CheckCircle size={10} className="text-emerald-500"/>}
                            {st==='reviewing'&&<Clock size={10} className="text-amber-500"/>}
                            {st==='waiting'&&<AlertCircle size={10} className="text-[#8A94B0]"/>}
                          </div>
                          <div className={`text-[10px] font-semibold ${st==='approved'?'text-emerald-700 dark:text-emerald-400':st==='reviewing'?'text-amber-600 dark:text-amber-400':'text-[#8A94B0]'}`}>{item.l}</div>
                          <div className={`text-[9px] mt-0.5 ${st==='approved'?'text-emerald-600':st==='reviewing'?'text-amber-500':'text-[#8A94B0]'}`}>{item.s}</div>
                        </div>
                      )
                    })}
                  </div>
                  {/* timeline */}
                  <div className="bg-[#F3F0E6] dark:bg-[#111320] border border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] rounded-xl p-3">
                    <div className="text-[9px] font-semibold uppercase tracking-widest text-[#8A94B0] mb-3">Activity Timeline</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-5">
                      {timeline.map((item,i) => { const Icon=item.icon; const st=item.status; return (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${st==='done'?'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-400':st==='active'?'bg-amber-100 dark:bg-amber-900/20 border-amber-400':'bg-white dark:bg-[#161924] border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)]'}`}>
                            <Icon size={9} className={st==='done'?'text-emerald-600':st==='active'?'text-amber-500':'text-[#8A94B0]'} strokeWidth={1.75}/>
                          </div>
                          <span className={`flex-1 text-[10px] font-${st==='pending'?'normal':'semibold'} ${st==='pending'?'text-[#8A94B0]':'text-[#0D1B3E] dark:text-[#EDE9DF]'}`}>{item.label}</span>
                          <span className="text-[9px] text-[#8A94B0] flex-shrink-0">{item.time}</span>
                        </div>
                      )})}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(13,27,62,0.12)] dark:via-[rgba(237,233,223,0.12)] to-transparent mx-5"/>

      {/* ══ FEATURES ══ */}
      <section id="features" className="max-w-[1200px] mx-auto py-16 px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <FadeUp>
              <span className="text-[10px] font-semibold tracking-[.16em] uppercase text-[#A67C00] dark:text-[#D4A030] block mb-2">Why Digital</span>
              <h2 className="font-serif text-[clamp(24px,3.5vw,42px)] font-semibold tracking-[-0.02em] text-[#0D1B3E] dark:text-[#EDE9DF] mb-4">Built around how OUI actually works</h2>
              <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] leading-relaxed mb-8">No more running from office to office with paper receipts. Every approval is transparent, every notification instant, and every student always knows where they stand.</p>
            </FadeUp>
            {[{icon:Bell,title:'Real-Time Notifications',desc:'The moment any manager approves or queries, you are notified instantly — in-app and via email.'},{icon:Lock,title:'Secure & Fully Audited',desc:'Every action is time-stamped and logged. Nothing can be changed without a traceable record.'},{icon:FileText,title:'Official Clearance Letter',desc:'Once Admin grants final clearance, a university-branded PDF letter is auto-generated for every student.'},{icon:RefreshCw,title:'Live Progress Tracking',desc:'A real-time stage tracker shows exactly where your application is — pending, reviewing, approved, or cleared.'}].map((f,i)=>{
              const Icon=f.icon; return (
              <FadeUp key={f.title} delay={i*0.08}>
                <div className="flex gap-4 items-start mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(166,124,0,0.09)] dark:bg-[rgba(212,160,48,0.10)] border border-[rgba(166,124,0,0.22)] dark:border-[rgba(212,160,48,0.25)] flex items-center justify-center text-[#A67C00] dark:text-[#D4A030] flex-shrink-0">
                    <Icon size={16} strokeWidth={1.75}/>
                  </div>
                  <div><h4 className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">{f.title}</h4><p className="text-[12.5px] text-[#4B5680] dark:text-[#8B97B8] leading-relaxed">{f.desc}</p></div>
                </div>
              </FadeUp>
            )})}
          </div>
          <FadeUp delay={0.15}>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden aspect-video">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=85" alt="Students on campus" className="w-full h-full object-cover"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden aspect-square">
                  <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&q=80" alt="Graduates" className="w-full h-full object-cover"/>
                </div>
                <div className="card p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Award size={14} className="text-[#A67C00] dark:text-[#D4A030]"/><span className="text-[12px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Clearance Letter</span></div>
                    {['Student Name','Matric No.','Department','Date Issued'].map(l=>(
                      <div key={l} className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] text-[#8A94B0]">{l}</span>
                        <div className="w-12 h-1 rounded-full bg-[rgba(13,27,62,0.08)] dark:bg-[rgba(237,233,223,0.08)]"/>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary justify-center mt-2 text-[11px] py-2"><Download size={11}/>Download PDF</button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ TESTIMONIAL ══ */}
      <section className="bg-[#F3F0E6] dark:bg-[#111320] py-14 px-5">
        <FadeUp>
          <div className="max-w-[600px] mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">{[...Array(5)].map((_,i)=><Star key={i} size={14} className="text-[#A67C00] dark:text-[#D4A030] fill-current"/>)}</div>
            <blockquote className="font-serif text-[clamp(17px,2.5vw,26px)] italic font-normal leading-[1.66] text-[#0D1B3E] dark:text-[#EDE9DF] mb-6">
              "I got my clearance letter without leaving my room. Every update came straight to my phone. This is how it should have always worked."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">AO</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Adaeze Okafor</div>
                <div className="text-xs text-[#8A94B0]">400L · Biochemistry · 2025 Graduate</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ══ CTA ══ */}
      <section className="max-w-[1200px] mx-auto py-16 px-5">
        <FadeUp>
          <div className="bg-[#F3F0E6] dark:bg-[#111320] border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full border border-[rgba(166,124,0,0.18)] dark:border-[rgba(212,160,48,0.18)] pointer-events-none"/>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full border border-[rgba(166,124,0,0.18)] dark:border-[rgba(212,160,48,0.18)] pointer-events-none"/>
            <div className="w-14 h-14 rounded-2xl bg-[#0D1B3E] dark:bg-[#EDE9DF] mx-auto mb-6 flex items-center justify-center relative z-10">
              <GraduationCap size={26} className="text-white dark:text-[#0D1B3E]"/>
            </div>
            <h2 className="font-serif text-[clamp(26px,4vw,50px)] font-semibold tracking-[-0.02em] text-[#0D1B3E] dark:text-[#EDE9DF] mb-4 relative z-10">Ready to get cleared?</h2>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] leading-relaxed max-w-[400px] mx-auto mb-8 relative z-10">
              Log in with your student credentials and submit your receipts. Your official clearance letter is just a few approvals away.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative z-10">
              <button onClick={handleStart} className="btn-primary px-8 py-3 text-[15px]">Start Clearance <ArrowRight size={15}/></button>
              <a href="mailto:registry@oui.edu.ng" className="btn-outline px-8 py-3 text-[15px]">Contact Registry</a>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] py-7 px-5">
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-4 text-xs text-[#8A94B0]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center"><GraduationCap size={12} className="text-white dark:text-[#0D1B3E]"/></div>
            <span className="font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] text-[13px]">OUI Clearance</span>
          </div>
          <p>© {new Date().getFullYear()} Oduduwa University, Ipetumodu. All rights reserved.</p>
          <div className="flex gap-4">{['Privacy','Support','Registry'].map(l=><a key={l} href="#" className="hover:text-[#0D1B3E] dark:hover:text-[#EDE9DF] transition-colors no-underline">{l}</a>)}</div>
        </div>
      </footer>
    </div>
  )
}
