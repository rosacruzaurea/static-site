# Rosacruz Áurea · site estático

## Atualização: biblioteca de serviços

Adicionada a [Biblioteca de Serviços e Conferências](docs/BIBLIOTECA-SERVICOS.md), por URL direta e sem link na navegação principal. São 73 páginas nesta revisão. Os relatos de escopo e envio inicial abaixo são históricos; limites e evidências da nova página constam no documento vinculado.

Versão de revisão do site institucional em **HTML, CSS e JavaScript puros**. Sem WordPress, framework, banco, pacote de execução ou serviço de terceiros carregado automaticamente.

## Abrir a versão

O site pronto está em [`site/`](site/). Pode ser servido por qualquer servidor de arquivos estáticos. **Não é necessário instalar dependências nem executar build para visualizar os arquivos já gerados.**

Preview local opcional, com Node.js 22 ou mais recente:

```sh
node tools/serve.mjs
```

Abra `http://127.0.0.1:4173/`. O servidor escuta exclusivamente em loopback. Encerre com Ctrl+C. Ele serve somente `site/`, não conteúdo-fonte, histórico Git ou documentação. `PORT=4174 node tools/serve.mjs` troca a porta.

## Conteúdo desta versão

- Home com três destaques, apresentação da Escola, programação de outubro de 2026 e últimas palestras.
- Sobre, Carta Aberta, palestras ao vivo, introdução ao minicurso e privacidade da versão de revisão.
- Biblioteca com **17 artigos completos**, imagens locais, links aos vídeos originais e busca por texto/tema.
- Diretório com **26 unidades**, páginas de endereço/contato/horário e filtros por cidade/estado.
- Páginas de categoria e estado, preservando esses caminhos do site original. Ao todo, **72 páginas HTML**.
- Menu móvel, carrossel manual, navegação por teclado, busca sem distinção de acentos e estados vazios.

O conteúdo público foi coletado em **19/10/2026**; as imagens de abertura foram recuperadas da auditoria de 18/10/2026. A lista de origem e hashes está em [docs/source-manifest.json](docs/source-manifest.json), e as rotas em [docs/routes.json](docs/routes.json).

Prévias: [desktop](docs/previews/desktop.png), [celular](docs/previews/mobile.png), [biblioteca no celular](docs/previews/library-mobile.png), [biblioteca completa](docs/previews/library-desktop.png) e [endereços](docs/previews/addresses-desktop.png). [Descrição preparada para o PR e galeria](docs/PULL_REQUEST.md); o PR ainda não está aberto no GitHub.

## Editar e verificar

- Textos, palestras, locais e programação: [`content/site.json`](content/site.json).
- Estrutura e templates: [`tools/build.mjs`](tools/build.mjs).
- Estilos: [`site/assets/styles.css`](site/assets/styles.css).
- Comportamento: [`site/assets/app.js`](site/assets/app.js).

```sh
node tools/build.mjs
node tools/check.mjs
```

O gerador usa somente bibliotecas nativas do Node e não consulta serviços externos. Ele atualiza o HTML versionado. Nenhum comando instala pacote, publica ou faz push. Ao excluir uma rota do conteúdo, também revisar o arquivo HTML antigo: o gerador intencionalmente não apaga arquivos.

Os testes opcionais de navegador em `tools/browser-check.mjs` usam uma instalação **já existente** de Playwright e um Chrome/CDP autorizado. Variáveis: `PLAYWRIGHT_MODULE` (caminho absoluto para o módulo) e `CDP_URL`. A execução usa uma origem sintética interceptada integralmente, com os arquivos locais entregues em memória; não acessa os serviços do site original. Não é teste de deploy.

## O que não está migrado

- **Cadastros e RD Station:** links explícitos ao canal oficial. Não existe formulário local fingindo envio ou confirmação.
- **Vídeos e mapas:** links externos acionados pelo visitante. Não há incorporação automática, geolocalização ou execução de scripts dos provedores.
- **Biblioteca de serviços/conferências e área restrita:** não importadas; a definição de público e permissões continua pendente.
- **Taxonomias de tags e tipo de unidade, busca WordPress e integrações internas:** não são uma migração integral. Conferir o inventário antes de substituir o site existente.
- Conteúdo e identidade foram reproduzidos para revisão, **não homologados editorialmente**. Atribuições de citações do carrossel original não foram reutilizadas por falta de confirmação. Tipografia usa fontes do sistema. A estética é uma reconstrução, não reprodução pixel a pixel.
- Datas e contatos refletem a fonte pública, não confirmação junto às unidades. Atualizar a programação e confirmar horários antes de publicar.

## Publicação e segurança

Esta entrega **não está publicada**. Mantém faixa de revisão e `noindex/nofollow`; isso não fornece controle de acesso. O diretório `site/` é o único artefato publicável. Não subir a raiz do projeto como site.

`site/_headers` contém sugestões de headers para hospedagens compatíveis. Esse arquivo **não é aplicado automaticamente em todos os provedores**, inclusive não comprova configuração de headers no GitHub Pages. A CSP também está no HTML; `frame-ancestors` exige header HTTP e está apenas em `_headers`/servidor de preview. A configuração efetiva deve ser verificada após a escolha de hospedagem.

Não existem workflows de deploy. Antes do primeiro push, inspecionar o repositório de destino, instruções e integrações; branches podem disparar automações externas. Envio para branch não autoriza merge, DNS ou publicação. Ver [docs/PROJETO.md](docs/PROJETO.md) e [docs/VERIFICACAO.md](docs/VERIFICACAO.md).

## Direitos

Textos, marca e imagens pertencem a seus respectivos titulares e foram obtidos das páginas oficiais para este projeto de reconstrução. Este repositório não concede licença de reutilização do acervo a terceiros. A organização deve validar conteúdo, atribuições e direitos antes de publicação.
