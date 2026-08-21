import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Upload, Map, FileText, Bell } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import TopBar  from '../../components/TopBar'

const links = [
  { to:'/student',              icon:LayoutDashboard, label:'Dashboard', exact:true },
  { to:'/student/apply',        icon:Upload,          label:'Apply for Clearance' },
  { to:'/student/track',        icon:Map,             label:'Track Status' },
  { to:'/student/letter',       icon:FileText,        label:'My Letter' },
  { to:'/student/notifications',icon:Bell,            label:'Notifications' },
]

export default function StudentLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen bg-[#FEFCF8] dark:bg-[#0B0D17] overflow-hidden">
      <Sidebar links={links} roleName="Student Portal" roleColor="#2563EB" open={open} onClose={()=>setOpen(false)}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={()=>setOpen(true)} title="Student Portal"/>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6"><Outlet/></main>
      </div>
    </div>
  )
}