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

Branch `feat/servicos-ago-out-2026`, baseada no candidato `e77a382101beda3008f4622cfb22e4721382abd7` da biblioteca. O PR #2 ainda estava aberto no início desta mudança; o novo PR contra main inclui essa dependência enquanto a biblioteca não for integrada. Não foi feito merge para criar a base.

O preview compartilhado deve representar este candidato após o deploy, em https://rosacruzaurea.github.io/static-site/biblioteca-de-servicos-e-conferencias/. O resultado efetivo da publicação e o commit servido são registrados no PR e no estado canônico do projeto. Resultados offline acima não são prova do deploy.

Página continua acessível apenas por URL direta, sem entrada no menu/home/rodapé. Sem merge automático, mudança de origem do Pages ou deploy na hospedagem institucional.
