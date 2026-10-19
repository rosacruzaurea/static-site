## Atualização de envio, 19/10/2026

Acesso autenticado confirmado. O destino é privado e estava vazio, sem branches ou Pages. A preparação de envio inclui um commit-base vazio na própria branch de revisão, sem criar ou alterar main. André autorizou o preview e delegou este projeto à Dani; não há autorização de merge. Leitura de hooks e políticas de Actions foi negada pelo escopo do token. Nenhuma credencial integra o projeto.

Os registros anteriores abaixo permanecem como histórico, não como bloqueio de autorização.

# Escopo, decisões e riscos

## Autorização e baseline

André autorizou em 19/10/2026 a implementação solicitada por Dani e o envio em branch separada para `rosacruzaurea/static-site`. Não autorizou merge, publicação, alteração de domínio ou infraestrutura. A aprovação de implementação está resolvida e não precisa ser solicitada de novo.

O repositório remoto não pôde ser acessado: na rodada anterior, a credencial autenticou, mas o alvo retornou 404 e não apareceu na listagem acessível. Na retomada, o valor da credencial não estava disponível, e a identidade GitHub do agente não estava conectada. Não se presume que 404 signifique inexistência; pode ser falta de acesso. Nenhum workflow remoto foi inspecionado, pois o acesso segue bloqueado.

Esta é uma preparação local independente, não um clone do alvo. Branch local `feat/vanilla-site`. Não houve push, pull request, merge ou deploy. Integração com o histórico remoto deverá preservar arquivos e commits existentes, sem force push ou substituição do repositório.

## Objetivo e critérios

Reproduzir as jornadas públicas centrais: conhecer a Escola, encontrar palestras, ler conteúdo, localizar uma unidade e chegar aos canais oficiais de participação. Interface em português, responsiva, com marca, imagens e composição base do site atual.

Critérios: páginas entregues em HTML/CSS/JS; conteúdo disponível sem renderização por framework; links locais íntegros; busca/categorias e menu utilizáveis; dados do acervo rastreáveis à fonte; nenhum falso envio; nenhum segredo no artefato; mudanças revisáveis sem publicação implícita.

O inventário implementado está em `routes.json`. A biblioteca de serviços/conferências, restrições de acesso, taxonomias restantes e administração não entram nesta primeira versão. Não chamar essa entrega de migração integral.

## Decisão de arquitetura

**Escolha:** site multipágina estático, assets locais, JavaScript para aprimoramento progressivo. Conteúdo centralizado em JSON e gerador opcional com bibliotecas nativas do Node; HTML pronto versionado.

**Motivo:** tecnologia explicitamente solicitada e fluxo de edição técnica por agente. A execução no navegador não requer framework, CMS ou banco. Generator reduz divergência de menus, rodapés e templates em 72 páginas.

**Alternativas:** HTML mantido manualmente em todas as páginas cria duplicação; CMS oferece autonomia editorial, mas adiciona operação que não foi solicitada. Um framework de frontend não é necessário às interações atuais. Reavaliar se surgirem edição direta por equipe, área restrita, automação editorial ou requisitos que exijam servidor.

**Limites:** conteúdo é um snapshot; não se atualiza do WordPress sozinho. Datas, horários e acervo precisam de manutenção. Fontes de sistema e adaptações de acessibilidade diferem visualmente do original.

## Dados e ameaças

Classificação pelo SOP: **nível A**, piloto local de conteúdo público. Não existe coleta de cadastro, autenticação ou base de visitantes. Contatos institucionais publicados integram o diretório e continuam sujeitos a revisão editorial.

- Conteúdo importado executável: removidos scripts, handlers, estilos e embeds da origem; conteúdo textual saneado antes de gerar HTML; saída sem scripts inline e com CSP restritiva.
- Entrada em busca: somente normalização e comparação de strings; não usa `innerHTML`, `eval` ou chamadas externas. Filtros ficam na URL para recarregar a seleção; não inserir dados pessoais e não presumir que URL equivale a armazenamento privado.
- Terceiros: mídia local; provedores de vídeo, mapas e cadastro somente por link intencional. Não houve envio de formulário nos testes.
- Credenciais: nenhuma no conteúdo, HTML, CSS, JS ou documentação. Credencial anterior não foi copiada para esta preparação.
- Publicação involuntária: ausência de workflow local não comprova ausência de automações externas. Requer inspeção do alvo antes de push.
- Conteúdo desatualizado: registrar data de coleta, distinguir encontros anteriores e validar contatos/programação antes de liberar.
- Logs e hospedagem: definir provedor, acesso e retenção antes de produção; privacidade desta versão não é uma certificação LGPD.

## Operação e retorno

Revisar mudanças de conteúdo, gerar, verificar, comparar diff e demonstrar o candidato. Em hospedagem estática futura, preservar versão anterior e promover apenas o diretório `site/`. Retorno será redeploy do artefato anterior; ainda não ensaiado em hospedagem porque nenhuma foi escolhida ou autorizada.

Próxima ação externa: resolver link/permissões do repositório e disponibilizar identidade/credencial; ler instruções, árvore e workflows; integrar a preparação ao histórico existente em branch de revisão; comprovar SHA remoto após push. Não ampliar esta autorização para merge/deploy.
