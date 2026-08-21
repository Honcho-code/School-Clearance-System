import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { stagesAPI } from '../../services/api'
import { PageHeader, StatusBadge, ClearanceProgress, Empty, Modal } from '../../components/ui'
import { ShieldCheck, CheckCircle, Award } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminFinal() {
  const { appId } = useParams()
  const { getAllApps } = useApp()
  const [apps,   setApps]   = useState([])
  const [busy,   setBusy]   = useState(true)
  const [modal,  setModal]  = useState(false)
  const [remark, setRemark] = useState('')
  const [active, setActive] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    getAllApps().then(all => {
      const queue = appId
        ? all.filter(a => a.id === appId)
        : all.filter(a => a.stages.final?.status === 'reviewing')
      setApps(queue); setBusy(false)
    })
  }

  useEffect(() => { load() }, [appId])

  const grant = async () => {
    if (!remark.trim()) { toast.error('Please add a final remark.'); return }
    setSaving(true)
    try {
      await stagesAPI.grant(active, { remark })
      toast.success('Clearance granted! Letter generated.')
      setModal(false); setRemark('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grant clearance.')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-[760px] mx-auto">
      <PageHeader title="Final Clearance" subtitle="Review all stages and grant official clearance."/>
      {busy ? <p className="text-sm text-[#8A94B0] text-center py-12">Loading...</p>
        : apps.length === 0
          ? <div className="card"><Empty icon={ShieldCheck} title="No final reviews" body="Applications reach here after HOD sign-off."/></div>
          : apps.map(app => (
            <div key={app.id} className="card p-5 mb-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.studentName}</h3>
                  <p className="text-xs text-[#8A94B0]">{app.matric} · {app.department}</p>
                </div>
                <StatusBadge status={app.stages.final?.status}/>
              </div>
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8A94B0] mb-3">All Stage Summary</p>
                <ClearanceProgress stages={app.stages}/>
              </div>
              {app.stages.final?.status === 'reviewing' && (
                <button onClick={() => { setActive(app.id); setModal(true) }} className="btn-primary w-full justify-center py-3">
                  <Award size={15}/>Grant Official Clearance
                </button>
              )}
              {app.stages.final?.status === 'approved' && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-600"/>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">Cleared. Certificate: <strong>{app.letterId}</strong></p>
                </div>
              )}
            </div>
          ))
      }
      <Modal open={modal} onClose={() => setModal(false)} title="Grant Final Clearance">
        <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-4">This will generate the student's official clearance letter.</p>
        <textarea className="input resize-none" rows={3} placeholder="Final verification remark…" value={remark} onChange={e => setRemark(e.target.value)}/>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={grant} disabled={saving} className="btn-success flex-1 justify-center">
            {saving ? 'Processing…' : <><Award size={14}/>Grant Clearance</>}
          </button>
        </div>
      </Modal>
    </div>
  )
}