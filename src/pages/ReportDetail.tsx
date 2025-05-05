import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Download, RefreshCw as Refresh, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useTestContext } from '../context/TestContext';
import { LineChart } from '../components/charts/LineChart';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { testResults } = useTestContext();
  const result = testResults[Number(id) || 0] || {
    testName: 'Login Flow Test',
    status: 'Passed',
    date: 'Oct 15, 2023',
    duration: '1.45s',
    steps: [
      { name: 'Navigate to login page', status: 'Passed', duration: '0.3s' },
      { name: 'Enter username', status: 'Passed', duration: '0.2s' },
      { name: 'Enter password', status: 'Passed', duration: '0.2s' },
      { name: 'Click login button', status: 'Passed', duration: '0.5s' },
      { name: 'Verify dashboard loads', status: 'Passed', duration: '0.25s' }
    ]
  };

  const StatusIcon = () => {
    if (result.status === 'Passed') return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (result.status === 'Failed') return <XCircle className="h-8 w-8 text-red-500" />;
    return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/reports" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{result.testName}</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <StatusIcon />
              <div>
                <h2 className={`text-lg font-medium ${
                  result.status === 'Passed' 
                    ? 'text-green-700' 
                    : result.status === 'Failed'
                    ? 'text-red-700'
                    : 'text-yellow-700'
                }`}>
                  {result.status}
                </h2>
                <p className="text-sm text-gray-500">Test Result</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{result.duration}</h2>
                <p className="text-sm text-gray-500">Execution Time</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{result.date}</h2>
                <p className="text-sm text-gray-500">Run Date</p>
              </div>
            </div>

            <div className="ml-auto flex gap-3">
              <Button
                variant="outline"
                onClick={() => {}}
                icon={<Refresh className="h-4 w-4" />}
              >
                Re-run
              </Button>
              <Button
                variant="primary"
                onClick={() => {}}
                icon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Performance Metrics</h2>
          </div>
          <div className="p-4 h-80">
            <LineChart />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Steps Execution</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {result.steps.map((step, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {step.status === 'Passed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{step.name}</p>
                      <p className="text-sm text-gray-500">{step.duration}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      step.status === 'Passed' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-800">Test Flow</h2>
        </div>
        <div className="p-6">
          <img 
            src="https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg" 
            alt="Test flow diagram" 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;