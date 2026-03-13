"use client"

import { useState, useEffect } from "react"
import { getTotalUsersCountApi } from "../../../redux/api/dashboardApi"
import { Calendar, Filter, Users, ChevronDown, Check } from "lucide-react"

export default function DashboardHeader({
  dashboardType,
  setDashboardType,
  dashboardStaffFilter,
  setDashboardStaffFilter,
  availableStaff,
  userRole,
  departmentFilter,
  setDepartmentFilter,
  availableDepartments,
  onDateRangeChange
}) {
  const [totalUsersCount, setTotalUsersCount] = useState(0)
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const count = await getTotalUsersCountApi()
        setTotalUsersCount(count)
      } catch (error) {
        console.error('Error fetching total users count:', error)
      }
    }
    fetchTotalUsers()
  }, [])

  const applyDateRange = () => {
    if (startDate && endDate && onDateRangeChange) {
      onDateRangeChange(startDate, endDate)
      setShowDateRangePicker(false)
    }
  }

  const clearDateRange = () => {
    setStartDate("")
    setEndDate("")
    if (onDateRangeChange) onDateRangeChange(null, null)
    setShowDateRangePicker(false)
  }

  const getTodayDate = () => new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      {/* Title & Badge Section */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm font-medium text-slate-500">Real-time checklist performance</p>
        </div>
        
        {(userRole === "admin" || userRole === "super_admin") && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200/50">
            <Users className="h-4 w-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{totalUsersCount} Users</span>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Selector */}
        {(userRole === "admin" || userRole === "super_admin") && (
          <div className="relative">
            <button
              onClick={() => setShowDateRangePicker(!showDateRangePicker)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-500 transition-colors text-sm font-bold text-slate-700"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              {startDate && endDate ? `${startDate} - ${endDate}` : "Pick Date Range"}
              <ChevronDown className="h-4 w-4 text-slate-300 ml-1" />
            </button>

            {showDateRangePicker && (
              <div className="absolute top-full right-0 mt-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 w-80 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-bold text-slate-900">Filter by Date</h3>
                   {startDate && endDate && (
                     <button onClick={clearDateRange} className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Clear</button>
                   )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">From</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || getTodayDate()}
                      className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      max={getTodayDate()}
                      className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={applyDateRange}
                  disabled={!startDate || !endDate}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-colors disabled:opacity-50"
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Type Toggler */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setDashboardType("checklist")}
             className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${dashboardType === "checklist" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
           >
             Checklist
           </button>
           <button 
             onClick={() => setDashboardType("delegation")}
             className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${dashboardType === "delegation" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
           >
             Delegation
           </button>
        </div>

        {/* Dynamic Filters */}
        <div className="flex gap-2">
          {dashboardType === "checklist" && (userRole === "admin" || userRole === "super_admin") && (
            <div className="relative group">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-300"
              >
                <option value="all">All Depts</option>
                {availableDepartments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500" />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
            </div>
          )}

          {(userRole === "admin" || userRole === "super_admin") && (
            <div className="relative group">
              <select
                value={dashboardStaffFilter}
                onChange={(e) => setDashboardStaffFilter(e.target.value)}
                className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-300"
              >
                <option value="all">All Staff</option>
                {availableStaff.map((staffName) => <option key={staffName} value={staffName}>{staffName}</option>)}
              </select>
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500" />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
            </div>
          )}
        </div>
      </div>

      {showDateRangePicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDateRangePicker(false)} />
      )}
    </div>
  )
}