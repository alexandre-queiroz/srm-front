# ADR 0001 — Server Actions como Camada de Acesso a Dados

- **Status:** Aceito
- **Data:** 2026-05-13

## Contexto

O frontend precisa se comunicar com uma API privada que exige autenticação via JWT. Há duas abordagens principais no Next.js App Router: chamar a API diretamente do client-side (com `fetch` no navegador) ou usar Server Actions para intermediar todas as chamadas.

A escolha afeta diretamente a segurança do token de autenticação, a superfície de ataque exposta ao navegador e o modelo de autorização da aplicação.

## Decisão

Toda comunicação com a API backend é feita exclusivamente via **Server Actions** (`"use server"`). O client-side nunca chama a API diretamente.

O token JWT é armazenado em cookie `httpOnly` e lido apenas no contexto do servidor. As páginas recebem dados já resolvidos via props ou chamam Server Actions que retornam dados tipados.

## Alternativa Considerada

**Client-side fetch com token em cookie acessível ao JS (`localStorage` ou cookie não-httpOnly):** o componente chama `fetch('/api/...')` diretamente, inclui o token no header `Authorization`, e gerencia estados de loading/error com `useState`.

## Trade-off

| Critério           | Server Actions                                    | Client-side fetch                               |
| ------------------ | ------------------------------------------------- | ----------------------------------------------- |
| Exposição do token | Nunca chega ao navegador                          | Token em memória JS ou cookie acessível         |
| URL do backend     | Nunca exposta ao client                           | Visível no DevTools/Network                     |
| XSS                | Token inacessível mesmo com script injetado       | Token roubável via `document.cookie` ou memória |
| Tipagem end-to-end | Tipos compartilhados diretamente                  | Requer duplicação ou codegen                    |
| Complexidade       | Baixa — funções async marcadas com `"use server"` | Requer gerenciamento de estado no client        |
| Streaming/loading  | `useTransition` + `isPending`                     | `useState` + `useEffect`                        |

## Justificativa

Em uma plataforma financeira, o token de autenticação nunca deve estar acessível ao JavaScript client-side. Um ataque XSS em qualquer componente poderia exfiltrar o token se ele estivesse em `localStorage` ou em um cookie sem `httpOnly`. Com Server Actions, o token existe apenas no contexto Node.js — o navegador nunca o vê.

A simplicidade operacional também favorece essa escolha: não há necessidade de interceptors de `axios`, gerenciamento de refresh token no client ou lógica de retry distribuída entre componentes.
