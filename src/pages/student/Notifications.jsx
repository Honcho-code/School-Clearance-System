import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui'
import { CheckCircle, AlertCircle, Award, Info, BellOff } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const TYPE_META = {
  success: { icon:CheckCircle, color:'text-emerald-600', bg:'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' },
  warning: { icon:AlertCircle, color:'text-amber-600',   bg:'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' },
  cleared: { icon:Award,       color:'text-[#A67C00]',   bg:'bg-[rgba(166,124,0,0.08)] border-[rgba(166,124,0,0.25)]' },
  info:    { icon:Info,        color:'text-blue-500',    bg:'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' },
}

export default function StudentNotifs() {
  const { notifs, markNotifRead, markAllRead, fetchNotifs } = useApp()
  const unread = notifs.filter(n => !n.is_read).length

  useEffect(() => { fetchNotifs() }, [])

  return (
    <div className="max-w-[680px] mx-auto">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : 'All caught up'}
        action={unread > 0 && <button onClick={markAllRead} className="btn-outline text-sm py-2 px-4">Mark all read</button>}
      />
      {notifs.length === 0 ? (
        <div className="card p-12 text-center">
          <BellOff size={32} className="text-[#8A94B0] mx-auto mb-3"/>
          <p className="text-sm text-[#4B5680] dark:text-[#8B97B8]">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifs.map(n => {
            const meta = TYPE_META[n.type] || TYPE_META.info
            const Icon = meta.icon
            return (
              <div key={n.id} onClick={() => markNotifRead(n.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-opacity ${meta.bg} ${n.is_read ? 'opacity-60' : ''}`}>
                <Icon size={16} className={`${meta.color} flex-shrink-0 mt-0.5`}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0D1B3E] dark:text-[#EDE9DF] leading-snug">{n.message}</p>
                  <p className="text-xs text-[#8A94B0] mt-1">{formatDistanceToNow(new Date(n.created_at), {addSuffix:true})}</p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#A67C00] flex-shrink-0 mt-1.5"/>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}