import React, { useState } from "react";
import Modal from "../common/Modal";
import { showSuccess, showError } from "../common/Toast";

interface StallCreate {
  stallCode: string;
  stallName: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  width: number;
  depth: number;
  category?: string;
  x: number;
  y: number;
  rotation: number;
  status: "AVAILABLE" | "RESERVED" | "BLOCKED";
  imgUrl?: string;
  price: number;
}

interface CreateStallModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreate?: (created: StallCreate & { id: number }) => void;
}

const BASE = "http://localhost:8081";

const CODE_RE = /^[A-Z0-9-]+$/;

const CreateStallModal: React.FC<CreateStallModalProps> = ({ isVisible, onClose, onCreate }) => {
  const [form, setForm] = useState<Partial<StallCreate>>({
    size: "MEDIUM",
    status: "AVAILABLE",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof StallCreate>(k: K, v: StallCreate[K] | string | number | undefined) => {
    setForm(prev => ({ ...(prev as object), [k]: v }));
    setErrors(prev => ({ ...prev, [String(k)]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const sc = (form.stallCode || "").trim();
    const sn = (form.stallName || "").trim();

    if (!sc) e.stallCode = "Stall code is required";
    else if (!CODE_RE.test(sc)) e.stallCode = "Use uppercase letters, numbers and hyphens only";

    if (!sn) e.stallName = "Stall name is required";
    else if (sn.length > 200) e.stallName = "Max 200 characters";

    if (!form.size) e.size = "Size is required";
    if (!Number.isInteger(form.width) || (form.width ?? 0) <= 0) e.width = "Width must be a positive integer";
    if (!Number.isInteger(form.depth) || (form.depth ?? 0) <= 0) e.depth = "Depth must be a positive integer";

    if (form.category && form.category.length > 100) e.category = "Max 100 characters";

    if (typeof form.x !== "number" || Number.isNaN(form.x)) e.x = "X position is required";
    if (typeof form.y !== "number" || Number.isNaN(form.y)) e.y = "Y position is required";

    if (typeof form.rotation !== "number" || Number.isNaN(form.rotation) || form.rotation! < 0 || form.rotation! > 360)
      e.rotation = "Rotation must be 0.0 - 360.0";

    if (!form.status) e.status = "Status is required";

    if (form.imgUrl && form.imgUrl.length > 500) e.imgUrl = "Image URL max 500 characters";

    const priceVal = Number(form.price);
    if (Number.isNaN(priceVal) || priceVal <= 0) e.price = "Price must be greater than 0";
    else {
      // max 8 digits before decimal, 2 decimals
      if (!/^\d{1,8}(\.\d{1,2})?$/.test(String(form.price))) e.price = "Price max 8 digits and up to 2 decimals";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: StallCreate = {
        stallCode: String(form.stallCode).trim(),
        stallName: String(form.stallName).trim(),
        size: (form.size as StallCreate["size"]) || "MEDIUM",
        width: Number(form.width),
        depth: Number(form.depth),
        category: form.category?.trim(),
        x: Number(form.x),
        y: Number(form.y),
        rotation: Number(form.rotation),
        status: (form.status as StallCreate["status"]) || "AVAILABLE",
        imgUrl: form.imgUrl?.trim(),
        price: Number(form.price),
      };

      const res = await fetch(`${BASE}/api/stalls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const created = await res.json();
        showSuccess(`Stall ${created.stallCode} created`);
        onCreate?.(created);
        onClose();
        // reset form
        setForm({ size: "MEDIUM", status: "AVAILABLE" });
        setErrors({});
        return;
      }

      // handle validation or conflict errors
      const body = await res.json().catch(() => null);
      if (res.status === 400 && body?.errors) {
        // map backend validation errors to UI
        const be: Record<string, string> = {};
        for (const k of Object.keys(body.errors)) be[k] = body.errors[k];
        setErrors(be);
        showError("Validation failed");
      } else if (res.status === 409) {
        const msg = body?.message || `Duplicate stall code`;
        showError(msg);
      } else {
        const msg = body?.message || `Create failed (${res.status})`;
        showError(msg);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      showError(msg || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} width="max-w-2xl" closeOnBackdrop>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Stall</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Stall Code</label>
            <input
              value={form.stallCode ?? ""}
              onChange={e => update("stallCode", e.target.value.toUpperCase())}
              className="mt-1 w-full border rounded px-2 py-1"
              maxLength={50}
            />
            {errors.stallCode && <div className="text-xs text-red-600 mt-1">{errors.stallCode}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Stall Name</label>
            <input
              value={form.stallName ?? ""}
              onChange={e => update("stallName", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
              maxLength={200}
            />
            {errors.stallName && <div className="text-xs text-red-600 mt-1">{errors.stallName}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Size</label>
            <select
              value={form.size ?? "MEDIUM"}
              onChange={e => update("size", e.target.value as StallCreate["size"])}
              className="mt-1 w-full border rounded px-2 py-1 bg-white"
            >
              <option value="SMALL">SMALL</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LARGE">LARGE</option>
            </select>
            {errors.size && <div className="text-xs text-red-600 mt-1">{errors.size}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Category</label>
            <input
              value={form.category ?? ""}
              onChange={e => update("category", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
              maxLength={100}
            />
            {errors.category && <div className="text-xs text-red-600 mt-1">{errors.category}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Width (cm)</label>
            <input
              type="number"
              value={form.width ?? ""}
              onChange={e => update("width", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.width && <div className="text-xs text-red-600 mt-1">{errors.width}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Depth (cm)</label>
            <input
              type="number"
              value={form.depth ?? ""}
              onChange={e => update("depth", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.depth && <div className="text-xs text-red-600 mt-1">{errors.depth}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">X (position)</label>
            <input
              type="number"
              step="any"
              value={form.x ?? ""}
              onChange={e => update("x", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.x && <div className="text-xs text-red-600 mt-1">{errors.x}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Y (position)</label>
            <input
              type="number"
              step="any"
              value={form.y ?? ""}
              onChange={e => update("y", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.y && <div className="text-xs text-red-600 mt-1">{errors.y}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Rotation (°)</label>
            <input
              type="number"
              step="0.1"
              value={form.rotation ?? 0}
              onChange={e => update("rotation", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.rotation && <div className="text-xs text-red-600 mt-1">{errors.rotation}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Status</label>
            <select
              value={form.status ?? "AVAILABLE"}
              onChange={e => update("status", e.target.value as StallCreate["status"])}
              className="mt-1 w-full border rounded px-2 py-1 bg-white"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="RESERVED">RESERVED</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
            {errors.status && <div className="text-xs text-red-600 mt-1">{errors.status}</div>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600">Image URL</label>
            <input
              value={form.imgUrl ?? ""}
              onChange={e => update("imgUrl", e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
              maxLength={500}
            />
            {errors.imgUrl && <div className="text-xs text-red-600 mt-1">{errors.imgUrl}</div>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600">Price (Rs.)</label>
            <input
              type="number"
              step="0.01"
              value={form.price ?? ""}
              onChange={e => update("price", Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.price && <div className="text-xs text-red-600 mt-1">{errors.price}</div>}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Creating..." : "Create Stall"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStallModal;