import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const LineChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Sample data
    const data = [
      { date: '2023-10-01', successRate: 92, totalTests: 25 },
      { date: '2023-10-05', successRate: 88, totalTests: 32 },
      { date: '2023-10-10', successRate: 94, totalTests: 28 },
      { date: '2023-10-15', successRate: 90, totalTests: 30 },
      { date: '2023-10-20', successRate: 96, totalTests: 35 },
      { date: '2023-10-25', successRate: 93, totalTests: 40 },
      { date: '2023-10-30', successRate: 95, totalTests: 38 },
    ];
    
    // Chart dimensions
    const margin = { top: 20, right: 80, bottom: 50, left: 50 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;
    
    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map(d => ({
      ...d,
      date: parseDate(d.date) || new Date()
    }));
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date) as [Date, Date])
      .range([0, width]);
    
    const y1 = d3.scaleLinear()
      .domain([80, 100])
      .range([height, 0]);
    
    const y2 = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.totalTests) || 0])
      .range([height, 0]);
    
    // Create axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')))
      .selectAll('text')
        .attr('font-size', '12px')
        .attr('fill', '#6B7280');
    
    svg.append('g')
      .call(d3.axisLeft(y1).ticks(5))
      .selectAll('text')
        .attr('font-size', '12px')
        .attr('fill', '#6B7280');
    
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(y2).ticks(5))
      .selectAll('text')
        .attr('font-size', '12px')
        .attr('fill', '#6B7280');
    
    // Add gridlines
    svg.selectAll('gridline-x')
      .data(y1.ticks(5))
      .enter()
      .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => y1(d))
        .attr('y2', d => y1(d))
        .attr('stroke', '#E5E7EB')
        .attr('stroke-width', 1);
    
    // Create line for success rate
    const successLine = d3.line<any>()
      .x(d => x(d.date))
      .y(d => y1(d.successRate))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 3)
      .attr('d', successLine);
    
    // Create line for total tests
    const testsLine = d3.line<any>()
      .x(d => x(d.date))
      .y(d => y2(d.totalTests))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', testsLine);
    
    // Add dots for success rate
    svg.selectAll('.dot-success')
      .data(formattedData)
      .enter()
      .append('circle')
        .attr('class', 'dot-success')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y1(d.successRate))
        .attr('r', 5)
        .attr('fill', '#3B82F6')
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    
    // Add dots for total tests
    svg.selectAll('.dot-tests')
      .data(formattedData)
      .enter()
      .append('circle')
        .attr('class', 'dot-tests')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y2(d.totalTests))
        .attr('r', 5)
        .attr('fill', '#10B981')
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    
    // Add labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#3B82F6')
      .text('Success Rate (%)');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', width + margin.right - 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#10B981')
      .text('Total Tests');
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 0)`);
    
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 10)
      .attr('y2', 10)
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 3);
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 10)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#4B5563')
      .text('Success Rate');
    
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 30)
      .attr('y2', 30)
      .attr('stroke', '#10B981')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 30)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#4B5563')
      .text('Total Tests');
    
  }, []);
  
  return <div ref={chartRef} className="w-full h-full"></div>;
};