# API Node.js + Express + Prisma + MySQL + Jest

Welcome to the API developed with **Node.js**, **Express**, **Prisma ORM**, **MySQL** as database and **Jest** for unity tests.

---

## 🚀 Tecnologies

* **Node.js**: 
* **Express**: 
* **Prisma ORM**: 
* **MySQL**: 
* **Jest**: 
* **Bcryptjs**: 
* **Dotenv**: 
* **Jsonwebtoken**: 
* **Nodemon**: 

---

## 📋 Prerequisites

Before start, you need to install all of this in your computer:

* **Node.js**: [Download](https://nodejs.org/en/download/)
* **npm** 
* **MySQL Server**: [Download](https://dev.mysql.com/downloads/mysql/) or you can use a cloud service.
* **Git**: [Download](https://git-scm.com/downloads) 

---

## 🛠️ Configuration and instalation

Follow steps above to configure this project in your computer:

1.  **Clone the repositorie:**

    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd nome-da-pasta-do-projeto
    ```

2.  **Install the dependences:**

    ```bash
    npm install
    ```

3.  **Configure the ambient variables:**

    Create a file `.env` and add the variables:

    ```env
    # Database Configuration
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
    # Exemplo: DATABASE_URL="mysql://root:minhasenha@localhost:3306/meu_banco_de_dados_api"

    # JWT Secret (para autenticação)
    JWT_SECRET="sua_chave_secreta_jwt_bem_longa_e_aleatoria"

    # Server Port
    PORT=3000
    ```
    *remember subsitute `USER`, `PASSWORD`, `HOST`, `PORT`, `DATABASE_NAME` and `sua_chave_secreta_jwt_bem_longa_e_aleatoria` for your values.*

4.  **Execute the migrations of Prisma:**

    Create the database and tables in your `schema.prisma`.

    ```bash
    npx prisma migrate dev --name init_database #
    ```

5.  **Generate the Prisma Client:**

    This command generate the necessary code to the Prisma integrate with you database.

    ```bash
    npx prisma generate
    ```

---

## ▶️ How run the Application

For start the server in develop mode (with `nodemon` for automatic charge):

```bash
npm run dev
```

## ▶️ How run the Test
```bash
npm test