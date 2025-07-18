export interface Tool {
  name: string
  input_from: string
  config?: any
}

export interface Agent {
  id: number
  agent_name: string
  workflow: {
    tools: Tool[]
  }
}
