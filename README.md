# GED FAEP - Sistema de Gestão Eletrônica de Documentos

Sistema de Gestão Eletrônica de Documentos (GED) desenvolvido para a FAEP, permitindo o gerenciamento eficiente de documentos acadêmicos e administrativos.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Backend
- Node.js com Express
- PostgreSQL como banco de dados
- Autenticação JWT
- Upload e gerenciamento de arquivos
- Controle de acesso baseado em roles

### Frontend
- React com TypeScript
- Material-UI para interface
- React Query para gerenciamento de estado
- React Router para navegação

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- NPM ou Yarn

## Configuração do Ambiente de Desenvolvimento

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```
Edite o arquivo .env com suas configurações locais

4. Execute as migrations:
```bash
npm run migrate
```

5. Inicie o servidor:
```bash
npm run dev
```

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```
Edite o arquivo .env com suas configurações locais

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Funcionalidades Principais

- Autenticação e autorização de usuários
- Upload e versionamento de documentos
- Organização hierárquica de pastas
- Busca avançada de documentos
- Controle de acesso baseado em roles (Admin, Secretaria, Coordenador)
- Registro de atividades (logs)

## Deployment

O sistema está configurado para deploy usando:
- Backend: Railway
- Frontend: Vercel
- Banco de Dados: PostgreSQL (Railway)

## Licença

Este projeto é proprietário e de uso exclusivo da FAEP.