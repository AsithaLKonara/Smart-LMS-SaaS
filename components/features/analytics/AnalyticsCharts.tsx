
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface AnalyticsChartsProps {
    completionData: any[];
    revenueData: any[];
}

export function AnalyticsCharts({ completionData, revenueData }: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Course Completion Rates (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={completionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="title" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                itemStyle={{ color: '#22d3ee' }}
                            />
                            <Bar dataKey="rate" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Revenue Insights (USD)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                itemStyle={{ color: '#8b5cf6' }}
                            />
                            <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
