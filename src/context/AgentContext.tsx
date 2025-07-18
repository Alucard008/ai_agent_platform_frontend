import { createContext, useContext, useState, ReactNode } from "react";

export interface ToolStep {
    name: string;
    input_from: string;
}

export interface AgentWorkflow {
    tools: ToolStep[];
}

export interface Agent {
    id: string;
    agent_name: string;
    user_id: string;
    workflow: AgentWorkflow;
}

interface AgentContextValue {
    agents: Agent[];
    setAgents: (agents: Agent[]) => void;
}

const AgentContext = createContext<AgentContextValue | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
    const [agents, setAgents] = useState<Agent[]>([]);
    return (
        <AgentContext.Provider value={{ agents, setAgents }}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgentContext() {
    const ctx = useContext(AgentContext);
    if (!ctx) throw new Error("useAgentContext must be inside AgentProvider");
    return ctx;
}
