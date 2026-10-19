# Atualização do acervo: agosto, setembro e outubro de 2026

## Conteúdo

Links fornecidos pela equipe em 19/10/2026. Acrescentados 13 registros em três coleções, das mais recentes para as mais antigas:

- Agosto: oito registros. Serviço online de 16/08; três serviços da Conferência Especial de Salvador de 22 e 23/08, com o Dia da Fraternidade identificado; três serviços e a introspecção da conferência mensal.
- Setembro: quatro registros. Serviço online de 20/09 e três serviços da conferência mensal.
- Outubro: serviço online de 04/10, separado de setembro.

Total: 257 registros em 56 coleções. As 53 coleções e os 244 registros anteriores foram preservados integralmente, na ordem original. Nenhuma coleção vazia de julho foi criada.

Todos os 13 links retornaram metadados HTTP 200 do canal Rosacruz Áurea pelo endpoint oficial YouTube oEmbed. Títulos oficiais adotados nos dez serviços regulares; os três de Salvador usam a identificação, datas e horários fornecidos pela equipe, compatíveis com os metadados. Durações não fornecidas permanecem omitidas. A consulta de metadados não comprova reprodução integral nem disponibilidade futura dos vídeos.

As URLs recebidas foram mantidas completas, inclusive os parâmetros dos três links de Salvador. O site segue sem players, thumbnails remotas ou carregamento automático de terceiros. A nota de origem distingue a coleta inicial das atualizações editoriais; o hash e a data da coleta inicial permanecem intactos.

## Verificação

- Build: 73 páginas; checagem estática: 1.543 referências locais, nenhuma falha.
- Interface: 45/45 verificações em Chrome, fixture offline sob `/static-site/`, após a revisão final dos títulos. Sem erros de console/JavaScript e sem requisições automáticas a terceiros.
- Filtro de 2026: agosto mostra oito registros; setembro, quatro; outubro, um; busca por Salvador, três.
- Capturas de agosto em desktop e mobile inspecionadas. Sem overflow horizontal em 390 px; a suíte também cobre 1365 e 320 px.
- Apenas o HTML da biblioteca mudou entre as 73 páginas. As outras 72 permanecem idênticas ao candidato anterior.
- Autorrevisão, não homologação editorial. Reprodução integral dos vídeos, Safari/Firefox e dispositivos físicos não verificados.

Evidência estruturada: [services-update-verification.json](services-update-verification.json). Capturas: [desktop](previews/services-update-agosto-desktop.png) e [mobile](previews/services-update-agosto-mobile.png).

## Revisão e publicação

Por solicitação da equipe, a biblioteca e esta atualização ficam reunidas no [PR #2](https://github.com/rosacruzaurea/static-site/pull/2), branch `feat/biblioteca-servicos`, contra main. A preparação começou em `feat/servicos-ago-out-2026`, a partir do candidato `e77a382101beda3008f4622cfb22e4721382abd7`; o PR #3 foi substituído pelo PR #2. Nenhum merge na main foi feito.

Preview publicado: https://rosacruzaurea.github.io/static-site/biblioteca-de-servicos-e-conferencias/. O deploy `39293221717` concluiu com sucesso no commit `23a58189748f87ca870e02ec11996c2d0f506d96` de `preview-pages`, com artefato do candidato `2445f3f0570a6418b75f9912ec55c6ff1c7f1a00`. A consolidação do PR só altera a documentação e a referência de revisão, sem mudar os arquivos publicados.

Na verificação pública, página, quatro CSS/JS e home responderam HTTP 200 com bytes iguais ao candidato. No Chrome da URL real, os 13 destinos estão presentes; filtros de 2026 e buscas por agosto/setembro exibem as contagens esperadas. Agosto também foi conferido em 390 px, com oito entradas e sem overflow. As capturas desktop/mobile carregaram no PR. Não houve reprodução integral dos vídeos.

Página continua acessível apenas por URL direta, sem entrada no menu/home/rodapé. Sem merge automático, mudança de origem do Pages ou deploy na hospedagem institucional.
