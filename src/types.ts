export interface CatalogItem {
  id: string;
  name: string;
  category: 'labor' | 'equipment';
}

export interface AIChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface SafetyAnalysis {
  fatalidade: { real: number; acum: number; probab: number };
  ar: { real: number; acum: number; probab: number };
  anr: { real: number; acum: number; probab: number };
  incidentes: { real: number; acum: number; probab: number };
  atoInseguro: { real: number; acum: number; probab: number };
}

export interface SafetyRegister {
  atoInseguro: { qty: number; ultimoRdo: number; status: string };
  condicaoInsegura: { qty: number; ultimoRdo: number; status: string };
  incidente: { qty: number; ultimoRdo: number; status: string };
  acidenteNaoReportavel: { qty: number; ultimoRdo: number; status: string };
  acidenteReportavel: { qty: number; ultimoRdo: number; status: string };
}

export interface Weather {
  manha: 'ceu_claro' | 'instavel' | 'chuva_fraca' | 'chuva_forte' | null;
  tarde: 'ceu_claro' | 'instavel' | 'chuva_fraca' | 'chuva_forte' | null;
  noite: 'ceu_claro' | 'instavel' | 'chuva_fraca' | 'chuva_forte' | null;
}

export interface LaborItem {
  id: string;
  funcao: string;
  qty: number;
  qtyHoras: string;
}

export interface EquipmentItem {
  id: string;
  tipo: string;
  qty: number;
  obs: string;
}

export interface RDOPhoto {
  id: string;
  url: string;
  comment: string;
}

export interface RDOData {
  header: {
    registro: string;
    data: string;
    diasCorridos: number;
    diasRestantes: number;
    numero: string;
  };
  contract: {
    contratada: string;
    projeto: string;
    contratante: string;
    numContrato: string;
    objeto: string;
    inicio: string;
    termino: string;
    duracao: number;
  };
  safetyAnalysis: SafetyAnalysis;
  safetyRegister: SafetyRegister;
  weather: Weather;
  labor: {
    left: LaborItem[];
    right: LaborItem[];
  };
  equipment: EquipmentItem[];
  activities: {
    construcao: string;
    observacoesContratada: string;
    observacoesContratante: string;
  };
  signatures: {
    contratada: { data: string; assinatura: string };
    contratante: { data: string; assinatura: string };
  };
  // For the "Checklist" feature - tracking important facts
  importantFacts: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  photos: RDOPhoto[];
}

