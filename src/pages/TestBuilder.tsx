import React, { useState, useEffect } from 'react';
import { Save, Play, Download, Plus } from 'lucide-react';
import NodeCanvas from '../components/flow/NodeCanvas';
import NodePanel from '../components/flow/NodePanel';
import { useTestContext } from '../context/TestContext';
import Button from '../components/ui/Button';
import { executeTest } from '../lib/testExecutor';
import { buildResultFromExecution } from '../lib/resultBuilder';

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

      // Hardcoded arg mapping per keyword
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
        context: Object.keys(contextEntries).length > 0 ? contextEntries : undefined
      }
    };

    console.log('🚀 Verstuurde payload naar backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await executeTest(payload);
      const result = buildResultFromExecution(payload, response, testResults.length);
      setTestResults(prev => [result, ...prev]);
      alert('✅ Test succesvol uitgevoerd');
    } catch (err) {
      console.error('❌ Fout bij uitvoeren test:', err);
      alert('❌ Test mislukt');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{testName}</h1>
          <div className="mt-1">
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="text-gray-500 bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => saveFlow(testName)}
            icon={<Save className="h-4 w-4" />}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={runTest}
            icon={<Play className="h-4 w-4" />}
          >
            Run Test
          </Button>
          <Button
            variant="primary"
            onClick={exportScript}
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>

          <Button
            className="text-blue-600 flex items-center text-sm gap-1"
            onClick={() => {
              console.log('👉 Add Node triggered');
              setPendingNode({ type: 'trigger', label: 'Page Load' });
            }}
          >
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-64 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Test Elements</h2>
          </div>
          <NodePanel />
        </div>

        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Flow Editor</h2>
            <button
              className="text-blue-600 flex items-center text-sm gap-1"
              onClick={() => {
                console.log('➕ Adding node immediately');
                addNode({
                  x: 100 + Math.random() * 500,
                  y: 100 + Math.random() * 300,
                  type: 'trigger',
                  label: 'Page Load',
                });
              }}
            >
              <Plus className="h-4 w-4" />
              Add Node
            </button>
          </div>
          <NodeCanvas pendingNode={pendingNode} onNodeAdded={() => setPendingNode(null)} />
        </div>
      </div>
    </div>
  );
};

export default TestBuilder;
