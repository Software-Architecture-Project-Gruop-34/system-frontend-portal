import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StallsMap from "../components/StallsMap";

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

const StallsPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // determine role from localStorage; show "Create Stall" only for ADMIN
  const rawRole = localStorage.getItem("userRole") || "";
  const role = rawRole.toUpperCase();
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    const controller = new AbortController();
    const fetchStalls = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8081/api/stalls", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: Stall[] = await res.json();
        setStalls(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof DOMException) {
          if (err.name !== "AbortError") {
            console.error(err);
            setError(err.message || "Failed to load stalls");
          }
        } else {
          const message = err instanceof Error ? err.message : String(err);
          console.error(err);
          setError(message || "Failed to load stalls");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStalls();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading stalls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!stalls.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No stalls available.</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Exhibition Hall</h1>

          {/* only show "Create Stall" to admins */}
          {isAdmin && (
            <Link
              to="/stalls/new"
              className="text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Stall
            </Link>
          )}
        </div>

        {/* Map-only view — clicking a stall shows details in the right panel */}
        <StallsMap stalls={stalls} onStallClick={() => { /* noop — selection handled inside map */ }} />
      </div>
    </div>
  );
};

export default StallsPage;