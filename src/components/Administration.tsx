import React, { useState } from 'react';
import { CatalogItem } from '../types';
import { Plus, Trash2, Settings, Users, Truck } from 'lucide-react';

interface AdministrationProps {
  laborCatalog: CatalogItem[];
  equipmentCatalog: CatalogItem[];
  onAddCatalogItem: (item: CatalogItem) => void;
  onRemoveCatalogItem: (id: string, category: 'labor' | 'equipment') => void;
}

export const Administration: React.FC<AdministrationProps> = ({
  laborCatalog,
  equipmentCatalog,
  onAddCatalogItem,
  onRemoveCatalogItem,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [activeTab, setActiveTab] = useState<'labor' | 'equipment'>('labor');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: CatalogItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: activeTab,
    };
    
    onAddCatalogItem(newItem);
    setNewItemName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const currentCatalog = activeTab === 'labor' ? laborCatalog : equipmentCatalog;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Settings className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Administração</h2>
          <p className="text-sm text-gray-500">Gerencie os itens disponíveis para cadastro no RDO.</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('labor')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'labor'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Efetivo (Mão de Obra)
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'equipment'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Truck className="w-4 h-4 mr-2" />
          Equipamentos
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Adicionar novo item de ${activeTab === 'labor' ? 'efetivo' : 'equipamento'}...`}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-100">
          {currentCatalog.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              Nenhum item cadastrado nesta categoria.
            </div>
          ) : (
            currentCatalog.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                <span className="font-medium text-gray-700">{item.name}</span>
                <button
                  onClick={() => onRemoveCatalogItem(item.id, activeTab)}
                  className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
