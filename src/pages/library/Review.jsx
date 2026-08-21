import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { stagesAPI } from '../../services/api'
import { PageHeader, StatusBadge, Empty, Modal } from '../../components/ui'
import ReceiptViewer from '../../components/ReceiptViewer'
import { BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function LibraryReview() {
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
        : all.filter(a => a.stages.library?.status === 'reviewing')
      setApps(queue); setBusy(false)
    })
  }

  useEffect(() => { load() }, [appId])

  const submit = async (decision) => {
    if (!remark.trim()) { toast.error('Please enter a remark.'); return }
    setSaving(true)
    try {
      await stagesAPI.review(active, { stage: 'library', decision, remark })
      toast.success(decision === 'approved' ? 'Approved!' : 'Queried.')
      setModal(null); setRemark('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <PageHeader title="Review Library Receipt" subtitle={`${apps.length} application${apps.length !== 1 ? 's' : ''} in queue`}/>
      {busy ? <p className="text-sm text-[#8A94B0] text-center py-12">Loading...</p>
        : apps.length === 0
          ? <div className="card"><Empty icon={BookOpen} title="Queue empty" body="No library receipts pending review."/></div>
          : apps.map(app => {
            const stage = app.stages.library
            return (
              <div key={app.id} className="card p-5 mb-4">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">{app.studentName}</h3>
                    <p className="text-xs text-[#8A94B0]">{app.matric} · {app.department}</p>
                  </div>
                  <StatusBadge status={stage?.status}/>
                </div>

                {/* ── Library receipt viewer ── */}
                <ReceiptViewer receipts={app.receipts?.library || []} title="Library Receipt — click to preview"/>

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
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'approve' ? 'Approve Library Receipt' : 'Query Submission'}>
        <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-4">{modal === 'approve' ? 'Add a confirmation remark.' : 'Describe the issue clearly.'}</p>
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