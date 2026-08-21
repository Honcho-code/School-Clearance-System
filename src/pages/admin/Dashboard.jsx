import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, ShieldCheck, CheckCircle, Clock, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader, StatCard, StatusBadge, Empty } from '../../components/ui'

export default function AdminDashboard() {
  const { getAllApps } = useApp()
  const [apps, setApps] = useState([])
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    getAllApps().then(a => { setApps(a); setBusy(false) })
  }, [])

  const feePending   = apps.filter(a => a.stages.admin?.status === 'reviewing').length
  const feeApproved  = apps.filter(a => a.stages.admin?.status === 'approved').length
  const finalPending = apps.filter(a => a.stages.final?.status === 'reviewing').length
  const cleared      = apps.filter(a => a.status === 'cleared').length

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader title="Admin Dashboard" subtitle="Manage school fees review and final clearance."/>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={ClipboardList} label="Fees Pending"  value={feePending}   color="#D97706"/>
        <StatCard icon={CheckCircle}  label="Fees Approved" value={feeApproved}  color="#059669"/>
        <StatCard icon={ShieldCheck}  label="Final Pending" value={finalPending} color="#DC2626"/>
        <StatCard icon={Users}        label="Total Cleared" value={cleared}      color="#A67C00"/>
      </div>
      {busy ? <p className="text-sm text-[#8A94B0] text-center py-12">Loading...</p> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Fees Review Queue</h3>
              <Link to="/admin/review" className="text-xs font-semibold text-[#059669] no-underline">View all</Link>
            </div>
            {apps.filter(a => a.stages.admin?.status === 'reviewing').length === 0
              ? <Empty icon={CheckCircle} title="Queue empty" body="No pending fee reviews."/>
              : apps.filter(a => a.stages.admin?.status === 'reviewing').slice(0,5).map(app => (
                <Link key={app.id} to={`/admin/review/${app.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F3F0E6] dark:hover:bg-[#111320] transition-colors no-underline mb-1">
                  <div>
                    <p className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.studentName}</p>
                    <p className="text-xs text-[#8A94B0]">{app.matric} · {app.department}</p>
                  </div>
                  <StatusBadge status={app.stages.admin?.status}/>
                </Link>
              ))
            }
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">Final Clearance Queue</h3>
              <Link to="/admin/final" className="text-xs font-semibold text-[#059669] no-underline">View all</Link>
            </div>
            {apps.filter(a => a.stages.final?.status === 'reviewing').length === 0
              ? <Empty icon={ShieldCheck} title="No final reviews" body="Students awaiting HOD sign-off first."/>
              : apps.filter(a => a.stages.final?.status === 'reviewing').slice(0,5).map(app => (
                <Link key={app.id} to={`/admin/final/${app.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F3F0E6] dark:hover:bg-[#111320] transition-colors no-underline mb-1">
                  <div>
                    <p className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.studentName}</p>
                    <p className="text-xs text-[#8A94B0]">{app.matric}</p>
                  </div>
                  <StatusBadge status="reviewing"/>
                </Link>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}