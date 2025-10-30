## Run Locally

Install dependencies

```bash
  npm ci
```

Create .env file with below

```bash
    MONGO_USER=root
    MONGO_PASSWORD=secret123
    MONGO_DB=avo
    PORT=4000
    NODE_ENV=development

    JWT_SECRET=avosecretkey
    JWT_REFRESH_SECRET=avorefreshkey
```

Start the server

```bash
  docker-compose up --build
```
