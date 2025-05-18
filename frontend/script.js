document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    const itemListContainer = document.getElementById('item-list-container');
    const currentListSearchInput = document.getElementById('current-list-search-input');
    
    const contentTitle = document.getElementById('content-title');
    const contentDetails = document.getElementById('content-details');
    const contentActions = document.getElementById('content-actions'); // Para ações do item TTD
    const auditInfoContainer = document.getElementById('audit-info-container');

    // Explicações das Siglas de Temporalidade
    const EXPLICACAO_PC_DG = "Refere-se ao tempo que o documento deve ser mantido na unidade que o produziu ou recebeu (arquivo corrente), enquanto é frequentemente consultado para atender às necessidades administrativas imediatas.";
    const EXPLICACAO_PI = "Indica o tempo que o documento deve ser mantido em um arquivo intermediário (geralmente um arquivo central da instituição) após cessar seu uso corrente, mas ainda possuindo valor administrativo, legal ou fiscal que justifique sua guarda antes da destinação final. Muitas vezes, a observação N/A (Não se Aplica) pode aparecer aqui, indicando que o documento vai direto do corrente para a destinação final ou que o prazo intermediário está incluído no corrente ou é determinado por outra condição.";
    const EXPLICACAO_DF = "Determina o que deve ser feito com o documento após o cumprimento dos prazos nas fases corrente e intermediária. As destinações mais comuns são: Guarda Permanente (GP) ou Eliminação (E).";
    const EXPLICACAO_OBS = "Observações adicionais ou contextos específicos sobre a temporalidade do documento.";

    // Mock data para a árvore documental BASEADA NA TTD FAEP (Parcial)
    // Esta estrutura de dados precisa ser completada com a TTD IFES completa.
    const treeData = [
      { // Classe 000
        id: '000',
        name: '000 - ADMINISTRAÇÃO GERAL',
        type: 'folder',
        details: 'Classe Principal - Documentos que viabilizam o funcionamento da instituição e o alcance de seus objetivos.',
        children: [
          {
            id: '001',
            name: '001 - RELAÇÃO INTERINSTITUCIONAL',
            type: 'file', 
            details: 'PC: * Fim da vigência, PI: 20 anos (Transferência), DF: Guarda Permanente, Obs: *O prazo de guarda se encerra imediatamente após o evento.'
          },
          {
            id: '002',
            name: '002 - ATENDIMENTO AO CIDADÃO',
            type: 'folder',
            details: 'Subclasse.',
            children: [
              {
                id: '002.01',
                name: '002.01 - NORMATIZAÇÃO. REGULAMENTAÇÃO',
                type: 'file',
                details: 'PC: * Fim da vigência, PI: 5 anos (Transferência), DF: Guarda Permanente, Obs: *O prazo de guarda se encerra imediatamente após o evento.'
              },
              {
                id: '002.1',
                name: '002.1 - ACESSO À INFORMAÇÃO',
                type: 'folder',
                details: 'Grupo.',
                children: [
                  {
                    id: '002.11',
                    name: '002.11 - PEDIDO DE ACESSO À INFORMAÇÃO E RECURSO',
                    type: 'file',
                    details: 'PC: * Término do atendimento, PI: 5 anos (Transferência), DF: Eliminação, Obs: *O prazo de guarda se encerra imediatamente após o evento. Aguardar o resultado do provimento do recurso em última instância, no caso de indeferimento do pedido de acesso.'
                  },
                  { id: '002.12', name: '002.12 - ACOMPANHAMENTO DO ATENDIMENTO AO CIDADÃO', type: 'file', details: 'PC: 2 anos, DF: Guarda Permanente'}
                ]
              },
              { id: '002.2', name: '002.2 - CONTROLE DE SATISFAÇÃO DO USUÁRIO', type: 'file', details: 'PC: 2 anos, DF: Eliminação' }
            ]
          },
          { id: '003', name: '003 - CONTROLE E FISCALIZAÇÃO', type: 'folder', children: [
            { id: '003.1', name: '003.1 - AUDITORIA INTERNA', type: 'file', details: 'PC: 5 anos, DF: Guarda Permanente'}
          ]}
        ]
      },
      { // Classe 100
        id: '100',
        name: '100 - ENSINO SUPERIOR',
        type: 'folder',
        details: 'Classe Principal.', // General detail for top-level class
        children: [
          {
            id: '120',
            name: '120 - Cursos de graduação (inclusive na modalidade a distância)',
            type: 'folder',
            details: 'Subclasse.', // General detail
            children: [
              {
                id: '121',
                name: '121 - Concepção, organização e funcionamento dos cursos de graduação',
                type: 'folder',
                details: 'Grupo.', // General detail
                children: [
                  { id: '121.1', name: '121.1 - Projeto pedagógico dos cursos', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente',
                    children: [
                      {
                        id: 'fict_121.1_01',
                        name: 'Projeto Pedagógico V1.pdf',
                        type: 'file',
                        fileType: 'pdf',
                        details: 'PC: N/A, PI: N/A, DF: N/A, Obs: Versão inicial do projeto.',
                        size: '1.2MB',
                        author: 'Coordenador X',
                        createdAt: '2023-01-20',
                        updatedAt: '2023-01-22',
                        isOfficial: false
                      }
                    ]
                  },
                  { id: '121.2', name: '121.2 - Criação de cursos. Conversão de cursos', type: 'file', details: 'PC: Até a homologação do ato, PI: 5 anos, DF: Guarda Permanente' },
                  { id: '121.21', name: '121.21 - Autorização. Reconhecimento. Renovação de reconhecimento', type: 'file', details: 'PC: Até a homologação do ato, PI: 5 anos, DF: Guarda Permanente' },
                  { id: '121.3', name: '121.3 - Desativação de cursos. Extinção de cursos', type: 'file', details: 'PC: Até a homologação do ato, PI: 5 anos, DF: Guarda Permanente' }
                ]
              },
              {
                id: '122',
                name: '122 - Planejamento e organização curricular',
                type: 'folder',
                details: 'Grupo.', // General detail
                children: [
                  { id: '122.1', name: '122.1 - Estrutura do currículo (grade ou matriz curricular)', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '122.2', name: '122.2 - Reformulação curricular', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '122.3', name: '122.3 - Disciplinas: programas didáticos', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '122.31', name: '122.31 - Oferta de disciplinas', type: 'file', details: 'PC: 2 anos, PI: N/A, DF: Eliminação' },
                  { id: '122.32', name: '122.32 - Atividades complementares', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' }
                ]
              },
              {
                id: '123',
                name: '123 - Planejamento da atividade acadêmica',
                type: 'folder',
                details: 'Grupo.', // General detail
                children: [
                  { id: '123.1', name: '123.1 - Calendário acadêmico', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '123.2', name: '123.2 - Agenda acadêmica. Guia do calouro. Guia do estudante. Manual do estudante', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' }
                ]
              },
              {
                id: '124',
                name: '124 - Colação de grau. Formatura',
                type: 'folder',
                details: 'PC: 5 anos, PI: N/A, DF: Eliminação', // Temporalidade as detail for the folder
                children: [
                  { id: '124.1', name: '124.1 - Termo ou ata de colação de grau', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' }
                ]
              },
              {
                id: '125',
                name: '125 - Vida acadêmica dos alunos dos cursos de graduação',
                type: 'folder',
                details: 'Grupo.', // General detail
                children: [
                  {
                    id: '125.1',
                    name: '125.1 - Ingresso',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.11', name: '125.11 - Processo de seleção (vestibular)', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '125.12', name: '125.12 - Reingresso. Admissão de graduado. Portador de diploma. Obtenção de novo título', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' },
                      { id: '125.13', name: '125.13 - Transferência', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '125.14', name: '125.14 - Reopção de curso. Mudança de curso. Transferência interna', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' },
                      { id: '125.19', name: '125.19 - Outras formas de ingresso', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' }
                    ]
                  },
                  {
                    id: '125.2',
                    name: '125.2 - Registros acadêmicos',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.21', name: '125.21 - Matrícula. Registro', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Eliminação' },
                      { id: '125.22', name: '125.22 - Inscrição em disciplinas. Matrícula semestral em disciplina', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Eliminação' },
                      { id: '125.23', name: '125.23 - Isenção de disciplinas. Dispensa de disciplinas. Aproveitamento de estudos', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Eliminação' },
                      { id: '125.24', name: '125.24 - Trancamento', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '125.25', name: '125.25 - Desligamento', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '125.26', name: '125.26 - Prorrogação de prazo para conclusão do curso', type: 'file', details: 'PC: 5 anos, PI: 25 anos, DF: Eliminação' }
                    ]
                  },
                  {
                    id: '125.3',
                    name: '125.3 - Avaliação acadêmica',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.31', name: '125.31 - Provas. Exames. Trabalhos (inclusive verificações suplementares)', type: 'file', details: 'PC: Devolução ao aluno após o registro das notas, PI: N/A, DF: Eliminação' },
                      { id: '125.32', name: '125.32 - Trabalho de conclusão de curso. Trabalho final de curso', type: 'file', details: 'PC: Devolução ao aluno após o registro das notas, PI: N/A, DF: Eliminação' },
                      { id: '125.321', name: '125.321 - Indicação, aceite e substituição de orientador e co-orientador', type: 'file', details: 'PC: Até o registro das notas, PI: 1 ano, DF: Eliminação' },
                      { id: '125.322', name: '125.322 - Bancas examinadoras: indicação e atuação', type: 'file', details: 'PC: Até o registro das notas, PI: 1 ano, DF: Eliminação' },
                      { id: '125.323', name: '125.323 - Prorrogação de prazo para entrega e apresentação', type: 'file', details: 'PC: Até o registro das notas, PI: 1 ano, DF: Eliminação' },
                      { id: '125.33', name: '125.33 - Registro de conteúdo programático ministrado, rendimento e frequência', type: 'file', details: 'PC: 10 anos, PI: 10 anos, DF: Eliminação' },
                      { id: '125.34', name: '125.34 - Distinção acadêmica e mérito', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' }
                    ]
                  },
                  {
                    id: '125.4',
                    name: '125.4 - Documentação acadêmica',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.41', name: '125.41 - Histórico escolar. Integralização curricular', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Guarda Permanente' },
                      { id: '125.42', name: '125.42 - Emissão de diploma', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '125.43', name: '125.43 - Assentamentos individuais dos alunos (Dossiês dos alunos)', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: *, DF: Eliminação, Obs: *O prazo total de guarda dos documentos é de 100 anos.' }
                    ]
                  },
                  {
                    id: '125.5',
                    name: '125.5 - Regime de exercício domiciliar',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.51', name: '125.51 - Aluna gestante', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 2 anos, DF: Eliminação' },
                      { id: '125.52', name: '125.52 - Aluno portador de afecções, infecções e traumatismos', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 2 anos, DF: Eliminação' }
                    ]
                  },
                  {
                    id: '125.6',
                    name: '125.6 - Monitorias. Estágios não obrigatórios. Programas de iniciação à docência',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.61', name: '125.61 - Monitorias', type: 'folder', details: 'PC: 3 anos, PI: 2 anos, DF: Guarda Permanente', children: [] },
                      { id: '125.62', name: '125.62 - Estágios não obrigatórios', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 2 anos, DF: Eliminação' },
                      { id: '125.63', name: '125.63 - Programas de iniciação à docência', type: 'folder', details: 'PC: 3 anos, PI: 2 anos, DF: Guarda Permanente', children: [] },
                      { id: '125.64', name: '125.64 - Frequência de monitores, estagiários e bolsistas', type: 'file', details: 'PC: 5 anos, PI: 47 anos, DF: Eliminação' }
                    ]
                  },
                  {
                    id: '125.7',
                    name: '125.7 - Mobilidade acadêmica. Mobilidade estudantil. Intercâmbio',
                    type: 'folder',
                    details: 'Grupo.', // General detail
                    children: [
                      { id: '125.71', name: '125.71 - Nacional', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: N/A, DF: Guarda Permanente' },
                      { id: '125.72', name: '125.72 - Internacional', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: N/A, DF: Guarda Permanente' }
                    ]
                  },
                  { id: '125.8', name: '125.8 - Regime disciplinar dos alunos: penalidades', type: 'file', details: 'PC: Até a conclusão do caso, PI: 10 anos, DF: Guarda Permanente' }
                ]
              }
            ]
          },
          {
            id: '130',
            name: '130 - Cursos de pós-graduação stricto sensu (inclusive na modalidade a distância)',
            type: 'folder',
            details: 'Subclasse.',
            children: [
              {
                id: '131',
                name: '131 - Concepção, organização e funcionamento dos cursos de pós-graduação stricto sensu',
                type: 'folder',
                details: 'Grupo.',
                children: [
                  { id: '131.1', name: '131.1 - Projeto pedagógico dos cursos', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente',
                    children: [
                      {
                        id: 'fict_131.1_01',
                        name: 'PPC Pós Stricto Sensu 2024.docx',
                        type: 'file',
                        fileType: 'docx',
                        details: 'PC: N/A, PI: N/A, DF: N/A, Obs: Minuta para aprovação.',
                        size: '870KB',
                        author: 'Secretaria Pós',
                        createdAt: '2024-02-10',
                        updatedAt: '2024-02-11',
                        isOfficial: false
                      }
                    ]
                  },
                  { id: '131.2', name: '131.2 - Criação de cursos. Criação de programas', type: 'file', details: 'PC: Até a homologação do ato, PI: 5 anos, DF: Guarda Permanente' },
                  { id: '131.21', name: '131.21 - Autorização. Reconhecimento. Renovação de reconhecimento', type: 'file', details: 'PC: Até a homologação do ato, PI: 5 anos, DF: Guarda Permanente' },
                  { id: '131.3', name: '131.3 - Desativação de cursos. Extinção de cursos', type: 'file', details: 'PC: Até a homologação do ato, PI: 5 anos, DF: Guarda Permanente' },
                  { id: '131.4', name: '131.4 - Credenciamento para orientação', type: 'file', details: 'PC: 5 anos, PI: 10 anos, DF: Eliminação' }
                ]
              },
              {
                id: '132',
                name: '132 - Planejamento e organização curricular',
                type: 'folder',
                details: 'Grupo.',
                children: [
                  { id: '132.1', name: '132.1 - Estrutura do currículo (grade ou matriz curricular)', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '132.2', name: '132.2 - Reformulação curricular (inclusive criação de novas áreas de concentração)', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '132.3', name: '132.3 - Disciplinas: programas didáticos', type: 'file', details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente' },
                  { id: '132.31', name: '132.31 - Oferta de disciplinas', type: 'file', details: 'PC: 5 anos, PI: 5 anos, DF: Eliminação' }
                ]
              },
              {
                id: '133',
                name: '133 - Planejamento da atividade acadêmica',
                type: 'file',
                details: 'PC: Enquanto vigora, PI: N/A, DF: Guarda Permanente'
              },
              {
                id: '134',
                name: '134 - Vida acadêmica dos alunos dos cursos de pós-graduação stricto sensu',
                type: 'folder',
                details: 'Grupo.',
                children: [
                  {
                    id: '134.1',
                    name: '134.1 - Ingresso',
                    type: 'folder',
                    details: 'Subgrupo.',
                    children: [
                      { id: '134.11', name: '134.11 - Processo de seleção', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '134.12', name: '134.12 - Transferência', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' },
                      { id: '134.13', name: '134.13 - Mudança de nível', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: N/A, DF: Guarda Permanente' },
                      { id: '134.19', name: '134.19 - Outras formas de ingresso (aluno especial, reintegração)', type: 'file', details: 'PC: 5 anos, PI: N/A, DF: Guarda Permanente' }
                    ]
                  },
                  {
                    id: '134.2',
                    name: '134.2 - Registros acadêmicos',
                    type: 'folder',
                    details: 'Subgrupo.',
                    children: [
                      { id: '134.21', name: '134.21 - Matrícula. Registro', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Eliminação' },
                      { id: '134.22', name: '134.22 - Inscrição em disciplinas. Matrícula semestral em disciplina', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Eliminação' },
                      { id: '134.23', name: '134.23 - Isenção de disciplinas. Dispensa de disciplinas. Aproveitamento de estudos', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Eliminação' },
                      { id: '134.24', name: '134.24 - Trancamento', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '134.25', name: '134.25 - Desligamento', type: 'folder', details: 'Subgrupo.', children: [] }
                    ]
                  },
                  {
                    id: '134.3',
                    name: '134.3 - Avaliação acadêmica',
                    type: 'folder',
                    details: 'Subgrupo.',
                    children: [
                      { id: '134.31', name: '134.31 - Provas. Exames. Trabalhos', type: 'file', details: 'PC: Devolução ao aluno após o registro das notas, PI: N/A, DF: Eliminação' },
                      { id: '134.32', name: '134.32 - Exame de qualificação', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '134.33', name: '134.33 - Defesa de dissertação e tese', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '134.34', name: '134.34 - Registro de conteúdo programático ministrado, rendimento e frequência', type: 'file', details: 'PC: 10 anos, PI: 10 anos, DF: Eliminação' }
                    ]
                  },
                  {
                    id: '134.4',
                    name: '134.4 - Documentação acadêmica',
                    type: 'folder',
                    details: 'Subgrupo.',
                    children: [
                      { id: '134.41', name: '134.41 - Histórico escolar. Integralização curricular', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 5 anos, DF: Guarda Permanente' },
                      { id: '134.42', name: '134.42 - Emissão de diploma', type: 'folder', details: 'Subgrupo.', children: [] },
                      { id: '134.43', name: '134.43 - Assentamentos individuais dos alunos (Dossiês dos alunos)', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: *, DF: Eliminação, Obs: *O prazo total de guarda dos documentos é de 100 anos.' }
                    ]
                  },
                  {
                    id: '134.5',
                    name: '134.5 - Regime de exercício domiciliar',
                    type: 'file',
                    details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 2 anos, DF: Eliminação'
                  },
                  {
                    id: '134.6',
                    name: '134.6 - Monitorias. Estágios não obrigatórios',
                    type: 'folder',
                    details: 'Subgrupo.',
                    children: [
                      { id: '134.61', name: '134.61 - Monitorias', type: 'folder', details: 'PC: 3 anos, PI: 2 anos, DF: Guarda Permanente', children: [] },
                      { id: '134.62', name: '134.62 - Estágios não obrigatórios', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: 2 anos, DF: Eliminação' },
                      { id: '134.63', name: '134.63 - Frequência de monitores e estagiários', type: 'file', details: 'PC: 5 anos, PI: 47 anos, DF: Eliminação' }
                    ]
                  },
                  {
                    id: '134.7',
                    name: '134.7 - Mobilidade acadêmica. Mobilidade estudantil. Intercâmbio',
                    type: 'folder',
                    details: 'Subgrupo.',
                    children: [
                      { id: '134.71', name: '134.71 - Nacional', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: N/A, DF: Guarda Permanente' },
                      { id: '134.72', name: '134.72 - Internacional', type: 'file', details: 'PC: Enquanto o aluno mantiver o vínculo com a instituição de ensino, PI: N/A, DF: Guarda Permanente' }
                    ]
                  },
                  { id: '134.8', name: '134.8 - Regime disciplinar dos alunos: penalidades', type: 'file', details: 'PC: Até a conclusão do caso, PI: 10 anos, DF: Guarda Permanente' }
                ]
              }
            ]
          }
        ]
      },
      { // Classe 200
        id: '200',
        name: '200 - PESQUISA E EXTENSÃO',
        type: 'folder',
        details: 'Classe Principal. Documentos relacionados a atividades de pesquisa e extensão.',
        children: [
          {
            id: '210',
            name: '210 - Normatização. Regulamentação',
            type: 'file',
            details: 'PC: Fim da vigência, PI: 5 anos (Transferência), DF: Guarda Permanente, Obs: O prazo de guarda se encerra com o fim da vigência do ato normativo.'
          },
          {
            id: '220',
            name: '220 - Programas, projetos e atividades de pesquisa',
            type: 'folder',
            details: 'Subclasse.',
            children: [
              {
                id: '221',
                name: '221 - Cadastro e acompanhamento de programas, projetos e atividades',
                type: 'file',
                details: 'PC: 5 anos, DF: Guarda Permanente, Obs: O prazo de guarda é contado a partir da aprovação do relatório final.'
              },
              {
                id: '222',
                name: '222 - Propriedade intelectual',
                type: 'folder',
                details: 'Grupo.',
                children: [
                  {
                    id: '222.1',
                    name: '222.1 - Patentes, marcas e cultivares',
                    type: 'file',
                    details: 'PC: * Fim da vigência, PI: -- (Transferência), DF: Guarda Permanente, Obs: *O prazo de guarda se encerra com o fim da vigência da patente, marca ou cultivar.'
                  },
                  {
                    id: '222.2',
                    name: '222.2 - Direitos autorais',
                    type: 'file',
                    details: 'PC: * Fim da vigência, PI: -- (Transferência), DF: Guarda Permanente, Obs: *O prazo de guarda se encerra com o fim da vigência do direito autoral.'
                  }
                ]
              },
              {
                id: '223',
                name: '223 - Bolsas e auxílios à pesquisa',
                type: 'file',
                details: 'PC: 5 anos, DF: Guarda Permanente, Obs: O prazo de guarda é contado a partir da aprovação da prestação de contas.'
              },
              {
                id: '224',
                name: '224 - Comitês e comissões de pesquisa',
                type: 'file',
                details: 'PC: 5 anos, DF: Guarda Permanente'
              }
            ]
          },
          {
            id: '230',
            name: '230 - Programas, projetos e atividades de extensão',
            type: 'folder',
            details: 'Subclasse.',
            children: [
              {
                id: '231',
                name: '231 - Cadastro e acompanhamento de programas, projetos e atividades',
                type: 'file',
                details: 'PC: 5 anos, DF: Guarda Permanente, Obs: O prazo de guarda é contado a partir da aprovação do relatório final.'
              },
              {
                id: '232',
                name: '232 - Bolsas e auxílios à extensão',
                type: 'file',
                details: 'PC: 5 anos, DF: Guarda Permanente, Obs: O prazo de guarda é contado a partir da aprovação da prestação de contas.'
              },
              {
                id: '233',
                name: '233 - Prestação de serviços à comunidade',
                type: 'file',
                details: 'PC: 5 anos, DF: Eliminação, Obs: O prazo de guarda é contado a partir da conclusão do serviço.'
              }
            ]
          },
          {
            id: '240',
            name: '240 - Intercâmbio e cooperação técnico-científica',
            type: 'file',
            details: 'PC: 5 anos, DF: Guarda Permanente, Obs: O prazo de guarda é contado a partir do encerramento do acordo ou convênio.'
          }
        ]
      },
      { // Classe 300
        id: '300',
        name: '300 - ADMINISTRAÇÃO DE PESSOAL',
        type: 'folder',
        details: 'Classe Principal. Documentos relacionados à gestão de recursos humanos.',
        children: [
            { id: '310', name: '310 - Concursos e Seleções', type: 'folder', children: [
                { id: '311', name: '311 - Edital de Concurso', type: 'file', details: 'Detalhes para 311...'}
            ] }
        ]
      },
      { // Classe 400
        id: '400',
        name: '400 - ADMINISTRAÇÃO DE MATERIAL, PATRIMÔNIO E SERVIÇOS GERAIS',
        type: 'folder',
        details: 'Classe Principal. Documentos sobre gestão de bens, materiais e serviços.',
        children: [
            { id: '410', name: '410 - Licitações e Contratos', type: 'folder', children: [
                { id: '411', name: '411 - Processo Licitatório', type: 'file', details: 'Detalhes para 411...'}
            ] }
        ]
      },
      { // Classe 500
        id: '500',
        name: '500 - ADMINISTRAÇÃO ORÇAMENTÁRIA, FINANCEIRA E CONTÁBIL',
        type: 'folder',
        details: 'Classe Principal. Documentos sobre finanças, orçamento e contabilidade.',
        children: [
            { id: '510', name: '510 - Execução Orçamentária', type: 'folder', children: [
                { id: '511', name: '511 - Relatório de Execução', type: 'file', details: 'Detalhes para 511...'}
            ] }
        ]
      }
    ];

    let dynamicTreeData = JSON.parse(JSON.stringify(treeData)); 
    let currentPathIds = []; // Array de IDs representando o caminho atual. Ex: ['000', '002']
    let currentlyListedItems = []; 

    // --- Funções Auxiliares ---
    function findNodeById(nodes, id) {
        if (!id) return { id: 'root', name: 'Raiz', type: 'folder', children: dynamicTreeData }; // Representa a raiz
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }
    
    function getIconClass(type, fileType = 'generic') {
        if (type === 'folder') {
            return 'fas fa-folder';
        } else { 
            switch (String(fileType).toLowerCase()) {
                case 'pdf': return 'fas fa-file-pdf';
                case 'doc': case 'docx': return 'fas fa-file-word';
                case 'xls': case 'xlsx': return 'fas fa-file-excel';
                case 'ppt': case 'pptx': return 'fas fa-file-powerpoint';
                case 'txt': return 'fas fa-file-alt';
                case 'jpg': case 'jpeg': case 'png': case 'gif': return 'fas fa-file-image';
                case 'zip': case 'rar': return 'fas fa-file-archive';
                default: return 'fas fa-file';
            }
        }
    }

    // --- Funções de Renderização ---
    function renderBreadcrumbs() {
        breadcrumbContainer.innerHTML = '';
        let pathSegments = [{ id: null, name: 'Raiz' }]; // Começa com a Raiz

        let currentNodes = dynamicTreeData;
        for (const nodeId of currentPathIds) {
            const node = findNodeById(currentNodes, nodeId);
            if (node) {
                pathSegments.push({ id: node.id, name: node.name });
                currentNodes = node.children || [];
            } else {
                break; 
            }
        }
        
        pathSegments.forEach((segment, index) => {
            const breadcrumbItem = document.createElement('span');
            breadcrumbItem.classList.add('breadcrumb-item');
            
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = segment.name;
            
            if (index === pathSegments.length - 1) {
                link.classList.add('active');
            } else {
                link.onclick = (e) => {
                    e.preventDefault();
                    // Navega para o ID do segmento, ou null para a raiz
                    navigateTo(segment.id);
                };
            }
            breadcrumbItem.appendChild(link);
            breadcrumbContainer.appendChild(breadcrumbItem);

            if (index < pathSegments.length - 1) {
                const separator = document.createElement('span');
                separator.classList.add('breadcrumb-separator');
                separator.innerHTML = '&nbsp;&gt;&nbsp;';
                breadcrumbContainer.appendChild(separator);
            }
        });
    }

    function renderItemListItem(itemData) {
        const listItem = document.createElement('div');
        listItem.classList.add('item-list-entry');
        listItem.dataset.id = itemData.id;
        listItem.dataset.type = itemData.type;

        // Define o padding-left baseado na profundidade atual para indentação
        // O padding base é 10px (do CSS), adicionamos 20px por nível de profundidade.
        const basePadding = 10; // Valor original do padding lateral do item-list-entry
        const indentSize = 20; // Tamanho da indentação por nível
        listItem.style.paddingLeft = `${basePadding + (currentPathIds.length * indentSize)}px`;

        const icon = document.createElement('i');
        icon.className = getIconClass(itemData.type, itemData.fileType) + ' item-icon';
        listItem.appendChild(icon);

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('item-name');
        nameSpan.textContent = itemData.name;
        listItem.appendChild(nameSpan);

        listItem.onclick = () => {
            if (itemData.type === 'folder') {
                navigateTo(itemData.id);
            } else {
                updateItemDetailsView(itemData);
                document.querySelectorAll('.item-list-entry.selected').forEach(el => el.classList.remove('selected'));
                listItem.classList.add('selected');
            }
        };
        return listItem;
    }

    function renderItemListView(searchTerm = '') {
        const currentFolderId = currentPathIds.length > 0 ? currentPathIds[currentPathIds.length - 1] : null;
        const parentNode = findNodeById(dynamicTreeData, currentFolderId);
        
        currentlyListedItems = parentNode && parentNode.children ? parentNode.children : dynamicTreeData; 
        
        let itemsToDisplay = currentlyListedItems;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            itemsToDisplay = currentlyListedItems.filter(item => item.name.toLowerCase().includes(lowerSearchTerm));
        }

        itemListContainer.innerHTML = ''; 

        if (itemsToDisplay.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = searchTerm ? 'Nenhum item encontrado.' : 'Esta pasta está vazia.';
            emptyMessage.classList.add('empty-list-message');
            itemListContainer.appendChild(emptyMessage);
        } else {
            itemsToDisplay.forEach(item => {
                const listItemElement = renderItemListItem(item);
                itemListContainer.appendChild(listItemElement);
            });
        }
        renderBreadcrumbs();
        if (!itemsToDisplay.some(item => document.querySelector(`.item-list-entry[data-id='${item.id}']`)?.classList.contains('selected'))) {
            clearItemDetailsView(); 
        }
    }
    
    function updateItemDetailsView(itemData) {
        if (!itemData || itemData.type === 'folder') {
            clearItemDetailsView();
            return;
        }
        contentTitle.textContent = itemData.name;
        
        let detailsDisplayHtml = `<p><strong>ID:</strong> ${itemData.id}</p>`;

        if (itemData.details) {
            let tempDetails = itemData.details;
            let pcText = '', piText = '', dfText = '', obsText = '';
            let isTTDIFESFormat = false;

            // Tenta extrair usando formato TTD IFES (DG, Intermediária, Permanente)
            if (tempDetails.match(/DG:|Permanente:|Intermediária:/i)) {
                isTTDIFESFormat = true;
                pcText = tempDetails.match(/DG:(.*?)(?=\. Intermediária:|\. Permanente:|\. Observações:|$)/i)?.[1]?.trim() || 'N/A';
                piText = tempDetails.match(/Intermediária:(.*?)(?=\. Permanente:|\. Observações:|$)/i)?.[1]?.trim() || 'N/A';
                dfText = tempDetails.match(/Permanente:(.*?)(?=\. Observações:|$)/i)?.[1]?.trim() || 'N/A';
                obsText = tempDetails.match(/Observações:(.*)/i)?.[1]?.trim() || '';
            } 
            // Tenta extrair usando formato original PC, PI, DF (fallback)
            else if (tempDetails.match(/PC:/i)) {
                pcText = tempDetails.match(/PC:(.*?)(?=PI:|DF:|Obs:|$)/i)?.[1]?.trim() || 'N/A';
                piText = tempDetails.match(/PI:(.*?)(?=DF:|Obs:|$)/i)?.[1]?.trim() || 'N/A';
                dfText = tempDetails.match(/DF:(.*?)(?=Obs:|$)/i)?.[1]?.trim() || 'N/A';
                obsText = tempDetails.match(/Obs:(.*)/i)?.[1]?.trim() || '';
            }

            if (pcText || piText || dfText || obsText) {
                detailsDisplayHtml += '<div class="temporalidade-container">';
                if (pcText) {
                    const labelPC = isTTDIFESFormat ? 'Prazo Corrente (DG):' : 'Prazo Corrente (PC):';
                    detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_PC_DG}">${labelPC}</span> <span class="temporalidade-valor">${pcText}</span></div>`;
                }
                if (piText) {
                    detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_PI}">Prazo Intermediário (PI):</span> <span class="temporalidade-valor">${piText}</span></div>`;
                }
                if (dfText) {
                    const labelDF = isTTDIFESFormat ? 'Destinação Final (Permanente):' : 'Destinação Final (DF):';
                    detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_DF}">${labelDF}</span> <span class="temporalidade-valor">${dfText}</span></div>`;
                }
                if (obsText) {
                    detailsDisplayHtml += `<div class="temporalidade-item"><span class="temporalidade-label" title="${EXPLICACAO_OBS}">Observações:</span> <span class="temporalidade-valor">${obsText}</span></div>`;
                }
                detailsDisplayHtml += '</div>';
            } else {
                 // Se não conseguiu parsear, mostra a string original formatada como antes (fallback)
                const formattedGenericDetails = tempDetails
                    .replace(/PC:/g, '<strong>Prazo Corrente (PC):</strong>')
                    .replace(/PI:/g, '<strong>Prazo Intermediário (PI):</strong>')
                    .replace(/DF:/g, '<strong>Destinação Final (DF):</strong>')
                    .replace(/DG:/g, '<strong>Prazo Corrente (DG):</strong>')
                    .replace(/Intermediária:/g, '<strong>Prazo Intermediário:</strong>')
                    .replace(/Permanente:/g, '<strong>Destinação Final (Permanente):</strong>')
                    .replace(/Obs:/g, '<strong>Observações:</strong>')
                    .replace(/\n/g, '<br>');
                detailsDisplayHtml += `<div class="details-fallback">${formattedGenericDetails}</div>`;
            }

        } else {
            detailsDisplayHtml += '<p>Sem detalhes de temporalidade especificados.</p>';
        }
        contentDetails.innerHTML = detailsDisplayHtml;

        // Modificado para adicionar botão de Download se for arquivo
        let actionsHtml = '<button class="action-btn"><i class="fas fa-edit"></i> Editar Item TTD (Protótipo)</button>';
        if (itemData.type === 'file') {
            // Verifica se é um arquivo TTD ou um arquivo fictício (que não terá children)
            if (!itemData.children || itemData.children.length === 0) { 
                actionsHtml += ' <button class="action-btn"><i class="fas fa-download"></i> Baixar (Protótipo)</button>';
            }
        }
        contentActions.innerHTML = actionsHtml;

        auditInfoContainer.innerHTML = `<p>Auditoria para ${itemData.name} (Protótipo)</p>`;
    }

    function clearItemDetailsView() {
        contentTitle.textContent = 'Detalhes do Item';
        contentDetails.innerHTML = '<p>Selecione um item na lista para ver os detalhes.</p>';
        contentActions.innerHTML = '';
        auditInfoContainer.innerHTML = '<p>Informações de auditoria.</p>';
        document.querySelectorAll('.item-list-entry.selected').forEach(el => el.classList.remove('selected'));
    }

    // --- Navegação ---
    function navigateTo(folderId) {
        if (folderId === null || folderId === 'root') { // Navegando para a raiz
            currentPathIds = [];
        } else {
            const node = findNodeById(dynamicTreeData, folderId);
            if (node && node.type === 'folder') {
                // Para construir o caminho, precisamos garantir que folderId é filho do último item em currentPathIds
                // ou se estamos subindo na hierarquia.
                const lastCurrentId = currentPathIds.length > 0 ? currentPathIds[currentPathIds.length -1] : null;
                
                if (currentPathIds.includes(folderId)) {
                    // Navegando para cima via breadcrumb
                    currentPathIds = currentPathIds.slice(0, currentPathIds.indexOf(folderId) + 1);
                } else {
                    // Navegando para baixo
                    // Verificamos se o folderId é filho do nó atual (se houver)
                    const parentOfNewFolder = lastCurrentId ? findNodeById(dynamicTreeData, lastCurrentId) : { children: dynamicTreeData };
                    if (parentOfNewFolder && parentOfNewFolder.children && parentOfNewFolder.children.some(child => child.id === folderId)) {
                        currentPathIds.push(folderId);
                    } else {
                        // Se não for filho direto, ou estamos saltando, resetamos e construímos o caminho do zero (poderia ser melhorado)
                        currentPathIds = [];
                        let pathSegments = [];
                        function buildPath(targetId, nodes, currentBuildPath) {
                            for (let n of nodes) {
                                if (n.id === targetId) return [...currentBuildPath, n.id];
                                if (n.children) {
                                    let foundPath = buildPath(targetId, n.children, [...currentBuildPath, n.id]);
                                    if (foundPath) return foundPath;
                                }
                            }
                            return null;
                        }
                        pathSegments = buildPath(folderId, dynamicTreeData, []);
                        if(pathSegments) currentPathIds = pathSegments;
                        else { console.error('Não foi possível construir o caminho para', folderId); currentPathIds = [];}
                    }
                }
            } else if (node && node.type !== 'folder') {
                 updateItemDetailsView(node);
                 return; // Não navega, apenas mostra detalhes
            } else {
                console.error("Nó não encontrado ou não é uma pasta:", folderId);
                currentPathIds = []; // Volta para a raiz em caso de erro
            }
        }
        currentListSearchInput.value = '';
        renderItemListView();
    }

    // --- Event Listeners ---
    currentListSearchInput.addEventListener('input', (e) => {
        renderItemListView(e.target.value);
    });

    // --- Inicialização ---
    navigateTo(null); // Inicia na raiz

}); 