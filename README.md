# Full-Stack Mithril.js + Fastify Boilerplate for Vercel

This is a comprehensive boilerplate for building modern, full-stack Single-Page Applications (SPAs). It combines a lightweight and powerful Mithril.js frontend with a high-performance Fastify backend, all configured for seamless **serverless deployment on Vercel**.

This project was built from the ground up to include a complete and secure user authentication system, making it an excellent starting point for your next web application.

## ✨ Features

- **Complete User Authentication:**
  - User Signup with secure password hashing (bcrypt).
  - User Login with JWT (JSON Web Token) generation.
  - Secure "Forgot Password" flow with 6-digit codes sent via email.
  - Password Reset functionality with code and email verification.
- **Modern Tech Stack:**
  - **Frontend:** [Mithril.js](https://mithril.js.org/) for a fast and lightweight UI.
  - **Backend:** [Fastify](https://www.fastify.io/) for a low-overhead, high-performance Node.js API.
  - **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for flexible data modeling.
  - **Deployment:** Pre-configured for easy **serverless deployment on [Vercel](https://vercel.com/)**.
- **Development Experience:**
  - **Bundling:** Uses [esbuild](https://esbuild.github.io/) for incredibly fast frontend bundling.
  - **Live Reload:** Scripts included for watching file changes and rebuilding automatically.
  - **Environment-Aware:** Dynamically generates URLs and settings for both local development and production.

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [Yarn](https://yarnpkg.com/) (or npm)
- A [MongoDB](https://www.mongodb.com/cloud/atlas/register) database URI.
- An SMTP email account (e.g., from Gmail or a dedicated provider) for sending password reset emails.

### Installation & Configuration

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/guntur-d/genelec.git
    cd genelec
    ```

2.  **Install dependencies:**
    ```sh
    yarn install
    # or
    npm install
    ```

3.  **Create an environment file:**
    Copy the example `.env.example` file to a new file named `.env`.
    ```sh
    cp .env.example .env
    ```

4.  **Configure your environment variables in the `.env` file:**
    You will need to fill in your own credentials for the database, JWT secret, and email service.

    ```ini
    # Your MongoDB connection string
    MONGODB_URI="mongodb+srv://..."

    # A long, random, and secret string for signing JWTs
    JWT_SECRET="your-super-secret-jwt-string"

    # Your SMTP email credentials for Nodemailer
    EMAIL_USER="your-email@example.com"
    EMAIL_PASS="your-email-password"
    ```

### Running the Application

This project requires two terminal windows to run locally: one for the frontend bundler and one for the Vercel development server.

1.  **Terminal 1: Start the frontend watcher:**
    This command uses `esbuild` to watch your frontend files and automatically rebuild `public/bundle.js` on any change.
    ```sh
    yarn develop
    ```

2.  **Terminal 2: Start the Vercel development server:**
    This command runs the Fastify API and serves the static frontend, simulating the Vercel environment.
    ```sh
    vercel dev
    ```

Your application should now be running at `http://localhost:3000`.

## 📜 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.