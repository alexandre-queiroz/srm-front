# ADR 0004 — Design System Customizado sobre Biblioteca de Componentes

- **Status:** Aceito
- **Data:** 2026-05-13

## Contexto

A aplicação exige uma identidade visual específica da SRM Asset (paleta azul/laranja, tabular numerals em dados financeiros, densidade de informação alta). A escolha entre uma biblioteca pronta (shadcn/ui, Chakra, MUI) e um design system customizado define o grau de controle sobre aparência, acessibilidade e performance.

## Decisão

O design system é completamente customizado, construído sobre **primitivos nativos do React** e **Tailwind CSS**. Nenhuma biblioteca de componentes de terceiros é usada como base. Comportamentos complexos são implementados diretamente: modais com `framer-motion` + `AnimatePresence`, selects com `createPortal`, tabs com `createContext`. Os tokens visuais (cores, tipografia, espaçamento) são documentados em `src/app/docs/` — uma rota interna da aplicação com galeria de componentes e referência de cores.

Componentes base (`Button`, `Badge`, `Modal`, `DataTable`, `Avatar`, `Icon`, `Select`, `Tabs`) vivem em `src/components/ui/` sem dependência de aparência ou comportamento de biblioteca externa.

## Alternativa Considerada

**shadcn/ui ou Radix UI Primitives:** componentes com comportamento e acessibilidade já implementados, estilizados com Tailwind. Reduz tempo de implementação dos comportamentos (focus trap, portal, keyboard nav) mas acopla a aplicação a decisões de API e estrutura de markup de terceiros.

## Trade-off

| Critério                                 | Componentes nativos                  | shadcn/ui ou Radix                   |
| ---------------------------------------- | ------------------------------------ | ------------------------------------ |
| Alinhamento com identidade SRM           | Total controle de markup e aparência | Requer sobrescrita sistemática       |
| Comportamentos complexos (modal, select) | Implementados do zero                | Prontos e testados                   |
| Acessibilidade                           | Requer atenção manual                | Garantida pela lib                   |
| Bundle size                              | Apenas o que é usado                 | Apenas o que é instalado             |
| Acoplamento externo                      | Zero                                 | API da lib pode quebrar ao atualizar |
| Tabular numerals em tabelas              | Configurado por padrão               | Requer customização                  |

## Justificativa

O controle total sobre o markup dos componentes é prioritário para a identidade visual da SRM. Bibliotecas como Radix ou shadcn geram estruturas de DOM com classes e atributos próprios que precisam ser sobrescritos sistematicamente — o custo de manutenção desses overrides cresce com o projeto.

A desvantagem real é a responsabilidade por acessibilidade: focus trap em modais, navegação por teclado em selects e ARIA attributes precisam ser implementados e mantidos manualmente. No contexto atual de produto interno com usuários controlados, esse trade-off é aceitável.
