document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Atualizado para nova estrutura HTML
    const folderTreeContainer = document.getElementById('folder-tree');
    const expandAllBtn = document.getElementById('expand-all-btn');
    const collapseAllBtn = document.getElementById('collapse-all-btn');
    
    const currentFolderTitle = document.getElementById('current-folder-title');
    const fileListSearchInput = document.getElementById('file-list-search-input');
    const fileListView = document.getElementById('file-list-view');

    // Detalhes do item TTD (temporalidade) - IDs antigos podem precisar de ajuste se o HTML mudou muito para eles
    const contentTitleDetail = document.getElementById('content-title-detail');
    const contentDetailsTd = document.getElementById('content-details-td');
    const contentActionsTd = document.getElementById('content-actions-td');
    const auditInfoContainerTd = document.getElementById('audit-info-container-td');

    // --- Modal de Adicionar Documento: Elementos DOM ---
    const addDocumentModal = document.getElementById('add-document-modal');
    const closeModalBtn = document.getElementById('close-add-document-modal-btn');
    const addDocumentForm = document.getElementById('add-document-form');
    const modalTtdClassification = document.getElementById('modal-ttd-classification');
    const docNameInput = document.getElementById('doc-name');
    const docDescriptionInput = document.getElementById('doc-description');
    const cancelAddDocumentBtn = document.getElementById('cancel-add-document-btn');

    // --- Modal de Eliminação Lógica: Elementos DOM ---
    const eliminationModal = document.getElementById('elimination-modal');
    const closeEliminationModalBtn = document.getElementById('close-elimination-modal-btn');
    const eliminationDocNameElement = document.getElementById('elimination-doc-name');
    const eliminationDocNameElementStep2 = document.getElementById('elimination-doc-name-step-2');
    const eliminationStep1Div = document.getElementById('elimination-step-1');
    const eliminationStep2Div = document.getElementById('elimination-step-2');
    const confirmInitialEliminationBtn = document.getElementById('confirm-initial-elimination-btn');
    const cancelEliminationStep1Btn = document.getElementById('cancel-elimination-step-1-btn');
    const eliminationReasonForm = document.getElementById('elimination-reason-form');
    const eliminationReasonInput = document.getElementById('elimination-reason');
    const cancelEliminationStep2Btn = document.getElementById('cancel-elimination-step-2-btn');

    // --- Painel Redimensionável: Elementos DOM ---
    const resizeHandle = document.getElementById('resize-handle');
    const treeViewContainer = document.getElementById('tree-view-container');
    // mainContentContainer já deve estar definido ou pode ser pego se necessário para reajuste
    // const mainContentContainer = document.getElementById('main-content-container');

    let documentToEliminate = null; // Armazena o documento a ser eliminado

    // --- localStorage Keys and Service ---
    const LOCAL_STORAGE_KEY = 'gedFaepPrototypeData';
    const SIDEBAR_WIDTH_KEY = 'gedFaepSidebarWidth'; // Nova chave para largura da sidebar

    let appData = { // Global holder for our application state
        ttdTree: [],
        documents: []
    };

    function saveApplicationData() {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
        } catch (e) {
            console.error("Error saving data to localStorage:", e);
        }
    }

    function loadApplicationData() {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error("Error loading data from localStorage:", e);
        }
        return null; // Return null if no data or error
    }

    // Explicações das Siglas de Temporalidade (Mantidas)
    const EXPLICACAO_PC_DG = "Refere-se ao tempo que o documento deve ser mantido na unidade que o produziu ou recebeu (arquivo corrente), enquanto é frequentemente consultado para atender às necessidades administrativas imediatas.";
    const EXPLICACAO_PI = "Indica o tempo que o documento deve ser mantido em um arquivo intermediário (geralmente um arquivo central da instituição) após cessar seu uso corrente, mas ainda possuindo valor administrativo, legal ou fiscal que justifique sua guarda antes da destinação final. Muitas vezes, a observação N/A (Não se Aplica) pode aparecer aqui, indicando que o documento vai direto do corrente para a destinação final ou que o prazo intermediário está incluído no corrente ou é determinado por outra condição.";
    const EXPLICACAO_DF = "Determina o que deve ser feito com o documento após o cumprimento dos prazos nas fases corrente e intermediária. As destinações mais comuns são: Guarda Permanente (GP) ou Eliminação (E).";
    const EXPLICACAO_OBS = "Observações adicionais ou contextos específicos sobre a temporalidade do documento.";

    // --- Funções Geradoras de Dados Fictícios para Arquivos ---
    function getRandomDate(startDate = new Date(2022, 0, 1), endDate = new Date()) {
        const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        return date;
    }

    function formatDate(date) {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    function formatDateTime(date) {
        const h = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${formatDate(date)} ${h}:${min}`;
    }

    function getRandomFileName(folderName) {
        const prefixes = ['Relatorio_', 'Documento_', 'Ata_', 'Oficio_', 'Planilha_', 'Apresentacao_'];
        const suffixes = ['_Final', '_v2', '_Revisado', '_Oficial', '_ParaAprovacao'];
        const extensions = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt'];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = Math.random() > 0.5 ? suffixes[Math.floor(Math.random() * suffixes.length)] : '';
        const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
        // Tenta usar parte do nome da pasta para dar mais contexto, se disponível
        const baseName = folderName ? folderName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '') : 'Generico';
        return `${randomPrefix}${baseName}${randomSuffix}${randomExtension}`;
    }

    function getRandomVersion() {
        return `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`;
    }

    const mockUsers = ['ana.silva', 'bruno.costa', 'carla.dias', 'diego.gomes', 'elisa.fernandes', 'fabio.lima', 'admin.sistema', 'usuario.teste', 'Maria Oliveira', 'João Santos'];
    function getRandomUser() {
        return mockUsers[Math.floor(Math.random() * mockUsers.length)];
    }

    const mockFileDescriptions = [
        "Relatório financeiro detalhado do último trimestre.",
        "Ata da reunião de planejamento estratégico.",
        "Documento técnico sobre a nova arquitetura do sistema.",
        "Planilha de acompanhamento de metas e KPIs.",
        "Apresentação para a diretoria sobre os resultados anuais."
    ];

    function getRandomDescription() {
        return mockFileDescriptions[Math.floor(Math.random() * mockFileDescriptions.length)];
    }
    
    const mockEliminationReasons = [
        "Cumprimento do prazo de guarda legal.",
        "Substituído por versão mais recente.",
        "Informação obsoleta e sem valor histórico."
    ];

    function getRandomEliminationReason() {
        return mockEliminationReasons[Math.floor(Math.random() * mockEliminationReasons.length)];
    }

    let globalFileIdCounter = 0; // For generating unique file IDs across sessions if needed (or use UUIDs)

    // ADAPTED: generateMockFile (singular, without count, with ttdNodeId and TTD properties)
    function generateMockFile(ttdNodeId, ttdNodeName, ttdProperties) {
        const attachmentDateObj = getRandomDate();
        const lastModifiedDateObj = getRandomDate(attachmentDateObj);
        // const status = Math.random() < 0.1 ? 'Eliminado' : 'Ativo'; // Lógica antiga de status
        // let eliminationDetails = null; // Lógica antiga de eliminação
        // if (status === 'Eliminado') {
        //     const eliminationDateObj = getRandomDate(lastModifiedDateObj);
        //     eliminationDetails = {
        //         date: formatDate(eliminationDateObj),
        //         reason: getRandomEliminationReason(),
        //         responsible: getRandomUser()
        //     };
        // }

        // Nova lógica de status e campos
        const statusDocumento = 'Vigente'; // Padrão inicial
        let dataDeValidadeEfetiva = null;
        // Aleatoriamente definir uma data de validade para alguns documentos para teste
        if (Math.random() < 0.3) { // 30% chance de ter data de validade
            const validadeDateObj = getRandomDate(new Date(2023, 0, 1), new Date(2025, 11, 31)); // Entre 2023 e 2025
            dataDeValidadeEfetiva = formatDate(validadeDateObj);
        }

        // Ensure ttdProperties exist and provide defaults
        const pc = ttdProperties && ttdProperties.pc ? ttdProperties.pc : 'N/A';
        const pi = ttdProperties && ttdProperties.pi ? ttdProperties.pi : 'N/A';
        const df = ttdProperties && ttdProperties.df ? ttdProperties.df : 'N/A';
        const obs = ttdProperties && ttdProperties.obs ? ttdProperties.obs : '';

        return {
            id: `doc-${Date.now()}-${globalFileIdCounter++}`, // More robust unique ID
            ttdNodeId: ttdNodeId,
            name: getRandomFileName(ttdNodeName),
            description: getRandomDescription(),
            attachmentDate: formatDate(attachmentDateObj),
            lastModifiedDate: formatDateTime(lastModifiedDateObj),
            version: getRandomVersion(),
            user: getRandomUser(),
            // status: status, // Campo antigo
            // eliminationDetails: eliminationDetails, // Campo antigo
            statusDocumento: statusDocumento, // Novo campo de status
            dataDeValidadeEfetiva: dataDeValidadeEfetiva, // Novo campo
            dataCancelamento: null,
            usuarioCancelamento: null,
            motivoCancelamento: null,
            dataVencimentoReal: null, // Será preenchido se/quando vencer
            type: 'file', // Document type, not TTD classification type
            // Store TTD properties directly on the file object, inherited at creation
            temporalidadePC: pc,
            temporalidadePI: pi,
            temporalidadeDF: df,
            observacoes: obs
        };
    }
    
    // --- TTD Parsing and Processing ---
    function parseSingleTtdDetails(detailsString) { // Renamed to avoid conflict
        if (!detailsString || typeof detailsString !== 'string') {
            return { pc: 'N/D', pi: 'N/D', df: 'N/D', obs: 'N/D' };
        }
        const ttd = { pc: 'N/A', pi: 'N/A', df: 'N/A', obs: '' };
        const parts = detailsString.split(/,(?=\s*\w+:)/);
        parts.forEach(part => {
            part = part.trim();
            if (part.startsWith('PC:')) ttd.pc = part.substring(3).trim();
            else if (part.startsWith('PI:')) ttd.pi = part.substring(3).trim();
            else if (part.startsWith('DF:')) ttd.df = part.substring(3).trim();
            else if (part.startsWith('Obs:')) ttd.obs = part.substring(4).trim();
            else if (!ttd.obs && (!ttd.pc || ttd.pc === 'N/A')) ttd.obs = part; // Capture general details if others not set
        });
        ttd.pc = ttd.pc || 'N/A';
        ttd.pi = ttd.pi || 'N/A';
        ttd.df = ttd.df || 'N/A';
        return ttd;
    }

    function processTtdNode(node) { // Adds TTD properties directly to TTD nodes
        if (node.details && typeof node.details === 'string') {
            const ttdProps = parseSingleTtdDetails(node.details);
            node.temporalidadePC = ttdProps.pc;
            node.temporalidadePI = ttdProps.pi;
            node.temporalidadeDF = ttdProps.df;
            node.observacoes = ttdProps.obs;
            // delete node.details; // Optional: remove original details string
        }
        // Define 'canHaveDocuments'. For this prototype, any TTD item (original type: 'file')
        // or any folder that doesn't have children that are TTD items can have documents.
        // More simply: if it's a TTD classification, or a folder without TTD classification children.
        // For now, let's assume any TTD item identified as type 'file' in original treeData can hold docs.
        // And any folder node which does NOT have children that are type 'file' (TTD items) can also hold docs.
        // This logic might need refinement based on how deeply nested TTD items are treated vs folders.
        // A simpler rule: if a node is intended to be a leaf in terms of TTD hierarchy, it can hold documents.
        // Or, any node can be a "folder" for documents. Let's assume for now:
        // nodes that were 'type: "file"' in original treeData are primary targets.
        // nodes that were 'type: "folder"' and have no children can also be targets.
        // For now, let's make all nodes potentially able to hold documents.
        // We will add a button based on selection later.

        if (node.children && node.children.length > 0) {
            node.children.forEach(child => processTtdNode(child));
        }
    }
    
    // Initial raw treeData (will be processed)
    const initialRawTreeData = [
      {
        id: 'I', name: 'I - GOVERNANÇA E PLANEJAMENTO INSTITUCIONAL', type: 'folder', details: 'Classe Principal.', 
        children: [
          { id: 'I.1', name: 'I.1 - ATOS CONSTITUTIVOS E SOCIETÁRIOS DA MANTENEDORA', type: 'folder', details: 'Subclasse.', 
            children: [
              { id: 'I.1.1', name: 'I.1.1 - Contrato/Estatuto Social da Mantenedora e Alterações', type: 'file', details: 'PC: Permanente (enquanto existir a pessoa jurídica), PI: N/A, DF: Guarda Permanente' },
              { id: 'I.1.2', name: 'I.1.2 - CNPJ, Inscrições Estaduais e Municipais', type: 'file', details: 'PC: Permanente (enquanto ativo/válido), PI: N/A, DF: Guarda Permanente da última versão e das alterações significativas' },
              { id: 'I.1.3', name: 'I.1.3 - Atas de Reunião/Assembleia de Sócios/Acionistas/Conselho de Administração da Mantenedora', type: 'file', details: 'PC: 5 anos após a reunião, PI: *, DF: Guarda Permanente, Obs: *Prazo total de guarda de acordo com o Código Civil e Comercial para livros obrigatórios' },
              { id: 'I.1.4', name: 'I.1.4 - Alvarás e Licenças de Funcionamento da Mantenedora', type: 'file', details: 'PC: Enquanto vigente, PI: 5 anos após vencimento/substituição, DF: Eliminação' }
            ]
          },
          { id: 'I.2', name: 'I.2 - ATOS REGULATÓRIOS E CONSTITUTIVOS DA INSTITUIÇÃO DE ENSINO (MANTIDA)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'I.2.1', name: 'I.2.1 - Ato de Credenciamento da IES junto ao MEC (e Portarias de autorização inicial)', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' },
              { id: 'I.2.2', name: 'I.2.2 - Atos de Recredenciamento da IES', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' },
              { id: 'I.2.3', name: 'I.2.3 - Estatuto da IES (se aplicável) e Regimento Geral da IES (e suas alterações aprovadas)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente da versão atual e das versões históricas relevantes' },
              { id: 'I.2.4', name: 'I.2.4 - Alvarás e Licenças específicas da IES (Vigilância Sanitária, Bombeiros, etc.)', type: 'file', details: 'PC: Enquanto vigente, PI: 5 anos após vencimento/substituição, DF: Eliminação' },
              { id: 'I.2.5', name: 'I.2.5 - Certidões Negativas de Débitos (Federais, Estaduais, Municipais, Trabalhistas, FGTS)', type: 'file', details: 'PC: 1 ano após emissão, PI: 4 anos, DF: Eliminação, Obs: Observar prazos específicos para cada tipo de certidão, alguns podem ser 5 anos ou mais' }
            ]
          },
          { id: 'I.3', name: 'I.3 - PLANEJAMENTO ESTRATÉGICO E INSTITUCIONAL', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'I.3.1', name: 'I.3.1 - Plano de Desenvolvimento Institucional (PDI) (e relatórios de acompanhamento/avaliação)', type: 'file', details: 'PC: Durante a vigência, PI: 5 anos após o término da vigência, DF: Guarda Permanente' },
              { id: 'I.3.2', name: 'I.3.2 - Projeto Pedagógico Institucional (PPI) / Projeto Político Pedagógico (PPP)', type: 'file', details: 'PC: Enquanto vigente, PI: 5 anos após substituição, DF: Guarda Permanente' },
              { id: 'I.3.3', name: 'I.3.3 - Relatórios de Autoavaliação Institucional (CPA) e Planos de Melhoria', type: 'file', details: 'PC: 5 anos, PI: 5 anos, DF: Guarda Permanente' }
            ]
          },
          { id: 'I.4', name: 'I.4 - ATOS NORMATIVOS E DELIBERATIVOS INTERNOS (GERAIS)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'I.4.1', name: 'I.4.1 - Coleção de Portarias da Direção/Reitoria (de caráter normativo geral)', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' },
              { id: 'I.4.2', name: 'I.4.2 - Coleção de Resoluções dos Órgãos Colegiados Superiores da IES (CONSU, CONSUNEP, etc., de caráter normativo geral e não específicas de uma área já coberta abaixo)', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' },
              { id: 'I.4.3', name: 'I.4.3 - Atas e Deliberações de Órgãos Colegiados Superiores da IES (completas)', type: 'file', details: 'PC: 5 anos, PI: 20 anos, DF: Guarda Permanente das atas. Pautas e documentos preparatórios podem ter prazos menores' },
              { id: 'I.4.4', name: 'I.4.4 - Manuais de Normas e Procedimentos Internos (Gerais)', type: 'file', details: 'PC: Enquanto vigente, PI: 5 anos após substituição, DF: Eliminação, Obs: Guardar permanentemente versões que representem marcos históricos' }
            ]
          },
          { id: 'I.5', name: 'I.5 - RELAÇÕES INTERINSTITUCIONAIS', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'I.5.1', name: 'I.5.1 - Convênios e Acordos de Cooperação (Nacionais e Internacionais)', type: 'file', details: 'PC: Fim da vigência + 5 anos, PI: 15 anos, DF: Guarda Permanente para os de grande relevância; Eliminação para os demais' }
            ]
          }
        ]
      },
      {
        id: 'II', name: 'II - GESTÃO ACADÊMICA', type: 'folder', details: 'Classe Principal.',
        children: [
          { id: 'II.A.1', name: 'II.A.1 - Normatização Acadêmica Geral (Regulamentos acadêmicos gerais, normas de graduação, pós-graduação, etc., não cobertas em I.4)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
          { id: 'II.B', name: 'II.B - ENSINO SUPERIOR – GRADUAÇÃO (e 2ª Licenciatura)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'II.B.1', name: 'II.B.1 - Concepção, Organização e Funcionamento de Cursos de Graduação (Baseado no código 121 da TTD IFES)', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.B.1.1', name: 'II.B.1.1 - Projeto Pedagógico de Curso (PPC) e suas atualizações', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
                  { id: 'II.B.1.2', name: 'II.B.1.2 - Processos de Criação e Autorização de Curso junto ao MEC', type: 'file', details: 'PC: Até homologação + 5 anos, PI: N/A, DF: Guarda Permanente da portaria de autorização e documentos chave do processo' },
                  { id: 'II.B.1.3', name: 'II.B.1.3 - Processos de Reconhecimento e Renovação de Reconhecimento de Curso', type: 'file', details: 'PC: Até homologação + 5 anos, PI: N/A, DF: Guarda Permanente da portaria e documentos chave do processo' }
                ]
              },
               { id: 'II.B.2', name: 'II.B.2 - Planejamento e Organização Curricular (Baseado no código 122 da TTD IFES)', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.B.2.1', name: 'II.B.2.1 - Estrutura Curricular/Grade Curricular (por curso e versão)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
                  { id: 'II.B.2.2', name: 'II.B.2.2 - Ementas e Programas de Disciplinas', type: 'file', details: 'PC: Enquanto vigente o PPC, PI: N/A, DF: Guarda Permanente como parte do histórico do PPC' },
                  { id: 'II.B.2.3', name: 'II.B.2.3 - Atas de Colegiado de Curso/Departamento (referentes a currículo, PPC, etc.)', type: 'file', details: 'PC: 5 anos, PI: 15 anos, DF: Guarda Permanente para decisões de impacto duradouro' },
                  { id: 'II.B.2.4', name: 'II.B.2.4 - Documentação de Atividades Complementares (normas e registros gerais, não do aluno)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' }
                ]
              },
              { id: 'II.B.3', name: 'II.B.3 - Gestão da Atividade Acadêmica Discente (Graduação) (Baseado no código 125 da TTD IFES)', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.B.3.1', name: 'II.B.3.1 - Calendário Acadêmico', type: 'file', details: 'PC: Ano corrente + 1 ano, PI: 4 anos, DF: Guarda Permanente de um exemplar por ano' },
                  { id: 'II.B.3.2', name: 'II.B.3.2 - Diários de Classe/Listas de Frequência e Avaliação', type: 'file', details: 'PC: 2 anos após conclusão do período letivo, PI: 3 anos, DF: Eliminação, Obs: As informações consolidadas vão para o histórico do aluno. LGPD: Cuidado com dados sensíveis.' },
                  { id: 'II.B.3.3', name: 'II.B.3.3 - Provas, Exames e Trabalhos Avaliativos (originais ou cópias, se não devolvidos)', type: 'file', details: 'PC: 1 ano após divulgação das notas, PI: N/A, DF: Eliminação, Obs: Alguns podem ser guardados como modelo ou por contestação. LGPD.' },
                  { id: 'II.B.3.4', name: 'II.B.3.4 - Documentação de Estágios Curriculares Obrigatórios (Termos de compromisso, planos, relatórios, avaliações – parte do dossiê do aluno, mas aqui a gestão do processo)', type: 'file', details: 'PC: 5 anos após conclusão do estágio pelo aluno, PI: N/A, DF: Eliminação, Obs: Comprovantes finais no dossiê do aluno' },
                  { id: 'II.B.3.5', name: 'II.B.3.5 - Documentação de Trabalhos de Conclusão de Curso (TCC) (Normas, atas de defesa, termos de orientação – cópia do TCC no dossiê ou biblioteca)', type: 'file', details: 'PC: 5 anos após defesa, PI: N/A, DF: Guarda Permanente para atas de defesa e TCCs de destaque; Eliminação para documentos de trâmite' },
                  { id: 'II.B.3.6', name: 'II.B.3.6 - Atas de Colação de Grau', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' },
                  { id: 'II.B.3.7', name: 'II.B.3.7 - Registros de Diplomas Expedidos e Registrados (Livros de registro ou sistema)', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' }
                ]
              },
              { id: 'II.B.4', name: 'II.B.4 - Documentação Individual do Aluno de Graduação (Dossiê/Prontuário) (Baseado no código 125.43 da TTD IFES)', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.B.4.1', name: 'II.B.4.1 - Documentos Pessoais (Cópia de RG, CPF, Certidão Nascimento/Casamento, Título Eleitor, Militar)', type: 'file', details: 'PC: Durante o vínculo, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: 100 anos. LGPD.' },
                  { id: 'II.B.4.2', name: 'II.B.4.2 - Documentos de Escolaridade Anterior (Certificado e Histórico do Ens. Médio)', type: 'file', details: 'PC: Durante o vínculo, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: 100 anos' },
                  { id: 'II.B.4.3', name: 'II.B.4.3 - Comprovante de Forma de Ingresso (ENEM, Vestibular, Transferência, etc.)', type: 'file', details: 'PC: Durante o vínculo, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: 100 anos' },
                  { id: 'II.B.4.4', name: 'II.B.4.4 - Requerimento de Matrícula e Termos de Adesão', type: 'file', details: 'PC: Durante o vínculo, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: 100 anos' },
                  { id: 'II.B.4.5', name: 'II.B.4.5 - Histórico Escolar da Graduação (emitido pela IES)', type: 'file', details: 'PC: Permanente (no dossiê), PI: *, DF: Guarda Permanente, Obs: *Prazo total de guarda do dossiê: 100 anos' },
                  { id: 'II.B.4.6', name: 'II.B.4.6 - Cópia do Diploma de Graduação (expedido pela IES)', type: 'file', details: 'PC: Permanente (no dossiê), PI: *, DF: Guarda Permanente, Obs: *Prazo total de guarda do dossiê: 100 anos' },
                  { id: 'II.B.4.7', name: 'II.B.4.7 - Outros Documentos da Vida Acadêmica (Aproveitamento de estudos, trancamentos, atividades complementares, etc.)', type: 'file', details: 'PC: Durante o vínculo, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: 100 anos' },
                  { id: 'II.B.4.8', name: 'II.B.4.8 - Documentação de Alunos Estrangeiros (RNE/RNM, Revalidação de estudos, etc.)', type: 'file', details: 'PC: Durante o vínculo, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: 100 anos. LGPD.' }
                ]
              }
            ]
          },
          { id: 'II.C', name: 'II.C - ENSINO SUPERIOR – PÓS-GRADUAÇÃO (Stricto e Lato Sensu)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'II.C.1', name: 'II.C.1 - Pós-Graduação Stricto Sensu (Mestrado, Doutorado)', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.C.1.1', name: 'II.C.1.1 - Projeto Pedagógico de Curso (PPC Stricto Sensu)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
                  { id: 'II.C.1.2', name: 'II.C.1.2 - Processos de Autorização/Reconhecimento/Renovação CAPES/MEC', type: 'file', details: 'PC: Até homologação + 5 anos, PI: N/A, DF: Guarda Permanente da decisão final e documentos chave' },
                  { id: 'II.C.1.3', name: 'II.C.1.3 - Documentação Individual do Aluno de Pós Stricto Sensu (Dossiê)', type: 'file', details: 'PC: Permanente, PI: *, DF: Guarda Permanente, Obs: *Prazo total de guarda de 100 anos. Inclui Tese/Dissertação. LGPD.' },
                  { id: 'II.C.1.4', name: 'II.C.1.4 - Atas de Defesa de Dissertação/Tese', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' }
                ]
              },
              { id: 'II.C.2', name: 'II.C.2 - Pós-Graduação Lato Sensu (Especialização, MBA)', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.C.2.1', name: 'II.C.2.1 - Projeto Pedagógico de Curso (PPC Lato Sensu)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
                  { id: 'II.C.2.2', name: 'II.C.2.2 - Comunicação/Registro de Cursos Lato Sensu ao MEC (conforme legislação)', type: 'file', details: 'PC: 5 anos após término da oferta, PI: N/A, DF: Eliminação' },
                  { id: 'II.C.2.3', name: 'II.C.2.3 - Documentação Individual do Aluno de Pós Lato Sensu (Dossiê)', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo + 5 anos, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: recomendado 50-100 anos. Verificar legislação. LGPD.' },
                  { id: 'II.C.2.4', name: 'II.C.2.4 - Certificados de Conclusão de Pós Lato Sensu (Registros de emissão)', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' }
                ]
              }
            ]
          },
          { id: 'II.D', name: 'II.D - ENSINO SUPERIOR – EXTENSÃO UNIVERSITÁRIA (Baseado na Classe 300 da TTD IFES)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'II.D.1', name: 'II.D.1 - Normatização da Extensão', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
              { id: 'II.D.2', name: 'II.D.2 - Programas e Projetos de Extensão', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.D.2.1', name: 'II.D.2.1 - Propostas de Programas/Projetos', type: 'file', details: 'PC: 5 anos após conclusão, PI: N/A, DF: Guarda Permanente para projetos de impacto; Eliminação para demais' },
                  { id: 'II.D.2.2', name: 'II.D.2.2 - Relatórios de Programas/Projetos', type: 'file', details: 'PC: 5 anos após conclusão, PI: N/A, DF: Guarda Permanente para projetos de impacto; Eliminação para demais' }
                ]
              },
              { id: 'II.D.3', name: 'II.D.3 - Cursos e Eventos de Extensão', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.D.3.1', name: 'II.D.3.1 - Propostas e Aprovações de Cursos/Eventos', type: 'file', details: 'PC: 2 anos após realização, PI: N/A, DF: Eliminação' },
                  { id: 'II.D.3.2', name: 'II.D.3.2 - Listas de Inscrição e Frequência', type: 'file', details: 'PC: 2 anos após realização, PI: N/A, DF: Eliminação, LGPD' },
                  { id: 'II.D.3.3', name: 'II.D.3.3 - Certificados de Extensão (Registros de emissão e modelos)', type: 'file', details: 'PC: 5 anos, PI: 20 anos, DF: Guarda Permanente dos registros de emissão' }
                ]
              }
            ]
          },
          { id: 'II.E', name: 'II.E - ENSINO TÉCNICO (Baseado na Classe 400, item 450 da TTD IFES, estrutura similar à Graduação para PPC, Dossiê do Aluno Técnico, Diplomas Técnicos)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'II.E.1', name: 'II.E.1 - Normatização do Ensino Técnico', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
              { id: 'II.E.2', name: 'II.E.2 - Concepção, Organização e Funcionamento de Cursos Técnicos', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.E.2.1', name: 'II.E.2.1 - Projeto Pedagógico de Curso Técnico (PPC)', type: 'file', details: 'PC: Enquanto vigente, PI: N/A, DF: Guarda Permanente' },
                  { id: 'II.E.2.2', name: 'II.E.2.2 - Processos de Autorização de Curso Técnico (junto aos órgãos competentes)', type: 'file', details: 'PC: Até homologação + 5 anos, PI: N/A, DF: Guarda Permanente da autorização' }
                ]
              },
              { id: 'II.E.3', name: 'II.E.3 - Vida Escolar do Aluno de Ensino Técnico', type: 'folder', details: 'Grupo.',
                children: [
                  { id: 'II.E.3.1', name: 'II.E.3.1 - Documentação Individual do Aluno Técnico (Dossiê)', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo + 5 anos, PI: *, DF: Eliminação, Obs: *Prazo total de guarda do dossiê: recomendado 50-100 anos. LGPD.' },
                  { id: 'II.E.3.2', name: 'II.E.3.2 - Diplomas Técnicos (Registros de expedição)', type: 'file', details: 'PC: Permanente, PI: N/A, DF: Guarda Permanente' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'III', name: 'III - RELACIONAMENTO COM ALUNOS', type: 'folder', details: 'Classe Principal.',
        children: [
          { id: 'III.A', name: 'III.A - PROCESSO SELETIVO E INGRESSO (Baseado em 125.1 e similares da TTD IFES)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'III.A.1', name: 'III.A.1 - Editais de Processo Seletivo (Vestibular, ENEM, Transferência, etc.)', type: 'file', details: 'PC: 5 anos após realização, PI: N/A, DF: Guarda Permanente de um exemplar por processo' },
              { id: 'III.A.2', name: 'III.A.2 - Inscrições (fichas, comprovantes de pagamento de taxa, se houver)', type: 'file', details: 'PC: 1 ano após processo seletivo, PI: 1 ano, DF: Eliminação, LGPD' },
              { id: 'III.A.3', name: 'III.A.3 - Provas e Gabaritos', type: 'file', details: 'PC: 1 ano após divulgação do resultado, PI: 1 ano, DF: Eliminação, Obs: Salvo processos judiciais' },
              { id: 'III.A.4', name: 'III.A.4 - Listas de Classificação e Resultados Finais', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' }
            ]
          },
          { id: 'III.B', name: 'III.B - VÍNCULO CONTRATUAL E FINANCEIRO COM O ALUNO (Crítico para IES Privada)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'III.B.1', name: 'III.B.1 - Contrato de Prestação de Serviços Educacionais (e aditivos)', type: 'file', details: 'PC: Vigência do contrato + 5 anos, PI: N/A, DF: Eliminação, Obs: Avaliar guarda mais longa por precaução. LGPD.' },
              { id: 'III.B.2', name: 'III.B.2 - Comprovantes de Pagamento de Matrícula, Mensalidades e Taxas Acadêmicas', type: 'file', details: 'PC: 5 anos (prazo prescricional cobrança), PI: N/A, DF: Eliminação, Obs: Aluno guarda o original. IES arquiva controle. LGPD.' },
              { id: 'III.B.3', name: 'III.B.3 - Documentação de Bolsas de Estudo (ProUni, FIES, próprias) e Financiamentos (contratos, termos, comprovantes)', type: 'file', details: 'PC: Vigência da bolsa/financiamento + 5 anos, PI: N/A, DF: Eliminação, Obs: Manter enquanto houver obrigações. LGPD.' },
              { id: 'III.B.4', name: 'III.B.4 - Registros de Inadimplência, Negociações e Acordos Financeiros', type: 'file', details: 'PC: 5 anos após quitação ou prescrição, PI: N/A, DF: Eliminação, LGPD.' }
            ]
          },
          { id: 'III.C', name: 'III.C - ATENDIMENTO E SUPORTE AO ALUNO (Baseado no código 002 da TTD IFES e outros)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'III.C.1', name: 'III.C.1 - Requerimentos e Solicitações Diversas de Alunos (Declarações, justificativas, etc.)', type: 'file', details: 'PC: 1 ano após atendimento, PI: 1 ano, DF: Eliminação, Obs: Se gerar documento para o dossiê, este segue o prazo do dossiê. LGPD.' },
              { id: 'III.C.2', name: 'III.C.2 - Registros da Secretaria Acadêmica (Atendimentos, protocolos)', type: 'file', details: 'PC: 1 ano, PI: 1 ano, DF: Eliminação, LGPD' },
              { id: 'III.C.3', name: 'III.C.3 - Registros da Ouvidoria (Manifestações de alunos: reclamações, sugestões, etc.)', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Eliminação, Obs: Relatórios consolidados podem ter guarda mais longa. LGPD.' },
              { id: 'III.C.4', name: 'III.C.4 - Documentação do Programa de Apoio Psicopedagógico (se houver, com extremo cuidado com LGPD e sigilo)', type: 'file', details: 'PC: 5 anos após desligamento do aluno do programa, PI: N/A, DF: Eliminação, LGPD.' }
            ]
          }
        ]
      },
      {
        id: 'IV', name: 'IV - GESTÃO ADMINISTRATIVA, FINANCEIRA, FISCAL E TRIBUTÁRIA', type: 'folder', details: 'Classe Principal.',
        children: [
          { id: 'IV.A', name: 'IV.A - GESTÃO CONTÁBIL E FINANCEIRA', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'IV.A.1', name: 'IV.A.1 - Livros Contábeis Obrigatórios (Diário, Razão, Balancetes, Balanços)', type: 'file', details: 'PC: Ano corrente, PI: Mínimo 10 anos (Código Civil) ou conforme legislação específica, DF: Guarda Permanente dos Balanços anuais consolidados; Eliminação dos demais após prazo legal/precaucional' },
              { id: 'IV.A.2', name: 'IV.A.2 - Comprovantes de Lançamentos Contábeis (Receitas e Despesas)', type: 'file', details: 'PC: Exercício corrente, PI: 5 anos (mínimo), DF: Eliminação' },
              { id: 'IV.A.3', name: 'IV.A.3 - Orçamentos Anuais e Plurianuais (Proposta, aprovação, acompanhamento)', type: 'file', details: 'PC: Exercício corrente + 1 ano, PI: 4 anos, DF: Eliminação, Obs: Exemplar do orçamento aprovado pode ter guarda mais longa' },
              { id: 'IV.A.4', name: 'IV.A.4 - Relatórios de Auditoria Contábil e Financeira (Interna e Externa)', type: 'file', details: 'PC: 5 anos, PI: 5 anos, DF: Guarda Permanente' }
            ]
          },
          { id: 'IV.B', name: 'IV.B - GESTÃO FISCAL E TRIBUTÁRIA', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'IV.B.1', name: 'IV.B.1 - Notas Fiscais de Serviços Prestados (educacionais)', type: 'file', details: 'PC: Exercício corrente, PI: 5 anos (mínimo, conforme legislação tributária), DF: Eliminação' },
              { id: 'IV.B.2', name: 'IV.B.2 - Notas Fiscais de Serviços Tomados e Aquisição de Bens', type: 'file', details: 'PC: Exercício corrente, PI: 5 anos (mínimo), DF: Eliminação' },
              { id: 'IV.B.3', name: 'IV.B.3 - Guias de Recolhimento de Tributos (ISS, PIS, COFINS, IRPJ, CSLL, INSS, FGTS, etc.)', type: 'file', details: 'PC: Exercício corrente, PI: 5 anos (mínimo, alguns tributos podem exigir mais), DF: Eliminação' },
              { id: 'IV.B.4', name: 'IV.B.4 - Declarações Fiscais Obrigatórias (DCTF, DIRF, ECF, EFD-Contribuições, eSocial (parte empresa), etc.)', type: 'file', details: 'PC: Ano da entrega, PI: 5 anos (mínimo), DF: Eliminação' },
              { id: 'IV.B.5', name: 'IV.B.5 - Livros de Apuração Fiscal (ICMS, IPI, ISS, se aplicável)', type: 'file', details: 'PC: Exercício corrente, PI: 5 anos (mínimo), DF: Eliminação' }
            ]
          },
          { id: 'IV.C', name: 'IV.C - GESTÃO DE CONTRATOS COM TERCEIROS (FORNECEDORES, PRESTADORES DE SERVIÇO)', type: 'folder', details: 'Subclasse.',
            children: [
              { id: 'IV.C.1', name: 'IV.C.1 - Processos de Compra e Contratação de Serviços (Cotações, propostas, justificativas)', type: 'file', details: 'PC: 1 ano após conclusão, PI: 4 anos, DF: Eliminação' },
              { id: 'IV.C.2', name: 'IV.C.2 - Contratos com Fornecedores e Prestadores de Serviço (e aditivos)', type: 'file', details: 'PC: Vigência do contrato + 5 anos (prazo prescricional), PI: N/A, DF: Eliminação, Obs: Contratos estratégicos ou de longo impacto podem ter guarda mais longa' },
              { id: 'IV.C.3', name: 'IV.C.3 - Documentação de Execução e Fiscalização de Contratos (Relatórios, medições, atestes)', type: 'file', details: 'PC: Vigência do contrato + 5 anos, PI: N/A, DF: Eliminação' },
              { id: 'IV.C.4', name: 'IV.C.4 - Contratos de Aluguel de Imóveis e Equipamentos', type: 'file', details: 'PC: Vigência do contrato + 5 anos, PI: N/A, DF: Eliminação' }
            ]
          }
        ]
      }
    ];
    
    // This will be populated by initializeApp from localStorage or default generation
    let dynamicTreeData = []; 
    let allDocuments = []; // Flat list of all documents

    // Helper to generate initial mock documents for a processed TTD tree
    function populateInitialMockDocuments(processedTtdTree) {
        let documents = [];
        globalFileIdCounter = 0; // Reset for consistency if generating mocks

        function traverseAndMock(nodes) {
            nodes.forEach(node => {
                // Decide if this node should have mock documents
                // For now, let's add to TTD items (original type: 'file') and empty folders
                // let canHaveDocs = node.type === 'file'; // Original TTD items - Lógica antiga
                // if (node.type === 'folder' && (!node.children || node.children.length === 0)) {
                // canHaveDocs = true; // Empty folders can also have docs - Lógica antiga
                // }
                // Or, more simply, any node that is a classification (has TTD props)
                let canHaveDocs = false; // Resetar para nova lógica
                if (node.temporalidadePC) { // If it has TTD properties, it's a classification node
                     canHaveDocs = true;
                }


                if (canHaveDocs) {
                    const numberOfFiles = Math.floor(Math.random() * 4); // 0 to 3 files
                    for (let i = 0; i < numberOfFiles; i++) {
                        documents.push(generateMockFile(node.id, node.name, {
                            pc: node.temporalidadePC,
                            pi: node.temporalidadePI,
                            df: node.temporalidadeDF,
                            obs: node.observacoes
                        }));
                    }
                }
                if (node.children) {
                    traverseAndMock(node.children);
                }
            });
        }
        traverseAndMock(processedTtdTree);
        return documents;
    }

    // Variáveis de estado globais
    let selectedTtdNodeId = null; 

    // --- Funções Auxiliares ---
    function findNodeById(nodes, id) {
        if (!id || !nodes) return null;
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }
    
    function getIconForFileType(fileName) {
        if (!fileName || typeof fileName !== 'string') return 'fas fa-file'; 
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return 'fas fa-file-pdf';
            case 'doc': case 'docx': return 'fas fa-file-word';
            // ... (rest of the cases)
            case 'xls': case 'xlsx': return 'fas fa-file-excel';
            case 'ppt': case 'pptx': return 'fas fa-file-powerpoint';
            case 'txt': return 'fas fa-file-alt';
            case 'jpg': case 'jpeg': case 'png': case 'gif': return 'fas fa-file-image';
            case 'zip': case 'rar': return 'fas fa-file-archive';
            default: return 'fas fa-file';
        }
    }

    // --- LÓGICA DA ÁRVORE DE PASTAS (TTD Tree) ---
    // renderFolderTree remains largely the same, but operates on appData.ttdTree (dynamicTreeData)
    function renderFolderTree(nodes, parentElement, level = 0) {
        parentElement.innerHTML = ''; 
        const ul = document.createElement('ul');
        ul.classList.add('folder-tree-level');
        if (level === 0) ul.classList.add('root-level');

        nodes.forEach(node => {
            const li = document.createElement('li');
            li.classList.add('tree-node');
            li.dataset.id = node.id;
            // node.type still refers to original type ('folder' for grouping, 'file' for TTD classification)
            // All these nodes can potentially be "folders" for documents.
            li.dataset.type = node.type; 

            const nodeContent = document.createElement('div');
            nodeContent.classList.add('node-content');
            nodeContent.style.paddingLeft = `${level * 20}px`;

            if (node.children && node.children.length > 0) { // Expander for any node with children
                const expander = document.createElement('span');
                expander.classList.add('expander');
                expander.innerHTML = node.isExpanded ? '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-right"></i>';
                expander.onclick = (e) => {
                    e.stopPropagation(); 
                    toggleNodeExpansion(node.id);
                };
                nodeContent.appendChild(expander);
            } else { 
                 const placeholderExpander = document.createElement('span');
                 placeholderExpander.classList.add('expander-placeholder');
                 nodeContent.appendChild(placeholderExpander);
            }

            const icon = document.createElement('i');
            // Icon based on original type or presence of children for visual cue
            icon.className = (node.type === 'folder' || (node.children && node.children.length > 0) ? 'fas fa-folder' : 'fas fa-file-alt') + ' node-icon';
            nodeContent.appendChild(icon);

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('node-name');
            nameSpan.textContent = node.name;
            nodeContent.appendChild(nameSpan);
            
            nodeContent.onclick = () => {
                handleNodeSelection(node); // Pass the TTD node
            };

            li.appendChild(nodeContent);

            if (node.children && node.children.length > 0 && node.isExpanded) {
                const subUl = document.createElement('ul');
                subUl.classList.add('folder-tree-level');
                renderFolderTree(node.children, subUl, level + 1);
                li.appendChild(subUl);
            }
            ul.appendChild(li);
        });
        parentElement.appendChild(ul);
    }

    function handleNodeSelection(selectedNode) { // selectedNode is a TTD node from appData.ttdTree
        document.querySelectorAll('.tree-node .node-content.selected').forEach(el => el.classList.remove('selected'));
        const clickedNodeElement = folderTreeContainer.querySelector(`.tree-node[data-id="${selectedNode.id}"] > .node-content`);
        if (clickedNodeElement) {
            clickedNodeElement.classList.add('selected');
        }

        selectedTtdNodeId = selectedNode.id; // Store the ID of the selected TTD node
        currentFolderTitle.textContent = `Documentos em: ${selectedNode.name}`;
        
        // Filter documents from appData.documents that belong to this TTD node
        const documentsForNode = appData.documents.filter(doc => doc.ttdNodeId === selectedTtdNodeId);
        renderFileListView(documentsForNode, selectedNode); // Pass selected TTD node for context if needed by renderFileListView later

        // Display TTD details of the selected TTD node itself (which is acting as a folder)
        updateTtdDetailsView(selectedNode); 
    }

    function toggleNodeExpansion(nodeId, expand) { 
        const node = findNodeById(appData.ttdTree, nodeId); // Search in the persisted tree
        if (node && node.children && node.children.length > 0) {
            if (typeof expand === 'boolean') {
                node.isExpanded = expand;
            } else {
                node.isExpanded = !node.isExpanded;
            }
            // No need to save appData here just for expansion state if it's not critical to persist
            // Or, if we want to persist expansion, then call saveApplicationData()
            // For now, let's not persist expansion state to keep save operations for actual data changes.
            renderFolderTree(appData.ttdTree, folderTreeContainer, 0);
            
            // Re-apply selection styling if the selected node was part of the toggle
            if (selectedTtdNodeId === nodeId || findNodeById([node], selectedTtdNodeId)) {
                 const currentSelectedNodeElement = folderTreeContainer.querySelector(`.tree-node[data-id="${selectedTtdNodeId}"] > .node-content`);
                 if (currentSelectedNodeElement) {
                    currentSelectedNodeElement.classList.add('selected');
                 }
            }
        }
    }

    function toggleAllNodes(nodes, expand) {
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) { // Only expand/collapse nodes with children
                node.isExpanded = expand;
                toggleAllNodes(node.children, expand);
            }
        });
        renderFolderTree(appData.ttdTree, folderTreeContainer, 0);
    }
    
    // --- LÓGICA DA LISTA DE ARQUIVOS ---
    // MODIFICADO: renderFileListView agora gerencia dois contêineres
    function renderFileListView(documentsToList, currentTtdNode, searchTerm = '') {
        const vigentesContainer = document.getElementById('vigentes-documents-table-view');
        const arquivadosContainer = document.getElementById('arquivados-documents-table-view');

        if (!vigentesContainer || !arquivadosContainer) {
            console.error("Contêineres de documentos (vigentes/arquivados) não encontrados.");
            return;
        }

        vigentesContainer.innerHTML = ''; // Limpa antes de renderizar
        arquivadosContainer.innerHTML = ''; // Limpa antes de renderizar

        if (!documentsToList) documentsToList = [];

        let filteredDocuments = documentsToList;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredDocuments = documentsToList.filter(doc => 
                doc.name.toLowerCase().includes(lowerSearchTerm) || 
                (doc.description && doc.description.toLowerCase().includes(lowerSearchTerm))
            );
        }

        const vigentesDocs = filteredDocuments.filter(doc => doc.statusDocumento === 'Vigente');
        const arquivadosDocs = filteredDocuments.filter(doc => 
            doc.statusDocumento === 'Cancelado' || 
            doc.statusDocumento === 'Vencido' || 
            doc.statusDocumento === 'Substituído'
        );

        if (vigentesDocs.length === 0) {
            vigentesContainer.innerHTML = searchTerm ? 
                '<p>Nenhum documento vigente encontrado com o termo de busca.</p>' : 
                '<p>Nenhum documento vigente nesta classificação TTD.</p>';
        }
        else {
            renderDocumentTable(vigentesDocs, vigentesContainer, true, currentTtdNode);
        }

        if (arquivadosDocs.length === 0) {
            arquivadosContainer.innerHTML = searchTerm ? 
            '<p>Nenhum documento arquivado encontrado com o termo de busca.</p>' : 
            '<p>Nenhum documento arquivado nesta classificação TTD.</p>';
        } else {
            renderDocumentTable(arquivadosDocs, arquivadosContainer, false, currentTtdNode);
        }
    }

    // NOVA FUNÇÃO: renderDocumentTable
    function renderDocumentTable(docs, containerElement, isVigenteTable, currentTtdNode) {
        const table = document.createElement('table');
        table.classList.add('file-list-table');
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        
        let headers = ['Nome', 'Descrição', 'Anexo', 'Modificado', 'Versão', 'Usuário', 'Status', 'PC', 'PI', 'DF', 'Obs.'];
        if (!isVigenteTable) {
            headers.push('Detalhes Arquivamento'); // Coluna para motivo/data de cancelamento/vencimento
        }
        headers.push('Ações');

        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        docs.forEach(doc => {
            const row = tbody.insertRow();
            const cellName = row.insertCell();
            const fileIcon = document.createElement('i');
            fileIcon.className = getIconForFileType(doc.name) + ' file-icon-list';
            cellName.appendChild(fileIcon);
            cellName.append(` ${doc.name}`);

            row.insertCell().textContent = doc.description || '-';
            row.insertCell().textContent = doc.attachmentDate;
            row.insertCell().textContent = doc.lastModifiedDate;
            row.insertCell().textContent = doc.version;
            row.insertCell().textContent = doc.user;
            
            const statusCell = row.insertCell();
            statusCell.textContent = doc.statusDocumento;
            if (doc.statusDocumento === 'Cancelado' || doc.statusDocumento === 'Vencido' || doc.statusDocumento === 'Substituído') {
                statusCell.classList.add('status-arquivado'); // Usar uma classe genérica para status não vigentes
                 row.classList.add('document-arquivado'); // Estilo para a linha toda
            }
            // Tooltip para status (especialmente se arquivado)
            let tooltipText = doc.statusDocumento;
            if (doc.statusDocumento === 'Cancelado' && doc.motivoCancelamento) {
                tooltipText += ` em ${doc.dataCancelamento} por ${doc.usuarioCancelamento}. Motivo: ${doc.motivoCancelamento}`;
            } else if (doc.statusDocumento === 'Vencido' && doc.dataVencimentoReal) {
                tooltipText += ` em ${doc.dataVencimentoReal}`;
            }
            statusCell.title = tooltipText;

            row.insertCell().textContent = doc.temporalidadePC || 'N/A';
            row.insertCell().textContent = doc.temporalidadePI || 'N/A';
            row.insertCell().textContent = doc.temporalidadeDF || 'N/A';
            row.insertCell().textContent = doc.observacoes || '-';

            if (!isVigenteTable) {
                const cellDetalhesArquivamento = row.insertCell();
                let detalhes = '';
                if (doc.statusDocumento === 'Cancelado') {
                    detalhes = `Cancelado: ${doc.motivoCancelamento || 'Sem motivo especificado'} (Por: ${doc.usuarioCancelamento || 'N/A'} em ${doc.dataCancelamento || 'N/A'})`;
                } else if (doc.statusDocumento === 'Vencido') {
                    detalhes = `Vencido em: ${doc.dataVencimentoReal || doc.dataDeValidadeEfetiva || 'N/A'}`;
                } else if (doc.statusDocumento === 'Substituído') {
                    detalhes = `Substituído (detalhes a definir)`; // Placeholder
                }
                cellDetalhesArquivamento.textContent = detalhes;
                cellDetalhesArquivamento.title = detalhes; // Também no tooltip
            }
            
            const cellActions = row.insertCell();
            const downloadBtn = document.createElement('button');
            downloadBtn.classList.add('action-btn');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.title = 'Baixar (Simulado)';
            downloadBtn.onclick = () => alert(`Simulando download de ${doc.name}`);
            cellActions.appendChild(downloadBtn);

            if (isVigenteTable) {
                const editBtn = document.createElement('button');
                editBtn.classList.add('action-btn');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.title = 'Editar Metadados (Protótipo)';
                // editBtn.onclick = () => displayEditDocumentModal(doc); // Futuro
                cellActions.appendChild(editBtn);

                const cancelBtn = document.createElement('button');
                cancelBtn.classList.add('action-btn', 'action-btn-cancel'); // Nova classe para botão de cancelar
                cancelBtn.innerHTML = '<i class="fas fa-times-circle"></i>'; // Ícone de cancelar
                cancelBtn.title = 'Cancelar Documento';
                cancelBtn.onclick = () => displayCancelDocumentModal(doc); // Nova função a ser criada
                cellActions.appendChild(cancelBtn);
            } else {
                // Para documentos arquivados, podemos ter um botão de "Ver Detalhes do Arquivamento" se a coluna não for suficiente
                // Por ora, os detalhes estão na coluna "Detalhes Arquivamento"
            }
        });
        containerElement.appendChild(table);
    }

    // --- LÓGICA DE DETALHES DO ITEM TTD (Selected TTD Node) ---
    function updateTtdDetailsView(ttdNode) { // ttdNode is the selected node from the TTD tree
        if (!ttdNode) {
            clearTtdDetailsView();
            return;
        }
        contentTitleDetail.textContent = `Detalhes da Classificação TTD: ${ttdNode.name}`;
        
        let detailsDisplayHtml = `<p><strong>ID (Classificação TTD):</strong> ${ttdNode.id}</p>`;
        // Display TTD properties directly from the node
        detailsDisplayHtml += '<div class="temporalidade-container">';
        detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_PC_DG}">Prazo Corrente (PC):</span> <span class="temporalidade-valor">${ttdNode.temporalidadePC || 'N/A'}</span></div>`;
        detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_PI}">Prazo Intermediário (PI):</span> <span class="temporalidade-valor">${ttdNode.temporalidadePI || 'N/A'}</span></div>`;
        detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_DF}">Destinação Final (DF):</span> <span class="temporalidade-valor">${ttdNode.temporalidadeDF || 'N/A'}</span></div>`;
        if (ttdNode.observacoes) {
            detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_OBS}">Observações:</span> <span class="temporalidade-valor">${ttdNode.observacoes}</span></div>`;
        }
        detailsDisplayHtml += '</div>';
        
        // If there's still an original 'details' string with unparsed info, show it.
        if (ttdNode.details && typeof ttdNode.details === 'string' && !ttdNode.observacoes) {
             const originalDetailsOnly = parseSingleTtdDetails(ttdNode.details);
             if (originalDetailsOnly.obs && !ttdNode.observacoes && originalDetailsOnly.obs !== ttdNode.temporalidadePC && originalDetailsOnly.obs !== ttdNode.temporalidadePI && originalDetailsOnly.obs !== ttdNode.temporalidadeDF) {
                 detailsDisplayHtml += `<p><strong>Detalhes Originais Adicionais:</strong> ${originalDetailsOnly.obs}</p>`;
             }
        }


        contentDetailsTd.innerHTML = detailsDisplayHtml;
        // Actions for TTD node itself (e.g. "+ Novo Documento aqui") could be added to contentActionsTd
        contentActionsTd.innerHTML = ''; // Clear for now
        const addButton = document.createElement('button');
        addButton.id = 'add-new-document-btn';
        addButton.classList.add('action-btn', 'primary-action-btn');
        addButton.innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Novo Documento';
        addButton.onclick = () => displayNewDocumentForm(ttdNode);
        contentActionsTd.appendChild(addButton);

        auditInfoContainerTd.innerHTML = `<p>Informações de auditoria para classificação ${ttdNode.name} (Protótipo)</p>`;
    }

    function clearTtdDetailsView() {
        contentTitleDetail.textContent = 'Detalhes da Classificação TTD';
        contentDetailsTd.innerHTML = '<p>Selecione uma classificação na árvore para ver seus detalhes de temporalidade.</p>';
        contentActionsTd.innerHTML = '';
        auditInfoContainerTd.innerHTML = '<p>Informações de auditoria.</p>';
    }
    
    // --- Event Listeners ---
    if (expandAllBtn) expandAllBtn.onclick = () => toggleAllNodes(appData.ttdTree, true);
    if (collapseAllBtn) collapseAllBtn.onclick = () => toggleAllNodes(appData.ttdTree, false);

    if (fileListSearchInput) {
        fileListSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const currentSelectedNode = findNodeById(appData.ttdTree, selectedTtdNodeId);
            if (currentSelectedNode) {
                 const documentsForNode = appData.documents.filter(doc => doc.ttdNodeId === selectedTtdNodeId);
                 renderFileListView(documentsForNode, currentSelectedNode, searchTerm);
            } else {
                 renderFileListView([], null, searchTerm); // Clear list if no folder selected
            }
        });
    }

    // --- Event Listeners para o Modal de Adicionar Documento ---
    if (closeModalBtn) {
        closeModalBtn.onclick = closeNewDocumentModal;
    }
    if (cancelAddDocumentBtn) {
        cancelAddDocumentBtn.onclick = closeNewDocumentModal;
    }
    if (addDocumentForm) {
        addDocumentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Previne o comportamento padrão de submit do formulário
            const name = docNameInput.value.trim();
            const description = docDescriptionInput.value.trim();
            if (name) { // Validação básica do nome
                handleSaveNewDocument(name, description);
            } else {
                alert("O nome do documento é obrigatório.");
            }
        });
    }
    // Fechar o modal se clicar fora do conteúdo do modal
    if (addDocumentModal) {
        window.onclick = function(event) {
            if (event.target == addDocumentModal) {
                closeNewDocumentModal();
            }
            // Adicionar verificação para o modal de eliminação também
            if (eliminationModal && event.target == eliminationModal) {
                closeEliminationModal();
            }
        }
    }

    // --- Inicialização ---
    function initializeDefaultDataStructure() {
        const processedTree = JSON.parse(JSON.stringify(initialRawTreeData)); // Deep copy
        processedTree.forEach(rootNode => processTtdNode(rootNode));
        
        appData.ttdTree = processedTree;
        appData.documents = populateInitialMockDocuments(processedTree);
        saveApplicationData();
    }

    function initializeApp() {
        loadSidebarWidth(); // Carregar largura da sidebar ANTES de qualquer renderização que dependa dela

        const loadedData = loadApplicationData();
        // Adicionar verificação para a nova estrutura de dados
        if (loadedData && loadedData.ttdTree && loadedData.documents && 
            (loadedData.documents.length === 0 || (loadedData.documents[0] && typeof loadedData.documents[0].statusDocumento !== 'undefined'))) {
            appData = loadedData;
            // Ensure tree nodes have expansion state (if we decide to persist it)
            // For now, we just load the structure. Expansion is transient.
            // It's important that findNodeById and other functions operate on appData.ttdTree
        } else {
            initializeDefaultDataStructure();
        }

        // Após carregar ou inicializar, processar documentos vencidos
        checkAndProcessExpiredDocuments();

        // Initialize globalFileIdCounter based on existing documents to prevent reuse if app is reloaded without clearing storage
        if(appData.documents.length > 0){
            // A simple way, assuming IDs are `doc-timestamp-counter`
            const maxCounter = appData.documents.reduce((max, doc) => {
                const parts = doc.id.split('-');
                const count = parseInt(parts[parts.length -1], 10);
                return count > max ? count : max;
            }, 0);
            globalFileIdCounter = maxCounter + 1;
        } else {
            globalFileIdCounter = 0;
        }


        dynamicTreeData = appData.ttdTree; // Keep dynamicTreeData reference for now if other parts of UI rely on it by that name
                                        // But ideally, consistently use appData.ttdTree

        renderFolderTree(appData.ttdTree, folderTreeContainer, 0);
        currentFolderTitle.textContent = 'Selecione uma classificação TTD na árvore';
        fileListView.innerHTML = '<p>Selecione uma classificação na árvore para ver os documentos associados.</p>';
        clearTtdDetailsView();
    }

    // parseTtdDetails was renamed to parseSingleTtdDetails
    // The old populateFoldersWithMockFiles is replaced by populateInitialMockDocuments

    // --- Funções para Adicionar Novo Documento ---
    let currentTtdNodeForNewDocument = null; // Store the TTD node when form is opened

    function displayNewDocumentForm(ttdNode) {
        currentTtdNodeForNewDocument = ttdNode;
        console.log("Abrir formulário para novo documento em:", ttdNode.name, ttdNode.id);
        // alert(`Protótipo: Abrir formulário para adicionar documento em "${ttdNode.name}"`);
        // Futuramente: aqui vamos exibir um modal/formulário
        // E preencher informações do ttdNode (ex: nome da classificação TTD)
        if (addDocumentModal && modalTtdClassification && addDocumentForm) {
            modalTtdClassification.textContent = `${ttdNode.name} (ID: ${ttdNode.id})`;
            addDocumentForm.reset(); // Limpa o formulário
            addDocumentModal.style.display = 'block'; // Exibe o modal
        } else {
            console.error("Elementos do modal não encontrados!");
            alert("Erro ao tentar abrir o formulário. Verifique o console.");
        }
    }

    function closeNewDocumentModal() {
        if (addDocumentModal && addDocumentForm) {
            addDocumentForm.reset();
            addDocumentModal.style.display = 'none';
            currentTtdNodeForNewDocument = null; // Limpa o nó TTD atual
        } 
    }

    function handleSaveNewDocument(name, description) { // Argumentos virão do formulário
        if (!currentTtdNodeForNewDocument || !name) {
            alert("Erro: Classificação TTD não selecionada ou nome do documento em branco.");
            return;
        }

        const attachmentDateObj = new Date();
        const newDocument = {
            id: `doc-${Date.now()}-${globalFileIdCounter++}`,
            ttdNodeId: currentTtdNodeForNewDocument.id,
            name: name,
            description: description || '',
            attachmentDate: formatDate(attachmentDateObj),
            lastModifiedDate: formatDateTime(attachmentDateObj),
            version: 'v1.0',
            user: getRandomUser(), // Usar um usuário logado real no futuro
            status: 'Ativo',
            eliminationDetails: null,
            type: 'file', // Tipo do objeto, não classificação TTD
            temporalidadePC: currentTtdNodeForNewDocument.temporalidadePC,
            temporalidadePI: currentTtdNodeForNewDocument.temporalidadePI,
            temporalidadeDF: currentTtdNodeForNewDocument.temporalidadeDF,
            observacoes: currentTtdNodeForNewDocument.observacoes
        };

        appData.documents.push(newDocument);
        saveApplicationData();

        // Atualizar a visualização
        const documentsForNode = appData.documents.filter(doc => doc.ttdNodeId === selectedTtdNodeId);
        renderFileListView(documentsForNode, currentTtdNodeForNewDocument); // currentTtdNodeForNewDocument é o nó TTD selecionado
        
        console.log("Novo documento salvo:", newDocument);
        // Futuramente: fechar o modal/formulário
        // alert("Novo documento salvo com sucesso!"); // Feedback temporário
        closeNewDocumentModal();
    }

    // --- Funções para Eliminação Lógica de Documento --- (SERÁ RENOMEADO/ADAPTADO PARA CANCELAMENTO)
    // Manter documentToEliminate, mas talvez renomear para documentBeingProcessed ou similar
    let documentToProcess = null; 

    // RENOMEAR E ADAPTAR: displayEliminationModal para displayCancelDocumentModal
    function displayCancelDocumentModal(doc) {
        documentToProcess = doc;
        const modal = document.getElementById('elimination-modal'); // Usaremos o mesmo modal HTML, mas adaptaremos os textos e lógica
        const docNameEl = document.getElementById('elimination-doc-name');
        const docNameElStep2 = document.getElementById('elimination-doc-name-step-2');
        const step1Div = document.getElementById('elimination-step-1');
        const step2Div = document.getElementById('elimination-step-2');
        const reasonInput = document.getElementById('elimination-reason'); // Reutilizar o campo de motivo
        const modalTitle = modal.querySelector('h2');
        const step1Text = step1Div.querySelector('p');
        const confirmInitialBtn = document.getElementById('confirm-initial-elimination-btn');
        const reasonLabel = step2Div.querySelector('label[for="elimination-reason"]');
        const concludeBtn = step2Div.querySelector('form button[type="submit"]');


        if (modal && docNameEl && step1Div && step2Div && docNameElStep2 && reasonInput && modalTitle && step1Text && confirmInitialBtn && reasonLabel && concludeBtn) {
            modalTitle.textContent = 'Cancelar Vigor do Documento';
            docNameEl.textContent = doc.name;
            docNameElStep2.textContent = doc.name;
            step1Text.innerHTML = `Atenção: Você está prestes a cancelar o vigor do documento <strong id="elimination-doc-name">${doc.name}</strong>. Ele será movido para a seção de 'Documentos Arquivados' e não estará mais na lista de documentos vigentes. Deseja continuar?`;
            confirmInitialBtn.textContent = 'Sim, Cancelar Vigor';
            
            reasonLabel.textContent = 'Motivo do Cancelamento (obrigatório):';
            reasonInput.value = ''; 
            concludeBtn.textContent = 'Confirmar Cancelamento com Motivo';
            
            step1Div.style.display = 'block';
            step2Div.style.display = 'none';
            modal.style.display = 'block';
        } else {
            console.error("Elementos do modal de cancelamento/eliminação não encontrados ou incompletos para adaptação!");
            alert("Erro ao tentar abrir o formulário de cancelamento. Verifique o console.");
        }
    }

    // RENOMEAR E ADAPTAR: handleConfirmInitialElimination para handleConfirmInitialCancellation
    function handleConfirmInitialCancellation() {
        const step1Div = document.getElementById('elimination-step-1');
        const step2Div = document.getElementById('elimination-step-2');
        const reasonInput = document.getElementById('elimination-reason');
        if (step1Div && step2Div && reasonInput) {
            step1Div.style.display = 'none';
            step2Div.style.display = 'block';
            reasonInput.focus(); 
        }
    }

    // RENOMEAR E ADAPTAR: closeEliminationModal para closeCancelDocumentModal
    function closeCancelDocumentModal() {
        const modal = document.getElementById('elimination-modal');
        const reasonInput = document.getElementById('elimination-reason');
        const step1Div = document.getElementById('elimination-step-1');
        const step2Div = document.getElementById('elimination-step-2');
        if (modal && reasonInput && step1Div && step2Div) {
            modal.style.display = 'none';
            documentToProcess = null;
            reasonInput.value = ''; 
            step1Div.style.display = 'block';
            step2Div.style.display = 'none';
        } else {
            console.warn("Tentativa de fechar modal de cancelamento, mas alguns elementos não foram encontrados.");
        }
    }

    // RENOMEAR E ADAPTAR: handleConcludeElimination para handleConcludeCancellation
    function handleConcludeCancellation() {
        if (!documentToProcess) {
            console.error("Nenhum documento selecionado para cancelamento.");
            closeCancelDocumentModal();
            return;
        }
        const reasonInput = document.getElementById('elimination-reason');
        const reason = reasonInput.value.trim();
        if (!reason) {
            alert("O motivo do cancelamento é obrigatório.");
            reasonInput.focus();
            return; 
        }

        const docIndex = appData.documents.findIndex(d => d.id === documentToProcess.id);
        if (docIndex === -1) {
            console.error("Documento para cancelar não encontrado em appData.documents:", documentToProcess.id);
            alert("Erro ao processar o cancelamento. Documento não encontrado.");
            closeCancelDocumentModal();
            return;
        }

        const cancellationDateObj = new Date();
        
        appData.documents[docIndex].statusDocumento = 'Cancelado';
        appData.documents[docIndex].dataCancelamento = formatDateTime(cancellationDateObj);
        appData.documents[docIndex].usuarioCancelamento = getRandomUser(); 
        appData.documents[docIndex].motivoCancelamento = reason;
        // Outros campos como dataDeValidadeEfetiva e dataVencimentoReal não são afetados diretamente aqui

        saveApplicationData(); 
        
        const currentSelectedNode = findNodeById(appData.ttdTree, selectedTtdNodeId);
        if (currentSelectedNode) {
            const documentsForNode = appData.documents.filter(doc => doc.ttdNodeId === selectedTtdNodeId);
            renderFileListView(documentsForNode, currentSelectedNode, fileListSearchInput ? fileListSearchInput.value : '');
        }
        
        console.log(`Documento "${appData.documents[docIndex].name}" marcado como Cancelado. Motivo: ${reason}`);
        closeCancelDocumentModal(); 
    }


    // Event Listeners para Modal de Adicionar Documento (manter)
    // ...

    // --- Event Listeners para o Modal de Eliminação (AGORA CANCELAMENTO) ---
    // Ajustar os IDs e funções chamadas
    const effectiveCloseEliminationModalBtn = document.getElementById('close-elimination-modal-btn');
    const effectiveCancelEliminationStep1Btn = document.getElementById('cancel-elimination-step-1-btn');
    const effectiveConfirmInitialEliminationBtn = document.getElementById('confirm-initial-elimination-btn');
    const effectiveEliminationReasonForm = document.getElementById('elimination-reason-form');
    const effectiveCancelEliminationStep2Btn = document.getElementById('cancel-elimination-step-2-btn');

    if (effectiveCloseEliminationModalBtn) {
        effectiveCloseEliminationModalBtn.onclick = closeCancelDocumentModal;
    }
    if (effectiveCancelEliminationStep1Btn) {
        effectiveCancelEliminationStep1Btn.onclick = closeCancelDocumentModal;
    }
    if (effectiveConfirmInitialEliminationBtn) {
        effectiveConfirmInitialEliminationBtn.onclick = handleConfirmInitialCancellation;
    }
    if (effectiveEliminationReasonForm) {
        effectiveEliminationReasonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleConcludeCancellation();
        });
    }
    if (effectiveCancelEliminationStep2Btn) {
        effectiveCancelEliminationStep2Btn.onclick = closeCancelDocumentModal;
    }
    
    // Ajustar o window.onclick para o modal de "eliminação" que agora é de cancelamento
    if (addDocumentModal) { // O addDocumentModal ainda existe e seu listener é separado
        window.onclick = function(event) {
            if (event.target == addDocumentModal) {
                closeNewDocumentModal();
            }
            const eliminationModalRef = document.getElementById('elimination-modal'); // Pegar a referência aqui
            if (eliminationModalRef && event.target == eliminationModalRef) { 
                closeCancelDocumentModal();
            }
        }
    } else {
         const eliminationModalRef = document.getElementById('elimination-modal');
         if (eliminationModalRef) {
            window.onclick = function(event) {
                if (event.target == eliminationModalRef) {
                    closeCancelDocumentModal();
                }
            }
         }
    }

    // --- Funcionalidade de Painel Redimensionável ---
    function enableResizableSidebar() {
        if (!resizeHandle || !treeViewContainer) return;

        let isResizing = false;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.userSelect = 'none'; // Prevenir seleção de texto durante o resize
            document.body.style.cursor = 'col-resize';

            const mouseMoveHandler = (moveEvent) => {
                if (!isResizing) return;
                let newWidth = moveEvent.clientX - treeViewContainer.getBoundingClientRect().left;
                
                // Aplicar limites min/max definidos no CSS ou aqui diretamente
                const minWidth = parseInt(getComputedStyle(treeViewContainer).minWidth, 10) || 150;
                const maxWidth = parseInt(getComputedStyle(treeViewContainer).maxWidth, 10) || (window.innerWidth * 0.7);

                if (newWidth < minWidth) newWidth = minWidth;
                if (newWidth > maxWidth) newWidth = maxWidth;
                
                treeViewContainer.style.width = `${newWidth}px`;
                // mainContentContainer se ajustará automaticamente devido ao flex-grow
            };

            const mouseUpHandler = () => {
                if (!isResizing) return;
                isResizing = false;
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);

                // Salvar a largura no localStorage
                localStorage.setItem(SIDEBAR_WIDTH_KEY, treeViewContainer.style.width);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    }

    function loadSidebarWidth() {
        if (!treeViewContainer) return;
        const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
        if (savedWidth) {
            treeViewContainer.style.width = savedWidth;
        } else {
            // Fallback para a largura definida no CSS se não houver nada salvo
            // ou definir uma largura padrão aqui se o CSS não tiver uma inicial explícita
            treeViewContainer.style.width = '300px'; 
        }
    }

    const mainHeaderTitle = document.querySelector('.main-header h1'); // Elemento do logo/título
    const globalSearchInput = document.getElementById('global-search-input'); // Campo de busca global

    // --- localStorage Keys and Service ---
    function resetToHomeView() {
        selectedTtdNodeId = null;
        currentFolderTitle.textContent = 'Selecione uma classificação TTD na árvore';
        
        // Limpar a visualização de arquivos (ambos os contêineres)
        const vigentesContainer = document.getElementById('vigentes-documents-table-view');
        const arquivadosContainer = document.getElementById('arquivados-documents-table-view');
        if (vigentesContainer) vigentesContainer.innerHTML = '<p>Selecione uma classificação na árvore para ver os documentos associados.</p>';
        if (arquivadosContainer) arquivadosContainer.innerHTML = '<p>Nenhum documento arquivado ou classificação não selecionada.</p>';

        clearTtdDetailsView();
        
        // Remover seleção da árvore visualmente
        document.querySelectorAll('.tree-node .node-content.selected').forEach(el => el.classList.remove('selected'));

        // Limpar campo de busca de arquivos da pasta atual
        if (fileListSearchInput) fileListSearchInput.value = '';
        // Se houver uma busca global, talvez limpá-la também ou mudar o foco
        // const globalSearchInput = document.getElementById('global-search-input');
        // if (globalSearchInput) globalSearchInput.value = '';

        console.log("Navegado para a Home View.");
    }

    // --- Funções de Busca Global ---
    function performGlobalSearch(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) { // Não buscar com menos de 2 caracteres
            resetToHomeView(); // Ou limpar apenas os resultados da busca global
            // Se uma pasta estiver selecionada, renderizar seu conteúdo normalmente
            const currentSelectedNode = findNodeById(appData.ttdTree, selectedTtdNodeId);
            if (currentSelectedNode) {
                const documentsForNode = appData.documents.filter(doc => doc.ttdNodeId === selectedTtdNodeId);
                renderFileListView(documentsForNode, currentSelectedNode);
            } else {
                // Se nenhuma pasta estiver selecionada, a home view já foi resetada.
                 // Garantir que a área de arquivos mostre a mensagem apropriada para home
                const vigentesContainer = document.getElementById('vigentes-documents-table-view');
                const arquivadosContainer = document.getElementById('arquivados-documents-table-view');
                if (vigentesContainer) vigentesContainer.innerHTML = '<p>Selecione uma classificação na árvore ou faça uma busca global.</p>';
                if (arquivadosContainer) arquivadosContainer.innerHTML = '<p></p>'; // Limpa arquivados na home inicial
            }
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const searchResults = appData.documents.filter(doc => {
            return (
                doc.name.toLowerCase().includes(lowerSearchTerm) ||
                (doc.description && doc.description.toLowerCase().includes(lowerSearchTerm)) ||
                (doc.user && doc.user.toLowerCase().includes(lowerSearchTerm)) ||
                (doc.motivoCancelamento && doc.motivoCancelamento.toLowerCase().includes(lowerSearchTerm)) ||
                (doc.id && doc.id.toLowerCase().includes(lowerSearchTerm)) // Buscar por ID também
            );
        });

        renderGlobalSearchResults(searchResults, searchTerm);
    }

    function getPathForTtdNode(nodeId) {
        let path = [];
        function findPath(nodes, id, currentPath) {
            for (const node of nodes) {
                const newPath = [...currentPath, node.name];
                if (node.id === id) {
                    path = newPath;
                    return true;
                }
                if (node.children) {
                    if (findPath(node.children, id, newPath)) {
                        return true;
                    }
                }
            }
            return false;
        }
        findPath(appData.ttdTree, nodeId, []);
        return path.join(' > ');
    }

    function renderGlobalSearchResults(results, searchTerm) {
        const vigentesContainer = document.getElementById('vigentes-documents-table-view');
        const arquivadosContainer = document.getElementById('arquivados-documents-table-view');
        
        currentFolderTitle.textContent = `Resultados da Busca Global por: "${searchTerm}"`;
        clearTtdDetailsView(); // Limpar detalhes TTD ao mostrar busca global
        document.querySelectorAll('.tree-node .node-content.selected').forEach(el => el.classList.remove('selected'));
        selectedTtdNodeId = null; // Desselecionar nó da árvore

        if (!vigentesContainer || !arquivadosContainer) {
            console.error("Contêineres de documentos não encontrados para busca global.");
            fileListView.innerHTML = '<p>Erro ao exibir resultados da busca.</p>';
            return;
        }

        vigentesContainer.innerHTML = ''; 
        arquivadosContainer.innerHTML = ''; 

        if (results.length === 0) {
            const noResultsMessage = '<p>Nenhum documento encontrado para o termo de busca global.</p>';
            vigentesContainer.innerHTML = noResultsMessage;
            // arquivadosContainer pode ficar vazio ou também mostrar a mensagem
            return;
        }

        // Para simplificar, vamos colocar todos os resultados em uma única lista/tabela por enquanto
        // Poderia-se separar em vigentes/arquivados se necessário, mas o requisito é mais genérico
        const resultsTable = document.createElement('table');
        resultsTable.classList.add('file-list-table');
        const thead = resultsTable.createTHead();
        const headerRow = thead.insertRow();
        const headers = ['Nome', 'Localização (TTD)', 'Status', 'Anexo', 'Versão', 'Ações'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        const tbody = resultsTable.createTBody();
        results.forEach(doc => {
            const row = tbody.insertRow();
            const cellName = row.insertCell();
            const fileIcon = document.createElement('i');
            fileIcon.className = getIconForFileType(doc.name) + ' file-icon-list';
            cellName.appendChild(fileIcon);
            cellName.append(` ${doc.name}`);

            row.insertCell().textContent = getPathForTtdNode(doc.ttdNodeId) || 'Raiz (ERRO: Local não encontrado)';
            row.insertCell().textContent = doc.statusDocumento;
            row.insertCell().textContent = doc.attachmentDate;
            row.insertCell().textContent = doc.version;

            const cellActions = row.insertCell();
            const downloadBtn = document.createElement('button');
            downloadBtn.classList.add('action-btn');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar';
            downloadBtn.title = 'Baixar (Simulado)';
            downloadBtn.onclick = () => alert(`Simulando download de ${doc.name}`);
            cellActions.appendChild(downloadBtn);

            const goToFolderBtn = document.createElement('button');
            goToFolderBtn.classList.add('action-btn');
            goToFolderBtn.innerHTML = '<i class="fas fa-folder-open"></i> Ir para Pasta';
            goToFolderBtn.title = 'Ir para a pasta do documento';
            goToFolderBtn.onclick = () => {
                const ttdNode = findNodeById(appData.ttdTree, doc.ttdNodeId);
                if (ttdNode) {
                    // Expandir a árvore até o nó
                    expandTreeToNode(doc.ttdNodeId);
                    handleNodeSelection(ttdNode);
                    if (globalSearchInput) globalSearchInput.value = ''; // Limpar busca global ao navegar
                } else {
                    alert('Erro: Pasta TTD não encontrada para este documento.');
                }
            };
            cellActions.appendChild(goToFolderBtn);
        });

        vigentesContainer.appendChild(resultsTable); 
        // Por enquanto, não teremos container de arquivados para busca global, simplificando.
        arquivadosContainer.innerHTML = '<p style="text-align:center; color: var(--dark-gray)">-- Fim dos resultados --</p>';
    }

    function expandTreeToNode(nodeId) {
        const pathIds = [];
        function findPathToNode(nodes, id, currentPathNodeIds) {
            for (const node of nodes) {
                const newPathNodeIds = [...currentPathNodeIds, node.id];
                if (node.id === id) {
                    pathIds.push(...newPathNodeIds);
                    return true;
                }
                if (node.children) {
                    if (findPathToNode(node.children, id, newPathNodeIds)) {
                        return true;
                    }
                }
            }
            return false;
        }

        findPathToNode(appData.ttdTree, nodeId, []);
        
        if (pathIds.length > 0) {
            // Expandir cada nó no caminho, exceto o último (o próprio nó)
            for (let i = 0; i < pathIds.length - 1; i++) {
                const nodeToExpand = findNodeById(appData.ttdTree, pathIds[i]);
                if (nodeToExpand && nodeToExpand.children && nodeToExpand.children.length > 0) {
                    nodeToExpand.isExpanded = true;
                }
            }
            renderFolderTree(appData.ttdTree, folderTreeContainer, 0); // Re-renderizar árvore
        }
    }

    // --- Inicialização ---
    initializeApp();
    enableResizableSidebar(); // Habilitar redimensionamento após a inicialização

    if (mainHeaderTitle) {
        mainHeaderTitle.addEventListener('click', resetToHomeView);
    }

    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            performGlobalSearch(e.target.value);
        });
        // Opcional: limpar a busca local quando a global é usada
        globalSearchInput.addEventListener('focus', () => {
            if (fileListSearchInput) fileListSearchInput.value = '';
            // A lógica em performGlobalSearch já redefine a view se o termo for curto
        });
    }
}); 