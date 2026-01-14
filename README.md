# 🔤 Palavra

**Jogo de adivinhação da palavra do dia** - Uma versão em português brasileiro inspirada no Wordle.

🌐 **Acesse:** [https://palavra.marccusz.com](https://palavra.marccusz.com)

---

## 🎮 Como Jogar

1. Você tem **6 tentativas** para adivinhar a palavra do dia
2. Digite uma palavra de 5 letras e pressione Enter
3. As cores das letras indicam:
   - 🟩 **Verde**: Letra correta na posição correta
   - 🟨 **Amarelo**: Letra correta na posição errada
   - ⬛ **Cinza**: Letra não está na palavra
4. Os acentos são preenchidos automaticamente
5. Uma nova palavra é disponibilizada a cada dia

## ✨ Funcionalidades

- 🎯 Palavra nova todos os dias
- 📊 Estatísticas de desempenho pessoal
- 🌡️ **Palavrostato** - Estatísticas globais de todos os jogadores
- 📱 Aplicação PWA instalável
- ♿ Modo de alto contraste para acessibilidade
- 📤 Compartilhamento de resultados

## 🏗️ Arquitetura

O projeto é dividido em duas partes:

| Componente | Tecnologias | Descrição |
|------------|-------------|-----------|
| [**Backend**](./back) | .NET 10, PostgreSQL, JWT | API RESTful para validação e estatísticas |
| [**Frontend**](./front) | HTML, CSS, JavaScript | Interface web do jogo |

```
palavra/
├── back/     # API .NET 10
├── front/    # Interface Web
└── README.md
```

## 🚀 Deploy

### Backend
A API pode ser containerizada via Docker ou publicada em qualquer host compatível com .NET 10.

### Frontend
Arquivos estáticos que podem ser servidos por qualquer servidor web (Nginx, Vercel, Netlify, etc.).

## 👨‍💻 Desenvolvimento

```bash
# Backend
cd back/Termo.API
dotnet run

# Frontend (com qualquer servidor HTTP)
cd front
npx http-server .
```

## 📚 Créditos

- Inspirado no [Wordle](https://www.nytimes.com/games/wordle/index.html) original
- Frontend baseado no [Term.ooo](https://term.ooo)
- Backend desenvolvido com lógica própria

## 📄 Licença

Projeto desenvolvido para fins de estudo e aprendizado.

---
