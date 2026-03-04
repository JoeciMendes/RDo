import React, { useState, useEffect } from 'react';
import { RDOData, LaborItem, EquipmentItem, CatalogItem, AIChecklistItem, RDOPhoto } from '../types';
import { Calendar, Users, Truck, ShieldAlert, CloudRain, FileText, Sparkles, X, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface RDOFormProps {
  data: RDOData;
  onChange: (data: RDOData) => void;
  laborCatalog: CatalogItem[];
  equipmentCatalog: CatalogItem[];
}

const aiChecklistItems: AIChecklistItem[] = [
  { id: '1', label: 'Houve chuva que paralisou as atividades?', checked: false },
  { id: '2', label: 'Ocorreu algum acidente de trabalho?', checked: false },
  { id: '3', label: 'Todos os equipamentos operaram normalmente?', checked: true },
  { id: '4', label: 'Houve visita da fiscalização?', checked: false },
  { id: '5', label: 'Realizada reunião de segurança (DDS)?', checked: true },
  { id: '6', label: 'Houve entrega de materiais?', checked: false },
  { id: '7', label: 'Atividades de escavação realizadas?', checked: false },
  { id: '8', label: 'Atividades de concretagem realizadas?', checked: false },
  { id: '9', label: 'Atividades de armação realizadas?', checked: false },
  { id: '10', label: 'Atividades de carpintaria realizadas?', checked: false },
  { id: '11', label: 'Instalações elétricas em andamento?', checked: false },
  { id: '12', label: 'Instalações hidráulicas em andamento?', checked: false },
  { id: '13', label: 'Houve falta de efetivo?', checked: false },
];

export const RDOForm: React.FC<RDOFormProps> = ({ data, onChange, laborCatalog, equipmentCatalog }) => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [checklist, setChecklist] = useState<AIChecklistItem[]>(aiChecklistItems);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync RDO data with catalogs
  useEffect(() => {
    // Sync Labor
    const currentLaborIds = new Set([...data.labor.left, ...data.labor.right].map(i => i.funcao));
    const newLaborItems: LaborItem[] = [];
    
    laborCatalog.forEach(catItem => {
      if (!currentLaborIds.has(catItem.name)) {
        newLaborItems.push({
          id: catItem.id,
          funcao: catItem.name,
          qty: 0,
          qtyHoras: '0:00:00'
        });
      }
    });

    // Sync Equipment
    const currentEquipIds = new Set(data.equipment.map(i => i.tipo));
    const newEquipItems: EquipmentItem[] = [];

    equipmentCatalog.forEach(catItem => {
      if (!currentEquipIds.has(catItem.name)) {
        newEquipItems.push({
          id: catItem.id,
          tipo: catItem.name,
          qty: 0,
          obs: ''
        });
      }
    });

    if (newLaborItems.length > 0 || newEquipItems.length > 0) {
      // Distribute new labor items to left/right to keep balance
      const newLeft = [...data.labor.left];
      const newRight = [...data.labor.right];
      
      newLaborItems.forEach((item, idx) => {
        if (newLeft.length <= newRight.length) {
          newLeft.push(item);
        } else {
          newRight.push(item);
        }
      });

      onChange({
        ...data,
        labor: {
          left: newLeft,
          right: newRight
        },
        equipment: [...data.equipment, ...newEquipItems]
      });
    }
  }, [laborCatalog, equipmentCatalog, data.labor, data.equipment]);

  const handleHeaderChange = (field: string, value: any) => {
    onChange({ ...data, header: { ...data.header, [field]: value } });
  };

  const handleLaborChange = (side: 'left' | 'right', index: number, field: keyof LaborItem, value: any) => {
    const newList = [...data.labor[side]];
    newList[index] = { ...newList[index], [field]: value };
    onChange({ ...data, labor: { ...data.labor, [side]: newList } });
  };

  const handleEquipmentChange = (index: number, field: keyof EquipmentItem, value: any) => {
    const newList = [...data.equipment];
    newList[index] = { ...newList[index], [field]: value };
    onChange({ ...data, equipment: newList });
  };

  const handleWeatherChange = (period: 'manha' | 'tarde' | 'noite', value: any) => {
    onChange({ ...data, weather: { ...data.weather, [period]: value } });
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      const checkedItems = checklist.filter(i => i.checked).map(i => i.label);
      const prompt = `
        Atue como um engenheiro civil experiente escrevendo um Relatório Diário de Obra (RDO).
        Com base nos seguintes fatos marcados no checklist de hoje:
        ${checkedItems.map(i => `- ${i}`).join('\n')}
        
        Gere um texto técnico, formal e conciso para o campo "Construção / Atividades" do RDO.
        O texto deve descrever o andamento da obra, mencionando as atividades realizadas e quaisquer ocorrências relevantes.
        Use português de Portugal ou Angola (formal).
        Não inclua saudações ou introduções, apenas o texto do relatório.
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      onChange({
        ...data,
        activities: {
          ...data.activities,
          construcao: text
        }
      });
      setShowAIModal(false);
    } catch (error) {
      console.error("Erro ao gerar com IA:", error);
      alert("Erro ao gerar texto com IA. Verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPhotos: RDOPhoto[] = [];
      let processedCount = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            comment: ''
          });
          processedCount++;
          
          if (processedCount === files.length) {
            onChange({ ...data, photos: [...data.photos, ...newPhotos] });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePhotoCommentChange = (id: string, comment: string) => {
    const newPhotos = data.photos.map(p => 
      p.id === id ? { ...p, comment } : p
    );
    onChange({ ...data, photos: newPhotos });
  };

  const handleRemovePhoto = (id: string) => {
    const newPhotos = data.photos.filter(p => p.id !== id);
    onChange({ ...data, photos: newPhotos });
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen relative">
      {/* AI Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAIModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Assistente IA
        </button>
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50">
              <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Gerar Atividades com IA
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 mb-4">Marque os itens que ocorreram hoje para gerar o relatório:</p>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-purple-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-md flex items-center gap-2 disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <FileText className="w-5 h-5" />
          Informações Gerais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número RDO</label>
            <input
              type="text"
              value={data.header.numero}
              onChange={(e) => handleHeaderChange('numero', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              value={data.header.data}
              onChange={(e) => handleHeaderChange('data', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dias Corridos</label>
            <input
              type="number"
              value={data.header.diasCorridos}
              onChange={(e) => handleHeaderChange('diasCorridos', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <ShieldAlert className="w-5 h-5" />
          Segurança
        </h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide border-b pb-1">Análise de Segurança</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['fatalidade', 'ar', 'anr', 'incidentes', 'atoInseguro'].map((key) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{key}</label>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-gray-400">Real</span>
                    <input
                      type="number"
                      step="0.01"
                      value={data.safetyAnalysis[key as keyof typeof data.safetyAnalysis].real}
                      onChange={(e) => {
                        const newSafety = { ...data.safetyAnalysis };
                        (newSafety[key as keyof typeof data.safetyAnalysis] as any).real = parseFloat(e.target.value);
                        onChange({ ...data, safetyAnalysis: newSafety });
                      }}
                      className="w-full rounded border-gray-300 text-xs p-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Acum (%)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={data.safetyAnalysis[key as keyof typeof data.safetyAnalysis].acum}
                      onChange={(e) => {
                        const newSafety = { ...data.safetyAnalysis };
                        (newSafety[key as keyof typeof data.safetyAnalysis] as any).acum = parseFloat(e.target.value);
                        onChange({ ...data, safetyAnalysis: newSafety });
                      }}
                      className="w-full rounded border-gray-300 text-xs p-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Probab</span>
                    <input
                      type="number"
                      step="0.01"
                      value={data.safetyAnalysis[key as keyof typeof data.safetyAnalysis].probab}
                      onChange={(e) => {
                        const newSafety = { ...data.safetyAnalysis };
                        (newSafety[key as keyof typeof data.safetyAnalysis] as any).probab = parseFloat(e.target.value);
                        onChange({ ...data, safetyAnalysis: newSafety });
                      }}
                      className="w-full rounded border-gray-300 text-xs p-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide border-b pb-1">Registro Diário de Segurança</h3>
          <div className="space-y-2">
            {[
              { label: 'Ato Inseguro', key: 'atoInseguro' },
              { label: 'Condição Insegura', key: 'condicaoInsegura' },
              { label: 'Incidente', key: 'incidente' },
              { label: 'Acidente Não Reportável', key: 'acidenteNaoReportavel' },
              { label: 'Acidente Reportável', key: 'acidenteReportavel' },
            ].map((item) => (
              <div key={item.key} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <div>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={data.safetyRegister[item.key as keyof typeof data.safetyRegister].qty}
                    onChange={(e) => {
                      const newRegister = { ...data.safetyRegister };
                      (newRegister[item.key as keyof typeof data.safetyRegister] as any).qty = parseInt(e.target.value);
                      onChange({ ...data, safetyRegister: newRegister });
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1 border"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Último RDO"
                    value={data.safetyRegister[item.key as keyof typeof data.safetyRegister].ultimoRdo}
                    onChange={(e) => {
                      const newRegister = { ...data.safetyRegister };
                      (newRegister[item.key as keyof typeof data.safetyRegister] as any).ultimoRdo = parseInt(e.target.value);
                      onChange({ ...data, safetyRegister: newRegister });
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1 border"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <CloudRain className="w-5 h-5" />
          Condições Climáticas
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {['manha', 'tarde', 'noite'].map((period) => (
            <div key={period}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{period}</label>
              <select
                value={data.weather[period as keyof typeof data.weather] || ''}
                onChange={(e) => handleWeatherChange(period as any, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="">Selecione</option>
                <option value="ceu_claro">Céu Claro</option>
                <option value="instavel">Instável</option>
                <option value="chuva_fraca">Chuva Fraca</option>
                <option value="chuva_forte">Chuva Forte</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <Users className="w-5 h-5" />
          Efetivo (Mão de Obra)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            {data.labor.left.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="text-xs font-medium w-48 truncate" title={item.funcao}>{item.funcao}</span>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleLaborChange('left', idx, 'qty', parseInt(e.target.value))}
                  className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1 border"
                  placeholder="Qtd"
                />
                <input
                  type="text"
                  value={item.qtyHoras}
                  onChange={(e) => handleLaborChange('left', idx, 'qtyHoras', e.target.value)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1 border"
                  placeholder="Horas"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {data.labor.right.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="text-xs font-medium w-48 truncate" title={item.funcao}>{item.funcao}</span>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleLaborChange('right', idx, 'qty', parseInt(e.target.value))}
                  className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1 border"
                  placeholder="Qtd"
                />
                <input
                  type="text"
                  value={item.qtyHoras}
                  onChange={(e) => handleLaborChange('right', idx, 'qtyHoras', e.target.value)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1 border"
                  placeholder="Horas"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <Truck className="w-5 h-5" />
          Equipamentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.equipment.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-xs font-medium w-40 truncate" title={item.tipo}>{item.tipo}</span>
              <input
                type="number"
                value={item.qty}
                onChange={(e) => handleEquipmentChange(idx, 'qty', parseInt(e.target.value))}
                className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1 border"
                placeholder="Qtd"
              />
              <input
                type="text"
                value={item.obs}
                onChange={(e) => handleEquipmentChange(idx, 'obs', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1 border"
                placeholder="Obs"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <FileText className="w-5 h-5" />
          Atividades e Observações
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Construção / Atividades</label>
            <textarea
              value={data.activities.construcao}
              onChange={(e) => onChange({ ...data, activities: { ...data.activities, construcao: e.target.value } })}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações Contratante</label>
            <textarea
              value={data.activities.observacoesContratante}
              onChange={(e) => onChange({ ...data, activities: { ...data.activities, observacoesContratante: e.target.value } })}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <ImageIcon className="w-5 h-5" />
          Registro Fotográfico
        </h2>
        
        <div className="mb-4">
          <label className="block w-full cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-600">
              Clique para adicionar fotos (máx 10 por página)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.photos.map((photo) => (
            <div key={photo.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                title="Remover foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden border border-gray-300">
                <img src={photo.url} alt="RDO" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={photo.comment}
                onChange={(e) => handlePhotoCommentChange(photo.id, e.target.value)}
                placeholder="Comentário da foto..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
