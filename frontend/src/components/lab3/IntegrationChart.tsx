import React from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, ReferenceLine } from 'recharts';
import {PointDTO} from "../../types";

interface Props {
    points: PointDTO[];
    a: number;
    b: number;
}

const IntegrationChart = ({ points, a, b }: { points: any[], a: number, b: number }) => {
    if (!points || !Array.isArray(points)) {
        return (
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                <span className="text-slate-400 text-xs">Данные графика недоступны для текущего интервала</span>
            </div>
        );
    }

    const data = points.map(p => ({
        ...p,
        shadedY: (p.x >= a && p.x <= b) ? p.y : 0
    }));

    return (
        <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tickFormatter={(v) => v.toFixed(1)} />
                    <YAxis />
                    <Tooltip
                        formatter={(value: any) => parseFloat(value).toFixed(4)}
                        labelFormatter={(label: any) => {
                            const numLabel = typeof label === 'number' ? label : parseFloat(label);
                            return `x: ${numLabel.toFixed(2)}`;
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="shadedY"
                        stroke="none"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        connectNulls
                    />

                    <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#2563eb"
                        dot={false}
                        strokeWidth={2}
                    />

                    <ReferenceLine x={a} stroke="red" label={{ value: 'a', position: 'top' }} />
                    <ReferenceLine x={b} stroke="red" label={{ value: 'b', position: 'top' }} />
                    <ReferenceLine y={0} stroke="#000" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IntegrationChart;