# Brasil Fácil — Consultas rápidas

Aplicação web que reúne quatro consultas simples: CEP, DDD, feriados nacionais e bancos do Brasil.


## Links (preencher depois de publicar)
- **GitHub Pages:** COLE_AQUI_O_LINK_DO_SITE
- **Repositório GitHub:** COLE_AQUI_O_LINK_DO_REPOSITORIO
- **Vídeo:** COLE_AQUI_O_LINK_DO_VIDEO (ou inclua video.mp4 no ZIP)

## Tecnologias
HTML5, CSS3, JavaScript puro, `fetch`, `async/await` e framework CSS Bootstrap 5.3.3. Sem back-end.

## API e endpoints
| Método | URL | Uso na tela |
|---|---|---|
| GET | https://brasilapi.com.br/api/cep/v1/{cep} | Mostra rua, bairro, cidade e estado. |
| GET | https://brasilapi.com.br/api/ddd/v1/{ddd} | Mostra estado e cidades do DDD. |
| GET | https://brasilapi.com.br/api/feriados/v1/{ano} | Lista feriados nacionais do ano. |
| GET | https://brasilapi.com.br/api/banks/v1 | Busca bancos pelo nome (filtragem local dos dados retornados). |

Fonte: https://brasilapi.com.br/

## Como usar
1. Abra `index.html` com conexão à internet, ou acesse o link do GitHub Pages.
2. Digite um CEP, DDD, ano ou nome de banco.
3. Clique no botão da consulta para ver os resultados.
4. Para testar erros, envie um campo vazio, pesquise um valor inexistente ou simule modo offline no DevTools.

## Tratamento de falhas
- Campos inválidos: mensagem antes de chamar a API.
- Erro HTTP, indisponibilidade de rede e resultados vazios: avisos na página.
- Consulta em andamento: aviso de carregamento e botão desativado.

## Estrutura
```
index.html
css/estilo.css
js/app.js
README.md
ROTEIRO_VIDEO.txt
```

## Publicação no GitHub Pages
Crie um repositório público, envie os arquivos e vá a **Settings > Pages > Build and deployment > Deploy from a branch > main / (root) > Save**. Depois atualize os links acima e teste o site publicado.
