## Atualização de acesso, 19/10/2026

Acesso de leitura autenticado confirmado no destino privado vazio. A checagem de 72 páginas e 1.525 referências foi repetida, sem falhas. O conteúdo da aplicação é idêntico ao candidato já testado; só documentação de estado mudou. O envio, o PR e o deploy ainda precisam de confirmação remota. Registros anteriores abaixo são históricos.

# Verificação da versão local

Data: 19/10/2026. Ambiente: Node.js 26.11.1 e Google Chrome instalado, acessado por CDP autorizado. Revisão do próprio autor; **não é revisão independente nem homologação editorial**.

## Resultados comprovados

- `node tools/build.mjs`: 72 páginas HTML geradas.
- `node tools/check.mjs`: 72 páginas e 1.525 referências locais verificadas; nenhuma falha. Inclui links, assets, fragments, h1 único, IDs duplicados, idioma, bloqueio de indexação, placeholders e padrões de conteúdo executável indevido.
- Preview HTTP loopback: 72/72 páginas responderam 200 com HTML e CSP esperados. Isso não valida qualquer hospedagem pública.
- `tools/browser-check.mjs`: **103 verificações passaram**, sem erro de JavaScript/console nem requisição automática a terceiros.
- Renderização em 1365, 390 e 320 pixels, em oito páginas representativas (24 combinações): sem overflow horizontal detectado; h1 único; sem falhas nas imagens carregadas.
- Menu móvel: abre, fecha por Escape, devolve foco ao botão e navega até a biblioteca.
- Biblioteca: busca sem acentos, filtro de tema, persistência da seleção pela URL, reset e estado vazio. Entrada com markup não se transforma em HTML.
- Endereços: busca sem acentos, filtro por estado e estado vazio.
- Carrossel: avanço, retorno, seleção direta, teclado e retorno cíclico; sem rotação automática.
- Jornada de inscrição: navegação interna até apresentação; link ao destino oficial; nenhum input ou confirmação falsa.
- Artigo: ID do vídeo preservado em link externo; sem iframe.
- JavaScript desativado: biblioteca e diretório completos acessíveis, navegação móvel visível e filtros inativos não mostrados.
- Capturas desktop/mobile de home, biblioteca e endereços. Para capturas de página inteira, imagens lazy foram carregadas explicitamente no contexto de captura; o código do site não foi alterado.
- Inspeção visual: composição desktop da home, imagens, programação, cards e rodapé; capturas móveis para confirmar hierarquia e ausência de sobreposição.
- Contraste de tokens calculado: oliva/branco 4,69:1; texto secundário/branco 6,25:1; texto escuro/botão de abertura 6,66:1; rodapé 10,44:1. Isso não comprova contraste em todos os pixels de imagens nem conformidade WCAG integral.
- Varredura de padrões de credenciais nos arquivos textuais do projeto: nenhum achado. Não equivale a auditoria exaustiva de segredos ou segurança.

Os resultados estruturados estão em `verification-results.json`. O manifesto SHA-256 identifica os arquivos do candidato verificado. Logs e HTML bruto da coleta são evidências locais, excluídas do Git e do pacote de entrega.

## Ambiente de navegador e limites

O navegador gerenciado bloqueou a navegação direta ao endereço localhost por política. **A política foi preservada.** Os testes de interface usaram um contexto isolado novo no Chrome, origem sintética `https://static-site.test` e interceptação integral que entregou apenas os arquivos locais em memória. Nenhuma página acessou a rede privada ou o site original durante esses testes.

Assim, existem duas provas distintas: resposta do servidor local por HTTP e comportamento de HTML/CSS/JS no Chrome isolado. Elas não são uma prova ponta a ponta de um deploy.

Na primeira execução do teste de interação, um seletor dependia do texto “Menu”, que muda para “Fechar” ao abrir. O teste foi corrigido para selecionar o controle estável, sem alteração do produto; a execução integral seguinte passou. O relatório não confunde os 72 checks de layout anteriores ao timeout com uma execução integral aprovada.

Durante coleta pública houve resposta 429. A coleta foi desacelerada, passou a execução sequencial e respeitou espera antes da retomada. Não houve tentativa de contornar bloqueio ou executar testes ativos no site original.

Após a execução de navegador, apenas um comentário de JavaScript e o aviso de privacidade sobre URL/registros foram esclarecidos. Não houve mudança funcional; a checagem estática foi repetida e o manifesto atualizado.

## Não verificado / pendente

- Permissão de escrita no GitHub, workflows e integrações do repositório remoto. Sem acesso, não houve push.
- Renderização em Safari, Firefox, aparelho físico ou tecnologias assistivas reais; teclado completo e acessibilidade integral.
- Reprodução de todos os vídeos, submissão/entrega de cadastros, RD Station, envio de e-mail e confirmação externa de horários/contatos.
- Exatidão editorial, atribuições e direitos de uso para publicação; validação humana necessária.
- Headers, TLS, logs, cache, SEO final, redirecionamentos, analytics e recuperação na futura hospedagem. O projeto permanece noindex.
- Migração de área restrita, serviços/conferências e taxonomias não incluídas. Esta não é uma réplica integral do backend.
- Lighthouse/Core Web Vitals, tráfego real, teste de carga e auditoria de segurança externa não realizados. Não há nota de performance inventada.

## Situação

**Implementado e verificado localmente. Não enviado ao GitHub, não publicado, não homologado.** Autorização de André para preparar e enviar branch está registrada; falta acesso técnico ao alvo, não nova aprovação do escopo.
