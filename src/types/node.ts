
export interface MyNodeData {
  label: string;            // tool name
  config?: {
    texts?: string[];
    files?: Array<{ name: string; data: string /* base64 */ }>;
  };
}
