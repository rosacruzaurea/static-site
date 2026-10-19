# Orientações do projeto

Site institucional em HTML/CSS/JS puros, sem dependências de runtime. HTML pronto em `site/`; conteúdo em `content/site.json`; templates em `tools/build.mjs`.

- Biblioteca de serviços: ler `docs/BIBLIOTECA-SERVICOS.md`. Conteúdo em `content/services.json`, template em `tools/services-page.mjs`, CSS/JS próprios. Preservar acesso por URL direta, sem adicionar links na navegação principal.
- Autoridade vigente deste projeto: André delegou à Dani. Pedidos no grupo seguem nova branch → PR contra main → candidato em preview-pages → link para revisão. Dani/André revisam e mergeiam, ou solicitam explicitamente o merge a Jarvis. A regra anterior de autorização de publicação abaixo é atendida por esse fluxo; sem produção nem administração geral do servidor.

- Ler `docs/PROJETO.md` e `docs/VERIFICACAO.md` antes de alterar. SOP canônico do workspace permanece aplicável.
- Comandos: `node tools/build.mjs`, `node tools/check.mjs`, `node tools/serve.mjs`. Não precisa de `npm install`.
- Não editar os HTML gerados manualmente; alterar conteúdo/template e regenerar. CSS/JS em `site/assets/` são fontes.
- Não remover conteúdo editorial por conveniência. Manter URLs locais consistentes, texto sem execução, navegação progressiva e acessibilidade.
- Nunca colocar chave, cadastro, conteúdo restrito, `.env`, log privado ou dump no repositório. Dados neste projeto são conteúdo público.
- Não inventar sucesso de inscrição. Canal oficial externo até existir integração aprovada e testada.
- Não carregar analytics, mapas, vídeos, fontes ou scripts remotos automaticamente.
- Não adicionar workflow, fazer merge ou publicar sem autorização específica de André. Ler instruções e automações reais do repositório remoto antes de enviar.
- Resultado de teste local não é homologação, deploy nem confirmação de funcionamento das integrações externas.
- O gerador não apaga arquivos. Ao retirar rotas, revisar arquivos antigos e obter a autorização aplicável à remoção.
