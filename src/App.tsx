import React, { useState } from 'react';
import { initialRDOData, RDOData, CatalogItem } from './types';
import { RDOForm } from './components/RDOForm';
import { Administration } from './components/Administration';
import { RDOPrint } from './components/RDOPrint';
import { RDOList } from './components/RDOList';
import { FileText, Settings, Printer, PenTool, ArrowLeft, Save } from 'lucide-react';

// Mock data for history
const mockHistory: RDOData[] = [
  { ...initialRDOData, header: { ...initialRDOData.header, numero: 'RDO-040', data: '2026-03-01', diasCorridos: 40, diasRestantes: 140 } },
  { ...initialRDOData, header: { ...initialRDOData.header, numero: 'RDO-039', data: '2026-02-28', diasCorridos: 39, diasRestantes: 141 } },
  { ...initialRDOData, header: { ...initialRDOData.header, numero: 'RDO-038', data: '2026-02-27', diasCorridos: 38, diasRestantes: 142 } },
];

// Initial Catalogs
const initialLaborCatalog: CatalogItem[] = [
  { id: '1', name: 'TECN./ ADMINISTRAT. OBRA.', category: 'labor' },
  { id: '2', name: 'APONTADOR', category: 'labor' },
  { id: '3', name: 'ARMADOR FERRO', category: 'labor' },
  { id: '4', name: 'AUXILIAR LABORATÓRIO', category: 'labor' },
  { id: '5', name: 'OPERÁRIO NÃO QUALIFICADO', category: 'labor' },
  { id: '6', name: 'CANALIZADOR', category: 'labor' },
  { id: '7', name: 'CARPINTEIRO', category: 'labor' },
  { id: '8', name: 'ALVORADO', category: 'labor' },
  { id: '9', name: 'COORD. EQUIPA DE TRABALHO', category: 'labor' },
  { id: '10', name: 'CONDUTOR OPERADOR', category: 'labor' },
  { id: '11', name: 'COZINHEIRO', category: 'labor' },
  { id: '12', name: 'ELETRICISTA C. CIVIL', category: 'labor' },
  { id: '13', name: 'ENCARREGADO', category: 'labor' },
  { id: '14', name: 'ENCARREGADO ADJUNTO', category: 'labor' },
  { id: '15', name: 'ENCARREGADO OBRAS CIVIS', category: 'labor' },
  { id: '16', name: 'ENCARREGADO TERRAPLENAGEM', category: 'labor' },
  { id: '17', name: 'ENCARREGADO GERAL', category: 'labor' },
  { id: '18', name: 'ENFERMEIRA', category: 'labor' },
  { id: '19', name: 'ENGENHEIRO CIVIL', category: 'labor' },
  { id: '20', name: 'ESPALHADOR DE BETUMINOSO', category: 'labor' },
  { id: '21', name: 'ESTAGIÁRIO', category: 'labor' },
  { id: '22', name: 'FERRAMENTEIRO', category: 'labor' },
  { id: '23', name: 'GUARDA/SEGURANÇA', category: 'labor' },
  { id: '24', name: 'LUBRIFICADOR', category: 'labor' },
  { id: '25', name: 'MECÂNICO', category: 'labor' },
  { id: '26', name: 'MOTORISTA PESADOS', category: 'labor' },
  { id: '27', name: 'PEDREIRO', category: 'labor' },
  { id: '28', name: 'SERRALHEIRO MECÂNICO', category: 'labor' },
  { id: '29', name: 'AUX./ ADMINISTRAT. OBRA.', category: 'labor' },
  { id: '30', name: 'TÉCNICO TOPÓGRAFO', category: 'labor' },
  { id: '31', name: 'TÉCNICO DE QUALIDADE', category: 'labor' },
  { id: '32', name: 'TECNICO DE HSE', category: 'labor' },
  { id: '33', name: 'SINALEIRO', category: 'labor' },
  { id: '34', name: 'COORD.HSE', category: 'labor' },
  { id: '35', name: 'DIRETOR DE OBRAS', category: 'labor' },
  { id: '36', name: 'PINTOR', category: 'labor' },
];

const initialEquipmentCatalog: CatalogItem[] = [
  { id: '1', name: 'GERADOR', category: 'equipment' },
  { id: '2', name: 'AUTOBETONEIRA 3M³', category: 'equipment' },
  { id: '3', name: 'GIRATÓRIA DE PNEUS', category: 'equipment' },
  { id: '4', name: 'RETROESCAVADEIRA', category: 'equipment' },
  { id: '5', name: 'NIVELADORA', category: 'equipment' },
  { id: '6', name: 'BULLDOZER(D6)', category: 'equipment' },
  { id: '7', name: 'CAMINHÕES BASC. 16M³', category: 'equipment' },
  { id: '8', name: 'CARINHA 3500KG', category: 'equipment' },
  { id: '9', name: 'CILINDRO MISTO 15TONS', category: 'equipment' },
  { id: '10', name: 'GIRATÓRIA 35TONS', category: 'equipment' },
  { id: '11', name: 'FRESA PEQUENA', category: 'equipment' },
  { id: '12', name: 'CILINDRO MISTO 20TONS', category: 'equipment' },
  { id: '13', name: 'CAMINHÃO ÁGUA', category: 'equipment' },
  { id: '14', name: 'GRUA MÓVEL 50t', category: 'equipment' },
  { id: '15', name: 'MINIBUS 33P', category: 'equipment' },
  { id: '16', name: 'FRESA GRANDE', category: 'equipment' },
];

