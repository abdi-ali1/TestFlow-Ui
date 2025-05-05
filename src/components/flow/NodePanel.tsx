import React, { useState } from 'react';
import { useTestContext } from '../../context/TestContext';
import { Search } from 'lucide-react';
import { NodeTemplate, nodeTemplates } from './nodeTemplates';

const NodePanel: React.FC = () => {
  const { dragNode } = useTestContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Triggers: true,
    Actions: true,
    Assertions: true,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleDragStart = (nodeTemplate: NodeTemplate, e: React.DragEvent) => {
    e.dataTransfer.setData('node', JSON.stringify(nodeTemplate));
    dragNode(nodeTemplate.type, nodeTemplate.label);
  };

  const filteredTemplates = nodeTemplates.filter(template =>
    template.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTemplates = {
    Triggers: filteredTemplates.filter(t => t.type === 'trigger'),
    Actions: filteredTemplates.filter(t => t.type === 'action'),
    Assertions: filteredTemplates.filter(t => t.type === 'assertion'),
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3">
        <div className="relative mb-4">
          <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-8 pr-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {Object.entries(groupedTemplates).map(([groupTitle, nodes]) => (
          nodes.length > 0 && (
            <div key={groupTitle} className="mb-4">
              <button
                className="flex justify-between items-center w-full text-xs uppercase tracking-wider text-gray-500 mb-2 px-2"
                onClick={() => toggleGroup(groupTitle)}
              >
                <span>{groupTitle}</span>
                <span>{expandedGroups[groupTitle] ? '−' : '+'}</span>
              </button>

              {expandedGroups[groupTitle] && (
                <div className="space-y-1">
                  {nodes.map((node, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(node, e)}
                    >
                      <div className="flex-shrink-0">{node.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{node.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default NodePanel;
