import React from 'react';
import { RDOData } from '../types';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

interface RDOListProps {
  rdos: RDOData[];
  onSelectRDO: (rdo: RDOData) => void;
}

export const RDOList: React.FC<RDOListProps> = ({ rdos, onSelectRDO }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Histórico de Relatórios
        </h2>
        <p className="text-sm text-gray-500 mt-1">Selecione um relatório para visualizar ou imprimir.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Número</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Dias Corridos</th>
              <th className="px-6 py-4">Projeto</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rdos.map((rdo, index) => (
              <tr 
                key={index} 
                onClick={() => onSelectRDO(rdo)}
                className="hover:bg-blue-50 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{rdo.header.numero}</td>
                <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {rdo.header.data}
                </td>
                <td className="px-6 py-4 text-gray-600">{rdo.header.diasCorridos}</td>
                <td className="px-6 py-4 text-gray-600">{rdo.contract.projeto}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Abrir <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rdos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum relatório encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
