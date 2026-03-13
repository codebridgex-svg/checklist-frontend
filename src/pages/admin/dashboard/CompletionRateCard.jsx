"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export default function CompletionRateCard({ completionRate, pieChartData }) {
  // Use provided pieChartData or fallback to empty default
  const data = pieChartData && pieChartData.length > 0 
    ? pieChartData 
    : [
        { name: "Completed", value: 0, color: "#10b981" },
        { name: "Remaining", value: 100, color: "#e2e8f0" }
      ];

  const rate = completionRate || (data[0].value > 0 ? ((data[0].value / (data.reduce((a, b) => a + b.value, 0))) * 100).toFixed(1) : 0);

  return (
    <div className="card-premium p-6 bg-white/50 backdrop-blur-xl border-none flex flex-col items-center justify-center text-center">
      <div className="w-full text-left mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-tight">Achievement Score</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Overall completion efficiency</p>
      </div>

      <div className="relative w-full aspect-square max-w-[200px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-500" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900 tracking-tighter">{rate}%</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Target Met</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 mt-8">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
             <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ backgroundColor: item.color }} />
             <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter truncate w-full">{item.value}</span>
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}