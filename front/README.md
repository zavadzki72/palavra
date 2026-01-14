# 🎮 Palavra - Frontend

Interface web do jogo de adivinhação de palavras desenvolvida em **HTML, CSS e JavaScript** puro.

## 📚 Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| HTML5 | - | Estrutura da página |
| CSS3 | - | Estilização e animações |
| JavaScript (ES6+) | - | Lógica do jogo |
| jQuery | 3.5.1 | Manipulação do DOM e requisições AJAX |
| Google Fonts (Mitr) | - | Tipografia |

## 📁 Estrutura do Projeto

```
front/
├── index.html            # Página principal do jogo
├── main.js               # Lógica do jogo (código fonte)
├── main-obsfucated.js    # Código ofuscado para produção
├── main.css              # Estilos principais
├── termostato.html       # Página de estatísticas globais
├── termostato.js         # Lógica do termostato
├── termostato.css        # Estilos do termostato
├── termostato-obsfucated.js
└── icon.png              # Ícone da aplicação
```

## 🎯 Funcionalidades

- ✅ Jogo estilo Wordle em português brasileiro
- ✅ 6 tentativas para adivinhar a palavra do dia
- ✅ Feedback visual de letras (correta, posição errada, incorreta)
- ✅ Teclado virtual interativo
- ✅ Estatísticas de desempenho do jogador
- ✅ Modo de alto contraste (acessibilidade)
- ✅ PWA (Progressive Web App) - instalável
- ✅ Design responsivo (mobile-first)
- ✅ Preenchimento automático de acentos

## 🚀 Como Executar

### Desenvolvimento Local

Basta servir os arquivos estáticos com qualquer servidor HTTP:

```bash
# Com Python
python -m http.server 8080

# Com Node.js (http-server)
npx http-server .

# Com VS Code
# Use a extensão "Live Server"
```

Acesse `http://localhost:8080` no navegador.

### Produção

Hospede os arquivos em qualquer servidor web estático (Nginx, Apache, CDN, etc.).

**URL Pública:** [https://palavra.marccusz.com](https://palavra.marccusz.com)

## 🎨 Design

- Tema escuro com tons de rose/roxo
- Fonte: [Mitr](https://fonts.google.com/specimen/Mitr)
- Animações suaves de flip nas letras
- Inspirado no [Wordle](https://www.nytimes.com/games/wordle/index.html) e [Term.ooo](https://term.ooo)

## 📱 PWA

A aplicação é instalável como PWA, com suporte a:
- Instalação na home screen
- Modo fullscreen
- Ícone personalizado

## 📄 Licença

Projeto desenvolvido para fins de estudo. Interface baseada no [Term.ooo](https://term.ooo), com backend próprio.
