import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { stagesAPI } from '../../services/api'
import { PageHeader, StatusBadge, Empty, Modal } from '../../components/ui'
import ReceiptViewer from '../../components/ReceiptViewer'
import { CheckCircle, XCircle, Clock, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function AdminReview() {
  const { appId } = useParams()
  const { getAllApps } = useApp()
  const [apps,   setApps]   = useState([])
  const [busy,   setBusy]   = useState(true)
  const [modal,  setModal]  = useState(null)
  const [active, setActive] = useState(null)
  const [remark, setRemark] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    getAllApps().then(all => {
      const queue = appId
        ? all.filter(a => a.id === appId)
        : all.filter(a => a.stages.admin?.status === 'reviewing')
      setApps(queue); setBusy(false)
    })
  }

  useEffect(() => { load() }, [appId])

  const submit = async (decision) => {
    if (!remark.trim()) { toast.error('Please enter a remark.'); return }
    setSaving(true)
    try {
      await stagesAPI.review(active, { stage: 'admin', decision, remark })
      toast.success(decision === 'approved' ? 'Approved!' : 'Queried.')
      setModal(null); setRemark('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <PageHeader title="Review School Fees" subtitle={`${apps.length} application${apps.length !== 1 ? 's' : ''} in queue`}/>
      {busy ? <p className="text-sm text-[#8A94B0] text-center py-12">Loading...</p>
        : apps.length === 0
          ? <div className="card"><Empty icon={ClipboardList} title="Queue empty" body="No school fees receipts pending review."/></div>
          : apps.map(app => {
            const stage = app.stages.admin
            return (
              <div key={app.id} className="card p-5 mb-4">
                {/* Student info */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.studentName}</h3>
                    <p className="text-xs text-[#8A94B0]">{app.matric} · {app.department}</p>
                  </div>
                  <StatusBadge status={stage?.status}/>
                </div>

                {/* ── Receipts viewer ── */}
                <ReceiptViewer receipts={app.receipts?.schoolFees || []} title="School Fees Receipts — click to preview"/>

                {/* Remark if already reviewed */}
                {stage?.remark && (
                  <div className="mt-3 bg-[#F3F0E6] dark:bg-[#111320] rounded-xl p-3">
                    <p className="text-xs text-[#4B5680] dark:text-[#8B97B8]"><strong>Remark:</strong> {stage.remark}</p>
                    {stage.reviewedAt && (
                      <p className="text-[10px] text-[#8A94B0] mt-1 flex items-center gap-1">
                        <Clock size={9}/>{stage.reviewer} · {formatDistanceToNow(new Date(stage.reviewedAt), {addSuffix:true})}
                      </p>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                {stage?.status === 'reviewing' && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setActive(app.id); setModal('approve') }} className="btn-success flex-1 justify-center"><CheckCircle size={14}/>Approve</button>
                    <button onClick={() => { setActive(app.id); setModal('reject')  }} className="btn-danger  flex-1 justify-center"><XCircle    size={14}/>Query</button>
                  </div>
                )}
              </div>
            )
          })
      }
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'approve' ? 'Approve School Fees' : 'Query Submission'}>
        <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-4">{modal === 'approve' ? 'Add a confirmation remark for the student.' : 'Describe the issue clearly.'}</p>
        <textarea className="input resize-none" rows={3} placeholder="Enter remark…" value={remark} onChange={e => setRemark(e.target.value)}/>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={() => submit(modal === 'approve' ? 'approved' : 'rejected')} disabled={saving}
            className={modal === 'approve' ? 'btn-success flex-1 justify-center' : 'btn-danger flex-1 justify-center'}>
            {saving ? 'Saving…' : modal === 'approve' ? <><CheckCircle size={13}/>Confirm Approve</> : <><XCircle size={13}/>Confirm Query</>}
          </button>
        </div>
      </Modal>
    </div>
  )
}