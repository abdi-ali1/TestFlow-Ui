import { ReactNode } from 'react';
import { Play, MousePointer, Check } from 'lucide-react';

export interface NodeTemplate {
  type: string;
  label: string;
  icon: ReactNode;
  defaultConfig: Record<string, string>;
    defaultArgs?: string[]; 
}

export const nodeTemplates: NodeTemplate[] = [
  {
    type: 'context',
    label: 'Context: Contract Creation',
    icon: <Play className="h-4 w-4 text-blue-600" />,
    defaultConfig: {
      key: 'contract_creation',
      value: '<Contract><CustomerID>12345</CustomerID><Tariff>Day</Tariff></Contract>'
    },
    defaultArgs: [] // context-nodes hebben geen args
  },
  {
    type: 'action',
    label: 'Send POST Request',
    icon: <MousePointer className="h-4 w-4 text-green-600" />,
    defaultConfig: {
      endpoint: '/api/contracts',
      body: '${xml_data}'
    },
    defaultArgs: ['/api/contracts', '${xml_data}']
  },
  {
    type: 'assertion',
    label: 'Validate Response Status',
    icon: <Check className="h-4 w-4 text-purple-600" />,
    defaultConfig: {
      status_code: '201'
    },
    defaultArgs: ['201']
  },
  {
    type: 'assertion',
    label: 'Validate XML Schema',
    icon: <Check className="h-4 w-4 text-purple-600" />,
    defaultConfig: {
      body: '${response_body}',
      schema: 'schemas/contract_creation_schema.xsd'
    },
    defaultArgs: ['${response_body}', 'schemas/contract_creation_schema.xsd']
  }
];