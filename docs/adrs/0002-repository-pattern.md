# ADR 0002 — Repository Pattern no Frontend

- **Status:** Aceito
- **Data:** 2026-05-13

## Contexto

As Server Actions precisam se comunicar com a API backend. Sem uma camada de abstração, cada Server Action faria `fetch` diretamente com a URL, headers e lógica de parsing inline. Com 10+ entidades (lotes, recebíveis, empresas, câmbio, relatórios, produtos, moedas, parâmetros), esse padrão resultaria em duplicação massiva de lógica e dificuldade de rastrear todos os pontos de chamada à API.

## Decisão

Toda chamada à API backend é intermediada por funções em `src/repositories/`. Cada repositório é responsável por uma entidade ou domínio e expõe funções tipadas que recebem parâmetros de negócio e retornam tipos do domínio. Nenhuma Server Action chama `apiFetchJson` diretamente.

A estrutura tem duas variantes dependendo da presença de lógica de negócio:

```
# Operação simples (sem regra de negócio)
page.tsx  →  repository  →  apiFetchJson  →  API

# Operação com orquestração ou regra de negócio
page.tsx  →  service  →  repository  →  apiFetchJson  →  API
```

`src/services/` existe apenas quando há lógica real: combinar múltiplos repositórios, aplicar transformações de domínio ou orquestrar sequências de chamadas. Services que seriam passthrough puro (chamar um repositório sem nenhuma lógica adicional) não são criados — a page chama o repositório diretamente.

## Alternativa Considerada

**Service obrigatório para toda operação:** toda page passa por um service, mesmo que ele seja um passthrough de uma linha para o repositório. Cria consistência estrutural mas adiciona arquivos e indireção sem valor.

## Trade-off

| Critério | Repository direto / Service quando necessário | Service sempre obrigatório |
|---|---|---|
| Localização da lógica de API | Centralizada no repositório | Centralizada no service |
| Overhead sem lógica de negócio | Nenhum — page → repo direto | Arquivo de service vazio |
| Rastreabilidade | Repositório é ponto único por entidade | Dois arquivos para rastrear |
| Escalabilidade para regras complexas | Introduz service quando surge a necessidade | Já existe o arquivo, fácil de adicionar |

## Justificativa

Camadas extras sem responsabilidade real são ruído. Um service que faz `return repo.list(token, params)` não agrega nada — só adiciona um arquivo para abrir ao debugar. A regra é simples: se existe orquestração, existe service; se não existe, a page fala diretamente com o repositório.
