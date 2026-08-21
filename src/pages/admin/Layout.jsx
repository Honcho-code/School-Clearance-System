import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, ShieldCheck } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import TopBar  from '../../components/TopBar'

const links = [
  { to:'/admin',         icon:LayoutDashboard, label:'Dashboard',      exact:true },
  { to:'/admin/review',  icon:ClipboardList,   label:'Review Fees' },
  { to:'/admin/final',   icon:ShieldCheck,     label:'Final Clearance' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen bg-[#FEFCF8] dark:bg-[#0B0D17] overflow-hidden">
      <Sidebar links={links} roleName="Admin" roleColor="#059669" open={open} onClose={()=>setOpen(false)}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={()=>setOpen(true)} title="Admin Panel"/>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6"><Outlet/></main>
      </div>
    </div>
  )
}