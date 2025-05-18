# Protótipo de Sistema de Gestão Eletrônica de Documentos (GED) para Instituição de Ensino

## Descrição Curta

Este projeto é um protótipo interativo de um Sistema de Gestão Eletrônica de Documentos (GED) focado nas necessidades operacionais de uma instituição de ensino superior e técnico privada. O sistema demonstra funcionalidades chave como navegação hierárquica de pastas, gerenciamento de metadados de arquivos (incluindo temporalidade e descarte), e simulação do ciclo de vida documental (criação, edição, eliminação lógica).

## Status do Projeto

ℹ️ **Protótipo em Desenvolvimento Ativo**

## Objetivos do Protótipo

* Validar a experiência do usuário (UX) para navegação, busca e gerenciamento de documentos em um ambiente que pode conter grande volume de informações.
* Demonstrar a apresentação clara e completa de metadados de arquivos, incluindo informações cruciais de temporalidade (Prazos Corrente, Intermediário, Destinação Final) e rastreabilidade de ações.
* Simular as operações básicas de CRUD (Create, Read, Update, Delete) e o ciclo de vida dos documentos (versionamento, marcação como eliminado) em um ambiente controlado.
* Servir como base para discussões e refinamento de requisitos para um futuro sistema GED de produção.

## Funcionalidades Implementadas / Em Implementação

* **Navegação em Árvore de Pastas:**
    * Visualização hierárquica da estrutura de pastas (TTD IFES).
    * Expansão e retração de nós individuais da árvore.
    * Botões globais "Expandir Tudo" e "Retrair Tudo" para a árvore.
* **Visualização de Conteúdo de Pastas:**
    * Exibição da lista de arquivos (mockados) contidos na pasta selecionada em formato de tabela.
    * Filtro dinâmico por nome e descrição do arquivo na lista.
* **Detalhes Completos por Arquivo (Exibidos na Tabela):**
    * Nome do Arquivo (com ícone de tipo)
    * Descrição
    * Data de Anexo (simulada, `attachmentDate`)
    * Data da Última Modificação (simulada, `lastModifiedDate`)
    * Versão do Documento (simulada, `version`)
    * Usuário Responsável (simulado, `user`)
    * Status do Documento (simulado: "Ativo", "Eliminado")
    * Detalhes da Eliminação (via tooltip, se aplicável): Data, Usuário, Motivo.
    * **Informações de Temporalidade (derivadas do contexto da pasta/classificação TTD):**
        * Prazo Corrente (PC)
        * Prazo Intermediário (PI)
        * Destinação Final (DF)
        * Observações (Obs.)
* **Ações em Arquivos (Parcialmente Implementadas/Planejadas):**
    * **Download:** Simulação do download de um arquivo (implementado).
    * **Editar:** (Planejado) Simulação de edição com atualização de versão, data de modificação e usuário.
    * **Marcar como Eliminado:** (Planejado) Simulação de eliminação lógica com confirmação, motivo, e atualização de metadados.
* **Inserção de Novo Documento (Planejada):**
    * (Planejado) Botão para iniciar o processo, formulário para metadados básicos, adição à lista.
* **Melhorias de UX (Planejadas):**
    * Paginação para listas de arquivos grandes.

## Estrutura de Dados Chave (Metadados Principais dos Arquivos Simulados em `frontend/script.js`)

*   **Arquivos (objetos JavaScript):**
    *   `id`: (string) Identificador único do arquivo (ex: `file-PastaNome-1`).
    *   `name`: (string) Nome do arquivo (ex: `Relatorio_Financeiro_v2.pdf`).
    *   `description`: (string) Descrição breve do arquivo.
    *   `attachmentDate`: (string) Data de anexo formatada (DD/MM/AAAA).
    *   `lastModifiedDate`: (string) Data da última modificação formatada (DD/MM/AAAA HH:MM).
    *   `version`: (string) Versão do arquivo (ex: `v1.2`).
    *   `user`: (string) Nome do usuário da última modificação/anexo.
    *   `status`: (string) "Ativo" ou "Eliminado".
    *   `eliminationDetails`: (object | null) Se `status` for "Eliminado":
        *   `date`: (string) Data da eliminação (DD/MM/AAAA).
        *   `reason`: (string) Motivo da eliminação.
        *   `responsible`: (string) Usuário que eliminou.
    *   `type`: (string) Atualmente fixo como `'file'`.
    *   *Nota: Informações de Temporalidade (PC, PI, DF, Obs) são derivadas dinamicamente do item de classificação TTD pai da pasta selecionada, não armazenadas diretamente em cada objeto de arquivo.*

