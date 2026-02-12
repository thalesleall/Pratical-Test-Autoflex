"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial } from "@/store/features/rawMaterials/rawMaterialsSlice";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { RawMaterialDTO } from "@/types/api";

export default function MaterialsPage() {
  const dispatch = useAppDispatch();
  const { items: materials, loading } = useAppSelector((state) => state.rawMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterialDTO | null>(null);
  const [formData, setFormData] = useState({ name: "", quantity: 0 });

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMaterial?.id) {
      await dispatch(updateRawMaterial({ id: editingMaterial.id, material: formData }));
    } else {
      await dispatch(createRawMaterial(formData));
    }
    setIsModalOpen(false);
    setFormData({ name: "", quantity: 0 });
    setEditingMaterial(null);
  };

  const handleEdit = (material: RawMaterialDTO) => {
    setEditingMaterial(material);
    setFormData({ name: material.name, quantity: material.quantity });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this raw material?")) {
      await dispatch(deleteRawMaterial(id));
    }
  };

  const openCreateModal = () => {
    setEditingMaterial(null);
    setFormData({ name: "", quantity: 0 });
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top duration-500">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2">Raw Materials</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your inventory</p>
            </div>
            <Button onClick={openCreateModal} size="lg" className="w-full sm:w-auto">
              + New Material
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {materials.map((material, idx) => (
                <Card key={material.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 50}ms` } as React.CSSProperties}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{material.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl text-blue-900 font-bold">{material.quantity}</span>
                        <span className="text-gray-500 text-sm">units</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(material)} className="flex-1 text-sm">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(material.id!)} className="flex-1 text-sm">
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && materials.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No materials yet. Click &quot;New Material&quot; to create one.</p>
              <Button onClick={openCreateModal}>Create First Material</Button>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMaterial ? "Edit Material" : "New Material"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Material Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter material name" required />
          <Input label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} placeholder="0" required />
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {editingMaterial ? "Update" : "Create"}
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
