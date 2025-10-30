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

## API Postman Collection
* API Postman Collection has added in the api-postmancollection.json file. please have it import and test it. 


### Overview

Used a JWT-based authentication system with two types of tokens:
* Access Token – Short-lived JWT for authorizing API requests.
* Refresh Token – Long-lived JWT for renewing access tokens without re-login.

* A valid refresh token is verified by matching the tokenId embedded in the refresh token JWT against the corresponding record in the RefreshTokens collection.

* The MongoDB TTL mechanism automatically removes expired entries from the RefreshTokens collection, ensuring secure and efficient token cleanup.