## Tecnologias Utilizadas no Protótipo Frontend

*   **Linguagens:** HTML5, CSS3, JavaScript (ES6+)
*   **Estrutura:** Arquivos estáticos (`index.html`, `style.css`, `script.js`).
*   **Dados:** Mock data (objetos JavaScript) definidos diretamente em `frontend/script.js`.
*   **Estilização:** CSS puro.
*   **Ícones:** Font Awesome (via CDN referenciada no `index.html`).
*   **Bibliotecas UI:** Nenhuma biblioteca de componentes UI externa (como React, Vue, Angular, etc.) está sendo utilizada no frontend no momento.

## Backend (Configurado Separadamente)

Este protótipo frontend interage (ou interagirá) com um backend Node.js/Express com PostgreSQL, implantado no Railway. A configuração e desenvolvimento do backend são tratados em um contexto separado. Este README foca primariamente no protótipo frontend.

## Como Executar o Protótipo Frontend

1.  **Clone o repositório (se ainda não o fez):**
    ```bash
    git clone [COLOQUE_A_URL_DO_SEU_REPOSITORIO_AQUI]
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd [NOME_DA_PASTA_DO_PROJETO_GED_FAEP]
    ```
3.  **Abra o arquivo principal no navegador:**
    *   Navegue até a pasta `frontend`.
    *   Abra o arquivo `index.html` diretamente em seu navegador web (Ex: Chrome, Firefox, Edge).

4.  **(Opcional) Use um servidor HTTP local para desenvolvimento:**
    Se preferir servir os arquivos através de um servidor local (útil para evitar algumas restrições de `file:///` e simular um ambiente web mais real):
    *   Certifique-se de ter o Python instalado.
    *   Abra seu terminal/prompt de comando.
    *   Navegue até a pasta `frontend` do projeto:
        ```bash
        cd frontend
        ```
    *   Execute um dos seguintes comandos (dependendo da sua versão do Python):
        ```bash
        # Python 3.x
        python -m http.server
        # Python 2.x
        # python -m SimpleHTTPServer
        ```
    *   Abra seu navegador e acesse `http://localhost:8000` (ou a porta indicada pelo servidor).

## Estrutura do Projeto

    /
    ├── backend/                # Código do backend (Node.js, Express, Prisma, etc.)
    │   ├── prisma/
    │   ├── scripts/
    │   ├── src/
    │   ├── .env.example
    │   ├── package.json
    │   └── ...
    ├── frontend/               # Código do protótipo frontend
    │   ├── assets/             # Para imagens, ícones locais (se houver)
    │   ├── index.html          # Estrutura principal da página
    │   ├── script.js           # Lógica JavaScript do frontend
    │   └── style.css           # Estilos CSS
    ├── .gitignore
    └── README.md               # Este arquivo

## Próximos Passos / Funcionalidades Planejadas (Frontend)

*   Implementar paginação para a lista de arquivos.
*   Implementar simulação completa de "Editar Documento".
*   Implementar simulação completa de "Marcar como Eliminado" com modal de confirmação e motivo.
*   Implementar simulação de "Inserir Novo Documento" com formulário/modal.
*   (Opcional) Busca por nome de pasta na árvore.
*   (Opcional) Simulação de diferentes perfis de usuário com permissões distintas.
*   (Opcional) Histórico de versões mais detalhado.

## Contribuição

[Indicar se é um projeto interno ou aberto a contribuições. Se aberto, detalhar como contribuir.]

## Licença

[Especificar a licença do projeto. Ex: "Todos os direitos reservados."]