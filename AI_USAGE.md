# AI Usage — SRM Asset Frontend

Este documento descreve como a IA (Claude) foi utilizada como co-piloto no desenvolvimento deste projeto, conforme exigido pela política de uso de IA da SRM Asset.

---

## Como a IA foi utilizada

A IA não foi utilizada para geração cega de código. O processo foi colaborativo e orientado por decisões técnicas tomadas em conjunto, com o autor validando cada escolha arquitetural antes da implementação.

O fluxo de trabalho seguiu esta ordem:

1. **Construção da identidade visual** — antes de qualquer código de produto, a identidade visual da SRM foi construída em múltiplas etapas com IA:
   - Um agente Claude rodou em background para acessar o site da SRM Asset e coletar material visual: paleta de cores, ícones, tipografia e padrões visuais existentes da marca.
   - O material coletado foi enviado ao **Claude Design**, que gerou a V1 do design system com tokens de cor, escala tipográfica e componentes base alinhados à identidade da marca.
   - A V1 foi importada para o projeto e cada componente passou por diversas rodadas de refinamento em conjunto com a IA: espessura e cor de bordas, separação entre variantes de cor e variantes de tamanho, testes de responsividade. O resultado é um sistema de componentes onde cor e forma são dimensões independentes e combináveis.
   - Após essas iterações, o projeto tem uma marca consistente — visual moderno, minimalista e uniforme em todas as telas. A documentação vive em `src/app/docs/` (rota `/docs`).

2. **Leitura do README e contexto do backend** — antes de qualquer código de produto, a IA leu a documentação do backend (ADRs, README, schema) para entender o domínio e as decisões já tomadas. Isso evitou inconsistências de modelagem entre as camadas.

3. **Definição de arquitetura antes de código** — as decisões de Server Actions, Repository Pattern e estratégia de cookies foram discutidas e documentadas antes da implementação. Cada decisão está registrada nos ADRs em `docs/adrs/`.

4. **Implementação incremental por domínio** — cada entidade (lotes, recebíveis, empresas, câmbio, relatórios) foi implementada de forma isolada, com integração à API validada por tela antes de avançar.

5. **Análise crítica de sugestões** — o autor questionou ativamente as sugestões antes de aceitar. Decisões relevantes de veto estão documentadas abaixo.

---

## Decisões onde o autor vetou a sugestão da IA

### 1. Polling do endpoint `/me` para exibir o nome do usuário

**Sugestão inicial da IA:** chamar o endpoint `/v1/auth/me` via Server Action a cada render do layout para sempre ter o nome atualizado.

**Veto do autor:** o autor sinalizou explicitamente ("Você não pretende ficar batendo nesse endpoint toda hora, né?") que uma chamada por navegação apenas para exibir o nome no sidebar é desperdício. O nome não muda durante uma sessão.

**Decisão final:** o nome é buscado uma única vez no momento do login — a Server Action `loginAction` já tem o token em mãos e chama `/me` naquele momento, salvando o resultado em um cookie não-httpOnly (`srm_user`). O layout lê esse cookie uma vez no `useEffect` do mount. Zero chamadas de rede após o login.

**Impacto:** eliminação de N requisições desnecessárias (uma por navegação de página) durante toda a sessão do usuário.

---

### 2. Uso de biblioteca de gerenciamento de estado externa

**Situação:** ao discutir como gerenciar os filtros e dados paginados das tabelas, a IA sugeriu avaliar Zustand para centralizar o estado entre telas.

**Veto do autor:** o autor identificou que não há estado verdadeiramente compartilhado entre rotas neste projeto. Lotes, recebíveis, câmbio e relatórios são domínios isolados.

**Decisão final:** `useState` + `useTransition` com Server Actions. Cada tela gerencia seu próprio estado local. Sem dependência externa de gerenciamento de estado.

**Impacto:** zero bytes adicionais no bundle, sem boilerplate de slices/reducers, integração nativa com Server Actions via `startTransition(async ...)`.

---

### 3. Filtros server-side para todos os campos de tabela

**Sugestão inicial da IA:** implementar filtragem server-side para todos os campos habilitados com `enableColumnFilter`, seguindo o padrão já estabelecido para `status` e `assignor`.

**Veto do autor:** para campos com baixa cardinalidade e volume reduzido (ex: `pair` na tabela de câmbio, que tem no máximo ~20 registros na tela), uma chamada de rede para filtrar é mais custosa do que filtrar o array em memória no client.

**Decisão final:** filtragem client-side para campos de baixa cardinalidade em tabelas com volume pequeno. Filtragem server-side para campos que implicam paginação ou grande volume.

**Impacto:** menos round-trips à API para casos de uso simples, melhor percepção de performance para o usuário.

---

## Onde a IA economizou tempo

- **Scaffolding de telas completas** — estrutura de `_view.tsx` + `page.tsx` com Server Actions, paginação e estado de loading gerados em minutos
- **DataTable com colunas tipadas** — colunas com `accessorKey`, formatação de moeda/data e `enableColumnFilter` para múltiplas entidades
- **Relatório hierárquico com SQL nativo** — padrão de duas queries (GROUP BY para sumários + IN para transações) com `defaultdict` para agrupamento Python-side, seguindo a restrição do README de não usar ORM para relatórios
- **Design system gerado a partir da marca real** — agente coletou material visual do site da SRM, Claude Design gerou a V1, refinamentos iterativos produziram um sistema de componentes com identidade visual própria
- **Componentes responsivos e compostos** — cada componente aceita variações de cor e forma como dimensões independentes, testados para responsividade mesmo em uma plataforma primariamente desktop
- **CSV export com BOM** — detecção automática do prefixo `﻿` necessário para o Excel reconhecer UTF-8 corretamente
- **Filtro typeahead com debounce** — implementação do componente de busca de cedente com `useDebounce` e dropdown de sugestões reutilizável
- **ADRs e documentação** — estrutura de decisões com tabela de trade-offs e justificativa clara para cada escolha

## Onde a IA precisou de correção

- **`b.processed_at` inexistente no banco** — a IA gerou SQL referenciando `b.processed_at` mas o modelo `Batch` usa `updated_at`. Só foi identificado ao testar a rota. Corrigido para `b.updated_at AS processed_at`.
- **Polling do nome do usuário** — sugestão inicial de buscar `/me` a cada render foi vetada pelo autor (documentado acima).
- **Ícone `alert-circle` sem funcionalidade** — a IA havia deixado no layout um botão de notificações sem implementação real. O autor identificou durante revisão visual e solicitou remoção.
- **Duplicação de `<Icon>` em paginação** — uma edição conflitante criou dois elementos `<Icon name="arrowRight">` adjacentes na mesma célula de tabela. Corrigido manualmente.

---

## Análise crítica

A IA foi mais útil como **executor de implementação** do que como **definidor de arquitetura**. As decisões mais importantes — a granularidade dos filtros, a estratégia de cookie, o modelo hierárquico do relatório — vieram do autor.

O maior risco no uso de IA em frontends financeiros é aceitar padrões de performance subótimos sem questionar: polling onde um cookie resolveria, state global onde estado local basta, chamada de rede onde um array em memória serve. Neste projeto, o autor questionou ativamente essas escolhas, e o resultado é uma aplicação mais enxuta do que seria sem esse escrutínio.