export const initialRDOData: RDOData = {
  header: {
    registro: '0041',
    data: '2026-03-02',
    diasCorridos: 41,
    diasRestantes: 139,
    numero: 'RDO-041',
  },
  contract: {
    contratada: 'TECNOVIA',
    projeto: 'AMBRIZ ROAD REHABILITATION',
    contratante: 'PETROMAR',
    numContrato: '1535328/2025',
    objeto: 'REABILITAÇÃO DA ESTRADA AMBRIZ',
    inicio: '2026-01-20',
    termino: '2026-07-19',
    duracao: 180,
  },
  safetyAnalysis: {
    fatalidade: { real: 1, acum: 3.3, probab: 0.00 },
    ar: { real: 30, acum: 10.0, probab: 0.00 },
    anr: { real: 300, acum: 10.0, probab: 0.00 },
    incidentes: { real: 3000, acum: 10.0, probab: 2.00 },
    atoInseguro: { real: 30000, acum: 26.0, probab: 0.09 },
  },
  safetyRegister: {
    atoInseguro: { qty: 0, ultimoRdo: 26, status: 'ok' },
    condicaoInsegura: { qty: 0, ultimoRdo: 23, status: 'alert' },
    incidente: { qty: 0, ultimoRdo: 2, status: 'danger' },
    acidenteNaoReportavel: { qty: 0, ultimoRdo: 0, status: 'alert' },
    acidenteReportavel: { qty: 0, ultimoRdo: 0, status: 'alert' },
  },
  weather: {
    manha: 'ceu_claro',
    tarde: 'ceu_claro',
    noite: 'ceu_claro',
  },
  labor: {
    left: [
      { id: '1', funcao: 'TECN./ ADMINISTRAT. OBRA.', qty: 1, qtyHoras: '9:00:00' },
      { id: '2', funcao: 'APONTADOR', qty: 3, qtyHoras: '27:00:00' },
      { id: '3', funcao: 'ARMADOR FERRO', qty: 0, qtyHoras: '0:00:00' },
      { id: '4', funcao: 'AUXILIAR LABORATÓRIO', qty: 0, qtyHoras: '0:00:00' },
      { id: '5', funcao: 'OPERÁRIO NÃO QUALIFICADO', qty: 8, qtyHoras: '72:00:00' },
      { id: '6', funcao: 'CANALIZADOR', qty: 0, qtyHoras: '0:00:00' },
      { id: '7', funcao: 'CARPINTEIRO', qty: 0, qtyHoras: '0:00:00' },
      { id: '8', funcao: 'ALVORADO', qty: 2, qtyHoras: '18:00:00' },
      { id: '9', funcao: 'COORD. EQUIPA DE TRABALHO', qty: 0, qtyHoras: '0:00:00' },
      { id: '10', funcao: 'CONDUTOR OPERADOR', qty: 6, qtyHoras: '54:00:00' },
      { id: '11', funcao: 'COZINHEIRO', qty: 0, qtyHoras: '0:00:00' },
      { id: '12', funcao: 'ELETRICISTA C. CIVIL', qty: 0, qtyHoras: '0:00:00' },
      { id: '13', funcao: 'ENCARREGADO', qty: 0, qtyHoras: '0:00:00' },
      { id: '14', funcao: 'ENCARREGADO ADJUNTO', qty: 0, qtyHoras: '0:00:00' },
      { id: '15', funcao: 'ENCARREGADO OBRAS CIVIS', qty: 1, qtyHoras: '9:00:00' },
      { id: '16', funcao: 'ENCARREGADO TERRAPLENAGEM', qty: 0, qtyHoras: '0:00:00' },
      { id: '17', funcao: 'ENCARREGADO GERAL', qty: 1, qtyHoras: '9:00:00' },
      { id: '18', funcao: 'ENFERMEIRA', qty: 1, qtyHoras: '9:00:00' },
    ],
    right: [
      { id: '19', funcao: 'ENGENHEIRO CIVIL', qty: 1, qtyHoras: '9:00:00' },
      { id: '20', funcao: 'ESPALHADOR DE BETUMINOSO', qty: 0, qtyHoras: '0:00:00' },
      { id: '21', funcao: 'ESTAGIÁRIO', qty: 0, qtyHoras: '0:00:00' },
      { id: '22', funcao: 'FERRAMENTEIRO', qty: 1, qtyHoras: '9:00:00' },
      { id: '23', funcao: 'GUARDA/SEGURANÇA', qty: 6, qtyHoras: '54:00:00' },
      { id: '24', funcao: 'LUBRIFICADOR', qty: 0, qtyHoras: '0:00:00' },
      { id: '25', funcao: 'MECÂNICO', qty: 3, qtyHoras: '27:00:00' },
      { id: '26', funcao: 'MOTORISTA PESADOS', qty: 7, qtyHoras: '63:00:00' },
      { id: '27', funcao: 'PEDREIRO', qty: 3, qtyHoras: '27:00:00' },
      { id: '28', funcao: 'SERRALHEIRO MECÂNICO', qty: 3, qtyHoras: '27:00:00' },
      { id: '29', funcao: 'AUX./ ADMINISTRAT. OBRA.', qty: 0, qtyHoras: '0:00:00' },
      { id: '30', funcao: 'TÉCNICO TOPÓGRAFO', qty: 1, qtyHoras: '9:00:00' },
      { id: '31', funcao: 'TÉCNICO DE QUALIDADE', qty: 2, qtyHoras: '18:00:00' },
      { id: '32', funcao: 'TECNICO DE HSE', qty: 1, qtyHoras: '9:00:00' },
      { id: '33', funcao: 'SINALEIRO', qty: 0, qtyHoras: '0:00:00' },
      { id: '34', funcao: 'COORD.HSE', qty: 1, qtyHoras: '9:00:00' },
      { id: '35', funcao: 'DIRETOR DE OBRAS', qty: 1, qtyHoras: '9:00:00' },
      { id: '36', funcao: 'PINTOR', qty: 1, qtyHoras: '9:00:00' },
    ]
  },
  equipment: [
    { id: '1', tipo: 'GERADOR', qty: 1, obs: '' },
    { id: '2', tipo: 'AUTOBETONEIRA 3M³', qty: 1, obs: '' },
    { id: '3', tipo: 'GIRATÓRIA DE PNEUS', qty: 0, obs: '' },
    { id: '4', tipo: 'RETROESCAVADEIRA', qty: 1, obs: '' },
    { id: '5', tipo: 'NIVELADORA', qty: 1, obs: '' },
    { id: '6', tipo: 'BULLDOZER(D6)', qty: 0, obs: '' },
    { id: '7', tipo: 'CAMINHÕES BASC. 16M³', qty: 14, obs: '' },
    { id: '8', tipo: 'CARINHA 3500KG', qty: 0, obs: '' },
    { id: '9', tipo: 'CILINDRO MISTO 15TONS', qty: 1, obs: '' },
    { id: '10', tipo: 'GIRATÓRIA 35TONS', qty: 2, obs: '' },
    { id: '11', tipo: 'FRESA PEQUENA', qty: 1, obs: '' },
    { id: '12', tipo: 'CILINDRO MISTO 20TONS', qty: 0, obs: '' },
    { id: '13', tipo: 'CAMINHÃO ÁGUA', qty: 2, obs: '' },
    { id: '14', tipo: 'GRUA MÓVEL 50t', qty: 0, obs: '' },
    { id: '15', tipo: 'MINIBUS 33P', qty: 1, obs: '' },
    { id: '16', tipo: 'FRESA GRANDE', qty: 1, obs: '' },
  ],
  activities: {
    construcao: `- Fresagem da camada do asfalto na rua 01, do PK 1+300 até PK 1+500\n- Continuação do lançamento de solo de empréstimo, regularização e compactação da berma na rua 01, do PK 0+100 até PK 1+200.\n- Realizado ensaio de medição de humidade e densidade de solo com a utilização do gama densímetro (Troxler).\n- Continuação da mobilização do estaleiro de obras, com instalação de suas infraestruturas hidráulicas e elétricas.\n\nNota: Atividades a serem desenvolvidas no terça-feira 03/03/26. Continuação do lançamento do solo de empréstimo, regularização e compactação da berma na rua 01, do PK 0+100 até PK 1+200.\n- Continuação da fresagem da camada do asfalto na rua 01, do PK 1+500 até PK 1+700\n- Continuação da mobilização do canteiro de obras, com instalação de infraestruturas hidráulicas e elétricas.\n- Fornecimento de (tout-venant), no período, com a data de corte para o dia 02/03/26, foram fornecidas 5.250 ton.`,
    observacoesContratada: '',
    observacoesContratante: '',
  },
  signatures: {
    contratada: { data: '03/03/2026', assinatura: '' },
    contratante: { data: '', assinatura: '' },
  },
  importantFacts: [
    { id: '1', label: 'Ocorreu algum acidente hoje?', checked: false },
    { id: '2', label: 'Houve chuva que paralisou as atividades?', checked: false },
    { id: '3', label: 'Todos os equipamentos principais operacionais?', checked: true },
    { id: '4', label: 'Efetivo completo presente?', checked: true },
    { id: '5', label: 'Visita da fiscalização?', checked: false },
  ],
  photos: [],
};
