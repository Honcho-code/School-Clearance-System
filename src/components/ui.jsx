import { useEffect, useRef, useState } from 'react'
import { CheckCircle, AlertCircle, Clock, Award, X, Loader2 } from 'lucide-react'

/* ── fade-up on scroll ── */
export function FadeUp({ children, delay=0, className='' }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setV(true) }, { threshold:0.1 })
    if(ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: v?1:0,
      transform: v?'translateY(0)':'translateY(22px)',
      transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease`,
    }}>{children}</div>
  )
}

/* ── status badge ── */
export function StatusBadge({ status }) {
  const map = {
    approved:  { cls:'badge-approved',  icon:CheckCircle, label:'Approved' },
    cleared:   { cls:'badge-cleared',   icon:Award,       label:'Cleared' },
    reviewing: { cls:'badge-reviewing', icon:Clock,       label:'In Review' },
    pending:   { cls:'badge-pending',   icon:Clock,       label:'Pending' },
    rejected:  { cls:'badge-rejected',  icon:AlertCircle, label:'Queried' },
    in_progress:{ cls:'badge-reviewing',icon:Clock,       label:'In Progress' },
  }
  const m = map[status] || map.pending
  const Icon = m.icon
  return <span className={m.cls}><Icon size={11}/>{m.label}</span>
}

/* ── spinner ── */
export function Spinner({ size=16 }) {
  return <Loader2 size={size} className="animate-spin-slow text-current" />
}

/* ── modal ── */
export function Modal({ open, onClose, title, children, width='max-w-lg' }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative z-10 card w-full ${width} p-6 animate-fadeUp`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-xl font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border-none bg-transparent">
            <X size={16} className="text-[#8A94B0]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── page header ── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{title}</h1>
        {subtitle && <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

/* ── stat card ── */
export function StatCard({ icon: Icon, label, value, color='#2563EB', sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color+'18' }}>
          <Icon size={18} color={color} strokeWidth={1.75} />
        </div>
      </div>
      <div className="font-serif text-3xl font-bold text-[#0D1B3E] dark:text-[#EDE9DF] leading-none mb-1">{value}</div>
      <div className="text-xs font-semibold text-[#4B5680] dark:text-[#8B97B8] uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-[#8A94B0] dark:text-[#4A5270] mt-1">{sub}</div>}
    </div>
  )
}

/* ── empty state ── */
export function Empty({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[#F3F0E6] dark:bg-[#1C2030] flex items-center justify-center mb-4">
        <Icon size={24} className="text-[#8A94B0]" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-2">{title}</h3>
      <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] max-w-xs leading-relaxed">{body}</p>
    </div>
  )
}

/* ── progress steps ── */
export function ClearanceProgress({ stages }) {
  const steps = [
    { key:'admin',   label:'Admin',          sub:'School Fees' },
    { key:'medical', label:'Medical',         sub:'Medical Receipts' },
    { key:'library', label:'Library',         sub:'Library Receipt' },
    { key:'hod',     label:'H.O.D',           sub:'Departmental' },
    { key:'final',   label:'Admin Final',     sub:'Final Check' },
  ]
  return (
    <div className="flex flex-col gap-3">
      {steps.map((s, i) => {
        const st = stages[s.key]?.status || 'pending'
        const isApproved  = st === 'approved'
        const isReviewing = st === 'reviewing'
        const isRejected  = st === 'rejected'
        return (
          <div key={s.key} className="flex items-center gap-3">
            {/* icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
              isApproved  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :
              isReviewing ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' :
              isRejected  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
              'border-gray-200 dark:border-gray-700 bg-transparent'
            }`}>
              {isApproved  && <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />}
              {isReviewing && <Clock size={14} className="text-amber-500 dark:text-amber-400" />}
              {isRejected  && <AlertCircle size={14} className="text-red-500" />}
              {st==='pending' && <span className="text-[10px] font-bold text-[#8A94B0]">{i+1}</span>}
            </div>
            {/* label */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${isApproved?'text-emerald-700 dark:text-emerald-400':isReviewing?'text-amber-600 dark:text-amber-400':isRejected?'text-red-600':'text-[#8A94B0]'}`}>
                {s.label}
              </div>
              <div className="text-xs text-[#8A94B0] dark:text-[#4A5270]">{s.sub}</div>
            </div>
            {/* status */}
            <StatusBadge status={st} />
          </div>
        )
      })}
    </div>
  )
}
