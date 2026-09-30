# LojaPrincipal | Gemi Tech

Loja virtual demonstrativa de eletrônicos, utilidades e serviços, com catálogo responsivo, carrinho e checkout por e-mail ou WhatsApp.

## Acesso

- **Loja online:** https://rafaelsales93.github.io/LojaPrincipal/
- **Painel administrativo local:** `admin.html`

## Funcionalidades

- Catálogo com produtos e serviços.
- Filtros por categoria.
- Carrinho com inclusão, remoção, alteração de quantidade e total automático.
- Checkout por e-mail e WhatsApp.
- Formulário de entrega com nome, sobrenome, endereço e observação.
- Registro de pedidos e visualizações no Supabase.
- Painel administrativo com autenticação, pedidos e itens mais vistos.
- Layout responsivo para celular e computador.

## Tecnologias

- HTML5, CSS3 e JavaScript.
- Supabase local com Postgres, Auth, Storage, Realtime e RLS.
- GitHub Pages para publicação da loja.

## Estrutura

```text
index.html                  # Loja e catálogo
style.css                   # Estilos da loja
script.js                   # Catálogo, carrinho e checkout
admin.html                  # Login e painel administrativo
admin.css                   # Estilos do painel
admin.js                    # Autenticação e dados do painel
produtos/                   # Imagens dos produtos e serviços
supabase/                   # Configuração e migrações do backend local
.github/workflows/pages.yml # Publicação no GitHub Pages
README.md                   # Documentação
```

## Execução local

### Loja

Na pasta do projeto, execute um servidor HTTP local:

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000.

### Backend local

Com o Supabase CLI e o Docker Desktop instalados:

```bash
supabase start
```

O projeto usa `LojaPrincipal` como identificador local. A área administrativa exige uma conta autenticada e um perfil com `is_admin = true` na tabela `profiles`.

Para interromper os serviços locais:

```bash
supabase stop
```

## Segurança

- A chave `anon` pode ser usada no navegador apenas para operações protegidas por autenticação e RLS.
- Chaves `service_role` nunca devem ser colocadas no HTML, JavaScript público ou repositório.
- O acesso administrativo é controlado pelo Supabase Auth, pelo campo `profiles.is_admin` e pelas políticas RLS.
- Em produção, use HTTPS, variáveis de ambiente e um backend server-side para operações privilegiadas.

## Como adicionar produtos

1. Coloque a imagem em `produtos/acessorios/` ou `produtos/servicos/`.
2. Adicione o produto à lista `products` em `script.js`.
3. Use o caminho relativo da imagem, por exemplo `produtos/acessorios/novo-item.jpg`.
4. Teste localmente antes de publicar.

## Publicação

As alterações são publicadas pelo workflow do GitHub Pages em `.github/workflows/pages.yml`. Após atualizar o repositório, aguarde a execução do workflow para que a versão online seja renovada.
