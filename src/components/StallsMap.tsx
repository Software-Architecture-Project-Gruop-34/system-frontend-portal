import React, { useState } from "react";

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

interface StallsMapProps {
  stalls: Stall[];
  onStallClick: (stallId: number) => void;
}

const StallsMap: React.FC<StallsMapProps> = ({ stalls, onStallClick }) => {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);

  const sizeColors = {
    SMALL: "bg-blue-100 text-blue-700 border-blue-300",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-300",
    LARGE: "bg-purple-100 text-purple-700 border-purple-300",
  };

  const handleStallClick = (stall: Stall) => {
    setSelectedStall(stall);
    onStallClick(stall.id);
  };

  // Organize stalls into a grid (assuming we have x,y coordinates)
  const maxCols = Math.max(...stalls.map(s => Math.floor(s.x / 100)), 8);
  const maxRows = Math.max(...stalls.map(s => Math.floor(s.y / 100)), 6);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Exhibition Hall Layout</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-300"></div>
                    <span>Reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-600"></div>
                    <span>Available</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">Click on any stall to view details</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-8 gap-2">
                {stalls.map((stall) => {
                  const isAvailable = stall.status === "AVAILABLE";
                  const sizeClass = sizeColors[stall.size as keyof typeof sizeColors] || sizeColors.SMALL;
                  
                  return (
                    <button
                      key={stall.id}
                      onClick={() => handleStallClick(stall)}
                      className={`
                        aspect-square rounded-lg border-2 p-2 text-xs font-medium transition-all cursor-pointer
                        ${isAvailable 
                          ? 'bg-green-50 border-green-600 hover:bg-green-100' 
                          : 'bg-gray-100 border-gray-300'
                        }
                        ${selectedStall?.id === stall.id ? 'ring-2 ring-blue-500 scale-105 shadow-lg' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="font-bold text-gray-900">{stall.stallCode}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 ${sizeClass}`}>
                          {stall.size[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stall Details Section */}
        <div>
          <div className="bg-white rounded-lg shadow sticky top-4">
            {selectedStall ? (
              <>
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">Stall {selectedStall.stallCode}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedStall.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedStall.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">{selectedStall.stallName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Size</span>
                        <span className="font-medium capitalize">{selectedStall.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium">{selectedStall.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dimensions</span>
                        <span className="font-medium">{selectedStall.width} × {selectedStall.depth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price</span>
                        <span className="font-medium">Rs. {selectedStall.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Position</span>
                        <span className="font-medium">({selectedStall.x}, {selectedStall.y})</span>
                      </div>
                    </div>
                  </div>

                  {selectedStall.status === "RESERVED" && (
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Vendor Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business</span>
                          <span className="font-medium">Sample Publisher</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact</span>
                          <span className="font-medium">John Doe</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="font-medium text-xs">vendor@example.com</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    {selectedStall.status === "AVAILABLE" ? (
                      <button
                        onClick={() => alert(`Reserve stall ${selectedStall.stallCode}`)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Reserve Stall
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Release stall ${selectedStall.stallCode}`)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Release Stall
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-16 text-center">
                <svg
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500">
                  Select a stall from the map to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StallsMap;
