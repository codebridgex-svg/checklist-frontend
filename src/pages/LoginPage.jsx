"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../redux/slice/loginSlice"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, userData, error } = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [toast, setToast] = useState({ show: false, message: "", type: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoginLoading(true)
    dispatch(loginUser(formData))
  }

  useEffect(() => {
    if (isLoggedIn && userData) {
      localStorage.setItem('user-name', userData.user_name || userData.username || "")
      localStorage.setItem('role', userData.role || "")
      localStorage.setItem('email_id', userData.email_id || userData.email || "")
      navigate("/dashboard/admin")
    } else if (error) {
      showToast(error, "error")
      setIsLoginLoading(false)
    }
  }, [isLoggedIn, userData, error, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" })
    }, 5000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="card-premium overflow-hidden bg-white/70 backdrop-blur-2xl border-white/40">
          {/* Logo Section */}
          <div className="pt-12 pb-8 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 to-violet-600/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 transform group-hover:scale-105 transition-all duration-500">
                <img
                  src="/CodeBridgeX2.png"
                  alt="CodeBridgeX"
                  className="h-14 w-auto brightness-110"
                />
              </div>
            </div>
            
            <div className="mt-8 text-center space-y-1">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Dashboard</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Checklist & Delegation System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity</label>
              <div className="relative">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-slate-100/50 border border-slate-200 rounded-xl text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Key</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-slate-100/50 border border-slate-200 rounded-xl text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full h-12 mt-4 rounded-xl bg-linear-to-r from-slate-900 to-slate-800 text-white text-xs font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoginLoading ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Authenticate"
                )}
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>
        </div>

        {/* Footer Branding */}
        <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
           <div className="h-px w-8 bg-slate-200" />
           <a
             href="https://www.botivate.in/"
             target="_blank"
             rel="noopener noreferrer"
             className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors"
           >
             Powered by BOTIVATE
           </a>
           <div className="h-px w-8 bg-slate-200" />
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl transition-all duration-500 z-50 animate-in slide-in-from-bottom-8 ${
          toast.type === "success"
            ? "bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest ring-1 ring-white/10"
            : "bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-rose-200"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default LoginPage
