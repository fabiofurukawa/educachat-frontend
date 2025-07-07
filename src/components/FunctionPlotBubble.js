import React from "react";
import FunctionPlot from "react-function-plot";

const FunctionPlotBubble = ({ fn, domain, title }) => (
  <div style={{
    background: "#fff",
    borderRadius: 12,
    margin: "12px 0",
    padding: 18,
    minWidth: 250
  }}>
    {title && <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>}
    <div style={{ width: "100%", height: 220 }}>
      <FunctionPlot
        width={340}
        height={200}
        options={{
          grid: true,
          xAxis: { domain: domain || [-10, 10] },
          yAxis: { domain: [-10, 10] },
          data: [{
            fn: fn,
            sampler: "builtIn",
            graphType: "polyline"
          }]
        }}
      />
    </div>
  </div>
);

export default FunctionPlotBubble;
