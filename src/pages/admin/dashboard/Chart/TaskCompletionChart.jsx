"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function TasksCompletionChart({ completedRatingOne, completedRatingTwo, completedRatingThreePlus }) {
  const data = [
    { name: "Rating 1 (Slowest)", value: completedRatingOne || 0, color: "#f43f5e" }, // Rose 500
    { name: "Rating 2 (Medium)", value: completedRatingTwo || 0, color: "#fbbf24" },  // Amber 400
    { name: "Rating 3+ (Fastest)", value: completedRatingThreePlus || 0, color: "#10b981" }, // Emerald 500
  ].filter(item => item.value > 0);

  // Fallback if no data
  const displayData = data.length > 0 ? data : [{ name: "No Rated Tasks", value: 1, color: "#e2e8f0" }];

  return (
    <div className="card-premium p-6 h-full flex flex-col bg-white/50 backdrop-blur-xl border-none">
      <div className="mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Performance Distribution</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Based on Task Completion Ratings</p>
      </div>
      
      <div className="flex-1 min-h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="rgba(255,255,255,0.8)" 
                  strokeWidth={2}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(8px)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              itemStyle={{ color: '#0f172a' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  {payload.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
