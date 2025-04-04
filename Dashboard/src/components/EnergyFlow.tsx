import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const SENSOR_MAP: Record<string, string[]> = {
  "Koolstofarm": ["today_load_2"],

  "Zonne-energie": [
    "today_s_pv_generation_1",
    "today_s_pv_generation_2",
    "today_s_pv_generation_4"
  ],

  "Net-import": ["today_energy_import_2"],
  "Net-export": ["today_energy_export_2"],

  "Net": ["today_energy_import_2", "today_energy_export_2"],

  "Batterij-opladen": ["today_battery_charge_2"],
  "Batterij-ontladen": ["today_battery_discharge_2"],

  "Thuis": ["today_load_2"]
};


const EnergyFlow = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [sensorValues, setSensorValues] = useState<Record<string, number>>({});

  const fetchSensors = async () => {
    const entity_ids = Object.values(SENSOR_MAP).flat();
    const res = await fetch("http://localhost:3000/api/entities/values", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ entity_ids })
    });

    if (!res.ok) {
      console.error("Server error:", res.status, await res.text());
      return;
    }

    const raw: Record<string, number | null> = await res.json();
    const values: Record<string, number> = {};

    for (const node in SENSOR_MAP) {
      const ids = SENSOR_MAP[node];
      if (node === 'Net') {
        const importVal = raw['today_energy_import_2'] ?? 0;
        const exportVal = raw['today_energy_export_2'] ?? 0;
        values[node] = parseFloat((importVal + exportVal).toFixed(2));
        values['Net_import'] = importVal;
        values['Net_export'] = exportVal;
      } else if (node === 'Batterij') {
        const charge = raw['today_battery_charge_2'] ?? 0;
        const discharge = raw['today_battery_discharge_2'] ?? 0;
        values[node] = parseFloat((charge + discharge).toFixed(2));
        values['Batterij_charge'] = charge;
        values['Batterij_discharge'] = discharge;
      } else {
        const total = ids.map(id => raw[id] ?? 0).reduce((a, b) => a + b, 0);
        values[node] = parseFloat(total.toFixed(2));
      }
    }

    setSensorValues(values);
  };

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 450;

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet");

    const nodes = [
      { id: "Koolstofarm", x: 100, y: 50, color: "#2ecc71", icon: "🌿", value:"" },
      { id: "Zonne-energie", x: 350, y: 50, color: "#f1c40f", icon: "☀️", value:"" },
      { id: "Net", x: 100, y: 225, color: "#3498db", icon: "🗼", value:"" },
      { id: "Thuis", x: 600, y: 225, color: "#2ecc71", icon: "🏠", value:"" },
      { id: "Batterij", x: 350, y: 400, color: "#BD5176", icon: "🔋", value:"" }
    ];

    nodes.forEach(n => {
      if (n.id === "Net") {
        const imp = sensorValues['Net_import'] ?? 0;
        const exp = sensorValues['Net_export'] ?? 0;
        n.value = `↓ ${imp} kWh\n↑ ${exp} kWh`;
      } else if (n.id === "Batterij") {
        const chg = sensorValues['Batterij_charge'] ?? 0;
        const dis = sensorValues['Batterij_discharge'] ?? 0;
        n.value = `↓ ${chg} kWh\n↑ ${dis} kWh`;
      } else {
        const val = sensorValues[n.id];
        n.value = typeof val === "number" ? `${val} kWh` : "—";
      }
    });

    const links = [
      { source: "Koolstofarm", target: "Net", color: "#2ecc71" },
      { source: "Zonne-energie", target: "Thuis", color: "#f1c40f" },
      { source: "Zonne-energie", target: "Net", color: "#8C70BC" },
      { source: "Zonne-energie", target: "Batterij", color: "#BD5176" },
      { source: "Net", target: "Thuis", color: "#2980b9" },
      { source: "Batterij", target: "Thuis", color: "#416B61" },
      { source: "Batterij", target: "Net", color: "#A0A0A0" }
    ];

    const curvePath = (source: any, target: any, inward = false) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      const sweepFlag = inward ? 0 : 1;
      return `M${source.x},${source.y} A${dr},${dr} 0 0,${sweepFlag} ${target.x},${target.y}`;
    };

    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return;

      const isCurved =
        (link.source === "Zonne-energie" && (link.target === "Thuis" || link.target === "Net")) ||
        (link.source === "Batterij" && (link.target === "Thuis" || link.target === "Net"));

      const inwardCurved =
        (link.source === "Zonne-energie" && link.target === "Thuis") ||
        (link.source === "Batterij" && link.target === "Net");

      const path = svg.append("path")
        .attr("d", isCurved ? curvePath(source, target, inwardCurved) : `M${source.x},${source.y} L${target.x},${target.y}`)
        .attr("stroke", link.color)
        .attr("stroke-width", 4)
        .attr("fill", "none");

      if (!(link.source === "Batterij" && (link.target === "Net" || link.target === "Thuis"))) {
        const circle = svg.append("circle")
          .attr("r", 5)
          .attr("fill", link.color);

        function animate() {
          const duration = 2000 + Math.random() * 3000;
          const delay = Math.random() * 1000;

          circle.transition()
            .delay(delay)
            .duration(duration)
            .attrTween("transform", function () {
              return function (t) {
                const p = path.node()?.getPointAtLength(t * path.node()!.getTotalLength());
                return p ? `translate(${p.x},${p.y})` : '';
              };
            })
            .on("end", animate);
        }

        animate();
      }
    });

    nodes.forEach(node => {
      svg.append("circle")
        .attr("cx", node.x)
        .attr("cy", node.y)
        .attr("r", 50)
        .attr("fill", "black")
        .attr("stroke", node.color)
        .attr("stroke-width", 3);

      svg.append("text")
        .attr("x", node.x)
        .attr("y", node.y - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "26px")
        .text(node.icon);

      const valueLines = node.value.split("\n");
      valueLines.forEach((line, i) => {
        svg.append("text")
          .attr("x", node.x)
          .attr("y", node.y + 25 + i * 18)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "18px")
          .text(line);
      });
    });

  }, [sensorValues]);

  return (
    <div className="flex justify-center items-center p-4">
      <svg ref={svgRef} className="w-full h-[450px]"></svg>
    </div>
  );
};

export default EnergyFlow;