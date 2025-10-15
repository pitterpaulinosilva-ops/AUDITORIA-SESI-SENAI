# Documento de Requisitos do Produto - AuditPro

## 1. Product Overview

O AuditPro é um SaaS completo para gestão de auditorias internas de processos e qualidade, oferecendo uma plataforma integrada para planejamento, execução e acompanhamento de auditorias empresariais. O sistema resolve a complexidade da gestão manual de auditorias, proporcionando maior eficiência, rastreabilidade e conformidade regulatória para empresas de todos os portes que necessitam de controle rigoroso de qualidade e processos.

O produto visa capturar o mercado crescente de compliance e qualidade empresarial, oferecendo uma solução moderna e acessível que substitui planilhas e processos manuais por uma plataforma digital robusta e intuitiva.

## 2. Core Features

### 2.1 User Roles (Implementação Futura)

*Nota: Na fase inicial do MVP, o sistema funcionará sem autenticação, permitindo acesso direto com permissões completas. O sistema de usuários será implementado em versões futuras.*

| Role                   | Implementação Futura                 | Core Permissions                                                              |
| ---------------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| Usuário Padrão (Atual) | Acesso direto sem login              | Acesso completo a todas as funcionalidades do sistema                         |
| Auditor (Futuro)       | Convite por email do administrador   | Pode executar auditorias, registrar não conformidades, capturar evidências    |
| Coordenador (Futuro)   | Cadastro aprovado pelo administrador | Pode planejar auditorias, alocar recursos, gerar relatórios                   |
| Administrador (Futuro) | Cadastro inicial do sistema          | Acesso completo: gerenciar usuários, configurar checklists, definir critérios |
| Visualizador (Futuro)  | Convite com permissão limitada       | Apenas visualizar dashboards e relatórios finalizados                         |

### 2.2 Feature Module

Nosso sistema de auditoria interna consiste nas seguintes páginas principais:

1. **Dashboard Principal**: painel de controle com KPIs críticos, gráficos interativos e filtros dinâmicos
2. **Planejamento de Auditorias**: calendário visual, alocação de recursos com drag-and-drop
3. **Gestão de Auditorias**: listagem, cadastro e execução de auditorias
4. **Execução de Auditoria**: formulários de campo, checklists e captura de evidências
5. **Não Conformidades**: registro, classificação e acompanhamento de não conformidades
6. **Editor de Checklists**: criação e versionamento de templates de auditoria
7. **Relatórios**: geração, personalização e exportação de relatórios
8. **Configurações**: gerenciamento de usuários, critérios e parâmetros do sistema

### 2.3 Page Details

| Page Name             | Module Name            | Feature description                                                                                                                                        |
| --------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard Principal   | KPIs Críticos          | Exibir métricas essenciais: total de auditorias, taxa de conformidade, não conformidades pendentes, pontuação média                                        |
| Dashboard Principal   | Gráficos Interativos   | Renderizar gráficos de pizza (distribuição por setor), barras (auditorias por período), linha do tempo (evolução da qualidade), heatmap (setores críticos) |
| Dashboard Principal   | Filtros Dinâmicos      | Filtrar dados por período, setor, tipo de auditoria, status, auditor responsável                                                                           |
| Planejamento          | Calendário Visual      | Visualizar cronograma mensal/semanal de auditorias, arrastar eventos para reagendar                                                                        |
| Planejamento          | Alocação de Recursos   | Gerenciar disponibilidade de auditores e equipamentos via drag-and-drop, validar conflitos de agenda                                                       |
| Gestão de Auditorias  | Listagem de Auditorias | Exibir tabela com ID, título, tipo, setor, auditor, data, status, pontuação e ações disponíveis                                                            |
| Gestão de Auditorias  | Cadastro de Auditoria  | Criar nova auditoria definindo escopo, checklist, responsáveis, cronograma                                                                                 |
| Execução de Auditoria | Formulários de Campo   | Preencher checklists estruturados, registrar observações, marcar conformidades                                                                             |
| Execução de Auditoria | Captura Multimídia     | Fotografar evidências via smartphone, comprimir imagens automaticamente, anexar documentos                                                                 |
| Execução de Auditoria | Pontuação Automática   | Calcular score baseado em critérios pré-definidos, gerar classificação de risco                                                                            |
| Não Conformidades     | Registro de NC         | Documentar não conformidades com descrição, classificação, prazo, responsável                                                                              |
| Não Conformidades     | Plano de Ação          | Definir ações corretivas, prazos, responsáveis, acompanhar implementação                                                                                   |
| Editor de Checklists  | Estrutura Hierárquica  | Criar categorias, subcategorias e itens de verificação com pesos específicos                                                                               |
| Editor de Checklists  | Versionamento          | Manter histórico de alterações, comparar versões, ativar/desativar templates                                                                               |
| Relatórios            | Modelos Padrão         | Gerar relatórios executivos, detalhados, de não conformidades, comparativos                                                                                |
| Relatórios            | Personalização         | Customizar layout, incluir/excluir seções, definir filtros específicos                                                                                     |
| Relatórios            | Exportação             | Exportar em PDF com formatação profissional, Excel para análise de dados                                                                                   |
| Configurações         | Gestão de Usuários     | Cadastrar, editar, desativar usuários, definir permissões por perfil                                                                                       |
| Configurações         | Critérios de Avaliação | Configurar pesos, fórmulas de cálculo, escalas de pontuação                                                                                                |

