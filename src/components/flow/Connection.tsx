import React from 'react';

interface ConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDragging?: boolean;
}

const Connection: React.FC<ConnectionProps> = ({
  startX,
  startY,
  endX,
  endY,
  isDragging = false
}) => {
  // Curving via bezier
  const curveOffset = Math.min(100, Math.abs(endX - startX) / 2);

  const path = `M ${startX},${startY}
                C ${startX + curveOffset},${startY}
                  ${endX - curveOffset},${endY}
                  ${endX},${endY}`;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <path
        d={path}
        fill="none"
        stroke={isDragging ? '#9CA3AF' : '#3B82F6'}
        strokeWidth={2}
        strokeDasharray={isDragging ? '5,5' : '0'}
      />
      {!isDragging && (
        <circle
          cx={endX}
          cy={endY}
          r={4}
          fill="#3B82F6"
        />
      )}
    </svg>
  );
};

export default Connection;
