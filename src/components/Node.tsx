// src/components/Node.tsx
import { Handle, Position, NodeProps, useReactFlow } from 'react-flow-renderer'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'

type DataType = {
    label: string
    description?: string
    [key: string]: any
}

export default function CustomNode({ id, data }: NodeProps<DataType>) {
    const { setNodes, setEdges } = useReactFlow()
    const [showInfo, setShowInfo] = useState(false)

    const removeNode = () => {
        setNodes((nds) => nds.filter((n) => n.id !== id))
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
    }

    return (
        <div
            className="relative bg-base-100 border border-base-300 rounded-lg shadow p-0.5"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
        >
            {/* Left handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="in"
                className="bg-primary"
            />

            {/* Node content */}
            <div className="flex items-center justify-between bg-base-100 px-3 py-1">
                <span className="font-medium text-base">{data.label}</span>
                <button
                    onClick={removeNode}
                    className="btn btn-ghost btn-xs btn-circle p-1"
                    aria-label="Delete"
                >
                    <FaTrash className="text-error" size={12} />
                </button>
            </div>

            {/* Right handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="out"
                className="bg-primary"
            />

            {/* Smooth popover */}
            <div
                className={`
          absolute left-1/2 transform -translate-x-1/2
          w-48 p-2 bg-base-200 border border-base-300 rounded-lg shadow-lg text-xs
          transition-all duration-200 ease-out
          ${showInfo ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}
        `}
            >
                <p className="font-semibold mb-1">Node Info</p>
                <p><strong>ID:</strong> {id}</p>
                <p><strong>Name:</strong> {data.label}</p>
                {data.description && <p><strong>Desc:</strong> {data.description}</p>}
                {Object.entries(data)
                    .filter(([k]) => k !== 'label' && k !== 'description')
                    .map(([key, val]) => (
                        <p key={key}>
                            <strong>{key}:</strong> {String(val)}
                        </p>
                    ))}
            </div>
        </div>
    )
}
