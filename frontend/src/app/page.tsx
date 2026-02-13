"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/features/products/productsSlice";
import { fetchRawMaterials } from "@/store/features/rawMaterials/rawMaterialsSlice";
import { fetchProductionSuggestions } from "@/store/features/production/productionSlice";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { items: materials, loading: materialsLoading } = useAppSelector((state) => state.rawMaterials);
  const { suggestions, loading: suggestionsLoading } = useAppSelector((state) => state.production);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  const totalProductValue = products.reduce((sum, p) => sum + p.value, 0);
  const totalMaterialQuantity = materials.reduce((sum, m) => sum + m.quantity, 0);
  const topSuggestion = suggestions[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Production management overview</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-in fade-in slide-in-from-left duration-500" hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-blue-900 font-semibold mb-1">Total Products</p>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-900">{products.length}</p>
                  <p className="text-xs text-blue-800 mt-2 font-medium">Value: ${(totalProductValue ?? 0).toFixed(2)}</p>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 animate-in fade-in slide-in-from-bottom duration-500 delay-100" hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-900 font-semibold mb-1">Raw Materials</p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900">{materials.length}</p>
                  <p className="text-xs text-slate-800 mt-2 font-medium">Qty: {totalMaterialQuantity} units</p>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 sm:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-right duration-500 delay-200" hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-blue-900 font-semibold mb-1">Production</p>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-900">{suggestions.length}</p>
                  {topSuggestion && (
                    <p className="text-xs text-blue-800 mt-2 font-medium">
                      Top: {topSuggestion.productName.substring(0, 15)}
                      {topSuggestion.productName.length > 15 ? "..." : ""} ({topSuggestion.maxProducibleQuantity})
                    </p>
                  )}
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-800 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {productsLoading || materialsLoading || suggestionsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="animate-in fade-in slide-in-from-left duration-700">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Products</h2>
                  <Link href="/products" className="text-xs sm:text-sm text-blue-900 hover:text-blue-950 font-semibold transition-colors flex items-center gap-1 hover:gap-2">
                    View all <span>→</span>
                  </Link>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {products.slice(0, 5).map((product, idx) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl hover:from-blue-100 hover:shadow-md transition-all cursor-pointer border border-blue-100"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate mr-2">{product.name}</span>
                      <span className="text-xs sm:text-sm bg-blue-900 text-white px-2 sm:px-3 py-1 rounded-full font-bold whitespace-nowrap">${(product.value ?? 0).toFixed(2)}</span>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No products yet</p>
                      <Link href="/products" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                        Create your first product
                      </Link>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="animate-in fade-in slide-in-from-right duration-700">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Production Ideas</h2>
                  <Link href="/production" className="text-xs sm:text-sm text-blue-900 hover:text-blue-950 font-semibold transition-colors flex items-center gap-1 hover:gap-2">
                    Plan <span>→</span>
                  </Link>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {suggestions.slice(0, 5).map((suggestion, idx) => (
                    <div
                      key={suggestion.productId}
                      className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-100 rounded-xl hover:shadow-md transition-all cursor-pointer border border-blue-200"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate mr-2">{suggestion.productName}</span>
                        <span className="text-xs sm:text-sm bg-blue-900 text-white px-2 sm:px-3 py-1 rounded-full font-bold whitespace-nowrap">${(suggestion.estimatedRevenue ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="bg-white px-2 py-0.5 rounded-full">Max: {suggestion.maxProducibleQuantity} units</span>
                        <span className="bg-white px-2 py-0.5 rounded-full">${(suggestion.productValue ?? 0).toFixed(2)}/unit</span>
                      </div>
                    </div>
                  ))}
                  {suggestions.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No suggestions available</p>
                      <Link href="/compositions" className="text-green-600 text-sm mt-2 inline-block hover:underline">
                        Create product recipes first
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
