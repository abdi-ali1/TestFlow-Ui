import React, { createContext, useContext, useState } from 'react';

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config?: Record<string, any>;
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

interface TestResult {
  id: string;
  testName: string;
  status: 'Passed' | 'Failed' | 'Skipped';
  date: string;
  duration: string;
  steps: Array<{
    name: string;
    status: 'Passed' | 'Failed' | 'Skipped';
    duration: string;
  }>;
}

interface TestContextType {
  nodes: Node[];
  connections: Connection[];
  testFlows: TestFlow[];
  testResults: TestResult[];
  addNode: (position: { x: number; y: number, type:string, label:string }) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  addConnection: (source: string, target: string) => void;
  saveFlow: (name: string) => void;
  runTest: () => void;
  exportScript: () => void;
  dragNode: (type: string, label: string) => void;
  removeNode: (nodeId: string) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'node-1',
      type: 'trigger',
      label: 'Page Load',
      position: { x: 100, y: 100 },
      config: {
        url: 'https://example.com',
      }
    },
    {
      id: 'node-2',
      type: 'action',
      label: 'Click Element',
      position: { x: 400, y: 100 },
      config: {
        selector: '#login-button',
      }
    },
    {
      id: 'node-3',
      type: 'assertion',
      label: 'Element Exists',
      position: { x: 700, y: 100 },
      config: {
        selector: '.dashboard-header',
      }
    }
  ]);
  
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'conn-1', source: 'node-1', target: 'node-2' },
    { id: 'conn-2', source: 'node-2', target: 'node-3' }
  ]);

  const [testFlows, setTestFlows] = useState<TestFlow[]>([
    {
      id: 'flow-1',
      name: 'Login Flow Test',
      nodes: [
        {
          id: 'node-1',
          type: 'trigger',
          label: 'Page Load',
          position: { x: 100, y: 100 },
          config: {
            url: 'https://example.com/login',
          }
        },
        {
          id: 'node-2',
          type: 'action',
          label: 'Click Element',
          position: { x: 400, y: 100 },
          config: {
            selector: '#login-button',
          }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'node-1', target: 'node-2' }
      ],
      lastModified: 'Oct 15, 2023'
    },
    {
      id: 'flow-2',
      name: 'Checkout Process',
      nodes: [
        {
          id: 'node-1',
          type: 'trigger',
          label: 'Page Load',
          position: { x: 100, y: 100 },
          config: {
            url: 'https://example.com/cart',
          }
        },
        {
          id: 'node-2',
          type: 'action',
          label: 'Click Element',
          position: { x: 400, y: 100 },
          config: {
            selector: '#checkout-button',
          }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'node-1', target: 'node-2' }
      ],
      lastModified: 'Oct 12, 2023'
    }
  ]);

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: 'result-1',
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
    },
    {
      id: 'result-2',
      testName: 'Checkout Process',
      status: 'Failed',
      date: 'Oct 12, 2023',
      duration: '2.30s',
      steps: [
        { name: 'Navigate to cart page', status: 'Passed', duration: '0.3s' },
        { name: 'Verify cart items', status: 'Passed', duration: '0.5s' },
        { name: 'Click checkout button', status: 'Passed', duration: '0.4s' },
        { name: 'Enter shipping details', status: 'Passed', duration: '0.6s' },
        { name: 'Submit payment', status: 'Failed', duration: '0.5s' }
      ]
    },
    {
      id: 'result-3',
      testName: 'Product Search',
      status: 'Passed',
      date: 'Oct 10, 2023',
      duration: '1.20s',
      steps: [
        { name: 'Navigate to homepage', status: 'Passed', duration: '0.3s' },
        { name: 'Enter search keyword', status: 'Passed', duration: '0.2s' },
        { name: 'Submit search', status: 'Passed', duration: '0.4s' },
        { name: 'Verify search results', status: 'Passed', duration: '0.3s' }
      ]
    }
  ]);

  const addNode = (position: { x: number; y: number, type: string, label: string }) => {
    const newNode: Node = {
      id: crypto.randomUUID(), // ✅ unieke id
      type: position.type,
      label: position.label,
      position: { x: position.x, y: position.y },
      config: {}
    };
    
    setNodes([...nodes, newNode]);
  };

  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, position } : node
    ));
  };

  const addConnection = (source: string, target: string) => {
    // Prevent self-connections
    if (source === target) return;
    
    // Prevent duplicate connections
    if (connections.some(conn => conn.source === source && conn.target === target)) return;
    
    const newConnection: Connection = {
      id: `conn-${connections.length + 1}`,
      source,
      target
    };
    
    setConnections([...connections, newConnection]);
  };

  const saveFlow = (name: string) => {
    alert(`Test flow "${name}" saved!`);
    
    // In a real app, this would save to server/localStorage
    const newFlow: TestFlow = {
      id: `flow-${testFlows.length + 1}`,
      name,
      nodes,
      connections,
      lastModified: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
    
    setTestFlows([newFlow, ...testFlows]);
  };

  const runTest = () => {
    alert('Test execution started!');
    
    // In a real app, this would trigger a real test execution
    setTimeout(() => {
      alert('Test execution completed!');
      
      const newResult: TestResult = {
        id: `result-${testResults.length + 1}`,
        testName: 'New Test Flow',
        status: Math.random() > 0.2 ? 'Passed' : 'Failed',
        date: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        duration: `${(Math.random() * 2 + 0.5).toFixed(2)}s`,
        steps: nodes.map(node => ({
          name: node.label,
          status: Math.random() > 0.1 ? 'Passed' : 'Failed',
          duration: `${(Math.random() * 0.5 + 0.1).toFixed(1)}s`
        }))
      };
      
      setTestResults([newResult, ...testResults]);
    }, 1500);
  };

  const exportScript = () => {
    alert('Test script exported!');
    
    // In a real app, this would generate and download a test script
    console.log('Exporting test with nodes:', nodes);
    console.log('Connections:', connections);
  };
  
  const dragNode = (type: string, label: string) => {
    // This would be called when a node is being dragged from the panel
    console.log('Dragging node:', type, label);
    
    // Additional drag start handling can be implemented here
  };

  const removeNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.source !== nodeId && c.target !== nodeId));
  };

  return (
    <TestContext.Provider value={{
      nodes,
      connections,
      testFlows,
      testResults,
      addNode,
      updateNodePosition,
      addConnection,
      saveFlow,
      runTest,
      exportScript,
      dragNode,
      removeNode
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};