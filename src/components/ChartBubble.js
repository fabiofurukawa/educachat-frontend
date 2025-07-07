import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ChartBubble = ({ data, title }) => (
  <div style={{
    background: "#fff",
    borderRadius: 12,
    margin: "12px 0",
    padding: 18,
    boxShadow: "0 1.5px 8px rgba(56, 86, 178, 0.06)"
  }}>
    {title && <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>}
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="valor" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartBubble;
