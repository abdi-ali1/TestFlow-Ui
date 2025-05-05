import React, { useState } from 'react';
import { Search, Plus, FolderOpen, Clock, Star } from 'lucide-react';
import { useTestContext } from '../context/TestContext';
import Button from '../components/ui/Button';

const TestLibrary: React.FC = () => {
  const { testFlows } = useTestContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tests based on search query
  const filteredTests = testFlows.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Library</h1>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/'}
          icon={<Plus className="h-4 w-4" />}
        >
          New Test
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tests..."
            className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800">Saved Test Flows</h2>
        </div>
        
        {filteredTests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tests found</h3>
            <p className="text-gray-500 mb-4">Create your first test or try a different search.</p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              icon={<Plus className="h-4 w-4" />}
            >
              Create Test
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTests.map((test, index) => (
              <div key={index} className="p-4 transition-colors hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {test.lastModified}
                      </span>
                      <span>{test.nodes.length} nodes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-full hover:bg-gray-100">
                      <Star className="h-4 w-4 text-gray-400" />
                    </button>
                    <Button
                      variant="outline"
                      small
                      onClick={() => window.location.href = '/'}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLibrary;