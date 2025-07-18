// src/hooks/useTools.ts
import { useAPI } from "../services/api"

export interface Tool {
    id: number
    name: string
    description: string
}

export function useTools() {
    const { data, error, isLoading } = useAPI<Tool[]>("/tools")
    return {
        tools: data ?? [],
        isLoading,
        isError: !!error,
    }
}
