"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import AdminLayout from "../../components/layout/AdminLayout.jsx"

import DashboardHeader from "./dashboard/DashboardHeader.jsx"
import StatisticsCards from "./dashboard/StaticsCard.jsx"
import TaskNavigationTabs from "./dashboard/TaskNavigationTab.jsx"
import CompletionRateCard from "./dashboard/CompletionRateCard.jsx"
import TasksCompletionChart from "./dashboard/Chart/TaskCompletionChart.jsx"
import StaffTasksTable from "./dashboard/StaffTaskTable.jsx"
import {
  completeTaskInTable,
  overdueTaskInTable,
  pendingTaskInTable,
  totalTaskInTable,
  notDoneTaskInTable
} from "../../redux/slice/dashboardSlice.js"
import {
  fetchDashboardDataApi,
  getUniqueDepartmentsApi,
  getStaffNamesByDepartmentApi,
  fetchChecklistDataByDateRangeApi,
  getChecklistDateRangeStatsApi
} from "../../redux/api/dashboardApi.js"

export default function AdminDashboard() {
  const [dashboardType, setDashboardType] = useState("checklist")
  const [taskView, setTaskView] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [dashboardStaffFilter, setDashboardStaffFilter] = useState("all")
  const [availableStaff, setAvailableStaff] = useState([])
  const userRole = localStorage.getItem("role")
  const username = localStorage.getItem("user-name")
  const [, setIsLoadingMore] = useState(false)
  const [, setHasMoreData] = useState(true)

  const [batchSize] = useState(1000)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [availableDepartments, setAvailableDepartments] = useState([])

  // State for department data
  const [departmentData, setDepartmentData] = useState({
    staffMembers: [],
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    barChartData: [],
    pieChartData: [],
    completedRatingOne: 0,
    completedRatingTwo: 0,
    completedRatingThreePlus: 0,
    allTasks: []
  })

  // New state for date range filtering
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    filtered: false,
  })

  // State to store filtered statistics
  const [filteredDateStats, setFilteredDateStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  })

  const dispatch = useDispatch()

  // Date parsing function
  const parseTaskStartDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null
    if (dateStr.includes("-") && dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      const parsed = new Date(dateStr)
      return isNaN(parsed) ? null : parsed
    }
    if (dateStr.includes("/")) {
      const parts = dateStr.split(" ")
      const datePart = parts[0]
      const dateComponents = datePart.split("/")
      if (dateComponents.length !== 3) return null
      const [day, month, year] = dateComponents.map(Number)
      if (!day || !month || !year) return null
      const date = new Date(year, month - 1, day)
      if (parts.length > 1) {
        const timePart = parts[1]
        const timeComponents = timePart.split(":")
        if (timeComponents.length >= 2) {
          const [hours, minutes, seconds] = timeComponents.map(Number)
          date.setHours(hours || 0, minutes || 0, seconds || 0)
        }
      }
      return isNaN(date) ? null : date
    }
    const parsed = new Date(dateStr)
    return isNaN(parsed) ? null : parsed
  }

  const isDateInPast = (date) => {
    if (!date || !(date instanceof Date)) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDateOnly = new Date(date)
    taskDateOnly.setHours(0, 0, 0, 0)
    return taskDateOnly < today
  }

  const formatDateToDDMMYYYY = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return ""
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    const uname = localStorage.getItem("user-name");
    if (role === "user") {
      setDashboardStaffFilter(uname);
      setDepartmentFilter("all");
    }
  }, []);

  const processFilteredData = (data, stats) => {
    const uname = localStorage.getItem("user-name");
    const role = localStorage.getItem("role");
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let tTasks = 0, cTasks = 0, pTasks = 0, oTasks = 0;
    const monthlyData = { Jan: { completed: 0, pending: 0 }, Feb: { completed: 0, pending: 0 }, Mar: { completed: 0, pending: 0 }, Apr: { completed: 0, pending: 0 }, May: { completed: 0, pending: 0 }, Jun: { completed: 0, pending: 0 }, Jul: { completed: 0, pending: 0 }, Aug: { completed: 0, pending: 0 }, Sep: { completed: 0, pending: 0 }, Oct: { completed: 0, pending: 0 }, Nov: { completed: 0, pending: 0 }, Dec: { completed: 0, pending: 0 } };

    const processedTasks = data.map((task) => {
      if ((role !== "admin" && role !== "super_admin") && task.name?.toLowerCase() !== uname?.toLowerCase()) return null;
      const taskStartDate = parseTaskStartDate(task.task_start_date);
      const completionDate = task.submission_date ? parseTaskStartDate(task.submission_date) : null;
      let status = completionDate ? "completed" : (taskStartDate && isDateInPast(taskStartDate) ? "overdue" : "pending");
      
      if (taskStartDate) {
        tTasks++;
        if (dashboardType === "checklist") {
          if (task.status === 'Yes') cTasks++; else pTasks++;
          if (taskStartDate < today && task.status !== 'Yes') oTasks++;
        } else {
          if (task.submission_date) cTasks++; else { pTasks++; if (taskStartDate < today) oTasks++; }
        }
        const monthName = taskStartDate.toLocaleString("default", { month: "short" });
        if (monthlyData[monthName]) {
          if (status === "completed") monthlyData[monthName].completed++; else monthlyData[monthName].pending++;
        }
      }
      return { id: task.task_id, title: task.task_description, assignedTo: task.name || "Unassigned", taskStartDate: formatDateToDDMMYYYY(taskStartDate), originalTaskStartDate: task.task_start_date, submission_date: task.submission_date, status, frequency: task.frequency || "one-time", rating: task.color_code_for || 0 };
    }).filter(Boolean);

    const fStats = stats || { totalTasks: tTasks, completedTasks: cTasks, pendingTasks: pTasks, overdueTasks: oTasks, completionRate: tTasks > 0 ? ((cTasks / tTasks) * 100).toFixed(1) : 0 };

    setDepartmentData(prev => ({ ...prev, allTasks: processedTasks, totalTasks: fStats.totalTasks, completedTasks: fStats.completedTasks, pendingTasks: fStats.pendingTasks, overdueTasks: fStats.overdueTasks, completionRate: fStats.completionRate, barChartData: Object.entries(monthlyData).map(([name, d]) => ({ name, completed: d.completed, pending: d.pending })), pieChartData: [{ name: "Completed", value: fStats.completedTasks, color: "#22c55e" }, { name: "Pending", value: fStats.pendingTasks, color: "#facc15" }, { name: "Overdue", value: fStats.overdueTasks, color: "#ef4444" }] }));
    setFilteredDateStats(fStats);
  };

  const fetchDepartmentDataWithDateRange = async (startDate, endDate) => {
    try {
      const data = await fetchDashboardDataApi(dashboardType, dashboardStaffFilter, 1, batchSize, 'all', departmentFilter);
      const start = new Date(startDate); start.setHours(0,0,0,0);
      const end = new Date(endDate); end.setHours(23,59,59,999);
      const filteredData = data.filter(task => {
        const d = parseTaskStartDate(task.task_start_date);
        return d && d >= start && d <= end;
      });
      let tTt = filteredData.length, cTt = 0, pTt = 0, oTt = 0;
      filteredData.forEach(task => {
        const d = parseTaskStartDate(task.task_start_date);
        const td = new Date(); td.setHours(0,0,0,0);
        if (dashboardType === "checklist") {
          if (task.status === 'Yes') cTt++; else { pTt++; if (d && d < td) oTt++; }
        } else {
          if (task.submission_date) cTt++; else { pTt++; if (d && d < td) oTt++; }
        }
      });
      processFilteredData(filteredData, { totalTasks: tTt, completedTasks: cTt, pendingTasks: pTt, overdueTasks: oTt, completionRate: tTt > 0 ? (cTt / tTt * 100).toFixed(1) : 0 });
    } catch (e) { console.error(e); }
  };

  const fetchDepartmentData = async (page = 1, append = false) => {
    try {
      setIsLoadingMore(true);
      const data = await fetchDashboardDataApi(dashboardType, dashboardStaffFilter, page, batchSize, 'all', departmentFilter);
      if (!data || data.length === 0) {
        if (page === 1) setDepartmentData(prev => ({ ...prev, allTasks: [], totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0, completionRate: 0 }));
        setHasMoreData(false); setIsLoadingMore(false); return;
      }
      const uname = localStorage.getItem("user-name"), role = localStorage.getItem("role"), today = new Date(); today.setHours(23, 59, 59, 999);
      let tTasks = 0, cTasks = 0, pTasks = 0, oTasks = 0, r1 = 0, r2 = 0, r3 = 0;
      const monthlyData = { Jan: { completed: 0, pending: 0 }, Feb: { completed: 0, pending: 0 }, Mar: { completed: 0, pending: 0 }, Apr: { completed: 0, pending: 0 }, May: { completed: 0, pending: 0 }, Jun: { completed: 0, pending: 0 }, Jul: { completed: 0, pending: 0 }, Aug: { completed: 0, pending: 0 }, Sep: { completed: 0, pending: 0 }, Oct: { completed: 0, pending: 0 }, Nov: { completed: 0, pending: 0 }, Dec: { completed: 0, pending: 0 } };

      const processedTasks = data.map((task) => {
        if ((role !== "admin" && role !== "super_admin") && task.name?.toLowerCase() !== uname?.toLowerCase()) return null;
        const d = parseTaskStartDate(task.task_start_date);
        const c = task.submission_date ? parseTaskStartDate(task.submission_date) : null;
        let s = c ? "completed" : (d && isDateInPast(d) ? "overdue" : "pending");
        if (d && d <= today) {
          if (s === "completed") { cTasks++; if (dashboardType === "delegation") { if (task.color_code_for === 1) r1++; else if (task.color_code_for === 2) r2++; else if (task.color_code_for >= 3) r3++; } }
          else { pTasks++; if (s === "overdue") oTasks++; }
          tTasks++;
        }
        if (d) {
          const m = d.toLocaleString("default", { month: "short" });
          if (monthlyData[m]) { if (s === "completed") monthlyData[m].completed++; else monthlyData[m].pending++; }
        }
        return { id: task.task_id, title: task.task_description, assignedTo: task.name || "Unassigned", taskStartDate: formatDateToDDMMYYYY(d), originalTaskStartDate: task.task_start_date, submission_date: task.submission_date, status: s, frequency: task.frequency || "one-time", rating: task.color_code_for || 0 };
      }).filter(Boolean);

      setDepartmentData(prev => {
        const updated = append ? [...prev.allTasks, ...processedTasks] : processedTasks;
        return { ...prev, allTasks: updated, totalTasks: append ? prev.totalTasks + tTasks : tTasks, completedTasks: append ? prev.completedTasks + cTasks : cTasks, pendingTasks: append ? prev.pendingTasks + pTasks : pTasks, overdueTasks: append ? prev.overdueTasks + oTasks : oTasks, completionRate: updated.length > 0 ? (updated.filter(t => t.status === "completed").length / updated.length * 100).toFixed(1) : 0, barChartData: Object.entries(monthlyData).map(([name, d]) => ({ name, completed: d.completed, pending: d.pending })), pieChartData: [{ name: "Completed", value: cTasks, color: "#22c55e" }, { name: "Pending", value: pTasks, color: "#facc15" }, { name: "Overdue", value: oTasks, color: "#ef4444" }], completedRatingOne: append ? prev.completedRatingOne + r1 : r1, completedRatingTwo: append ? prev.completedRatingTwo + r2 : r2, completedRatingThreePlus: append ? prev.completedRatingThreePlus + r3 : r3 };
      });
      if (data.length < batchSize) setHasMoreData(false);
      setIsLoadingMore(false);
    } catch (e) { console.error(e); setIsLoadingMore(false); }
  };

  const handleDateRangeChange = async (startDate, endDate) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate, filtered: true });
      try {
        setIsLoadingMore(true);
        if (dashboardType === "checklist") {
          const filteredData = await fetchChecklistDataByDateRangeApi(startDate, endDate, dashboardStaffFilter, departmentFilter, 1, batchSize, 'all');
          const stats = await getChecklistDateRangeStatsApi(startDate, endDate, dashboardStaffFilter, departmentFilter);
          processFilteredData(filteredData, stats);
        } else {
          await fetchDepartmentDataWithDateRange(startDate, endDate);
        }
      } catch (e) { console.error(e); } finally { setIsLoadingMore(false); }
    } else {
      setDateRange({ startDate: "", endDate: "", filtered: false });
      setFilteredDateStats({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0, completionRate: 0 });
      fetchDepartmentData(1, false);
    }
  };

  useEffect(() => {
    getUniqueDepartmentsApi().then(d => {
      const access = localStorage.getItem("user_access") || "";
      const depts = access ? access.split(',').map(x => x.trim().toLowerCase()) : [];
      setAvailableDepartments(userRole === "admin" || userRole === "super_admin" ? (depts.length > 0 ? d.filter(x => depts.includes(x.toLowerCase())) : d) : []);
    });
  }, [dashboardType, userRole]);

  useEffect(() => {
    const loadStaff = async () => {
      if (dashboardType === 'checklist' && departmentFilter !== 'all') {
        const s = await getStaffNamesByDepartmentApi(departmentFilter);
        setAvailableStaff(s || []);
      }
    };
    loadStaff();
  }, [departmentFilter, dashboardType]);

  useEffect(() => {
    fetchDepartmentData(1, false);
    dispatch(totalTaskInTable({ dashboardType, staffFilter: dashboardStaffFilter, departmentFilter }));
    dispatch(completeTaskInTable({ dashboardType, staffFilter: dashboardStaffFilter, departmentFilter }));
    dispatch(pendingTaskInTable({ dashboardType, staffFilter: dashboardStaffFilter, departmentFilter }));
    dispatch(overdueTaskInTable({ dashboardType, staffFilter: dashboardStaffFilter, departmentFilter }));
    dispatch(notDoneTaskInTable({ dashboardType, staffFilter: dashboardStaffFilter, departmentFilter }));
  }, [dashboardType, dashboardStaffFilter, departmentFilter, dispatch]);

  useEffect(() => {
    setDashboardStaffFilter("all"); setDepartmentFilter("all");
    setDateRange({ startDate: "", endDate: "", filtered: false });
  }, [dashboardType]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
        <div className="max-w-[1600px] mx-auto space-y-10">
          <DashboardHeader
            dashboardType={dashboardType} setDashboardType={setDashboardType}
            availableStaff={availableStaff} dashboardStaffFilter={dashboardStaffFilter}
            setDashboardStaffFilter={setDashboardStaffFilter} departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter} availableDepartments={availableDepartments}
            userRole={userRole} onDateRangeChange={handleDateRangeChange}
          />
          <StatisticsCards
            totalTask={dateRange.filtered ? filteredDateStats.totalTasks : departmentData.totalTasks}
            completeTask={dateRange.filtered ? filteredDateStats.completedTasks : departmentData.completedTasks}
            pendingTask={dateRange.filtered ? filteredDateStats.pendingTasks : departmentData.pendingTasks}
            overdueTask={dateRange.filtered ? filteredDateStats.overdueTasks : departmentData.overdueTasks}
            dashboardType={dashboardType}
          />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2 space-y-8">
              <TaskNavigationTabs
                dashboardType={dashboardType} taskView={taskView} setTaskView={setTaskView}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                dashboardStaffFilter={dashboardStaffFilter} departmentFilter={departmentFilter}
                username={username} onTaskComplete={() => fetchDepartmentData(1, false)}
              />
            </div>
            <div className="space-y-8">
              <CompletionRateCard
                completionRate={dateRange.filtered ? filteredDateStats.completionRate : departmentData.completionRate}
                pieChartData={departmentData.pieChartData}
              />
              <TasksCompletionChart
                completedRatingOne={departmentData.completedRatingOne}
                completedRatingTwo={departmentData.completedRatingTwo}
                completedRatingThreePlus={departmentData.completedRatingThreePlus}
              />
            </div>
          </div>

          <div className="w-full">
            <StaffTasksTable
              dashboardType={dashboardType} dashboardStaffFilter={dashboardStaffFilter}
              departmentFilter={departmentFilter}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}