# Minha Primeira Loja | Gemi Tech

![Banner de tecnologia](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85)

## Apresentação

A **Gemi Tech** é uma loja virtual demonstrativa de eletrônicos e utilidades, criada
com foco em uma experiência simples, moderna e objetiva. O projeto simula o fluxo
principal de uma compra: conhecer os produtos, adicionar itens ao carrinho, revisar o
pedido e encaminhá-lo por e-mail ou WhatsApp.

### Link para demonstração

**[Acessar a loja publicada](https://rafaelsales93.github.io/MinhaPrimeiraLoja/)**

## Objetivo do projeto

Este projeto foi desenvolvido para demonstrar como uma pequena loja pode apresentar
seus produtos de forma profissional usando tecnologias web fundamentais, sem depender
de um framework ou de um backend complexo.

Ele pode ser usado como:

- portfólio de desenvolvimento front-end;
- protótipo visual de uma loja virtual;
- base para uma futura aplicação com backend e pagamentos;
- exemplo didático de HTML, CSS, JavaScript e GitHub Pages.

## Principais recursos

| Recurso | O que demonstra |
| --- | --- |
| Catálogo de produtos | Organização de produtos com imagem, categoria, preço, descrição e avaliação |
| Carrinho interativo | Inclusão, remoção e alteração da quantidade de itens |
| Resumo do pedido | Visualização dos produtos e do valor total antes do envio |
| Checkout por e-mail | Geração de assunto e corpo do pedido em formato `mailto` |
| Checkout por WhatsApp | Montagem automática da mensagem para atendimento direto |
| Layout responsivo | Adaptação para computador, tablet e celular |
| Publicação online | Deploy automatizado pelo GitHub Pages |

## Imagens do catálogo

<div align="center">
	<img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=420&q=80" alt="Fone Bluetooth" width="30%" />
	<img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=420&q=80" alt="Smartwatch" width="30%" />
	<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=420&q=80" alt="Mini projetor e tecnologia" width="30%" />
</div>

## Tecnologias utilizadas

- **HTML5:** estrutura semântica, acessibilidade básica e organização das seções.
- **CSS3:** tema dark premium, neon suave, responsividade, transições e layout em grid.
- **JavaScript:** catálogo, estado do carrinho, totais, eventos e geração dos pedidos.
- **Python HTTP Server:** servidor local para testes durante o desenvolvimento.
- **Git e GitHub:** versionamento, colaboração e armazenamento do projeto.
- **GitHub Pages:** publicação automática da versão online.

## Organização dos arquivos

```text
.
├── index.html              # Estrutura da loja e componentes da interface
├── style.css               # Tema visual, responsividade e animações
├── script.js               # Catálogo, carrinho e fluxos de checkout
├── README.md               # Documentação e apresentação do projeto
└── .github/workflows/
		└── pages.yml           # Publicação automática no GitHub Pages
```

## Como executar localmente

Com Python instalado, execute na pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois, abra `http://localhost:8000` no navegador.

## Como demonstrar o projeto

1. Abra o link público da loja.
2. Navegue até a seção de produtos.
3. Clique em **Adicionar** em um ou mais produtos.
4. Abra o carrinho e altere as quantidades.
5. Revise o total do pedido.
6. Escolha o envio por e-mail ou WhatsApp.

Essa sequência apresenta rapidamente o visual, a interação e a lógica principal da
aplicação.

## Segurança implementada

O projeto possui proteções adequadas para um site estático:

- Content Security Policy restringindo scripts, imagens, fontes e destinos externos.
- Sanitização e escape de dados antes da renderização no DOM.
- Validação de URLs de imagem para aceitar apenas HTTPS do provedor autorizado.
- Limite de 99 unidades por produto no carrinho.
- Cooldown curto para evitar múltiplas aberturas consecutivas do checkout.
- Abertura do WhatsApp com `noopener,noreferrer`.

Os headers abaixo devem ser configurados também na hospedagem, pois não podem ser
aplicados de forma confiável apenas pelo HTML:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; form-action 'self' https://wa.me mailto:; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Próximas evoluções

Para transformar o protótipo em uma loja de produção, os próximos passos seriam:

- criar um backend para validar produtos, preços e pedidos;
- integrar um gateway de pagamento;
- adicionar banco de dados e painel administrativo;
- armazenar pedidos com segurança;
- configurar domínio próprio, HTTPS e headers no servidor;
- adicionar testes automatizados e monitoramento.

> O checkout atual prepara o pedido e abre o WhatsApp ou o cliente de e-mail. Ele não
> processa pagamentos nem substitui uma validação no servidor.

## Autoria

Projeto desenvolvido por **Rafael Sales** como estudo prático de front-end, interação
com o DOM, organização de código e publicação web.