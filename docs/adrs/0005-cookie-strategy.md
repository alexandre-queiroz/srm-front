# ADR 0005 — Estratégia de Cookies: httpOnly para Auth, não-httpOnly para Display

- **Status:** Aceito
- **Data:** 2026-05-13

## Contexto

O sistema usa dois tipos de dados persistidos no navegador: o token JWT de autenticação e informações de exibição do usuário (nome, ID). Esses dois tipos têm requisitos de segurança radicalmente diferentes.

## Decisão

Dois cookies com flags distintas:

| Cookie | Flag httpOnly | Conteúdo | Quem lê |
|---|---|---|---|
| `srm_token` | `true` | JWT de autenticação | Somente Server Actions |
| `srm_user` | `false` | `{ name, id }` JSON | Layout client-side (uma vez no mount) |

O cookie `srm_user` é escrito pelo servidor durante o login (Server Action tem acesso ao token para chamar `/me`) e lido no client-side via `document.cookie` no `useEffect` do layout. Não há polling da API — a leitura acontece uma única vez.

## Alternativa Considerada

**Um único cookie httpOnly com todas as informações:** inclui `{ token, name, id }` serializado. Seguro, mas o layout não consegue ler o nome sem uma Server Action adicional — o que implicaria em uma chamada de rede no render de cada página ou prop drilling do nome via layout server component.

**Chamar `/me` no client-side a cada render:** simples, mas gera uma chamada de rede desnecessária em toda navegação apenas para exibir um nome no sidebar.

## Trade-off

| Critério | Dois cookies | Cookie único httpOnly | Polling `/me` |
|---|---|---|---|
| Segurança do token | Total (nunca acessível ao JS) | Total | Expõe token no client |
| Exibição do nome | Sem custo de rede | Requer Server Action no layout | Uma req por navegação |
| Implementação | Levemente mais complexa | Simples | Simples mas ineficiente |
| Staleness do nome | Possível (nome muda, cookie não) | N/A | Sempre fresco |

## Justificativa

O token JWT nunca deve ser acessível ao JavaScript — é o requisito inegociável. O nome do usuário, por outro lado, é informação de display sem valor de segurança. Expô-lo num cookie de sessão não-httpOnly não representa risco, e elimina completamente qualquer chamada de rede para dados que mudam com frequência zero durante uma sessão.

O risco de staleness (nome atualizado no banco mas cookie desatualizado) é aceitável: o cookie expira junto com a sessão e é reescrito a cada novo login.