## 3. Core Process

**Fluxo Principal (MVP sem Autenticação):**
O usuário acessa o sistema diretamente no dashboard principal, onde pode visualizar KPIs, criar e gerenciar auditorias, configurar checklists, executar auditorias via mobile, registrar não conformidades e gerar relatórios. Todas as funcionalidades estão disponíveis sem restrições de acesso.

**Fluxos Futuros (Com Sistema de Usuários):**

**Fluxo do Administrador:**
O administrador acessa o sistema, configura checklists e critérios de avaliação, cadastra usuários e define permissões. Monitora o dashboard para acompanhar KPIs gerais e gera relatórios estratégicos.

**Fluxo do Coordenador:**
O coordenador planeja auditorias no calendário, aloca recursos (auditores e equipamentos), define cronogramas e acompanha o progresso das auditorias em andamento através do dashboard.

**Fluxo do Auditor:**
O auditor recebe notificação de auditoria agendada, acessa a execução via mobile, preenche checklists, captura fotos de evidências, registra não conformidades e finaliza a auditoria com pontuação automática.

**Fluxo do Visualizador:**
O visualizador acessa dashboards e relatórios finalizados para acompanhar indicadores de qualidade e conformidade de sua área de responsabilidade.

```C++
graph TD
  A[Acesso Direto] --> B[Dashboard Principal]
  B --> C[Planejamento]
  B --> D[Gestão de Auditorias]
  B --> E[Relatórios]
  
  C --> F[Calendário Visual]
  C --> G[Alocação de Recursos]
  
  D --> H[Lista de Auditorias]
  H --> I[Execução de Auditoria]
  I --> J[Checklists]
  I --> K[Captura de Evidências]
  I --> L[Registro de NC]
  
  E --> M[Modelos de Relatório]
  M --> N[Exportação PDF/Excel]
  
  B --> O[Editor de Checklists]
  B --> P[Configurações]
```

## 4. User Interface Design

### 4.1 Design Style

* **Cores Primárias**: Azul corporativo (#2563EB) para elementos principais, Verde (#059669) para status positivos

* **Cores Secundárias**: Cinza neutro (#6B7280) para textos, Vermelho (#DC2626) para alertas e não conformidades

* **Estilo de Botões**: Rounded corners (8px), sombras sutis, estados hover com transições suaves

* **Tipografia**: Inter ou similar, tamanhos 14px (corpo), 16px (subtítulos), 24px+ (títulos)

* **Layout**: Design baseado em cards com espaçamento generoso, navegação lateral retrátil

* **Ícones**: Lucide React ou Heroicons, estilo outline para consistência visual

### 4.2 Page Design Overview

| Page Name            | Module Name        | UI Elements                                                                                               |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| Dashboard Principal  | KPIs Cards         | Cards com ícones coloridos, números grandes, indicadores de tendência (↑↓), fundo branco com bordas sutis |
| Dashboard Principal  | Gráficos           | Paleta de cores consistente, tooltips informativos, legendas claras, responsividade para mobile           |
| Planejamento         | Calendário         | Interface similar ao Google Calendar, cores por tipo de auditoria, drag-and-drop visual                   |
| Gestão de Auditorias | Tabela             | Zebra striping, ações em dropdown, badges coloridos para status, paginação moderna                        |
| Execução             | Formulários Mobile | Inputs grandes para touch, checkboxes visuais, botões de ação destacados                                  |
| Execução             | Captura de Fotos   | Interface de câmera nativa, preview de imagens, indicador de compressão                                   |
| Relatórios           | Visualização       | Preview em tempo real, controles de customização em sidebar, botões de exportação prominentes             |

### 4.3 Responsiveness

O produto segue abordagem mobile-first com breakpoints em 640px (sm), 768px (md), 1024px (lg) e 1280px (xl). A interface prioriza touch interactions em dispositivos móveis, com elementos de pelo menos 44px de altura. O layout se adapta de navegação bottom-tab em mobile para sidebar em desktop, mantendo funcionalidades essenciais acessíveis em todas as telas.
