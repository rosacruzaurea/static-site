# Biblioteca de Serviços e Conferências

## Escopo desta mudança

Página solicitada para acesso por URL direta, sem entrada no menu, home, rodapé ou biblioteca de palestras. PR contra `main`; publicação somente em `preview-pages`. Sem merge automático e sem deploy na hospedagem institucional.

- Rota: `/biblioteca-de-servicos-e-conferencias/`.
- URL de preview: https://rosacruzaurea.github.io/static-site/biblioteca-de-servicos-e-conferencias/.
- Nova branch: `feat/biblioteca-servicos`, a partir da main integrada `4edf04c71e6e13c46595c47bf681c91a80ac3b29`.
- Página não listada na navegação, mas pública para quem tiver a URL. Não é uma área autenticada. `noindex/nofollow` e `robots.txt` de revisão são mantidos, não usados como controle de acesso.

## Fonte e fidelidade

Fonte pública, HTTP 200 sem autenticação em 19/10/2026: https://rosacruzaurea.org.br/biblioteca-de-servicos-e-conferencias/.

`content/services.json` registra URL, instante de coleta, hash SHA-256 do HTML original e os dados extraídos. São 53 coleções, 244 entradas e 236 URLs distintas do YouTube. Os 244 títulos, URLs e durações foram comparados à fonte, na mesma ordem. Não se afirma que todas as gravações foram reproduzidas ou que estão disponíveis.

Preservadas, para revisão editorial:

- Duas coleções chamadas “Agosto de 2021” e as reutilizações de vídeos presentes na fonte. Não houve deduplicação silenciosa.
- O ciclo “Maio de 2026” inclui um registro cujo título menciona 19/04/2026; a divergência já existe na origem.
- Um link curto `youtu.be` em Junho de 2023 contém um início em `t=2073`, preservado.

O HTML bruto da coleta não integra o repositório nem o artefato público. O importador opcional `python3 tools/import-services.py /caminho/origem.html` usa apenas a biblioteca padrão do Python e não faz chamadas de rede. A geração e o site não dependem de Python.

## Comportamento e segurança

- Listagem completa em HTML, organizada em ciclos com abertura nativa por `details/summary`.
- Busca por título/período, sem distinção de acentos ou maiúsculas; filtro por ano do ciclo; contagem, estado vazio e limpeza dos filtros.
- Busca e ano persistem em `q` e `year` na URL. Não colocar dados pessoais nesses campos.
- Expandir/recolher coleções; controles e navegação funcionam por teclado.
- Sem JavaScript, o acervo continua acessível pelas coleções; filtros inativos ficam ocultos.
- Links abrem o YouTube em nova aba, com `noopener noreferrer`. Sem iframe, player, thumbnail ou script remoto. A disponibilidade do destino depende do provedor.
- Valores importados são escapados antes de virar HTML. URLs limitadas a HTTPS nos hosts YouTube permitidos. Entrada de busca não usa `innerHTML` nem executa markup.
- CSS/JS próprios desta página são carregados somente nela. Os arquivos das 72 páginas anteriores não foram alterados.

## Evidências locais

- `node tools/build.mjs`: 73 páginas.
- `node tools/check.mjs`: 73 páginas, 1.543 referências locais, nenhuma falha.
- `tools/check-services-browser.mjs`: 45/45 verificações em Chrome instalado, contexto isolado offline simulando o subcaminho `/static-site/`. Sem erros de JavaScript/console e sem requisições automáticas a terceiros.
- Layout verificado em 1365, 390 e 320 px, sem overflow horizontal. Capturas desktop/mobile inspecionadas.
- Ausência de links à nova rota conferida nas 72 páginas anteriores; biblioteca de palestras e menu mantidos.
- [Resultado estruturado](services-verification.json), [desktop](previews/services-desktop.png) e [mobile](previews/services-mobile.png).

Esses testes locais não são prova do deploy. A entrega no grupo deve ocorrer após confirmação do commit em `preview-pages`, dos arquivos servidos e das jornadas afetadas na URL pública. Reprodução integral dos vídeos, Safari/Firefox, dispositivos físicos e homologação editorial permanecem fora desta verificação.

## Manutenção

Conteúdo em `content/services.json`; marcação em `tools/services-page.mjs`; estilos/comportamento em `site/assets/services.css` e `site/assets/services.js`. O build é chamado por `tools/build.mjs`. Não editar o HTML gerado diretamente. Repetir verificações pertinentes após mudanças; preservar o fluxo nova branch → PR contra main → preview → revisão humana.
