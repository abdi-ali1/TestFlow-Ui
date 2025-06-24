import React, { createContext, useContext, useState } from 'react';
import { executeTest } from '../lib/testExecutor';
import { buildResultFromExecution } from '../lib/resultBuilder';
import { nodeTemplates } from "../components/flow/nodeTemplates";

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config?: Record<string, string>;
  args?: string[];
}

interface Connection {
  source: string;
  target: string;
  id: string;
}

interface TestFlow {
  id: string;
  name: string;
  nodes: Node[];
  connections: Connection[];
  lastModified: string;
}

export interface TestResult {
  id: string;
  testName: string;
  status: 'Passed' | 'Failed' | 'Skipped';
  date: string;
  duration: string;
  logs?: string;
  stdout ?: string;


  steps: Array<{
    name: string;
    status: 'Passed' | 'Failed' | 'Skipped';
    duration: string;
  }>;

  analysis?: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    pass_rate: string;
    errors: Array<{
      keyword: string;
      message: string;
      line?: number;
    }>;
  };
}

interface TestContextType {
  nodes: Node[];
  connections: Connection[];
  testFlows: TestFlow[];
  testResults: TestResult[];
  setTestResults: React.Dispatch<React.SetStateAction<TestResult[]>>;
  addNode: (position: { x: number; y: number; type: string; label: string }) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  addConnection: (source: string, target: string) => void;
  saveFlow: (name: string) => void;
  runTest: () => void;
  exportScript: () => void;
  dragNode: (type: string, label: string) => void;
  removeNode: (nodeId: string) => void;
  updateNodeConfig: (nodeId: string, key: string, value: string) => void;
  updateNodeArgs: (nodeId: string, newArgs: string[]) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [testFlows, setTestFlows] = useState<TestFlow[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const addNode = (position: { x: number; y: number; type: string; label: string }) => {
    const template = nodeTemplates.find(
      (t) => t.type === position.type && t.label === position.label
    );
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: position.type,
      label: position.label,
      position: { x: position.x, y: position.y },
      config: template?.defaultConfig || {},
      args: template?.defaultArgs || []
    };
    setNodes(prev => [...prev, newNode]);
  };

  const updateNodeConfig = (nodeId: string, key: string, value: string) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId
        ? { ...node, config: { ...node.config, [key]: value } }
        : node
    ));
  };

  const updateNodeArgs = (nodeId: string, newArgs: string[]) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId
        ? { ...node, args: newArgs }
        : node
    ));
  };

  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node =>
      node.id === id ? { ...node, position } : node
    ));
  };

  const addConnection = (source: string, target: string) => {
    if (source === target) return;
    if (connections.some(c => c.source === source && c.target === target)) return;
    const newConnection: Connection = { id: `conn-${connections.length + 1}`, source, target };
    setConnections(prev => [...prev, newConnection]);
  };

  const saveFlow = (name: string) => {
    alert(`Test flow "${name}" saved!`);
    const newFlow: TestFlow = {
      id: `flow-${testFlows.length + 1}`,
      name,
      nodes,
      connections,
      lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setTestFlows(prev => [newFlow, ...prev]);
  };

  const runTest = async () => {
    const contextEntries: Record<string, string> = {};
    const steps: { keyword: string; args: string[] }[] = [];
    nodes.forEach(node => {
      if (node.type === 'context') {
        const key = node.config?.key;
        const value = node.config?.value;
        if (key && value) contextEntries[key] = value;
      } else {
        steps.push({ keyword: node.label, args: Object.values(node.config || {}) });
      }
    });
    const payload = { json_config: { name: 'Contract Creation', steps, context: Object.keys(contextEntries).length ? contextEntries : undefined } };
    try {
      const response = await executeTest(payload);
      if (!response.result) {
        alert((response as any).message || 'Test scheduled.');
        return;
      }
      const result = buildResultFromExecution(payload, response, testResults.length);
      setTestResults(prev => [result, ...prev]);
      alert('✅ Test succesvol uitgevoerd');
    } catch (err) {
      console.error('❌ Test mislukt', err);
      alert('❌ Test mislukt');
    }
  };

  const exportScript = () => {
    alert('Test script exported!');
    console.log('Export script with nodes:', nodes, 'connections:', connections);
  };

  const dragNode = (type: string, label: string) => {
    console.log('Dragging node:', type, label);
  };

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.source !== nodeId && c.target !== nodeId));
  };

  return (
    <TestContext.Provider value={{
      nodes,
      connections,
      testFlows,
      testResults,
      setTestResults,
      addNode,
      updateNodePosition,
      addConnection,
      saveFlow,
      runTest,
      exportScript,
      dragNode,
      removeNode,
      updateNodeConfig,
      updateNodeArgs
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error('useTestContext must be used within TestProvider');
  return context;
};
