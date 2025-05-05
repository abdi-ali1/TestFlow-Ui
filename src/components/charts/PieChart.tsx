import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const PieChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Sample data
    const data = [
      { name: 'Passed', value: 83, color: '#10B981' },
      { name: 'Failed', value: 12, color: '#EF4444' },
      { name: 'Skipped', value: 5, color: '#F59E0B' },
    ];
    
    // Chart dimensions
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const radius = Math.min(width, height) / 2 * 0.8;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // Create pie layout
    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);
    
    // Generate arc
    const arc = d3.arc<any>()
      .innerRadius(radius * 0.5) // Donut chart
      .outerRadius(radius);
    
    // Generate pie segments
    const segments = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
        .attr('class', 'arc');
    
    // Draw segments with animation
    segments.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0.9);
    
    // Add percentage labels
    segments.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text(d => `${d.data.value}%`);
    
    // Add legend
    const legend = svg.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${radius + 20}, ${-radius + 20 + i * 25})`);
    
    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('rx', 4)
      .attr('fill', d => d.color);
    
    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .attr('font-size', '14px')
      .attr('fill', '#4B5563')
      .text(d => `${d.name} (${d.value}%)`);
    
  }, []);
  
  return <div ref={chartRef} className="w-full h-full"></div>;
};