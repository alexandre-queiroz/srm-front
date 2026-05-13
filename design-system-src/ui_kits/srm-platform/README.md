# SRM Platform — UI Kit

High-fidelity recreation of the SRM Asset web platform — the operating console used by both **cedentes** (companies advancing receivables) and **investidores** (FIDC quotaholders).

## Files

- `index.html` — clickable prototype, demonstrates real flows
- `App.jsx` — top-level shell with sidebar + header + route switcher
- `Sidebar.jsx` / `Header.jsx` — navigation chrome
- `Dashboard.jsx` — cedente home with KPIs, recent operations, quick actions
- `NovaAntecipacao.jsx` — three-step form (envio → cotação → confirmação)
- `Operacoes.jsx` — full duplicatas table with filters
- `InvestidorView.jsx` — investidor portfolio view (FIDC dashboard)
- `Login.jsx` — entry screen
- `ui.jsx` — primitive components (Button, Input, Card, Badge, etc.)

## Disclaimers

- The original `srm-front` codebase referenced in the brief was empty at the time of this build. All components are inferences based on the brand guide + Brazilian FIDC platform conventions. **Reconcile with the real product** before treating any of this as canonical.
- Data is fake. All BRL values, CNPJs, and operation numbers are placeholders.

## Screens to demo

1. **Login** → enter any email/password → enter platform.
2. **Dashboard** (default landing) — see KPIs, recent operations.
3. **Nova antecipação** — click "Antecipar duplicata" button to walk the 3-step flow.
4. **Operações** — filter by status, see full list.
5. **Investidor** — toggle role in header to see the quotaholder view.
