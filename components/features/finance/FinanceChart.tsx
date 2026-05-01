
'use client';

import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";

interface FinanceChartProps {
    data: { date: string, amount: number }[];
}

export function FinanceChart({ data }: FinanceChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10}
                    tickFormatter={(str) => format(new Date(str), 'MMM d')}
                />
                <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10}
                    tickFormatter={(val) => `Rs.${val}`}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#22D3EE' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#22D3EE" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
