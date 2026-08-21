import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { PageHeader, ClearanceProgress, StatusBadge, Empty } from '../../components/ui'
import { Link } from 'react-router-dom'
import { Upload, Award, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const STAGE_META = {
  admin:   { label:'Admin Review',       sub:'School Fees Receipts' },
  medical: { label:'Medical Manager',    sub:'Medical Receipts' },
  library: { label:'Library Manager',    sub:'Library Receipt' },
  hod:     { label:'H.O.D Sign-off',     sub:'Departmental Confirmation' },
  final:   { label:'Admin Final Check',  sub:'Final Review & Clearance Grant' },
}

export default function Track() {
  const { app, fetchMyApp } = useApp()

  useEffect(() => { fetchMyApp() }, [])

  if (!app) return (
    <div className="max-w-[600px] mx-auto">
      <PageHeader title="Track Status"/>
      <div className="card">
        <Empty icon={Upload} title="No application found" body="You haven't submitted a clearance application yet."/>
        <div className="pb-8 flex justify-center"><Link to="/student/apply" className="btn-primary"><Upload size={14}/>Start Clearance</Link></div>
      </div>
    </div>
  )

  return (
    <div className="max-w-[760px] mx-auto">
      <PageHeader title="Track Clearance" subtitle={`Application ID: ${app.id}`} action={<StatusBadge status={app.status}/>}/>

      {app.status === 'cleared' && (
        <div className="bg-[rgba(166,124,0,0.08)] border border-[rgba(166,124,0,0.25)] rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Award size={28} className="text-[#A67C00] dark:text-[#D4A030] flex-shrink-0"/>
          <div className="flex-1">
            <h3 className="font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-0.5">You are fully cleared!</h3>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8]">Certificate ID: <strong>{app.letterId}</strong></p>
          </div>
          <Link to="/student/letter" className="btn-primary flex-shrink-0"><Award size={14}/>Download Letter</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-4">Stage Progress</h3>
          <ClearanceProgress stages={app.stages}/>
        </div>
        <div className="lg:col-span-3 flex flex-col gap-3">
          {Object.entries(STAGE_META).map(([key, meta]) => {
            const stage = app.stages[key] || {}
            return (
              <div key={key} className="card p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{meta.label}</h4>
                    <p className="text-xs text-[#8A94B0]">{meta.sub}</p>
                  </div>
                  <StatusBadge status={stage.status || 'pending'}/>
                </div>
                {stage.remark && (
                  <div className={`rounded-xl p-3 mt-2 ${stage.status==='approved'?'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800':'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'}`}>
                    <p className={`text-xs leading-relaxed ${stage.status==='approved'?'text-emerald-700 dark:text-emerald-400':'text-amber-700 dark:text-amber-400'}`}>
                      <strong>Remark:</strong> {stage.remark}
                    </p>
                  </div>
                )}
                {stage.reviewedAt && (
                  <p className="text-[11px] text-[#8A94B0] mt-2 flex items-center gap-1">
                    <Clock size={10}/>{stage.reviewer} · {formatDistanceToNow(new Date(stage.reviewedAt), {addSuffix:true})}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}