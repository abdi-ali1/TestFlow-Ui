import React from 'react';
import { GripVertical, X, ChevronRight } from 'lucide-react';

interface NodeProps {
  node: {
    id: string;
    type: string;
    label: string;
    position: { x: number; y: number };
    config?: Record<string, any>;
  };
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, position: { x: number; y: number }) => void;
  onConnectionEnd: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

const Node: React.FC<NodeProps> = ({ node, onDragStart, onConnectionStart, onConnectionEnd, onDelete }) => {
  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDragStart(node.id, e);
  };

  const handleConnectorMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onConnectionStart(node.id, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  };

  const handleConnectorMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnectionEnd(node.id);
  };




  return (
    <div
      className="absolute bg-white rounded-lg shadow-md border border-gray-200 w-[240px] transition-shadow hover:shadow-lg"
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        zIndex: 10
      }}
    >
      {/* Node header with handle */}
      <div 
        className={`flex items-center justify-between p-3 rounded-t-lg cursor-move ${
          node.type === 'trigger' 
            ? 'bg-blue-50 text-blue-700' 
            : node.type === 'action'
            ? 'bg-green-50 text-green-700'
            : 'bg-purple-50 text-purple-700'
        }`}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4" />
          <span className="font-medium">{node.label}</span>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) {
              onDelete(node.id); // ✅ check of het bestaat
            } else {
              console.warn("❗ onDelete is not passed to Node");
            }
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Node content */}
      <div className="p-3">
        {node.config && Object.entries(node.config).map(([key, value]) => (
          <div key={key} className="mb-2">
            <label className="block text-sm text-gray-700 mb-1">{key}</label>
            <input 
              type="text" 
              value={value as string} 
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={() => {}}
            />
          </div>
        ))}
      </div>
      
      {/* Node connectors */}
      <div 
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-300 cursor-pointer"
        onMouseUp={handleConnectorMouseUp}
      ></div>
      
      <div 
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer"
        onMouseDown={handleConnectorMouseDown}
      >
        <ChevronRight className="h-3 w-3 text-gray-500" />
      </div>
    </div>
  );
};

export default Node;