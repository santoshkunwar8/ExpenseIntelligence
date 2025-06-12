# Expense Tracking Dashboard

A modern expense tracking web application with AI-powered budget insights.

## Features

- **Balance Overview**: View current balance and monthly income/expense statistics
- **Transaction Management**: Add income and expenses with categorization
- **Interactive Charts**: Visualize balance fluctuations over time
- **AI Budget Assistant**: Get personalized financial advice using OpenAI
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (easily replaceable with database)
- **AI Integration**: OpenAI GPT-4o for budget analysis

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Start the development server: `npm run dev`
5. Open http://localhost:5000 in your browser

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript schemas
└── components.json  # UI component configuration
```

## API Endpoints

- `GET /api/balance` - Get current balance
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Add new transaction
- `GET /api/balance-history` - Get balance chart data
- `POST /api/ai-assistant` - Get AI budget advice

## License

MIT