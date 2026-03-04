import React from 'react';
import { RDOData, RDOPhoto } from '../types';
import { Cloud, Sun, CloudRain, CloudLightning } from 'lucide-react';

interface RDOPrintProps {
  data: RDOData;
}

export const RDOPrint: React.FC<RDOPrintProps> = ({ data }) => {
  // Helper to parse time string "HH:MM:SS" to hours
  const parseTime = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes || 0) / 60;
  };

  // Calculate totals
  const totalLaborQty = [...data.labor.left, ...data.labor.right].reduce((acc, item) => acc + (item.qty || 0), 0);
  const totalLaborHours = [...data.labor.left, ...data.labor.right].reduce((acc, item) => acc + parseTime(item.qtyHoras), 0);
  
  const totalEquipQty = data.equipment.reduce((acc, item) => acc + (item.qty || 0), 0);

  // Helper for weather icons
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'ceu_claro': return <Sun className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case 'instavel': return <Cloud className="w-4 h-4 text-gray-500 fill-gray-200" />;
      case 'chuva_fraca': return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'chuva_forte': return <CloudLightning className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  // Chunk photos into pages of 10
  const photoPages = [];
  for (let i = 0; i < data.photos.length; i += 10) {
    photoPages.push(data.photos.slice(i, i + 10));
  }

  const renderHeader = () => (
    <div className="border-2 border-black mb-1">
      {/* Top Row: Logos and Title */}
      <div className="flex border-b border-black h-16">
        <div className="w-48 p-2 flex items-center justify-center border-r border-black">
          <div className="text-red-600 font-bold text-lg flex flex-col items-center leading-none">
            <span>tecnovia</span>
            <span className="text-xs text-black">Angola</span>
          </div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="font-bold text-sm">RDO</div>
          <div className="font-bold text-lg">RELATÓRIO DIÁRIO DE OBRAS</div>
        </div>
        <div className="w-48 p-2 flex items-center justify-center border-l border-black">
          <div className="text-red-600 font-bold text-xl italic">Petromar</div>
        </div>
      </div>

      {/* Second Row: Info Grid */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] text-[9px] border-b border-black">
        <div className="border-r border-black p-1">
          <span className="font-bold block">REGISTRO:</span>
          <span>{data.header.registro}</span>
        </div>
        <div className="border-r border-black p-1">
          <span className="font-bold block">DATA:</span>
          <span>{data.header.data.split('-').reverse().join('/')}</span>
        </div>
        <div className="border-r border-black p-1">
          <span className="font-bold block">DIAS CORRIDOS:</span>
          <span>{data.header.diasCorridos}</span>
        </div>
        <div className="border-r border-black p-1">
          <span className="font-bold block">DIAS RESTANTES:</span>
          <span>{data.header.diasRestantes}</span>
        </div>
        <div className="p-1 flex items-center justify-between">
          <div className="border border-black px-2 py-1 w-full text-center">
            <span className="font-bold">NÚMERO:</span> RDO-{data.header.numero}
          </div>
        </div>
      </div>

      {/* Contract Info Header */}
      <div className="bg-gray-300 text-center font-bold text-[9px] border-b border-black py-0.5">
        INFORMAÇÕES CONTRATUAIS
      </div>

      {/* Contract Details */}
      <div className="text-[9px]">
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-1">
            <span className="font-bold block">CONTRATADA:</span>
            <span>{data.contract.contratada}</span>
          </div>
          <div className="p-1">
            <span className="font-bold block">CONTRATANTE:</span>
            <span>{data.contract.contratante}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-1">
            <span className="font-bold block">Nº DO CONTRATO:</span>
            <span>{data.contract.numContrato}</span>
          </div>
          <div className="p-1">
            <span className="font-bold block">OBJETO DO CONTRATO:</span>
            <span>{data.contract.objeto}</span>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="border-r border-black p-1">
            <span className="font-bold block">INÍCIO:</span>
            <span>{data.contract.inicio.split('-').reverse().join('/')}</span>
          </div>
          <div className="border-r border-black p-1">
            <span className="font-bold block">TÉRMINO:</span>
            <span>{data.contract.termino.split('-').reverse().join('/')}</span>
          </div>
          <div className="p-1">
            <span className="font-bold block">DURAÇÃO:</span>
            <span>{data.contract.duracao}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="print-container font-sans text-black bg-white">
      {/* Page 1: Main Report */}
      <div 
        className="w-[210mm] min-h-[297mm] mx-auto p-[10mm] bg-white shadow-lg print:shadow-none print:w-full print:h-[297mm] print:m-0 relative flex flex-col text-[9px]"
        style={{ pageBreakAfter: photoPages.length > 0 ? 'always' : 'auto' }}
      >
        {renderHeader()}

        {/* Gray Bar: Safety | Quality | Effective | Equipment */}
        <div className="bg-gray-300 text-center font-bold border-2 border-black border-t-0 py-0.5 mb-1">
          REGISTRO DE SEGURANÇA | QUALIDADE | EFETIVO | EQUIPAMENTO
        </div>

        {/* Safety Section */}
        <div className="border-2 border-black mb-1 flex">
          {/* Left: Pyramid & Analysis */}
          <div className="flex-grow border-r border-black">
            <div className="border-b border-black bg-gray-200 text-center font-bold py-0.5">ANÁLISE DE SEGURANÇA</div>
            <div className="flex">
              {/* Pyramid Placeholder */}
              <div className="w-24 flex flex-col items-center justify-center p-1 border-r border-black relative">
                <div className="text-[8px] absolute top-1 left-1">1.1 SEGURANÇA:</div>
                {/* CSS Triangle Pyramid Approximation */}
                <div className="relative w-16 h-16 mt-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-600 z-30 flex items-end justify-center">
                    <span className="text-white text-[6px] mb-1">1</span>
                  </div>
                  <div className="absolute top-[25px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[25px] border-l-transparent border-r-transparent border-b-yellow-400 z-20 flex items-end justify-center">
                    <span className="text-black text-[6px] mb-1">10</span>
                  </div>
                   <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[35px] border-r-[35px] border-b-[25px] border-l-transparent border-r-transparent border-b-purple-600 z-10 flex items-end justify-center">
                    <span className="text-white text-[6px] mb-1">30</span>
                  </div>
                   <div className="absolute top-[75px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[45px] border-r-[45px] border-b-[25px] border-l-transparent border-r-transparent border-b-gray-500 z-0 flex items-end justify-center">
                    <span className="text-white text-[6px] mb-1">600</span>
                  </div>
                </div>
              </div>
              
              {/* Analysis Table */}
              <div className="flex-grow">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-black">
                  <div className="p-0.5"></div>
                  <div className="border-l border-black p-0.5 text-center font-bold">REAL</div>
                  <div className="border-l border-black p-0.5 text-center font-bold">ACUM</div>
                  <div className="border-l border-black p-0.5 text-center font-bold">PROBAB*</div>
                </div>
                {[
                  { label: 'Fatalidade', data: data.safetyAnalysis.fatalidade },
                  { label: 'AR', data: data.safetyAnalysis.ar },
                  { label: 'ANR', data: data.safetyAnalysis.anr },
                  { label: 'Incidentes', data: data.safetyAnalysis.incidentes },
                  { label: 'Ato Inseguro', data: data.safetyAnalysis.atoInseguro },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-gray-300 last:border-b-0">
                    <div className="p-0.5 pl-1">{row.label}</div>
                    <div className="border-l border-gray-300 p-0.5 text-center">{row.data.real}</div>
                    <div className="border-l border-gray-300 p-0.5 text-center">{row.data.acum}</div>
                    <div className="border-l border-gray-300 p-0.5 text-center">{row.data.probab}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Safety Register */}
          <div className="w-1/3">
            <div className="border-b border-black bg-gray-200 text-center font-bold py-0.5">REGISTRO DIÁRIO DE SEGURANÇA</div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-black font-bold text-center">
              <div className="p-0.5">Tipo</div>
              <div className="border-l border-black p-0.5">Qty</div>
              <div className="border-l border-black p-0.5">Ultimo Rdo</div>
              <div className="border-l border-black p-0.5">Status</div>
            </div>
            {[
              { label: 'Ato Inseguro', data: data.safetyRegister.atoInseguro, status: '✅' },
              { label: 'Condição insegura', data: data.safetyRegister.condicaoInsegura, status: '⚠️' },
              { label: 'Incidente', data: data.safetyRegister.incidente, status: '❌' },
              { label: 'Acidente Não Reportável', data: data.safetyRegister.acidenteNaoReportavel, status: '⚠️' },
              { label: 'Acidente Reportável', data: data.safetyRegister.acidenteReportavel, status: '⚠️' },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-gray-300 last:border-b-0 text-center">
                <div className="p-0.5 text-left pl-1">{row.label}</div>
                <div className="border-l border-gray-300 p-0.5">{row.data.qty}</div>
                <div className="border-l border-gray-300 p-0.5">{row.data.ultimoRdo}</div>
                <div className="border-l border-gray-300 p-0.5">{row.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Row */}
        <div className="border-2 border-black border-t-0 -mt-1 mb-1 p-1">
          <span className="font-bold">COMENTÁRIOS.:</span>
        </div>

        {/* Weather & Labor & Equipment Grid */}
        <div className="grid grid-cols-[1fr_2fr] gap-1 mb-1">
          {/* Left Column: Weather & Equipment (Moved Equipment here to balance? No, PDF has Weather separate, then Labor/Equipment split) */}
          {/* Actually PDF has Weather on top right? No, Weather is a small block. 
             Let's look at the PDF again. 
             "REGISTRO DIÁRIO DE CONDIÇÕES CLIMÁTICAS" is a small table on the right side of the Safety section? 
             No, it's below Safety.
             Wait, the PDF screenshot shows:
             Safety Section (Full Width)
             Comments (Full Width)
             Then a split:
             Left: Empty? Or is Labor full width?
             Right: Weather?
             
             Actually, looking at the OCR and Screenshot:
             "REGISTRO DIÁRIO DE CONDIÇÕES CLIMÁTICAS" is on the RIGHT side of the page, aligned with "REGISTRO DIÁRIO DE EFETIVO"?
             No, "REGISTRO DIÁRIO DE EFETIVO" is on the LEFT. "REGISTRO DIÁRIO DE EQUIPAMENTOS" is on the RIGHT.
             Where is Weather?
             Ah, Weather is a small table ABOVE "REGISTRO DIÁRIO DE EQUIPAMENTOS" on the right side?
             Or is it a row?
             
             Let's re-examine the screenshot.
             Below "COMENTÁRIOS":
             Left Side: "REGISTRO DIÁRIO DE EFETIVO" (Wide table)
             Right Side: "REGISTRO DIÁRIO DE CONDIÇÕES CLIMÁTICAS" (Small table) AND "REGISTRO DIÁRIO DE EQUIPAMENTOS" (Below weather).
             
             So layout is:
             Row 1: Header
             Row 2: Safety
             Row 3: Comments
             Row 4: Split (Left: Labor, Right: Weather + Equipment)
          */}
          
          {/* Left: Labor */}
          <div className="border-2 border-black">
            <div className="bg-orange-200 text-center font-bold border-b border-black py-0.5">REGISTRO DIÁRIO DE EFETIVO</div>
            <div className="grid grid-cols-2">
               {/* Col 1 */}
               <div className="border-r border-black">
                 <div className="grid grid-cols-[1fr_auto_auto] border-b border-black font-bold text-center bg-gray-100">
                   <div className="p-0.5">FUNÇÃO</div>
                   <div className="p-0.5 border-l border-black w-8">QTY</div>
                   <div className="p-0.5 border-l border-black w-12">HORAS</div>
                 </div>
                 {data.labor.left.map((item, idx) => (
                   <div key={idx} className="grid grid-cols-[1fr_auto_auto] border-b border-gray-300 last:border-b-0">
                     <div className="p-0.5 pl-1 truncate">{item.funcao}</div>
                     <div className="p-0.5 border-l border-gray-300 w-8 text-center">{item.qty}</div>
                     <div className="p-0.5 border-l border-gray-300 w-12 text-center">{item.qtyHoras}</div>
                   </div>
                 ))}
               </div>
               {/* Col 2 */}
               <div>
                 <div className="grid grid-cols-[1fr_auto_auto] border-b border-black font-bold text-center bg-gray-100">
                   <div className="p-0.5">FUNÇÃO</div>
                   <div className="p-0.5 border-l border-black w-8">QTY</div>
                   <div className="p-0.5 border-l border-black w-12">HORAS</div>
                 </div>
                 {data.labor.right.map((item, idx) => (
                   <div key={idx} className="grid grid-cols-[1fr_auto_auto] border-b border-gray-300 last:border-b-0">
                     <div className="p-0.5 pl-1 truncate">{item.funcao}</div>
                     <div className="p-0.5 border-l border-gray-300 w-8 text-center">{item.qty}</div>
                     <div className="p-0.5 border-l border-gray-300 w-12 text-center">{item.qtyHoras}</div>
                   </div>
                 ))}
               </div>
            </div>
            {/* Labor Summary */}
            <div className="border-t border-black">
              <div className="bg-gray-200 font-bold text-center border-b border-black py-0.5">QUADRO RESUMO DE HORAS</div>
              <div className="grid grid-cols-[1fr_1fr_1fr]">
                 <div></div>
                 <div className="border-l border-black text-center font-bold">TECNOVIA</div>
                 <div className="border-l border-black text-center font-bold">Total</div>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr] border-t border-black">
                 <div className="p-0.5 pl-1">TOTAIS DE COLABORADORES</div>
                 <div className="border-l border-black text-center font-bold">{totalLaborQty}</div>
                 <div className="border-l border-black text-center">{totalLaborQty}</div>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr] border-t border-black">
                 <div className="p-0.5 pl-1">TOTAL HORAS DIA</div>
                 <div className="border-l border-black text-center font-bold">{totalLaborHours.toFixed(2)}</div>
                 <div className="border-l border-black text-center">{totalLaborHours.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Right: Weather & Equipment */}
          <div className="flex flex-col gap-1">
            {/* Weather */}
            <div className="border-2 border-black">
              <div className="bg-gray-200 text-center font-bold border-b border-black py-0.5">REGISTRO DIÁRIO DE CONDIÇÕES CLIMÁTICAS</div>
              <div className="grid grid-cols-[1fr_1fr_1fr] text-center border-b border-black font-bold text-[8px]">
                <div className="p-0.5">Condição</div>
                <div className="border-l border-black p-0.5 col-span-2">CHUVA</div>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr] text-center border-b border-black text-[8px]">
                <div className="p-0.5"></div>
                <div className="border-l border-black p-0.5 font-bold">FRACA</div>
                <div className="border-l border-black p-0.5 font-bold">FORTE</div>
              </div>
              {['Manhã', 'Tarde', 'Noite'].map((period) => (
                <div key={period} className="grid grid-cols-[1fr_1fr_1fr] border-b border-gray-300 last:border-b-0 items-center h-6">
                  <div className="p-0.5 text-left pl-2 font-bold">{period}</div>
                  <div className="border-l border-gray-300 p-0.5 flex justify-center">
                    {data.weather[period.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") as keyof typeof data.weather] === 'chuva_fraca' && 'X'}
                  </div>
                  <div className="border-l border-gray-300 p-0.5 flex justify-center">
                    {data.weather[period.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") as keyof typeof data.weather] === 'chuva_forte' && 'X'}
                  </div>
                  {/* Overlay Icon for Condition */}
                  <div className="absolute ml-24 mt-1">
                     {getWeatherIcon(data.weather[period.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") as keyof typeof data.weather])}
                  </div>
                </div>
              ))}
              {/* Legend */}
              <div className="border-t border-black text-[8px]">
                <div className="text-center font-bold bg-gray-100 border-b border-gray-300">LEGENDA</div>
                <div className="grid grid-cols-3 text-center p-1">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">CÉU CLARO</span>
                    <Sun className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">INSTÁVEL</span>
                    <Cloud className="w-3 h-3 text-gray-500 fill-gray-200" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">CHUVA</span>
                    <CloudRain className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="border-2 border-black flex-grow">
              <div className="bg-orange-200 text-center font-bold border-b border-black py-0.5">REGISTRO DIÁRIO DE EQUIPAMENTOS:</div>
              <div className="grid grid-cols-[1fr_auto_1fr] border-b border-black font-bold text-center bg-gray-100">
                <div className="p-0.5">Tipo</div>
                <div className="p-0.5 border-l border-black w-8">Qty.</div>
                <div className="p-0.5 border-l border-black">Obs.:</div>
              </div>
              {data.equipment.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_auto_1fr] border-b border-gray-300 last:border-b-0">
                  <div className="p-0.5 pl-1 truncate">{item.tipo}</div>
                  <div className="p-0.5 border-l border-gray-300 w-8 text-center">{item.qty}</div>
                  <div className="p-0.5 border-l border-gray-300 truncate">{item.obs}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activities & Observations */}
        <div className="border-2 border-black mb-1 flex-grow flex flex-col">
          <div className="bg-gray-300 text-center font-bold border-b border-black py-0.5">
            REGISTRO DE EXECUÇÃO DE ATIVIDADES | OBSERVAÇÕES
          </div>
          <div className="grid grid-cols-2 flex-grow">
            {/* Contratada */}
            <div className="border-r border-black flex flex-col">
              <div className="bg-gray-200 text-center font-bold border-b border-black py-0.5">CONTRATADA</div>
              <div className="p-1 flex-grow">
                <div className="font-bold mb-1">1.2 CONSTRUÇÃO ATIVIDADES.:</div>
                <div className="whitespace-pre-wrap">{data.activities.construcao}</div>
              </div>
            </div>
            {/* Observações Contratante */}
            <div className="flex flex-col">
              <div className="bg-gray-200 text-center font-bold border-b border-black py-0.5">OBSERVAÇÕES CONTRATANTE</div>
              <div className="p-1 flex-grow whitespace-pre-wrap">
                {data.activities.observacoesContratante}
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="border-2 border-black mt-auto">
          <div className="bg-gray-300 text-center font-bold border-b border-black py-0.5">APROVAÇÕES</div>
          <div className="grid grid-cols-2">
            <div className="border-r border-black">
              <div className="bg-gray-100 text-center font-bold border-b border-black py-0.5">REPRESENTANTE CONTRATADA</div>
              <div className="p-2 h-20 relative">
                <div className="absolute bottom-2 left-2 font-bold">DATA:</div>
                <div className="absolute bottom-2 left-12">{data.signatures.contratada.data}</div>
                
                <div className="absolute bottom-2 left-1/2 font-bold">ASSINATURA:</div>
                {/* Signature Line */}
                <div className="absolute bottom-2 right-2 w-32 border-b border-black"></div>
              </div>
            </div>
            <div>
              <div className="bg-gray-100 text-center font-bold border-b border-black py-0.5">REPRESENTANTE CONTRATANTE</div>
              <div className="p-2 h-20 relative">
                <div className="absolute bottom-2 left-2 font-bold">DATA:</div>
                <div className="absolute bottom-2 left-12">{data.signatures.contratante.data}</div>
                
                <div className="absolute bottom-2 left-1/2 font-bold">ASSINATURA:</div>
                {/* Signature Line */}
                <div className="absolute bottom-2 right-2 w-32 border-b border-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Pages */}
      {photoPages.map((pagePhotos, pageIndex) => (
        <div 
          key={pageIndex} 
          className="w-[210mm] min-h-[297mm] mx-auto p-[10mm] bg-white shadow-lg print:shadow-none print:w-full print:h-auto print:m-0 print:p-0 relative"
          style={{ pageBreakBefore: 'always' }}
        >
          {renderHeader()}
          
          <div className="mt-4 border-2 border-black">
            <div className="bg-gray-200 text-center font-bold border-b border-black py-1">
              REGISTRO FOTOGRÁFICO (Página {pageIndex + 1}/{photoPages.length})
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4">
              {pagePhotos.map((photo) => (
                <div key={photo.id} className="flex flex-col border border-gray-300 p-2 break-inside-avoid">
                  <div className="aspect-video bg-gray-100 mb-2 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={photo.url} alt="RDO" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-[10px] font-medium border-t border-gray-200 pt-1 min-h-[2.5em]">
                    {photo.comment}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer for photo pages */}
          <div className="absolute bottom-[10mm] left-[10mm] right-[10mm] border-t border-black pt-2 text-center text-[10px]">
             Relatório Fotográfico - {data.header.numero} - {data.header.data.split('-').reverse().join('/')}
          </div>
        </div>
      ))}
    </div>
  );
};
