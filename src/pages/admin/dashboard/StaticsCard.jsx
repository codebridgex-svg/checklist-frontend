import { ListTodo, CheckCircle2, Clock, AlertTriangle, BarChart3, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function StatisticsCards({
  dashboardType,
  totalTask,
  completeTask,
  pendingTask,
  overdueTask,
  notDoneTask,
  dateRange = null
}) {
  const navigate = useNavigate();

  const completionRate = totalTask > 0 ? (completeTask / totalTask) * 100 : 0;
  const pendingRate = totalTask > 0 ? (pendingTask / totalTask) * 100 : 0;
  const notDoneRate = totalTask > 0 ? (notDoneTask / totalTask) * 100 : 0;
  const overdueRate = totalTask > 0 ? (overdueTask / totalTask) * 100 : 0;

  const circumference = 251.3;
  const completedDash = (completionRate * circumference) / 100;
  const pendingDash = (pendingRate * circumference) / 100;
  const notDoneDash = (notDoneRate * circumference) / 100;
  const overdueDash = (overdueRate * circumference) / 100;

  const cards = [
    {
      label: "Total Tasks",
      value: totalTask,
      icon: ListTodo,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      desc: dateRange ? "Selected period" : "Checklist database",
      onClick: () => navigate('/dashboard/data/sales')
    },
    {
      label: dashboardType === "delegation" ? "Completed Once" : "Completed",
      value: completeTask,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      desc: "Successfully done",
      onClick: () => navigate('/dashboard/history')
    },
    {
      label: dashboardType === "delegation" ? "Completed Twice" : "Pending",
      value: pendingTask,
      icon: Clock,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-700",
      desc: "Awaiting action",
      onClick: () => navigate('/dashboard/data/sales')
    },
    {
      label: "Not Done",
      value: notDoneTask,
      icon: XCircle,
      color: "bg-slate-500",
      lightColor: "bg-slate-50",
      textColor: "text-slate-700",
      desc: "Missed schedules",
      onClick: null
    },
    {
      label: dashboardType === "delegation" ? "Completed 3+" : "Overdue",
      value: overdueTask,
      icon: AlertTriangle,
      color: "bg-rose-500",
      lightColor: "bg-rose-50",
      textColor: "text-rose-700",
      desc: "Critical attention",
      onClick: () => navigate('/dashboard/data/sales')
    }
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Left side - Statistics Grid */}
      <div className="xl:flex-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div 
              key={i}
              onClick={card.onClick}
              className={`card-premium p-5 flex flex-col justify-between group ${card.onClick ? 'cursor-pointer' : ''} ${i === cards.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${card.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`h-5 w-5 ${card.textColor}`} />
                </div>
                {card.onClick && (
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                )}
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{card.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Premium Analytics Card */}
      <div className="xl:w-[400px]">
        <div className="card-premium p-6 h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl -ml-16 -mb-16" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Productivity</h3>
              <p className="text-xs text-slate-400">{dateRange ? "Period analysis" : "Overall performance"}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
            </div>
          </div>

          <div className="flex items-center gap-8 flex-1 relative z-10">
            {/* Circular Chart */}
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray={`${overdueDash} ${circumference}`} />
                <circle cx="50" cy="50" r="40" stroke="#64748b" strokeWidth="8" fill="none" strokeDasharray={`${notDoneDash} ${circumference}`} strokeDashoffset={-overdueDash} />
                <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="8" fill="none" strokeDasharray={`${pendingDash} ${circumference}`} strokeDashoffset={-(overdueDash + notDoneDash)} />
                <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray={`${completedDash} ${circumference}`} strokeDashoffset={-(overdueDash + notDoneDash + pendingDash)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{completionRate.toFixed(0)}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Score</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
               {[
                 { label: "Done", val: completionRate, color: "bg-emerald-500" },
                 { label: "Pending", val: pendingRate, color: "bg-amber-500" },
                 { label: "Missed", val: notDoneRate, color: "bg-slate-500" },
                 { label: "Overdue", val: overdueRate, color: "bg-rose-500" }
               ].map((item, id) => (
                 <div key={id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                       <span className="text-slate-400">{item.label}</span>
                       <span>{item.val.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-slate-500 font-medium text-center relative z-10">
            Real-time synchronization with Supabase Cluster
          </div>
        </div>
      </div>
    </div>
  )
}