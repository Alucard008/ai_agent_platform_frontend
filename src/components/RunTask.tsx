import { useState } from "react";
import { postAPI } from "services/api";

export default function RunTask({
    agentName,
    userId,
}: {
    agentName: string;
    userId: string;
}) {
    const [query, setQuery] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        const res = await postAPI("/run-task", {
            query,
            session_id: Date.now().toString(),
            agent_name: agentName,
            user_id: userId,
        }) as { output: string };
        setOutput(res.output);
        setLoading(false);
    };

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body p-4 space-y-3">
                <h3 className="font-bold">▶️ Run “{agentName}”</h3>
                <textarea
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    placeholder="Enter query…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="btn btn-primary w-full"
                    onClick={handleRun}
                    disabled={loading || !query}
                >
                    {loading ? "Running…" : "Run"}
                </button>
                {output && (
                    <pre className="bg-base-200 p-2 rounded text-sm overflow-auto">
                        {output}
                    </pre>
                )}
            </div>
        </div>
    );
}
