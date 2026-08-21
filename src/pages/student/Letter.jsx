import { useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { PageHeader, Empty } from '../../components/ui'
import { Award, Download, FileText, CheckCircle, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import outLogo from '../Image/ouiLogo.jpeg'

export default function Letter() {
  const { user, getMyApp } = useApp()
  const app = getMyApp()
  const printRef = useRef(null)

  if (!app || app.status !== 'cleared') return (
    <div className="max-w-[600px] mx-auto">
      <PageHeader title="My Clearance Letter"/>
      <div className="card">
        <Empty icon={Lock} title="Letter not available yet" body="Your clearance letter will be available here once the Admin grants final clearance."/>
        <div className="pb-8 flex justify-center"><Link to="/student/track" className="btn-outline">Track Progress</Link></div>
      </div>
    </div>
  )

  const grantedDate = app.grantedAt ? format(new Date(app.grantedAt), 'MMMM d, yyyy') : format(new Date(), 'MMMM d, yyyy')

  const verifiers = [
    { role:'Admin / Senior Registrar', name: app.stages.final.reviewer || 'Mr Akombi' },
    { role:'Medical Manager',          name: app.stages.medical.reviewer || 'Dr. Emeka Adeyemi' },
    { role:'Library Manager',          name: app.stages.library.reviewer || 'Mr. Tunde Afolabi' },
    { role:'Head of Department',       name: app.stages.hod.reviewer || 'Mr J.O Olomola' },
  ]

  return (
    <div className="max-w-[760px] mx-auto">
      <PageHeader
        title="Clearance Letter"
        subtitle={`Certificate ID: ${app.letterId}`}
        action={
          <button onClick={()=>window.print()} className="btn-primary">
            <Download size={14}/>Download / Print
          </button>
        }
      />

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-5 flex items-center gap-3">
        <Award size={16} className="text-amber-600 flex-shrink-0"/>
        <p className="text-sm text-amber-700 dark:text-amber-400">This is your official clearance letter. It is printable and carries a unique verification ID.</p>
      </div>

      {/* letter */}
      <div ref={printRef} className="card p-8 sm:p-12 print:shadow-none print:border-none" id="clearance-letter">
        {/* header */}
        <div className="flex flex-col items-center text-center border-b-2 border-[#0D1B3E] dark:border-[#EDE9DF] pb-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center mb-3">
            {/* <Award size={28} className="text-white dark:text-[#0D1B3E]"/> */}
            <img src={outLogo} alt="Oui-logo" className='bg-cover rounded-full' />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0D1B3E] dark:text-[#EDE9DF] uppercase tracking-wide">Oduduwa University</h1>
          <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mt-1">Ipetumodu, Osun State, Nigeria</p>
          <div className="mt-4 bg-[rgba(166,124,0,0.08)] border border-[rgba(166,124,0,0.25)] rounded-xl px-6 py-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#A67C00] dark:text-[#D4A030]">Official Student Clearance Certificate</p>
          </div>
        </div>

        {/* body */}
        <div className="mb-8">
          <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-6 leading-relaxed">This is to certify that the following student of <strong>Oduduwa University, Ipetumodu</strong> has successfully completed all clearance requirements for the academic session 2025/2026 and has been fully cleared by all relevant departments.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              ['Full Name',       app.studentName],
              ['Matric Number',   app.matric],
              ['Department',      app.department],
              ['Faculty',         app.faculty || 'Science & Technology'],
              ['Level',           `${app.level}L`],
              ['Date of Issue',   grantedDate],
            ].map(([l,v]) => (
              <div key={l} className="bg-[#F3F0E6] dark:bg-[#111320] rounded-xl p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8A94B0] mb-1">{l}</p>
                <p className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{v}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F3F0E6] dark:bg-[#111320] rounded-xl p-4 mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8A94B0] mb-3">Verified By</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verifiers.map(v => (
                <div key={v.role} className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-emerald-500 flex-shrink-0"/>
                  <div>
                    <p className="text-xs font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{v.name}</p>
                    <p className="text-[10px] text-[#8A94B0]">{v.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8A94B0] mb-1">Certificate ID</p>
            <p className="font-mono text-sm font-bold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.letterId}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2">
            <CheckCircle size={14} className="text-emerald-600"/>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Officially Cleared</span>
          </div>
        </div>
      </div>

      <style>{`@media print { body * { visibility: hidden; } #clearance-letter, #clearance-letter * { visibility: visible; } #clearance-letter { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  )
}