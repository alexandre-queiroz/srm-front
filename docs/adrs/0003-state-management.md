# ADR 0003 — Gerenciamento de Estado: useTransition + Server Actions

- **Status:** Aceito
- **Data:** 2026-05-13

## Contexto

A aplicação tem múltiplas telas com listagens paginadas, filtros e estados de loading. A escolha do modelo de estado afeta a complexidade do código, o bundle size e a forma como dados fluem entre Server e Client Components.

## Decisão

O estado da aplicação é gerenciado localmente com `useState` + `useTransition`. As Server Actions retornam dados que são armazenados em estado local do componente. Não há store global (Redux, Zustand, Jotai, etc.).

```tsx
const [data, setData] = useState<PagedResult<T> | null>(null);
const [isPending, startTransition] = useTransition();

const load = (params) => {
  startTransition(async () => {
    const result = await fetchSomeAction(params);
    setData(result);
  });
};
```

## Alternativa Considerada

**Zustand ou Redux Toolkit:** store global com slices por entidade, actions e selectors. Amplamente usado em SPAs React tradicionais. Permite compartilhar estado entre componentes sem prop drilling.

## Trade-off

| Critério                               | useState + useTransition              | Zustand / Redux                 |
| -------------------------------------- | ------------------------------------- | ------------------------------- |
| Bundle size                            | Zero — primitivos do React            | 3–50 KB adicionais              |
| Compartilhamento de estado entre rotas | Não necessário neste projeto          | Seria o caso de uso principal   |
| Integração com Server Actions          | Nativa — `startTransition(async ...)` | Requer middleware extra         |
| Loading states                         | `isPending` do `useTransition`        | Boilerplate de status por slice |
| Curva de aprendizado                   | Zero                                  | Moderada                        |
| Devtools                               | React DevTools                        | Redux DevTools                  |

## Justificativa

Cada tela da aplicação é autossuficiente — lotes não precisam do estado de recebíveis, e relatórios não consomem o estado de câmbio. Não existe estado verdadeiramente compartilhado entre rotas que justifique um store global.

`useTransition` foi introduzido especificamente para wrapping de Server Actions assíncronas, marcando a transição como não-urgente e expondo `isPending` sem boilerplate. Adicionar Zustand trocaria primitivos do React por uma dependência externa para resolver um problema que esses primitivos já resolvem.
