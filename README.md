# Geek Shop API

REST API for a geek products store. Handles product, category and store management
with role-based authentication for regular users and store owners (admin).

## ⚡ Quick Start

1. Clone the repository
2. Follow the [Setup](#setup) section
3. Follow the [How to Run](#how-to-run) section

## 🚀 Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL + TypeORM
- **Authentication:** AWS Cognito + Passport JWT
- **Storage:** AWS S3
- **Authorization:** CASL
- **API Docs:** Swagger
- **Containerization:** Docker (local development only)

## 🏗️ Architecture

The application follows a hexagonal architecture:

- **Domain Layer:** Business logic and entities
- **Application Layer:** Use cases and ports (interfaces)
- **Infrastructure Layer:** Adapters and implementations
- **Interface Layer:** Controllers and DTOs

## ⚙️ Setup

### Prerequisites

- [Node >=24](https://github.com/nvm-sh/nvm)
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

> Docker is used locally to emulate AWS services (Cognito + S3).
> For production, just update the environment variables to point to real AWS services.

### Installation

1. Run `npm ci` to install dependencies
2. Run `chmod +x ./data/scripts/*.sh` to make scripts executable
3. Run `npm run dev:prepare` to generate environment variables
4. Run `docker compose up -d` to start the containers
5. Run `npm run aws:prepare` to set up local AWS services
6. Run `npm run migration:run` to run database migrations
7. Optionally run `npm run fixtures` to load sample data

## ▶️ How to Run

### Server

```bash
# Development (watch mode)
npm run start:dev

# Debug mode
npm run start:debug

# Production (build first)
npm run build
npm run start:prod
```

### Database

```bash
# Sync schema with entities
npm run schema:sync

# Drop all tables
npm run schema:drop

# Load sample data
npm run fixtures
```

### Code Quality

```bash
# Lint and fix
npm run lint

# Format code
npm run format
```

### Local AWS Services

```bash
# Set up all services at once
npm run aws:prepare

# Or individually
npm run cognito:prepare  # Cognito
npm run s3:prepare       # S3
```

## 🌍 Environment Variables

The `dev:prepare` script generates the `.env` file automatically. Key variables:

| Variable                     | Description                         | Example                   |
| ---------------------------- | ----------------------------------- | ------------------------- |
| `NODE_ENV`                   | Environment name                    | `development`             |
| `PORT`                       | Server port                         | `3001`                    |
| `FRONTEND_URL`               | Frontend URL for CORS               | `http://localhost:3000`   |
| `DB_TYPE`                    | Database type                       | `postgres`                |
| `DB_PORT`                    | Database port                       | `5432`                    |
| `DB_USERNAME`                | Database user                       | `root`                    |
| `DB_PASSWORD`                | Database password                   | `secret`                  |
| `DB_NAME`                    | Database name                       | `db_dev`                  |
| `AWS_ACCESS_KEY_ID`          | AWS access key (use `test` locally) | `test`                    |
| `AWS_SECRET_ACCESS_KEY`      | AWS secret key (use `test` locally) | `test`                    |
| `AWS_REGION`                 | AWS region                          | `us-east-1`               |
| `AWS_ENDPOINT`               | LocalStack endpoint                 | `http://localhost:4566`   |
| `COGNITO_PORT`               | Local Cognito port                  | `9229`                    |
| `COGNITO_USER_POOL_ID`       | Cognito User Pool ID                | `local_75UboFBP`          |
| `COGNITO_CLIENT_ID`          | Cognito Client ID                   | `4ml0fjw3c...`            |
| `COGNITO_ENDPOINT`           | Local Cognito endpoint              | `http://localhost:9229`   |
| `COGNITO_ISSUER`             | Cognito token issuer URL            | `http://0.0.0.0:9229/...` |
| `S3_BUCKET`                  | S3 bucket name                      | `test-bucket`             |
| `AUTH_ALLOWED_EMAIL_DOMAINS` | Allowed email domains for auth      | `gmail.com`               |

## 📖 API Docs

Swagger UI available at `http://localhost:3001/api`

### Modules

| Module       | Description                                                                               |
| ------------ | ----------------------------------------------------------------------------------------- |
| `iam`        | Handles authentication (Cognito + JWT), authorization (CASL policies) and user management |
| `stores`     | Store management (CRUD)                                                                   |
| `categories` | Category management (CRUD)                                                                |
| `products`   | Product management (CRUD)                                                                 |
| `catalog`    | Orchestrates stores, categories and products to avoid circular dependencies               |
| `upload`     | Image upload handling via AWS S3                                                          |

### Authorization

All endpoints are protected by a policy-based access control system using CASL:

| Role         | Access                                          |
| ------------ | ----------------------------------------------- |
| `SuperAdmin` | Full system access                              |
| `Admin`      | Manage their own store, products and categories |
| `User`       | Read-only access to products and categories     |

## 🗄️ Migrations

### Commands

```bash
# Create a new empty migration
npm run migration:create --name=your-migration-name

# Generate migration from entity changes
npm run migration:generate --name=your-migration-name

# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Notes

- Migration files are located in `./data/migrations`
- In production, migrations run automatically before the server starts
- Each migration should have a descriptive name and be reversible

## 🧪 Testing

Uses **Jest** and **Supertest** for testing. CRUD tests use SQLite to avoid mocking
the database. External services are mocked when needed.

### Commands

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Debug mode
npm run test:debug
```

### Structure

- `src/**/*.spec.ts` - Unit tests
- `test/` - End-to-end tests

## 🛠️ Recommended Tools

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## ⚠️ Troubleshooting

### 401 errors with Cognito

If you get 401 errors with token validation, check that `COGNITO_ISSUER` in `.env`
matches exactly what's in the token. Cognito Local may use
`http://0.0.0.0:9229/local_[POOL_ID]` instead of `localhost`.

## 👤 Author

| [<img src='https://avatars.githubusercontent.com/u/105408069?v=4' width=115><br><sub>Javier Anibal Villca</sub>](https://github.com/Javier104-dev) |
| :------------------------------------------------------------------------------------------------------------------------------------------------: |
