# AuditPro - Sistema de Auditoria Interna

Sistema completo de gestão de auditorias internas desenvolvido com React, TypeScript e Vite.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com KPIs e métricas principais
- **Planejamento**: Calendário de auditorias e gestão de cronogramas
- **Checklists**: Criação e execução de checklists de auditoria
- **Não Conformidades**: Registro e acompanhamento de não conformidades
- **Relatórios**: Geração de relatórios detalhados e dashboards
- **Configurações**: Personalização do sistema

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Chart.js + Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **PDF Generation**: jsPDF

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🧪 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter
- `npm run check` - Verifica tipos TypeScript

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── checklist/      # Componentes de checklist
│   ├── non-conformities/ # Componentes de não conformidades
│   ├── planning/       # Componentes de planejamento
│   ├── reports/        # Componentes de relatórios
│   └── settings/       # Componentes de configurações
├── pages/              # Páginas da aplicação
├── store/              # Estado global (Zustand)
├── types/              # Definições de tipos TypeScript
├── hooks/              # Custom hooks
└── lib/                # Utilitários
```

## 🔧 Configuração

O projeto está configurado com:

- **TypeScript**: Configuração otimizada para React
- **ESLint**: Regras de qualidade de código
- **Tailwind CSS**: Framework de CSS utilitário
- **Vite**: Build tool moderno e rápido

## 📊 Status do Projeto

✅ **Build**: Compilação sem erros  
✅ **TypeScript**: Verificação de tipos OK  
✅ **Dependências**: Todas atualizadas e seguras  
✅ **Navegação**: Rotas funcionando corretamente  
✅ **Componentes**: Renderização sem erros  
✅ **Funcionalidades**: Módulos principais testados  

## 🚀 Deploy

O projeto está pronto para deploy em:

- **Vercel**: Deploy automático via GitHub
- **Netlify**: Build e deploy contínuo
- **GitHub Pages**: Hospedagem estática

## 📝 Licença

Este projeto está sob a licença MIT.
