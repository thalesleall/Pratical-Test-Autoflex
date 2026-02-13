"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductionSuggestions, setProductQuantity } from "@/store/features/production/productionSlice";
import { fetchRawMaterials } from "@/store/features/rawMaterials/rawMaterialsSlice";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductionPage() {
  const dispatch = useAppDispatch();
  const { suggestions, selectedProducts, loading } = useAppSelector((state) => state.production);
  const { items: materials } = useAppSelector((state) => state.rawMaterials);

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(setProductQuantity({ productId, quantity: Math.max(0, quantity) }));
  };

  const totalRevenue = Object.entries(selectedProducts).reduce((sum, [productId, quantity]) => {
    const suggestion = suggestions.find((s) => s.productId === parseInt(productId));
    return sum + (suggestion ? suggestion.productValue * quantity : 0);
  }, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2">Production Planning</h1>
            <p className="text-gray-600 text-sm sm:text-base">Plan your production based on available materials</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Production Suggestions</h2>
                {suggestions.map((suggestion, idx) => {
                  const quantity = selectedProducts[suggestion.productId] || 0;
                  const revenue = suggestion.productValue * quantity;

                  return (
                    <Card key={suggestion.productId} className="animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{suggestion.productName}</h3>
                          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                              <span className="text-gray-600">Max Units: </span>
                              <span className="font-bold text-blue-600">{suggestion.maxProducibleQuantity}</span>
                            </div>
                            <div className="bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                              <span className="text-gray-600">Unit Price: </span>
                              <span className="font-bold text-purple-600">${(suggestion.productValue ?? 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="mt-2 bg-gradient-to-r from-blue-50 to-slate-50 px-3 py-2 rounded-lg border border-blue-200">
                            <span className="text-gray-600 text-xs sm:text-sm">Max Revenue: </span>
                            <span className="text-base sm:text-lg font-bold text-blue-900">${(suggestion.estimatedRevenue ?? 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                          <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(suggestion.productId, quantity - 1)} disabled={quantity === 0} className="w-10 h-10">
                            -
                          </Button>
                          <input
                            type="number"
                            min="0"
                            max={suggestion.maxProducibleQuantity}
                            value={quantity}
                            onChange={(e) => handleQuantityChange(suggestion.productId, parseInt(e.target.value) || 0)}
                            className="w-20 sm:w-24 text-center px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none font-bold text-lg"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(suggestion.productId, quantity + 1)}
                            disabled={quantity >= suggestion.maxProducibleQuantity}
                            className="w-10 h-10"
                          >
                            +
                          </Button>
                        </div>
                        <Button variant="success" onClick={() => handleQuantityChange(suggestion.productId, suggestion.maxProducibleQuantity)} className="w-full sm:w-auto sm:ml-auto" size="sm">
                          Max Production
                        </Button>
                      </div>

                      {quantity > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl border-2 border-blue-300 animate-in fade-in zoom-in duration-300">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Selected Production</p>
                              <p className="text-sm sm:text-base text-gray-700">
                                <span className="font-bold text-blue-600 text-lg">{quantity}</span> units
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 mb-1">Est. Revenue</p>
                              <p className="font-bold text-blue-900 text-lg sm:text-xl">${(revenue ?? 0).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}

                {suggestions.length === 0 && (
                  <Card className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No production suggestions available.</p>
                    <p className="text-gray-400 text-sm">Make sure you have products with recipes.</p>
                  </Card>
                )}
              </div>

              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700">
                <Card className="sticky top-20 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200" hover={false}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Production Summary</h2>

                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {Object.entries(selectedProducts).map(([productId, quantity]) => {
                      const suggestion = suggestions.find((s) => s.productId === parseInt(productId));
                      if (!suggestion || quantity === 0) return null;

                      return (
                        <div key={productId} className="p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                          <p className="font-semibold text-gray-900 text-sm truncate">{suggestion.productName}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-600">{quantity} units</span>
                            <span className="text-sm font-bold text-blue-900">${(quantity * (suggestion.productValue ?? 0)).toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                    {Object.values(selectedProducts).every((q) => q === 0) && (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No products selected</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-blue-200 pt-4">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold text-sm">Total Revenue:</span>
                        <span className="text-2xl sm:text-3xl font-bold text-blue-900">${(totalRevenue ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button variant="success" className="w-full" size="lg" disabled={totalRevenue === 0}>
                      Start Production
                    </Button>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200" hover={false}>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Available Materials</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {materials.map((material, idx) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <span className="text-xs sm:text-sm text-gray-700 font-medium truncate mr-2">{material.name}</span>
                        <span className="text-xs sm:text-sm font-bold bg-slate-700 text-white px-3 py-1 rounded-full whitespace-nowrap">{material.quantity}</span>
                      </div>
                    ))}
                    {materials.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No materials</p>}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
