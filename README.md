# SRM Asset — Frontend (SRM Platform)

Este é o frontend da plataforma de antecipação de recebíveis da **SRM Asset**. Uma aplicação moderna construída com **Next.js 15**, focada em performance financeira, segurança e uma experiência de usuário sênior.

---

## 🚀 Tecnologias e Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Vanilla CSS (Design Tokens)
- **Animações:** Framer Motion
- **Componentes de UI:** Radix UI (Primitives) + Design System customizado
- **Gerenciamento de Estado:** Server Actions + React `useTransition`
- **Validação:** Zod
- **Ícones:** Lucide React (via componente `Icon` abstraído)
- **Feedback:** Sonner (Toasts)

---

## 📁 Estrutura do Projeto

```text
src/
├── app/              # Rotas e layouts (App Router)
│   ├── (auth)/       # Fluxo de login e recuperação
│   ├── (dashboard)/  # Área logada (Lotes, Recebíveis, Relatórios, etc.)
│   └── api/          # Route Handlers para proxy e webhooks
├── components/       # UI Library e componentes compartilhados
│   ├── ui/           # Design System (Buttons, Modals, Tables, etc.)
│   └── dashboard/    # Componentes específicos do domínio
├── hooks/            # Hooks customizados (autenticação, fetch)
├── lib/              # Configurações de API, Auth e Utils
├── repositories/     # Camada de comunicação com a API (Data Mapping)
├── services/         # Lógica de negócio e orquestração de dados
└── types/            # Definições de interfaces TypeScript
```

---

## 🛠️ Arquitetura e Decisões Técnicas

### 1. Camada de Repositórios
Utilizamos o padrão **Repository Pattern** para isolar as chamadas de API. Isso permite que as páginas e componentes não saibam detalhes de implementação da rede (endpoints, headers de auth, etc.).

### 2. Server Actions & Segurança
A comunicação com o backend é feita majoritariamente via **Server Actions**. Isso elimina a exposição da URL do backend no client-side e permite uma gestão de cookies/tokens mais segura (`httpOnly`).

### 3. Simulação Stateless
Diferente da versão inicial, a simulação de antecipação agora é **stateless**. O frontend envia os IDs dos títulos e o backend calcula o deságio sem persistir um lote no banco até que o usuário confirme a operação.

### 4. Design System SRM
Localizado em `design-system-src/`, o sistema de design foca em:
- **Tabular Numerals:** Obrigatório para todos os valores financeiros para garantir alinhamento vertical perfeito.
- **Hierarquia Visual:** Branco como protagonista, com azul e laranja SRM apenas como acentos.
- **Micro-interações:** Feedback imediato em todas as ações via `framer-motion` e estados de `loading` nos botões.

---

## ⚙️ Configuração Local

### Pré-requisitos
- Node.js 20+
- NPM ou PNPM

### Instalação
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://srm-back-psi.vercel.app/api/v1
   ```

### Execução
```bash
npm run dev
```
Acesse `http://localhost:3000`.

---

## 📈 Melhorias e Evolução

- [x] Integração completa com API de Câmbio.
- [x] Motor de relatórios analíticos funcional.
- [x] Simulador sem persistência precoce.
- [ ] Dashboards dinâmicos na Home (atualmente parciais).
- [ ] Testes E2E com Playwright para o fluxo de antecipação.

---

**SRM Asset — Capital em movimento.**
