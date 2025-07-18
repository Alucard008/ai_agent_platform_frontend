// src/components/NodePropertiesPanel.tsx
import React, { useState, ChangeEvent } from "react";
import type { Node } from "react-flow-renderer";
import { MyNodeData } from "../types/node";

export default function NodePropertiesPanel({
    node,
    onChange,
}: {
    node: Node<MyNodeData>;
    onChange: (cfg: MyNodeData["config"]) => void;
}) {
    const cfg = node.data.config || { texts: [], files: [] };
    const [newText, setNewText] = useState("");

    // add text
    const addText = () => {
        if (!newText) return;
        const updated = { ...cfg, texts: [...(cfg.texts || []), newText] };
        onChange(updated);
        setNewText("");
    };

    // handle file upload → read as base64
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const blobs = await Promise.all(files.map(f =>
            new Promise<{ name: string, data: string }>((res, rej) => {
                const r = new FileReader();
                r.onload = () => res({ name: f.name, data: (r.result as string).split(",")[1] });
                r.onerror = rej;
                r.readAsDataURL(f);
            })
        ));
        const updated = { ...cfg, files: [...(cfg.files || []), ...blobs] };
        onChange(updated);
        e.target.value = ""; // reset
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-semibold">Configure “{node.data.label}”</h3>

            <div>
                <label className="block mb-1 font-medium">Extra Text Inputs</label>
                <div className="space-y-1">
                    {(cfg.texts || []).map((t, i) => (
                        <div key={i} className="flex justify-between">
                            <span>{t}</span>
                            <button onClick={() => {
                                const txts = (cfg.texts || []).filter((_, j) => j !== i);
                                onChange({ ...cfg, texts: txts });
                            }}>❌</button>
                        </div>
                    ))}
                </div>
                <textarea
                    className="textarea textarea-bordered w-full"
                    rows={2}
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                />
                <button className="btn btn-sm mt-1" onClick={addText}>Add Text</button>
            </div>

            <div>
                <label className="block mb-1 font-medium">File Attachments</label>
                <ul className="list-disc list-inside">
                    {(cfg.files || []).map((f, i) => (
                        <li key={i} className="flex justify-between">
                            {f.name}
                            <button onClick={() => {
                                const files = (cfg.files || []).filter((_, j) => j !== i);
                                onChange({ ...cfg, files });
                            }}>❌</button>
                        </li>
                    ))}
                </ul>
                <input
                    type="file"
                    multiple
                    className="mt-1"
                    onChange={onFileChange}
                />
            </div>
        </div>
    );
}
