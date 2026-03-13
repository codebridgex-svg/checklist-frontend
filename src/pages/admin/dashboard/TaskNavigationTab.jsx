"use client"

import { Filter, Search, CheckCircle2, MoreHorizontal } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import { fetchDashboardDataApi } from "../../../redux/api/dashboardApi"
import { updateChecklistData } from "../../../redux/api/checkListApi"
import { insertDelegationDoneAndUpdate } from "../../../redux/api/delegationApi"

export default function TaskNavigationTabs({
  dashboardType,
  taskView,
  setTaskView,
  searchQuery,
  setSearchQuery,
  getFrequencyColor,
  dashboardStaffFilter,
  departmentFilter,
  username,
  onTaskComplete
}) {
  const dispatch = useDispatch()
  const [displayedTasks, setDisplayedTasks] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  
  const itemsPerPage = 50

  useEffect(() => {
    setDisplayedTasks([])
  }, [taskView, dashboardType, dashboardStaffFilter, departmentFilter])

  const loadTasksFromServer = useCallback(async (page = 1, append = false) => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true)
      const data = await fetchDashboardDataApi(
        dashboardType,
        dashboardStaffFilter,
        page,
        itemsPerPage,
        taskView,
        departmentFilter
      )

      if (!data || data.length === 0) {
        if (!append) setDisplayedTasks([])
        return
      }

      const processedTasks = data.map((task) => {
        const submissionDate = task.submission_date ? new Date(task.submission_date) : null
        const taskStartDate = task.task_start_date ? new Date(task.task_start_date) : null
        
        let status = "pending"
        if (submissionDate || task.status === 'Yes') {
          status = "completed"
        } else if (taskStartDate && taskStartDate < new Date().setHours(0,0,0,0)) {
          status = "overdue"
        }

        return {
          id: task.task_id,
          title: task.task_description || task.name,
          assignedTo: task.name || task.staff_name || "Unassigned",
          taskStartDate: taskStartDate ? taskStartDate.toLocaleDateString('en-GB') : "N/A",
          status,
          frequency: task.frequency || "one-time",
          department: task.department || "N/A",
          _raw: task
        }
      })

      const filteredTasks = processedTasks.filter((task) => {
        if (!searchQuery?.trim()) return true
        const q = searchQuery.toLowerCase().trim()
        return task.title?.toLowerCase().includes(q) || 
               task.id?.toString().includes(q) || 
               task.assignedTo?.toLowerCase().includes(q)
      })

      setDisplayedTasks(prev => append ? [...prev, ...filteredTasks] : filteredTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [dashboardType, dashboardStaffFilter, taskView, searchQuery, departmentFilter])

  useEffect(() => { loadTasksFromServer(1, false) }, [loadTasksFromServer, taskView, dashboardType, dashboardStaffFilter, departmentFilter])

  const handleTaskCompletion = async (task) => {
    const isAssignedToMe = task.assignedTo?.toLowerCase() === username?.toLowerCase();
    if (!isAssignedToMe) return;

    if (confirm(`Mark "${task.title}" as complete?`)) {
      try {
        if (dashboardType === "checklist") {
          await updateChecklistData([{ taskId: task.id, status: "yes", remarks: "", image: null }]);
        } else {
          const raw = task._raw;
          await dispatch(insertDelegationDoneAndUpdate({
            selectedDataArray: [{
              task_id: raw.task_id,
              given_by: raw.given_by,
              name: raw.name,
              task_description: raw.task_description,
              task_start_date: raw.task_start_date,
              planned_date: raw.planned_date,
              status: "done",
              next_extend_date: null,
              reason: "",
              image_base64: null,
            }]
          })).unwrap();
        }
        if (onTaskComplete) onTaskComplete();
        loadTasksFromServer(1, false);
      } catch (e) {
        alert("Failed to complete task");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'overdue': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const tabs = [
    { id: 'recent', label: dashboardType === "delegation" ? "Today's Focus" : "Active Tasks" },
    { id: 'upcoming', label: "Future Pipeline" },
    { id: 'overdue', label: "Critical Priority" }
  ];

  return (
    <div className="card-premium overflow-hidden flex flex-col h-[600px] border-none bg-white/50 backdrop-blur-xl">
      {/* Tab Navigation */}
      <div className="flex p-2 bg-slate-900/5 backdrop-blur-md gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTaskView(tab.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              taskView === tab.id 
                ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50 scale-[1.02]" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-slate-100 bg-white/30">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search through your tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
            isFilterExpanded ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400"
          }`}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
        </button>
      </div>

      {/* Expanded Filters */}
      {isFilterExpanded && (
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top duration-300">
           <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                Type: {dashboardType}
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                Staff: {dashboardStaffFilter}
              </div>
              {departmentFilter !== "all" && (
                <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">
                  Dept: {departmentFilter}
                </div>
              )}
           </div>
        </div>
      )}

      {/* Table Section */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-white/40">
        {displayedTasks.length === 0 && !isLoadingMore ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="p-4 bg-slate-100 rounded-2xl mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Records Found</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Try clearing your filters or selecting a different view.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Task Assignment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Timeline</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTasks.map((task, i) => (
                <tr key={`${task.id}-${i}`} className="group hover:bg-white/60 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 leading-none mb-1.5">{task.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: {task.id}</span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">@{task.assignedTo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-600">{task.department}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                       <span className="text-xs font-black text-slate-900">{task.taskStartDate}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${getFrequencyColor ? getFrequencyColor(task.frequency).split(' ')[1] : ''}`}>
                         {task.frequency}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {task.status !== 'completed' && task.assignedTo?.toLowerCase() === username?.toLowerCase() ? (
                      <button 
                         onClick={() => handleTaskCompletion(task)}
                         className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm group-hover:shadow-lg"
                      >
                         <CheckCircle2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="p-2 text-slate-200">
                         <MoreHorizontal className="h-4 w-4" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Infinite Loading Indicator */}
      {isLoadingMore && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Fetching more data...</span>
        </div>
      )}
    </div>
  )
}
