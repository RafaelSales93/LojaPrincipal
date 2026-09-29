# MinhaPrimeiraLoja

## Segurança

O projeto inclui proteções adequadas para um site estático:

- Content Security Policy restringindo scripts, imagens, fontes e destinos externos.
- Sanitização e escape de dados antes da renderização no DOM.
- Validação de URLs de imagem para aceitar apenas HTTPS do provedor autorizado.
- Limite de 99 unidades por produto no carrinho.
- Cooldown curto para evitar múltiplas aberturas consecutivas do checkout.
- Abertura do WhatsApp com `noopener,noreferrer`.

### Publicação

Os headers abaixo devem ser configurados no servidor ou na plataforma de hospedagem,
pois não podem ser aplicados de forma confiável apenas pelo HTML:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; form-action 'self' https://wa.me mailto:; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

O checkout atual abre WhatsApp ou e-mail e não processa pagamentos. Para uma loja de
produção, pedidos, preços e pagamentos devem ser validados também em um backend.