import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { showError } from "../common/Toast";

interface Stall {
  id: number;
  stallCode: string;
  stallName: string;
  size: string;
  width: number;
  depth: number;
  category: string;
  x: number;
  y: number;
  rotation: number;
  status: string;
  imgUrl?: string;
  price: number;
}

interface EditStallModalProps {
  isVisible: boolean;
  stall: Stall | null;
  onClose: () => void;
  onSave?: (updated: Stall) => void;
}

const BASE = "http://localhost:8081";

const EditStallModal: React.FC<EditStallModalProps> = ({ isVisible, stall, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<Stall>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (stall) setForm(stall);
    else setForm({});
  }, [stall]);

  const update = <K extends keyof Stall>(key: K, value: Stall[K]) => {
    setForm(prev => ({ ...(prev as object), [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!stall) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/api/stalls/${stall.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let msg = `Save failed (${res.status})`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {
            // ignore JSON parse errors
        }
        throw new Error(msg);
      }

      const updated: Stall = await res.json().catch(() => ({ ...(stall as Stall), ...(form as Partial<Stall>) } as Stall));
      // notify parent and let parent show toast to avoid duplicates
      onSave?.(updated);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        showError(err.message || "Update failed");
      } else {
        showError(String(err) || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} width="max-w-lg" closeOnBackdrop>
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-4">Edit Stall</h3>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-sm text-gray-500">Stall Code</div>
            <input
              value={form.stallCode ?? ""}
              onChange={e => update("stallCode", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-500">Name</div>
            <input
              value={form.stallName ?? ""}
              onChange={e => update("stallName", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-500">Category</div>
            <input
              value={form.category ?? ""}
              onChange={e => update("category", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-500">Size</div>
            <input
              value={form.size ?? ""}
              onChange={e => update("size", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-500">Width</div>
            <input
              type="number"
              value={String(form.width ?? "")}
              onChange={e => update("width", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-500">Depth</div>
            <input
              type="number"
              value={String(form.depth ?? "")}
              onChange={e => update("depth", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block col-span-2">
            <div className="text-sm text-gray-500">Price</div>
            <input
              type="number"
              step="0.01"
              value={String(form.price ?? "")}
              onChange={e => update("price", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>

          <label className="block col-span-2">
            <div className="text-sm text-gray-500">Status</div>
            <select
              value={form.status ?? "AVAILABLE"}
              onChange={e => update("status", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="RESERVED">RESERVED</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStallModal;