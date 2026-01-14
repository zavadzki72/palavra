# 🔧 Palavra - Backend

API RESTful desenvolvida em **.NET 10** para o jogo de adivinhação de palavras.

## 📚 Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| .NET | 10.0 | Framework principal |
| Entity Framework Core | 10.x | ORM para acesso ao banco de dados |
| PostgreSQL | - | Banco de dados relacional |
| JWT Bearer | 10.x | Autenticação e autorização |
| Swagger/OpenAPI | 7.x | Documentação da API |
| Refit | 9.x | Cliente HTTP tipado |
| Newtonsoft.Json | 13.x | Serialização JSON |

## 📁 Estrutura do Projeto

```
back/
├── Termo.API/               # Projeto principal da API
│   ├── Controllers/         # Endpoints da aplicação
│   │   ├── WorldController      # Validação de palavras e progresso
│   │   ├── AuthController       # Autenticação
│   │   └── TermostatoController # Estatísticas globais
│   ├── Services/            # Lógica de negócio
│   ├── BackgroundServices/  # Tarefas em background
│   ├── Configurations/      # Configurações (DI, Auth, CORS, etc.)
│   └── Dockerfile           # Containerização
├── Termo.Infrastructure/    # Camada de infraestrutura
│   ├── Repositories/        # Repositórios de dados
│   └── Migrations/          # Migrações do EF Core
└── Termo.Models/           # Modelos e DTOs
```

## 🚀 Como Executar

### Pré-requisitos
- .NET 10 SDK
- PostgreSQL

### Desenvolvimento

```bash
cd back/Termo.API
dotnet restore
dotnet run
```

A API estará disponível em `https://localhost:5001` com Swagger em `/swagger`.

### Docker

```bash
docker build -t palavra-api -f Termo.API/Dockerfile .
docker run -p 5000:80 palavra-api
```

## 📡 Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/World/GetPlayerTodayProgress` | Obtém progresso do jogador no dia |
| GET | `/World/GetStatistics` | Estatísticas do jogador |
| POST | `/World/ValidateWorld` | Valida tentativa de palavra |

## 🔐 Autenticação

A API utiliza **JWT Bearer Tokens** para autenticação. Todas as rotas (exceto `/Auth`) requerem um token válido no header:

```
Authorization: Bearer <token>
```

## 📄 Licença

Projeto desenvolvido para fins de estudo.
