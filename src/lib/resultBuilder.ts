import { ExecutionRequest, ExecutionResponse } from '../lib/testExecutor';
import { TestResult } from '../context/TestContext';

export const buildResultFromExecution = (
  input: ExecutionRequest,
  output: ExecutionResponse,
  existingLength: number
): TestResult => {
  const duration = output.result.stdout.match(/Duration.*?(\d+(\.\d+)?s)/i)?.[1] || '1.0s';

  return {
    id: `result-${existingLength + 1}`,
    testName: input.json_config.name,
    status: output.result.returncode === '0' ? 'Passed' : 'Failed',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    duration,
    steps: input.json_config.steps.map(step => ({
      name: step.keyword,
      status: 'Passed', 
      duration: '0.2s'
    }))
  };
};
