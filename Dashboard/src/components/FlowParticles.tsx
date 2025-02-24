import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface FlowParticlesProps {
  pathD: string; // De lijn (path) waarop de bolletjes bewegen
  color: string;
}

const FlowParticles: React.FC<FlowParticlesProps> = ({ pathD, color }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const path = svg.append("path")
      .attr("d", pathD)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .node();

    if (!path) return; // Als er geen path is, stoppen

    // **Animatie Bolletjes**
    const circle = svg.append("circle")
      .attr("r", 5)
      .attr("fill", color);

    function animate() {
      circle.transition()
        .duration(2000)
        .attrTween("transform", function () {
          return function (t) {
            const length = path ? path.getTotalLength() : 0;
            if (!length) return ""; // Check of lengte geldig is

            if (!path) return ""; // Check of path geldig is
            const p = path.getPointAtLength(t * length);
            if (!p) return ""; // Check of p geldig is
            return `translate(${p.x},${p.y})`;
          };
        })
        .on("end", animate);
    }

    animate();
  }, [pathD, color]);

  return <svg ref={svgRef} className="absolute w-full h-full"></svg>;
};

export default FlowParticles;
