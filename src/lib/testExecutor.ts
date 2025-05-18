import axios from 'axios';

export interface Step {
  keyword: string;
  args: string[];
}

export interface ExecutionRequest {
  json_config: {
    name: string;
    steps: Step[];
    context?: Record<string, unknown>;
  };
}

export interface ExecutionResponse {
  test_file: string;
  result: {
    returncode: string;
    stdout: string;
    stderr: string;
  };
}

export const executeTest = async (payload: ExecutionRequest): Promise<ExecutionResponse> => {
  const res = await axios.post('http://localhost:8000/v1/execute/run', payload);
  return res.data;
};
