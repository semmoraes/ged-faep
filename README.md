# Protótipo GED FAEP - Sistema de Gerenciamento Eletrônico de Documentos

Este repositório contém o código-fonte do protótipo do Sistema de Gerenciamento Eletrônico de Documentos (GED) para a FAEP. O foco atual é no desenvolvimento do frontend para simular as interações e funcionalidades chave de um GED, com ênfase na Tabela de Temporalidade de Documentos (TTD).

## Visão Geral do Protótipo

O protótipo visa demonstrar:

*   Navegação hierárquica baseada na Tabela de Temporalidade de Documentos.
*   Visualização de documentos (mockados) dentro de cada classificação da TTD.
*   Exibição de metadados detalhados dos documentos, incluindo informações de temporalidade (Prazo Corrente, Prazo Intermediário, Destinação Final).
*   Simulação de ciclo de vida do documento:
    *   Adição de novos documentos (mockados) a uma classificação TTD.
    *   "Cancelamento" lógico de documentos com motivo.
    *   Diferenciação visual e funcional entre documentos "Vigentes" e "Arquivados" (Cancelados, Vencidos).
    *   Simulação de vencimento de documentos baseado em uma data de validade.
*   Persistência de dados da sessão utilizando o `localStorage` do navegador.
*   Interface com árvore de pastas lateral e área de conteúdo principal para visualização de arquivos e detalhes da TTD.
*   Painel da árvore de pastas redimensionável.
*   Busca de arquivos dentro da pasta TTD selecionada.
*   Busca global de documentos em todos os metadados.
*   Layout responsivo que ocupa 100% da tela.

## Tecnologias Utilizadas (Frontend)

*   **HTML5:** Estrutura da aplicação.
*   **CSS3:** Estilização e layout.
*   **JavaScript (Vanilla):** Lógica da aplicação, manipulação do DOM, interações e simulação de dados.
*   **Font Awesome:** Ícones.

## Como Executar o Protótipo

1.  Clone este repositório:
    ```bash
    git clone <url_do_repositorio>
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd <nome_da_pasta_do_projeto>
    ```
3.  Abra o arquivo `frontend/index.html` diretamente em um navegador web moderno (Chrome, Firefox, Edge, Safari).

Alternativamente, para uma experiência mais próxima de um ambiente de desenvolvimento web, você pode servir a pasta `frontend` usando um servidor HTTP simples. Se você tiver Python instalado:

*   **Python 3:**
    ```bash
    cd frontend
    python -m http.server
    ```
*   Acesse `http://localhost:8000` (ou a porta indicada) no seu navegador.

## Estrutura do Projeto (Simplificada)

```
GED_FAEP/
├── backend/         # (Configurado anteriormente, mas não diretamente usado pelo protótipo frontend atual para persistência de dados)
│   ├── prisma/
│   ├── scripts/
│   └── src/
├── frontend/
│   ├── index.html   # Arquivo principal da interface
│   ├── style.css    # Folha de estilos
│   └── script.js    # Lógica JavaScript do frontend
└── README.md        # Este arquivo
```

## Persistência de Dados no Protótipo GED FAEP

### Situação Atual

Este protótipo do sistema GED FAEP utiliza o **`localStorage` do navegador web** para simular a persistência de dados. Isso inclui:

*   A estrutura hierárquica da Tabela de Temporalidade de Documentos (TTD), que funciona como o sistema de pastas.
*   Os metadados de todos os documentos (mockados) criados e associados às classificações TTD.
*   Quaisquer alterações realizadas pelo usuário durante a sessão, como adição de novos documentos, cancelamento de documentos existentes, e modificações simuladas.

**Limitações do `localStorage`:**

A abordagem com `localStorage` é altamente eficaz para fins de prototipagem rápida e demonstração de funcionalidades em um ambiente de usuário único. No entanto, possui limitações intrínsecas que o tornam inadequado para uma aplicação de produção completa:

