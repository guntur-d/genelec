# Fastify Vercel App

This project is a simple Fastify application designed to run on Vercel. It includes a basic API endpoint for testing purposes.

## Project Structure

```
fastify-vercel-app
├── src
│   └── server.js        # Entry point of the application with Fastify server setup
├── package.json         # Configuration file for npm, including dependencies
└── README.md            # Documentation for the project
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd fastify-vercel-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Deploy to Vercel**:
   - Make sure you have the Vercel CLI installed. If not, you can install it using:
     ```bash
     npm install -g vercel
     ```
   - Run the following command to deploy your application:
     ```bash
     vercel
     ```

## API Endpoints

### GET /api/hello

This endpoint returns a JSON response with a greeting message.

**Response**:
```json
{
  "message": "Hello from Fastify on Vercel!"
}
```

## License

This project is licensed under the MIT License.