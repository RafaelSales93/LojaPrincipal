# Minha Primeira Loja | Gemi Tech

![Banner de tecnologia](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85)

## Sobre o projeto

A **Gemi Tech** é uma loja virtual demonstrativa de eletrônicos e utilidades. O projeto apresenta produtos, permite montar um carrinho e encaminha o pedido por e-mail ou WhatsApp.

**[Abrir a loja online](https://rafaelsales93.github.io/MinhaPrimeiraLoja/)**

## Linguagens utilizadas

- **HTML5:** estrutura e conteúdo da página.
- **CSS3:** cores, layout, responsividade e animações.
- **JavaScript:** catálogo, carrinho, cálculos e checkout.

### Ferramentas

- **Git e GitHub:** versionamento do projeto.
- **GitHub Pages:** publicação da loja.
- **Python:** servidor local para testes.

## Funcionalidades

- Catálogo com imagem, preço, categoria e avaliação.
- Carrinho com adicionar, remover e alterar quantidade.
- Cálculo automático do total.
- Revisão do pedido por e-mail.
- Envio do pedido pelo WhatsApp.
- Layout adaptado para celular e computador.

## Visual do catálogo

<div align="center">
  <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=420&q=80" alt="Fone Bluetooth" width="30%" />
  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=420&q=80" alt="Smartwatch" width="30%" />
  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=420&q=80" alt="Tecnologia" width="30%" />
</div>

## Estrutura

```text
index.html                  # Estrutura da loja
style.css                   # Estilo e responsividade
script.js                   # Interações e carrinho
README.md                   # Documentação
.github/workflows/pages.yml # Publicação no GitHub Pages
```

## Como executar

Na pasta do projeto, execute:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Roteiro para apresentação

1. Mostrar a página inicial e o catálogo.
2. Adicionar produtos ao carrinho.
3. Alterar quantidades e conferir o total.
4. Demonstrar as opções de e-mail e WhatsApp.
5. Explicar que a loja está publicada no GitHub Pages.

## Segurança

O projeto possui proteção para um site estático:

- Content Security Policy para restringir recursos externos.
- Sanitização dos textos antes da renderização no DOM.
- Validação das URLs das imagens.
- Limite de quantidade por produto.
- Proteção contra aberturas repetidas do checkout.
- Abertura do WhatsApp com `noopener,noreferrer`.

## Próximos passos

Para uma loja real, seria necessário adicionar backend, banco de dados, autenticação, pagamento online e validação dos pedidos no servidor.

> O checkout atual prepara o pedido e abre o e-mail ou WhatsApp. Ele não processa pagamentos.

## Autoria

Projeto desenvolvido por **Rafael Sales** como estudo prático de front-end e publicação web.
