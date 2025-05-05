import React, { useState } from 'react';
import { Calendar, Download, Filter, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import MetricCard from '../components/reports/MetricCard';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';
import DateRangePicker from '../components/ui/DateRangePicker';
import { useTestContext } from '../context/TestContext';

const ReportDashboard: React.FC = () => {
  const { testResults } = useTestContext();
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '2023-10-01',
    end: '2023-10-31'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Reports</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowDatePicker(!showDatePicker)}
              icon={<Calendar className="h-4 w-4" />}
            >
              {dateRange.start} - {dateRange.end}
            </Button>
            {showDatePicker && (
              <div className="absolute right-0 mt-2 z-10">
                <DateRangePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onChange={({start, end}) => {
                    setDateRange({start, end});
                    setShowDatePicker(false);
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              </div>
            )}
          </div>
          <Button
            variant="outline"
            icon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Button
            variant="primary"
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Tests"
          value="184"
          change="+12%"
          isPositive={true}
          icon={<div className="bg-blue-100 p-3 rounded-full"><Calendar className="h-6 w-6 text-blue-600" /></div>}
        />
        <MetricCard
          title="Success Rate"
          value="92.4%"
          change="+3.2%"
          isPositive={true}
          icon={<div className="bg-green-100 p-3 rounded-full"><Calendar className="h-6 w-6 text-green-600" /></div>}
        />
        <MetricCard
          title="Average Duration"
          value="1.8s"
          change="-0.3s"
          isPositive={true}
          icon={<div className="bg-indigo-100 p-3 rounded-full"><Calendar className="h-6 w-6 text-indigo-600" /></div>}
        />
        <MetricCard
          title="Failed Tests"
          value="14"
          change="+2"
          isPositive={false}
          icon={<div className="bg-red-100 p-3 rounded-full"><Calendar className="h-6 w-6 text-red-600" /></div>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Test Results Over Time</h2>
            <button className="text-blue-600 text-sm">Last 30 days</button>
          </div>
          <div className="p-4 h-72">
            <LineChart />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Result Distribution</h2>
            <button className="text-blue-600 text-sm">All tests</button>
          </div>
          <div className="p-4 h-72">
            <PieChart />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium text-gray-800">Test Execution Times</h2>
          <button className="text-blue-600 text-sm">Last 7 days</button>
        </div>
        <div className="p-4 h-80">
          <BarChart />
        </div>
      </div>

      {/* Recent Test Results */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium text-gray-800">Recent Test Runs</h2>
          <button className="text-blue-600 text-sm flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {testResults.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No test results available</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{result.testName}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {result.date} • {result.duration}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      result.status === 'Passed' 
                        ? 'bg-green-50 text-green-700' 
                        : result.status === 'Failed'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {result.status}
                    </div>
                    <Button
                      variant="outline"
                      small
                      onClick={() => window.location.href = `/reports/${index}`}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;