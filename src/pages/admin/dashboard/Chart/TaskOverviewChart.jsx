"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function TasksOverviewChart({ data }) {
  return (
    <div className="card-premium p-6 h-full flex flex-col bg-white/50 backdrop-blur-xl border-none">
      <div className="mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Efficiency Analytics</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Monthly task completion trends</p>
      </div>

      <div className="flex-1 min-h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.4)" />
            <XAxis 
              dataKey="name" 
              fontSize={10} 
              fontWeight={900}
              stroke="#64748b" 
              tickLine={false} 
              axisLine={false} 
              tick={{ dy: 10 }}
              className="uppercase tracking-widest"
            />
            <YAxis 
              fontSize={10} 
              fontWeight={900}
              stroke="#64748b" 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(8px)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px' }}
              content={({ payload }) => (
                <div className="flex justify-end gap-6 pb-4">
                  {payload.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey="completed" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={20} />
            <Bar dataKey="pending" stackId="a" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
