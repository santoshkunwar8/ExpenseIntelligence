# Local Development Setup

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Comes with Node.js
- **OpenAI API Key**: Required for AI budget assistant

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/santoshkunwar8/ExpenseIntelligence.git
   cd ExpenseIntelligence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   NODE_ENV=development
   PORT=5000
   ```

4. **For local development (fix Vite config issues)**
   
   If you encounter the `import.meta.dirname` error, use the local Vite config:
   ```bash
   # Rename the original vite config
   mv vite.config.ts vite.config.replit.ts
   
   # Use the local-compatible config
   mv vite.config.local.ts vite.config.ts
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open your browser to `http://localhost:5000`
   - The Express server serves both API and frontend

## Troubleshooting

### Error: `The "paths[0]" argument must be of type string. Received undefined`

This happens because the original `vite.config.ts` uses `import.meta.dirname` which isn't available in Node.js 18.

**Solution**: Use the provided `vite.config.local.ts`:
```bash
cp vite.config.local.ts vite.config.ts
```

### Missing OpenAI API Key

If the AI assistant doesn't work:
1. Get an API key from https://platform.openai.com/
2. Add it to your `.env` file
3. Restart the server

### Port conflicts

If port 5000 is in use:
1. Change the PORT in your `.env` file
2. Restart the application

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # App pages
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage
├── shared/                # Shared schemas
└── .env                   # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Features

- Balance tracking with visual charts
- Income and expense categorization
- AI-powered budget analysis
- Responsive design
- Real-time updates