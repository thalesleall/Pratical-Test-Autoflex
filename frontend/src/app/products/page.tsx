"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/store/features/products/productsSlice";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ProductDTO } from "@/types/api";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [formData, setFormData] = useState({ name: "", value: 0 });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct?.id) {
      await dispatch(updateProduct({ id: editingProduct.id, product: formData }));
    } else {
      await dispatch(createProduct(formData));
    }
    setIsModalOpen(false);
    setFormData({ name: "", value: 0 });
    setEditingProduct(null);
  };

  const handleEdit = (product: ProductDTO) => {
    setEditingProduct(product);
    setFormData({ name: product.name, value: product.value });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProduct(id));
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", value: 0 });
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top duration-500">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2">Products</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your product catalog</p>
            </div>
            <Button onClick={openCreateModal} size="lg" className="w-full sm:w-auto">
              + New Product
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product, idx) => (
                <Card key={product.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 50}ms` } as React.CSSProperties}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl text-blue-900 font-bold">${(product.value ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(product)} className="flex-1 text-sm">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(product.id!)} className="flex-1 text-sm">
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products yet. Click &quot;New Product&quot; to create one.</p>
              <Button onClick={openCreateModal}>Create First Product</Button>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "New Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter product name" required />
          <Input label="Value" type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })} placeholder="0.00" required />
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {editingProduct ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
