// src/hooks/useAgents.ts
import { useAPI } from "../services/api"

export interface ToolStep {
    name: string
    input_from: string
    config?: Record<string, any>
}

export interface Agent {
    id: number
    name: string
    workflow: { tools: ToolStep[] }
}

export function useAgents(userId: string) {
    const { data, error, isLoading } = useAPI<Agent[]>(`/agents/${userId}`)
    return {
        agents: data ?? [],
        isLoading,
        isError: !!error,
    }
}
