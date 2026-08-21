import { Link } from "react-router-dom";
import {
  Upload,
  Map,
  FileText,
  Bell,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  PageHeader,
  StatCard,
  ClearanceProgress,
  StatusBadge,
  Empty,
} from "../../components/ui";
import { formatDistanceToNow } from "date-fns";

export default function StudentDashboard() {
  const { user, getMyApp, notifs } = useApp();
  const app = getMyApp();

  const countByStatus = (st) =>
    app ? Object.values(app.stages).filter((s) => s.status === st).length : 0;
  const approved = countByStatus("approved");
  const reviewing = countByStatus("reviewing");
  const pending = countByStatus("pending");
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader
        title={`Good day, ${user?.name?.split(" ")[0]}.`}
        subtitle={`${user?.department} · ${user?.level}L`}
        action={
          !app && (
            <Link to="/student/apply" className="btn-primary">
              <Upload size={15} />
              Start Clearance
            </Link>
          )
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={CheckCircle}
          label="Approved"
          value={approved}
          color="#059669"
        />
        <StatCard
          icon={Clock}
          label="Reviewing"
          value={reviewing}
          color="#D97706"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending"
          value={pending}
          color="#8A94B0"
        />
        <StatCard icon={Bell} label="Unread" value={unread} color="#DC2626" />
      </div>
      {app ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">
                Clearance Stages
              </h3>
              <StatusBadge status={app.status} />
            </div>
            <ClearanceProgress stages={app.stages} />
            {app.status === "cleared" ? (
              <Link
                to="/student/letter"
                className="btn-primary mt-5 justify-center w-full"
              >
                <Award size={15} />
                Download Letter
              </Link>
            ) : (
              <Link
                to="/student/track"
                className="btn-outline mt-5 justify-center w-full"
              >
                <Map size={14} />
                View Details
              </Link>
            )}
          </div>
          <div className="lg:col-span-3 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-semibold text-[#0D1B3E] dark:text-[#EDE9DF]">
                Recent Activity
              </h3>
              <Link
                to="/student/notifications"
                className="text-xs font-semibold text-[#A67C00] dark:text-[#D4A030] no-underline flex items-center gap-1"
              >
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {(app?.notifications ?? [])
                .slice()
                .reverse()
                .slice(0, 5)
                .map((n) => {
                  // defensive: ensure createdAt is present and valid before calling date-fns
                  const created = n?.createdAt ? new Date(n.createdAt) : null;
                  const timeAgo =
                    created && !isNaN(created.getTime())
                      ? formatDistanceToNow(created, { addSuffix: true })
                      : "unknown time";

                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? "bg-[rgba(166,124,0,0.06)] dark:bg-[rgba(212,160,48,0.06)] border border-[rgba(166,124,0,0.14)]" : ""}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === "success" ? "bg-emerald-500" : n.type === "warning" ? "bg-amber-400" : n.type === "cleared" ? "bg-[#A67C00]" : "bg-blue-400"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-[#0D1B3E] dark:text-[#EDE9DF] leading-snug">
                          {n.message}
                        </p>
                        <p className="text-[11px] text-[#8A94B0] mt-1">
                          {timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <Empty
            icon={Upload}
            title="No clearance application yet"
            body="Start your clearance by submitting your school fees, medical and library receipts."
          />
          <div className="pb-8 flex justify-center">
            <Link to="/student/apply" className="btn-primary">
              <Upload size={15} />
              Start Clearance
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
