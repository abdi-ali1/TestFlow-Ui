import React, { useState, useRef, useEffect } from 'react';
import { useTestContext } from '../../context/TestContext';
import Node from './Node';
import Connection from './Connection';


interface NodeCanvasProps {
  pendingNode: { type: string, label: string } | null;
  onNodeAdded: () => void;
}

const NodeCanvas: React.FC<NodeCanvasProps> = ({ pendingNode, onNodeAdded }) => {
  const { nodes, connections, addNode, updateNodePosition, addConnection, removeNode } = useTestContext();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string, x: number, y: number } | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<{ x: number, y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);


  const handleDeleteNode = (nodeId: string) => {
    removeNode(nodeId);
  };

  // Handle node dragging
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - node.position.x;
    const offsetY = e.clientY - rect.top - node.position.y;
    
    setIsDragging(true);
    setDraggedNodeId(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  // Handle node dragging movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedNodeId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      updateNodePosition(draggedNodeId, { x, y });
    }
    
    if (isDrawingConnection && connectionStart && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
    

      const snapRadius = 16; 
    
      const targetNode = nodes.find(n => {
        const nodeX = n.position.x;
        const nodeY = n.position.y;
        const nodeHeight = 80; 
    
        return (
          mouseX >= nodeX - snapRadius &&
          mouseX <= nodeX + snapRadius &&
          mouseY >= nodeY &&
          mouseY <= nodeY + nodeHeight
        );
      });
    
      if (targetNode) {

        const connectorOffset = 12;
        setConnectionEnd({
          x: targetNode.position.x - connectorOffset,
          y: targetNode.position.y + 40
        });
      } else {

        setConnectionEnd({ x: mouseX, y: mouseY });
      }
    }
  };


  const handleConnectionStart = (nodeId: string, position: { x: number; y: number }) => {
    const connectorRadius = 12;
    const nodeWidth = 240;
  
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
  
    const x = node.position.x + nodeWidth + connectorRadius;
    const y = node.position.y + 40;
  
    setIsDrawingConnection(true);
    setConnectionStart({ nodeId, x, y });
    setConnectionEnd({ x, y }); // begin gelijk aan start
  };

  // Handle connection end
  const handleConnectionEnd = (nodeId: string) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      addConnection(connectionStart.nodeId, nodeId);
    }
    
    setIsDrawingConnection(false);
    setConnectionStart(null);
    setConnectionEnd(null);
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNodeId(null);
    
    if (isDrawingConnection) {
      setIsDrawingConnection(false);
      setConnectionStart(null);
      setConnectionEnd(null);
    }
  };

  // Canvas click handler for adding new nodes
  const handleCanvasClick = (e: React.MouseEvent) => {
      if (!pendingNode || isDragging || isDrawingConnection || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      addNode({
        x,
        y,
        type: pendingNode.type,
        label: pendingNode.label,
      });
    
      onNodeAdded(); 
    
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
  
    const data = e.dataTransfer.getData('node');
    if (!data) return;
  
    const { type, label } = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    addNode({ x, y, type, label });
  };
  
  return (
   <div className='w-full overflow-x-auto'> 
    <div 
      ref={canvasRef}
      className="relative min-w-[2000px] h-[500px] bg-gray-50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
  
    >

      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(#ddd_1px,transparent_1px),linear-gradient(90deg,#ddd_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Connections */}
      {connections.map((connection, index) => {
        const startNode = nodes.find(n => n.id === connection.source);
        const endNode = nodes.find(n => n.id === connection.target);
        
        if (!startNode || !endNode) return null;
        
        const nodeWidth = 240;
        const connectorRadius = 12;
        
        const startX = startNode.position.x + nodeWidth + connectorRadius; // rechter bolletje
        const startY = startNode.position.y + 40;
        
        const endX = endNode.position.x - connectorRadius; // linker bolletje
        const endY = endNode.position.y + 40;

        
        
        return (
          <Connection 
            key={index}
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
          />
        );
      })}

      
      
      {/* Dragging connection line */}
      {isDrawingConnection && connectionStart && connectionEnd && (
        <Connection 
          startX={connectionStart.x}
          startY={connectionStart.y}
          endX={connectionEnd.x}
          endY={connectionEnd.y}
          isDragging
        />
      )}
      
      {/* Nodes */}
      {nodes.map(node => (
        <Node 
          key={node.id}
          node={node}
          onDragStart={handleNodeDragStart}
          onConnectionStart={handleConnectionStart}
          onConnectionEnd={handleConnectionEnd}
          onDelete={handleDeleteNode}
        />
      ))}
      
      {/* Info text when canvas is empty */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p>Drag elements from the panel to start building your test flow</p>
            <p className="text-sm mt-2">or drag a node from the library</p>
          </div>
        </div>
      )}
    </div>
    </div>

  );
};

export default NodeCanvas;