"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductionSuggestions } from "@/store/features/production/productionSlice";
import { fetchRawMaterials } from "@/store/features/rawMaterials/rawMaterialsSlice";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductionPage() {
  const dispatch = useAppDispatch();
  const { suggestions, loading } = useAppSelector((state) => state.production);
  const { items: materials } = useAppSelector((state) => state.rawMaterials);

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const totalUnits = suggestions.reduce((sum, s) => sum + (s.maxProducibleQuantity ?? 0), 0);
  const totalRevenue = suggestions.reduce((sum, s) => sum + (s.estimatedRevenue ?? 0), 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Production Suggestions</h1>
            <p className="text-gray-600 text-sm">Products ordered by highest value. Materials are virtually consumed following priority.</p>
          </div>
          {/* Info Banner */}
          {!loading && suggestions.length > 0 && (
            <Card className="mb-6 bg-blue-900 border-0" hover={false}>
              <div className="text-white">
                <p className="font-bold text-gray-600 text-lg mb-3">Smart Algorithm Active - Greedy Strategy</p>
                <p className="text-sm text-gray-600 opacity-90 mb-4">
                  The system prioritizes products by highest value and simulates material consumption in order. Each product uses remaining materials after higher-value products.
                </p>

                {/* Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Sort by Value</p>
                      <p className="text-xs text-gray-400 opacity-80">Products ordered highest to lowest</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Load Stock</p>
                      <p className="text-xs text-gray-400 opacity-80">Create virtual inventory copy</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Calculate Bottleneck</p>
                      <p className="text-xs text-gray-400 opacity-80">Find limiting ingredient</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Virtual Consumption</p>
                      <p className="text-xs text-gray-400 opacity-80">Subtract materials for next</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : suggestions.length === 0 ? (
            <Card className="text-center py-16">
              <p className="text-gray-500 text-xl mb-2">No production suggestions available</p>
              <p className="text-gray-400 text-sm">Make sure you have products with recipes and raw materials in stock</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Products Table */}
              <div className="lg:col-span-2">
                <Card hover={false}>
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b-2 border-blue-900">
                          <th className="text-left py-3 px-4 font-bold text-blue-900">#</th>
                          <th className="text-left py-3 px-4 font-bold text-blue-900">Product</th>
                          <th className="text-right py-3 px-4 font-bold text-blue-900">Unit Value</th>
                          <th className="text-right py-3 px-4 font-bold text-blue-900">Quantity</th>
                          <th className="text-right py-3 px-4 font-bold text-blue-900">Max Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suggestions.map((suggestion, idx) => {
                          const unitValue = suggestion.productValue ?? 0;
                          const maxQty = suggestion.maxProducibleQuantity ?? 0;
                          const maxRevenue = suggestion.estimatedRevenue ?? 0;

                          return (
                            <tr key={suggestion.productId ?? idx} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-900 text-white font-bold rounded-full text-sm">{idx + 1}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-bold text-gray-900">{suggestion.productName}</p>
                                  <p className="text-xs text-gray-600">Priority by highest value</p>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <p className="font-bold text-blue-900">${unitValue.toFixed(2)}</p>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <p className="font-bold text-gray-900">{maxQty}</p>
                                <p className="text-xs text-gray-600">units</p>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <p className="font-bold text-blue-900 text-lg">${maxRevenue.toFixed(2)}</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700">
                <Card className="bg-blue-900 border-blue-900" hover={false}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Total Opportunity</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-700">
                      <span className="text-sm  text-gray-900">Total Products:</span>
                      <span className="text-lg font-bold text-gray-900">{suggestions.length}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-blue-700">
                      <span className="text-sm text-gray-900">Total Units:</span>
                      <span className="text-lg font-bold text-gray-900">{totalUnits}</span>
                    </div>

                    <div className="bg-blue-800 p-4 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-white-400 font-semibold">Max Revenue:</span>
                        <span className="text-3xl font-bold text-white-900">${totalRevenue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Available Materials */}
                <Card className="bg-white border-blue-900" hover={false}>
                  <h3 className="text-lg font-bold text-blue-900 mb-3">Raw Materials</h3>
                  {materials.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No materials in stock</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-900 transition-all">
                          <span className="text-sm text-gray-700 font-medium truncate mr-2">{material.name}</span>
                          <span className="text-sm font-bold bg-blue-900 text-white px-3 py-1.5 rounded-full whitespace-nowrap">{material.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