*   **Capacidade de Armazenamento Limitada:** O `localStorage` geralmente tem um limite de armazenamento de 5MB a 10MB por domínio, o que é insuficiente para um grande volume de metadados ou, crucialmente, para os próprios arquivos de documentos.
*   **Dados Restritos ao Navegador/Máquina:** Os dados salvos no `localStorage` são específicos do navegador e do perfil de usuário na máquina onde a aplicação foi acessada. Eles não são compartilhados entre diferentes navegadores, máquinas ou usuários.
*   **Não é uma Solução Multiusuário:** Não oferece suporte para acesso concorrente, colaboração ou gerenciamento de permissões para múltiplos usuários.
*   **Segurança e Backup:** Não fornece mecanismos robustos de segurança de dados, controle de acesso granular ou estratégias de backup centralizadas.
*   **Gerenciamento de Arquivos Binários:** O `localStorage` não é projetado para armazenar arquivos binários (como PDFs, DOCXs, etc.) de forma eficiente ou prática.

### Próximos Passos para Persistência Real e Funcionalidades Avançadas

A pergunta "isso é possível já estar conectado a um banco de dados para que os documentos possam e comecem ser anexados e guardados no banco de dados?" é fundamental para a evolução do protótipo para um sistema funcional.

**Resposta:** Para que o sistema GED FAEP possa anexar, guardar, versionar e gerenciar documentos de forma robusta, segura, escalável e acessível por múltiplos usuários (com diferentes níveis de permissão), a **integração com um serviço de backend dedicado, um sistema de banco de dados e uma solução de armazenamento de arquivos é essencial.** Esta transição representaria uma próxima fase significativa no desenvolvimento, transformando o protótipo atual em uma aplicação de produção completa e confiável.

**Componentes Necessários para uma Solução Completa (Visão Geral):**

1.  **Desenvolvimento de Backend (Serviço de API):**
    *   **Responsabilidade:** Orquestrar toda a lógica de negócios, segurança e comunicação com o banco de dados e o sistema de armazenamento de arquivos.
    *   **Funcionalidades:**
        *   APIs RESTful (ou GraphQL) para operações CRUD (Criar, Ler, Atualizar, Deletar) em pastas (classificações TTD) e metadados de documentos.
        *   Gerenciamento de upload e download de arquivos.
        *   Controle de versionamento de documentos.
        *   Autenticação e autorização de usuários (controle de acesso).
        *   Lógica para aplicar regras da TTD (prazos, destinação).
        *   Registro de logs de auditoria.
        *   Busca avançada nos metadados e, potencialmente, indexação de conteúdo de arquivos.
    *   **Tecnologias Sugeridas:** Node.js com Express.js (mantendo a linguagem JavaScript/TypeScript do frontend), Python com Django/Flask, Java com Spring Boot, C# com .NET Core, etc.

2.  **Banco de Dados (para Metadados e Estrutura):**
    *   **Responsabilidade:** Armazenar de forma estruturada e eficiente todos os metadados dos documentos, a estrutura da TTD, informações de usuários, permissões, logs de auditoria, e outros dados relacionais.
    *   **Tecnologias Sugeridas:**
        *   **Relacionais (SQL):** PostgreSQL (altamente recomendado pela robustez e funcionalidades), MySQL, SQL Server.
        *   **NoSQL (Documento):** MongoDB (pode ser uma opção se a flexibilidade do esquema for um grande requisito, mas bancos relacionais são geralmente preferidos para a complexidade de metadados de GED).

3.  **Armazenamento de Arquivos (para Binários):**
    *   **Responsabilidade:** Guardar os arquivos de documentos em si (PDFs, DOCXs, XLSX, imagens, etc.).
    *   **Tecnologias Sugeridas:**
        *   **Serviços de Armazenamento em Nuvem:** AWS S3 (Simple Storage Service), Google Cloud Storage, Azure Blob Storage. Estes são escaláveis, duráveis e oferecem integrações facilitadas.
        *   **Soluções Self-Hosted:** MinIO (compatível com API S3, pode ser hospedado localmente), ou diretamente no sistema de arquivos do servidor de backend (menos recomendado para escalabilidade e gerenciamento em produção).

**Para o Protótipo Atual:**

Reafirmamos que, para manter a agilidade e o foco nas funcionalidades de interface e experiência do usuário nesta fase de prototipação, continuaremos utilizando o `localStorage`. A transição para uma arquitetura com backend e banco de dados será planejada e executada como uma fase subsequente e mais extensa do projeto, caso haja a decisão de evoluir o protótipo para uma solução de produção.