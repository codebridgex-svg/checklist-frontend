"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  ClipboardList,
  Database,
  ChevronRight,
  Zap,
  Settings,
  CirclePlus,
  UserRound,
  CalendarCheck,
  BookmarkCheck,
  History,
  Video,
  Calendar,
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("user-name");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email_id");

    if (!storedUsername) {
      navigate("/login");
      return;
    }

    setUsername(storedUsername || "User");
    setUserRole(storedRole || "user");
    setUserEmail(storedEmail || "user@example.com");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const routes = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      showFor: ["admin", "user", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/quick-task",
      label: "Quick Task",
      icon: Zap,
      showFor: ["admin", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/assign-task",
      label: "Assign Task",
      icon: CheckSquare,
      showFor: ["admin", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/delegation",
      label: "Delegation",
      icon: ClipboardList,
      showFor: ["admin", "user", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/data/sales",
      label: "Checklist",
      icon: BookmarkCheck,
      showFor: ["admin", "user", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/history",
      label: "Admin Approval",
      icon: History,
      showFor: ["admin", "user", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: Calendar,
      showFor: ["admin", "user", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/holidays",
      label: "Holiday List",
      icon: CalendarCheck,
      showFor: ["admin", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/setting",
      label: "Settings",
      icon: Settings,
      showFor: ["admin", "super_admin", "pc role"],
    },
    {
      href: "/dashboard/training-video",
      label: "Training Video",
      icon: Video,
      showFor: ["admin", "user", "super_admin", "pc role"],
    },
  ];

  const accessibleRoutes = routes.filter((route) => 
    route.showFor.includes(userRole.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col shadow-xl z-30">
        <div className="flex h-24 items-center px-6 border-b border-slate-100 bg-white">
          <Link to="/dashboard/admin" className="flex items-center gap-4 group">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 group-hover:scale-105 transition-all duration-300">
               <img
                  src="/CodeBridgeX2.png"
                  alt="CodeBridgeX"
                  className="h-8 w-auto brightness-110 object-contain"
                />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 tracking-tighter leading-none text-lg uppercase">Task Management</span>
              <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase mt-1">System</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
              <ul className="space-y-1.5">
                {accessibleRoutes.map((route) => {
                  const isActive = location.pathname === route.href;
                  return (
                    <li key={route.label}>
                      <Link
                        to={route.href}
                        className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <route.icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                          <span>{route.label}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>

        <div className="mt-auto p-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold ring-4 ring-white shadow-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="shrink-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{username}</p>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">{userRole}</p>
                </div>
             </div>
             <button 
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-rose-600 border border-rose-100 bg-rose-50 hover:bg-rose-100 transition-colors duration-200 shadow-sm"
             >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
             </button>
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-1">
             <span className="text-[10px] text-slate-400 uppercase tracking-wider">Solution provided by</span>
             <a href="https://www.botivate.in/" target="_blank" rel="noopener" className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <span className="text-xs font-black text-indigo-600 tracking-tighter">BOTIVATE</span>
             </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Modern Header */}
        <header className="sticky top-0 z-60 bg-white border-b border-slate-200/80 h-20 transition-all duration-300 shadow-sm flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 hidden sm:block uppercase tracking-tight">
                {routes.find(r => r.href === location.pathname)?.label || "Overview"}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col text-right">
                <span className="text-sm font-black text-slate-900 leading-none mb-1">{username}</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{userRole}</span>
             </div>

             <button 
               onClick={() => setIsUserPopupOpen(true)}
               className="shrink-0 w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all ring-4 ring-slate-50"
             >
                <UserRound className="h-5 w-5 text-white" />
             </button>
          </div>
        </header>

        {/* Page Content Overflow Scroll */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 bg-[#fdfdfd] relative main-content">
          <div className="max-w-[1400px] mx-auto">
             {children}
          </div>
        </main>

        {/* Mobile Navbar Tab (Pill Design) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
           <nav className="glass rounded-3xl shadow-2xl shadow-indigo-900/10 px-6 py-4 flex items-center justify-between pointer-events-auto">
              {[
                { icon: LayoutDashboard, path: "/dashboard/admin" },
                { icon: BookmarkCheck, path: "/dashboard/data/sales" },
                { icon: CirclePlus, path: "/dashboard/assign-task", primary: true },
                { icon: BookmarkCheck, path: "/dashboard/delegation" },
                { icon: UserRound, path: "profile", isPopup: true }
              ].map((tab, i) => {
                const isActive = location.pathname === tab.path;
                if (tab.primary) {
                  return (
                    <Link key={i} to={tab.path} className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-white active:scale-90 transition-all">
                       <tab.icon className="h-6 w-6" />
                    </Link>
                  )
                }
                return (
                  <div key={i} 
                    onClick={() => tab.isPopup ? setIsUserPopupOpen(true) : navigate(tab.path)}
                    className={`p-2 rounded-xl transition-all ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
                  >
                    <tab.icon className="h-5 w-5" />
                  </div>
                )
              })}
           </nav>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <Link to="/dashboard/admin" className="flex items-center gap-4 group">
                 <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100">
                    <img
                      src="/CodeBridgeX2.png"
                      alt="CodeBridgeX"
                      className="h-7 w-auto brightness-110 object-contain"
                    />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-black text-slate-900 tracking-tighter leading-none text-lg uppercase">Task Management</span>
                    <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase mt-1">System</span>
                 </div>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {accessibleRoutes.map((route) => {
                const isActive = location.pathname === route.href;
                return (
                  <Link
                    key={route.label}
                    to={route.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <route.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    {route.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center text-white text-lg font-bold border-4 border-white shadow-md">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">{username}</p>
                    <p className="text-xs text-slate-500 uppercase font-medium">{userRole}</p>
                  </div>
               </div>
               <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:border-slate-300 transition-all"
               >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern User Popup / Modal */}
      {isUserPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 lg:hidden" onClick={() => setIsUserPopupOpen(false)} />
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsUserPopupOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full gradient-bg flex items-center justify-center mb-6 ring-8 ring-indigo-50 shadow-xl">
                <span className="text-4xl font-black text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">{username}</h3>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-4">{userRole}</p>
                            <div className="h-px bg-slate-100 mb-2" />
              
              <div className="w-full space-y-4">
                <div className="flex flex-col text-left px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Email Address</span>
                  <span className="text-sm font-medium text-slate-700">{userEmail}</span>
                </div>
                
                <div className="flex flex-col text-left px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Account Status</span>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-sm font-bold text-emerald-600">Active Session</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-10">
                 <button
                  onClick={() => setIsUserPopupOpen(false)}
                  className="py-3 px-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="py-3 px-4 bg-rose-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
