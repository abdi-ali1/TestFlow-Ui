import { ReactNode } from 'react';
import { Play, MousePointer, Check } from 'lucide-react';

export interface NodeTemplate {
  type: string;
  label: string;
  icon: ReactNode;
  defaultConfig: Record<string, string>;
}

export const nodeTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    label: 'Page Load',
    icon: <Play className="h-4 w-4 text-blue-600" />,
    defaultConfig: { url: 'https://example.com' }
  },
  {
    type: 'action',
    label: 'Click Element',
    icon: <MousePointer className="h-4 w-4 text-green-600" />,
    defaultConfig: { selector: '#my-button' }
  },
  {
    type: 'assertion',
    label: 'Element Exists',
    icon: <Check className="h-4 w-4 text-purple-600" />,
    defaultConfig: { selector: '.dashboard-header' }
  }
];
