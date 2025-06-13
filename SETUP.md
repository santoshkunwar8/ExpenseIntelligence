# Local Development Setup

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Comes with Node.js
- **OpenAI API Key**: Required for AI budget assistant

## Quick Start

1. **Clone and setup**
   ```bash
   git clone https://github.com/santoshkunwar8/ExpenseIntelligence.git
   cd ExpenseIntelligence
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   NODE_ENV=development
   PORT=5000
   ```

3. **Fix Node.js compatibility issues**
   
   The original files use `import.meta.dirname` which isn't available in Node.js 18. Replace with local versions:
   
   ```bash
   # Replace server files
   mv server/index.ts server/index.replit.ts
   mv server/vite.ts server/vite.replit.ts
   mv server/index.local.ts server/index.ts
   mv server/vite.local.ts server/vite.ts
   
   # Replace vite config
   mv vite.config.ts vite.config.replit.ts
   mv vite.config.local.ts vite.config.ts
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
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