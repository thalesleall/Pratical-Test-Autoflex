"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/features/products/productsSlice";
import { fetchRawMaterials } from "@/store/features/rawMaterials/rawMaterialsSlice";
import { fetchCompositions, addComposition, deleteComposition } from "@/store/features/compositions/compositionsSlice";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CompositionsPage() {
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.products);
  const { items: materials } = useAppSelector((state) => state.rawMaterials);
  const { compositions, loading, currentProductId } = useAppSelector((state) => state.compositions);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId);
    dispatch(fetchCompositions(productId));
  };

  const handleAddComposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId && selectedMaterialId) {
      // Check if material is already in composition
      const isDuplicate = compositions.some((comp) => comp.rawMaterialId === selectedMaterialId);
      if (isDuplicate) {
        const material = materials.find((m) => m.id === selectedMaterialId);
        alert(`"${material?.name || "This material"}" is already in this recipe. Remove it first to change the quantity.`);
        return;
      }

      try {
        await dispatch(
          addComposition({
            productId: selectedProductId,
            composition: { rawMaterialId: selectedMaterialId, quantity },
          }),
        ).unwrap();
        setSelectedMaterialId(0);
        setQuantity(1);
      } catch (error: any) {
        alert(error.message || "Failed to add material to recipe");
      }
    }
  };

  const handleDelete = async (rawMaterialId: number) => {
    if (selectedProductId && confirm("Remove this material from the composition?")) {
      await dispatch(deleteComposition({ productId: selectedProductId, rawMaterialId }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2">Product Recipes</h1>
            <p className="text-gray-600 text-sm sm:text-base">Define which materials are needed for each product</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="lg:col-span-1 animate-in fade-in slide-in-from-left duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Select Product</h2>
              <div className="space-y-2">
                {products.map((product, idx) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductChange(product.id!)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 animate-in fade-in slide-in-from-left ${
                      selectedProductId === product.id
                        ? "bg-gradient-to-r from-blue-900 to-blue-950 text-white shadow-xl scale-105"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-900 hover:scale-102 border border-gray-200"
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="font-semibold text-sm sm:text-base">{product.name}</div>
                    <div className={`text-xs sm:text-sm mt-1 ${selectedProductId === product.id ? "opacity-90" : "opacity-60"}`}>${(product.value ?? 0).toFixed(2)}</div>
                  </button>
                ))}
                {products.length === 0 && <p className="text-gray-500 text-center py-8">No products available</p>}
              </div>
            </Card>

            <Card className="lg:col-span-2 animate-in fade-in slide-in-from-right duration-500">
              {selectedProductId ? (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Recipe for {products.find((p) => p.id === selectedProductId)?.name}</h2>

                  {materials.filter((material) => !compositions.some((comp) => comp.rawMaterialId === material.id)).length > 0 ? (
                    <form onSubmit={handleAddComposition} className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Material</label>
                          <select
                            value={selectedMaterialId}
                            onChange={(e) => setSelectedMaterialId(parseInt(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none bg-white hover:border-gray-400 transition-all text-gray-900 font-normal"
                            style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" } as React.CSSProperties}
                            required
                          >
                            <option value={0}>Select a material</option>
                            {materials
                              .filter((material) => !compositions.some((comp) => comp.rawMaterialId === material.id))
                              .map((material) => (
                                <option key={material.id} value={material.id}>
                                  {material.name} ({material.quantity} available)
                                </option>
                              ))}
                          </select>
                        </div>
                        <Input label="Quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} required />
                      </div>
                      <Button type="submit" variant="success" className="mt-4 w-full">
                        + Add Material
                      </Button>
                    </form>
                  ) : (
                    <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-300 text-center">
                      <p className="text-gray-600">All available materials have been added to this recipe.</p>
                    </div>
                  )}

                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="space-y-3">
                      {compositions.map((comp, idx) => {
                        const material = materials.find((m) => m.id === comp.rawMaterialId);
                        return (
                          <div
                            key={comp.rawMaterialId}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom duration-300"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">{material?.name || comp.rawMaterialName}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Quantity: {comp.quantity} units</p>
                              </div>
                            </div>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(comp.rawMaterialId)} className="flex-shrink-0">
                              Remove
                            </Button>
                          </div>
                        );
                      })}
                      {compositions.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-sm sm:text-base">No materials added yet. Add materials using the form above.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500">Select a product to manage its recipe</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
