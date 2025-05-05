import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const BarChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Sample data
    const data = [
      { name: 'Login Test', value: 2.3 },
      { name: 'Checkout', value: 3.5 },
      { name: 'Search', value: 1.8 },
      { name: 'Registration', value: 2.7 },
      { name: 'Profile Edit', value: 1.4 },
      { name: 'Dashboard', value: 2.1 },
      { name: 'Product View', value: 1.9 },
    ];
    
    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.3);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height, 0]);
    
    // Create and style bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name) || 0)
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value))
        .attr('rx', 4)
        .attr('fill', '#3B82F6')
        .attr('opacity', 0.8);
    
    // Add value labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
        .attr('class', 'label')
        .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 10)
        .attr('text-anchor', 'middle')
        .text(d => `${d.value}s`)
        .attr('font-size', '12px')
        .attr('fill', '#6B7280');
    
    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('font-size', '12px')
        .attr('fill', '#6B7280');
    
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}s`))
      .selectAll('text')
        .attr('font-size', '12px')
        .attr('fill', '#6B7280');
    
    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#4B5563')
      .text('Test Name');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#4B5563')
      .text('Duration (seconds)');
    
  }, []);
  
  return <div ref={chartRef} className="w-full h-full"></div>;
};