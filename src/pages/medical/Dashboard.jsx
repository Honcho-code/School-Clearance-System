import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, CheckCircle, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader, StatCard, StatusBadge, Empty } from '../../components/ui'

export default function MedicalDashboard() {
  const { getAllApps } = useApp()
  const [apps, setApps] = useState([])
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    getAllApps().then(a => { setApps(a); setBusy(false) })
  }, [])

  const pending  = apps.filter(a => a.stages['medical']?.status === 'reviewing').length
  const approved = apps.filter(a => a.stages['medical']?.status === 'approved').length
  const queue    = apps.filter(a => a.stages['medical']?.status === 'reviewing')

  return (
    <div className="max-w-[860px] mx-auto">
      <PageHeader title="Medical Dashboard" subtitle="Review student medical receipts."/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <StatCard icon={Clock}       label="In Review" value={pending}    color="#DC2626"/>
        <StatCard icon={CheckCircle} label="Approved"  value={approved}   color="#059669"/>
        <StatCard icon={Stethoscope}      label="Total"     value={apps.length} color="#DC2626"/>
      </div>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Review Queue</h3>
          <Link to="/medical/review" className="text-xs font-semibold no-underline" style={{color:'#DC2626'}}>View all</Link>
        </div>
        {busy ? (
          <p className="text-sm text-[#8A94B0] text-center py-8">Loading...</p>
        ) : queue.length === 0 ? (
          <Empty icon={Stethoscope} title="Queue empty" body="No medical receipts pending."/>
        ) : (
          queue.slice(0,6).map(app => (
            <Link key={app.id} to={`/medical/review/${app.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F3F0E6] dark:hover:bg-[#111320] transition-colors no-underline mb-1">
              <div>
                <p className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.studentName}</p>
                <p className="text-xs text-[#8A94B0]">{app.matric} · {app.department}</p>
              </div>
              <StatusBadge status="reviewing"/>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}