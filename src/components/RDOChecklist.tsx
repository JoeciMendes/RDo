import React from 'react';
import { RDOData } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface RDOChecklistProps {
  data: RDOData;
  onChange: (data: RDOData) => void;
}

export const RDOChecklist: React.FC<RDOChecklistProps> = ({ data, onChange }) => {
  const toggleFact = (id: string) => {
    const newFacts = data.importantFacts.map(fact => 
      fact.id === id ? { ...fact, checked: !fact.checked } : fact
    );
    onChange({ ...data, importantFacts: newFacts });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Resumo Diário</h2>
          <p className="text-blue-100 mt-1">Verificação rápida dos principais eventos do dia.</p>
        </div>
        
        <div className="p-6 space-y-4">
          {data.importantFacts.map((fact) => (
            <div 
              key={fact.id}
              onClick={() => toggleFact(fact.id)}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                fact.checked 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className={`mr-4 ${fact.checked ? 'text-blue-600' : 'text-gray-300'}`}>
                {fact.checked ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </div>
              <span className={`text-lg font-medium ${fact.checked ? 'text-blue-900' : 'text-gray-600'}`}>
                {fact.label}
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Resumo Automático</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="text-gray-500 block">Efetivo Total</span>
              <span className="text-xl font-bold text-gray-800">
                {data.labor.left.reduce((acc, item) => acc + item.qty, 0) + 
                 data.labor.right.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="text-gray-500 block">Equipamentos Ativos</span>
              <span className="text-xl font-bold text-gray-800">
                {data.equipment.reduce((acc, item) => acc + (item.qty > 0 ? 1 : 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
