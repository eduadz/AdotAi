# Como Rodar o Projeto AdotAi para Desenvolvimento

Siga os passos abaixo para subir o ambiente de desenvolvimento local sem quebrar a aplicação.

---

## Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão LTS recomendada)
- **Docker** e **Docker Compose**

---

## Passo a Passo

### 1. Inicializar o Banco de Dados (Docker)
Suba apenas o serviço do banco de dados PostgreSQL usando o Docker Compose na raiz do projeto:
```bash
docker compose up db -d
```
*Isso lerá as configurações de ambiente do arquivo `.env` localizado na raiz do projeto.*

### 2. Aplicar o Schema no Banco de Dados
Aguarde alguns segundos até o container do banco inicializar por completo e execute o seguinte comando na raiz do projeto para criar a estrutura de tabelas:
```bash
docker exec -i adotai-db psql -U adotai_user -d adotai_db < backend/database/schema.sql
```

### 3. Rodar o Backend Localmente (Modo Watch)
Entre na pasta do backend, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd backend
npm install
npm run start:dev
```
O backend estará de pé respondendo localmente em `http://localhost:8000`.

### 4. Acessar o Swagger
Abra seu navegador e acesse a documentação interativa dos endpoints em:
👉 **[http://localhost:8000/api](http://localhost:8000/api)**

---

## Solução de Problemas Comuns
- **Erro de Conexão com o Banco**: Certifique-se de que o container do Docker `adotai-db` está rodando (`docker ps`) e que a porta `5432` está livre na sua máquina local.
- **Limpar o Banco**: Se precisar resetar a base de dados inteira, execute `docker compose down -v` na raiz e refaça os passos acima.
