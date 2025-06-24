import React, { useState } from 'react';
import { Save, Play, Download, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import NodeCanvas from '../components/flow/NodeCanvas';
import NodePanel from '../components/flow/NodePanel';
import { useTestContext } from '../context/TestContext';
import Button from '../components/ui/Button';
import { executeTest } from '../lib/testExecutor';
import { buildResultFromExecution } from '../lib/resultBuilder';
// @ts-ignore
import demoVideoUrl from './demo_testflow.mp4';

const TestBuilder: React.FC = () => {
  const {
    nodes,
    saveFlow,
    exportScript,
    addNode,
    setTestResults,
    testResults,
  } = useTestContext();

  const [testName, setTestName] = useState('Contract Creation');
  const [pendingNode, setPendingNode] = useState<{ type: string; label: string } | null>(null);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  // State voor uitklapbare video
  const [videoOpen, setVideoOpen] = useState(false);


  const toggleLogs = (idx: number) => {
    setExpandedResult(expandedResult === idx ? null : idx);
  };

  const runTest = async () => {
    const contextEntries: Record<string, string> = {};
    const steps: { keyword: string; args: string[] }[] = [];

    for (const node of nodes) {
      const keyword = node.label;

      if (node.type === 'context') {
        const key = node.config?.key;
        const value = node.config?.value;
        if (key && value) {
          contextEntries[key] = value;
        }
        continue;
      }

      const args: string[] = [];
      switch (keyword) {
        case 'Send POST Request':
          args.push(node.config?.endpoint || '', node.config?.body || '');
          break;
        case 'Validate Response Status':
          args.push(node.config?.status_code || '');
          break;
        case 'Validate XML Schema':
          args.push(node.config?.body || '', node.config?.schema || '');
          break;
        default:
          args.push(...Object.values(node.config || {}));
      }
      steps.push({ keyword, args });
    }

    const payload = {
      json_config: {
        name: testName,
        steps,
        context: Object.keys(contextEntries).length ? contextEntries : undefined,
      },
    };

    console.log('🚀 Sending payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await executeTest(payload);
      console.log('🚀 Raw response', response);

      const result = buildResultFromExecution(payload, response, testResults.length);
      setTestResults(prev => [result, ...prev]);
      setExpandedResult(0);
    } catch (err) {
      console.error('❌ Test execution error:', err);
      alert('❌ Test failed. See console for details.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => saveFlow(testName)} icon={<Save className="h-4 w-4" />}>
            Save
          </Button>
          <Button variant="secondary" onClick={runTest} icon={<Play className="h-4 w-4" />}>
            Run Test
          </Button>
          <Button variant="primary" onClick={exportScript} icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button className="text-blue-600 flex items-center text-sm gap-1" onClick={() => setPendingNode({ type: 'trigger', label: 'Page Load' })}>
            <Plus className="h-4 w-4" /> Add Node
          </Button>
        </div>
      </div>

      {/* Demo Video Section */}
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <button
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 focus:outline-none"
          onClick={() => setVideoOpen(open => !open)}
        >
          <span className="font-medium text-gray-800">Bekijk demo</span>
          {videoOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
        {videoOpen && (
          <div className="px-4 py-4">
            <video
              src={demoVideoUrl}
              controls
              className="w-full h-auto rounded-lg shadow"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Node Palette */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Test Elements</h2>
          </div>
          <NodePanel />
        </div>

        {/* Flow Editor */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Flow Editor</h2>
            <button
              className="text-blue-600 flex items-center text-sm gap-1"
              onClick={() =>
                addNode({
                  x: 150 + Math.random() * 400,
                  y: 120 + Math.random() * 250,
                  type: 'trigger',
                  label: 'Page Load',
                })
              }
            >
              <Plus className="h-4 w-4" /> Add Node
            </button>
          </div>
          <div className="flex-1 relative">
            <NodeCanvas pendingNode={pendingNode} onNodeAdded={() => setPendingNode(null)} />
          </div>
        </div>
      </div>

      {/* Results & Logs */}
      <div className="mt-6 bg-white rounded-lg shadow p-4 overflow-auto" style={{ maxHeight: '30%' }}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Test Results</h2>
        {testResults.length === 0 && (
          <p className="text-gray-500">No results yet. Run a test to see output.</p>
        )}

        {testResults.map((res, idx) => (
          <div
            key={idx}
            className={`mb-3 border-l-4 rounded border border-gray-200 ${
              res.status === 'Passed'
                ? 'border-green-500'
                : res.status === 'Failed'
                ? 'border-red-500'
                : 'border-yellow-400'
            }`}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center bg-gray-50 px-4 py-2 cursor-pointer"
              onClick={() => toggleLogs(idx)}
            >
              <div>
                <span className="font-medium text-gray-800">{res.testName}</span>
                <span className={`ml-2 text-sm ${
                  res.status === 'Passed'
                    ? 'text-green-600'
                    : res.status === 'Failed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {res.status === 'Passed'
                    ? '✅ Passed'
                    : res.status === 'Failed'
                    ? '❌ Failed'
                    : '⚠️ Skipped'}
                </span>
              </div>
              <div>{expandedResult === idx ? <ChevronUp /> : <ChevronDown />}</div>
            </div>

            {/* Expanded content */}
            {expandedResult === idx && (
              <div className="px-4 py-3 bg-white space-y-4">
                <p className="text-sm text-gray-700">🕒 Duration: {res.duration}</p>

                {/* Analyse summary */}
                {res.analysis && (
                  <div className="text-sm bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <p className="font-semibold text-blue-700 mb-2">📊 Analyse-overzicht</p>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
                      <div>✅ Passed: {res.analysis.passed}</div>
                      <div>❌ Failed: {res.analysis.failed}</div>
                      <div>⚠️ Skipped: {res.analysis.skipped}</div>
                      <div>📈 Pass rate: {res.analysis.pass_rate}</div>
                      <div>Total tests: {res.analysis.total}</div>
                    </div>
                  </div>
                )}

                {/* Errors */}
                {(res.analysis?.errors?.length ?? 0) > 0 && (
                  <div className="text-sm bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm">
                    <p className="font-semibold text-red-700 mb-2">🛑 Gevonden fouten</p>
                    <ul className="list-disc list-inside text-xs text-red-800 space-y-1">
                      {res.analysis?.errors?.map((err, i) => (
                        <li key={i}>{err.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Logs */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">📜 Testlog (stdout)</p>
                  <pre
                    className="whitespace-pre-wrap text-xs font-mono bg-gray-100 border border-gray-200 rounded-xl p-3 overflow-auto"
                    style={{ maxHeight: 200 }}
                  >
                    {res.logs || res.stdout || 'No logs available'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestBuilder;