function App() {
  const [activeTab, setActiveTab] = useState<'cadastro' | 'administracao' | 'relatorio'>('cadastro');
  const [rdoData, setRdoData] = useState<RDOData>(initialRDOData);
  const [rdoHistory, setRdoHistory] = useState<RDOData[]>([...mockHistory]);
  const [viewingRDO, setViewingRDO] = useState<RDOData | null>(null);
  
  const [laborCatalog, setLaborCatalog] = useState<CatalogItem[]>(initialLaborCatalog);
  const [equipmentCatalog, setEquipmentCatalog] = useState<CatalogItem[]>(initialEquipmentCatalog);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Check if RDO with same number exists
    const existingIndex = rdoHistory.findIndex(r => r.header.numero === rdoData.header.numero);
    if (existingIndex >= 0) {
      const newHistory = [...rdoHistory];
      newHistory[existingIndex] = rdoData;
      setRdoHistory(newHistory);
      alert(`RDO ${rdoData.header.numero} atualizado com sucesso!`);
    } else {
      setRdoHistory([rdoData, ...rdoHistory]);
      alert(`RDO ${rdoData.header.numero} salvo com sucesso!`);
    }
  };

  const handleSelectRDO = (rdo: RDOData) => {
    setViewingRDO(rdo);
  };

  const handleBackToList = () => {
    setViewingRDO(null);
  };

  const handleAddCatalogItem = (item: CatalogItem) => {
    if (item.category === 'labor') {
      setLaborCatalog([...laborCatalog, item]);
    } else {
      setEquipmentCatalog([...equipmentCatalog, item]);
    }
  };

  const handleRemoveCatalogItem = (id: string, category: 'labor' | 'equipment') => {
    if (category === 'labor') {
      setLaborCatalog(laborCatalog.filter(item => item.id !== id));
    } else {
      setEquipmentCatalog(equipmentCatalog.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Navigation Bar - Hidden when printing */}
      <nav className="bg-blue-900 text-white shadow-lg print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg">
                <PenTool className="h-6 w-6 text-blue-900" />
              </div>
              <span className="font-bold text-xl tracking-tight">Gestão RDO</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('cadastro')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'cadastro' 
                    ? 'bg-blue-800 text-white shadow-inner' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Cadastro
              </button>
              <button
                onClick={() => setActiveTab('administracao')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'administracao' 
                    ? 'bg-blue-800 text-white shadow-inner' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Administração
              </button>
              <button
                onClick={() => {
                  setActiveTab('relatorio');
                  setViewingRDO(null); // Reset view when switching tab
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'relatorio' 
                    ? 'bg-blue-800 text-white shadow-inner' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <Printer className="w-4 h-4 mr-2" />
                Relatório
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 print:max-w-none print:p-0 print:m-0">
        <div className="print:hidden">
          {activeTab === 'cadastro' && (
            <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
              <div className="flex justify-end mb-4 px-6">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center shadow-sm transition-all hover:shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar RDO
                </button>
              </div>
              <RDOForm 
                data={rdoData} 
                onChange={setRdoData} 
                laborCatalog={laborCatalog}
                equipmentCatalog={equipmentCatalog}
              />
            </div>
          )}
          {activeTab === 'administracao' && (
            <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
              <Administration 
                laborCatalog={laborCatalog}
                equipmentCatalog={equipmentCatalog}
                onAddCatalogItem={handleAddCatalogItem}
                onRemoveCatalogItem={handleRemoveCatalogItem}
              />
            </div>
          )}
          {activeTab === 'relatorio' && (
            <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
              {!viewingRDO ? (
                <div className="px-4 sm:px-0">
                   <RDOList rdos={rdoHistory} onSelectRDO={handleSelectRDO} />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-4 px-4 sm:px-0">
                    <button
                      onClick={handleBackToList}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center shadow-sm transition-all hover:shadow-md"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar para Lista
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center shadow-sm transition-all hover:shadow-md"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir PDF
                    </button>
                  </div>
                  <div className="bg-gray-200 p-8 rounded-xl overflow-auto shadow-inner flex justify-center">
                    <div className="transform scale-90 origin-top shadow-2xl">
                      <RDOPrint data={viewingRDO} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Print Only View */}
        <div className="hidden print:block">
          <RDOPrint data={viewingRDO || rdoData} />
        </div>
      </main>
    </div>
  );
}

export default App;
