"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Users, Filter, ChevronRight, ChevronLeft, Search } from "lucide-react"
import { fetchStaffTasksDataApi, getTotalUsersCountApi } from "../../../redux/api/dashboardApi"

export default function StaffTasksTable({
  dashboardType,
  dashboardStaffFilter,
  departmentFilter
}) {
  const [staffMembers, setStaffMembers] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalUsersCount, setTotalUsersCount] = useState(0)
  const [selectedMonthYear, setSelectedMonthYear] = useState("")
  const [monthYearOptions, setMonthYearOptions] = useState([])
  const itemsPerPage = 20

  const generateMonthYearOptions = useCallback(() => {
    const options = []
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const monthName = date.toLocaleString('default', { month: 'long' })
      const year = date.getFullYear()
      options.push({
        value: `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: `${monthName} ${year}`,
        isCurrent: i === 0
      })
    }
    setMonthYearOptions(options)
    if (options.length > 0 && !selectedMonthYear) {
      const current = options.find(opt => opt.isCurrent)
      if (current) setSelectedMonthYear(current.value)
    }
  }, [selectedMonthYear])

  useEffect(() => {
    generateMonthYearOptions()
  }, [generateMonthYearOptions])

  useEffect(() => {
    setStaffMembers([])
  }, [dashboardType, dashboardStaffFilter, departmentFilter, selectedMonthYear])

  const loadStaffData = useCallback(async (page = 1, append = false) => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true)
      const data = await fetchStaffTasksDataApi(
        dashboardType,
        dashboardStaffFilter,
        page,
        itemsPerPage,
        selectedMonthYear
      )

      if (page === 1) {
        const usersCount = await getTotalUsersCountApi();
        setTotalUsersCount(usersCount)
      }

      if (!data || data.length === 0) {
        if (!append) setStaffMembers([])
        return
      }

      setStaffMembers(prev => append ? [...prev, ...data] : data)
    } catch (error) {
      console.error('Error loading staff data:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [dashboardType, dashboardStaffFilter, selectedMonthYear])

  useEffect(() => {
    loadStaffData(1, false)
  }, [loadStaffData, dashboardType, dashboardStaffFilter, departmentFilter, selectedMonthYear])

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-500 bg-emerald-50 border-emerald-100"
    if (score >= 75) return "text-indigo-500 bg-indigo-50 border-indigo-100"
    if (score >= 50) return "text-amber-500 bg-amber-50 border-amber-100"
    return "text-rose-500 bg-rose-50 border-rose-100"
  }

  return (
    <div className="card-premium overflow-hidden flex flex-col h-[500px] border-none bg-white/50 backdrop-blur-xl">
      {/* Table Header / Action Area */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" />
            Performance Rankings
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
            Showing {staffMembers.length} of {totalUsersCount} active users
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <select
                value={selectedMonthYear}
                onChange={(e) => setSelectedMonthYear(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-tight appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm min-w-[180px]"
              >
                <option value="">All-Time Records</option>
                {monthYearOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} {opt.isCurrent ? "— Current" : ""}
                  </option>
                ))}
              </select>
          </div>
          
          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-white/40 staff-table-container">
        {staffMembers.length === 0 && !isLoadingMore ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="p-4 bg-slate-100 rounded-2xl mb-4">
              <Users className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Activity Logged</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">No performance data matches the current filters.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest w-16">Rank</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Team Member</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Tasks</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Efficiency</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff, i) => (
                <tr key={`${staff.name}-${i}`} className="group hover:bg-white/60 transition-colors">
                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-slate-300 group-hover:text-indigo-600 transition-colors">#{i + 1}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-900 uppercase border border-white shadow-sm ring-1 ring-slate-200">
                        {staff.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 leading-none mb-1">{staff.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[150px]">
                          {staff.email?.split('@')[0]}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 space-y-1">
                     <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-black text-slate-900">{staff.completedTasks}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Done</span>
                     </div>
                     <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400" 
                          style={{ width: `${(staff.completedTasks / (staff.totalTasks || 1)) * 100}%` }}
                        />
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-900">{staff.onTimeScore || 0}%</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">On-Time</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${getScoreColor(staff.onTimeScore || 0)}`}>
                      {staff.onTimeScore || 0}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Infinite Loader */}
      {isLoadingMore && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Retrieving rankings...</span>
        </div>
      )}
    </div>
  )
}