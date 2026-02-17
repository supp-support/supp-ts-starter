# supp-ts-starter

A Next.js example project demonstrating the [supp-ts](https://www.npmjs.com/package/supp-ts) SDK — AI-powered customer support classification and routing.

## What's inside

- **Interactive demo page** — try classification, priority scoring, and more from the browser
- **API routes** — server-side examples using the SDK (see `src/app/api/`)
- **Widget integration** — embedded Supp chat widget via `next/script`
- **TypeScript** — fully typed, shows error handling patterns

## Quick start

```bash
# Clone
git clone https://github.com/supp-support/supp-ts-starter
cd supp-ts-starter

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your API keys from https://supp.support/dashboard

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## API routes

| Route | SDK Method | Cost |
|-------|-----------|------|
| `POST /api/classify` | `supp.classify(message)` | $0.20 |
| `POST /api/priority` | `supp.priorityScore(message)` | $0.03 |
| `GET /api/intents` | `supp.intents.list({ category })` | Free |
| `GET /api/conversations` | `supp.conversations.list()` | Free |
| `GET /api/balance` | `supp.billing.balance()` | Free |

## Project structure

```
src/
  app/
    page.tsx                    # Interactive demo UI
    layout.tsx                  # Widget embed + global styles
    globals.css                 # Dark theme styles
    api/
      classify/route.ts         # Classification endpoint
      priority/route.ts         # Priority scoring endpoint
      intents/route.ts          # Browse intents endpoint
      conversations/route.ts    # List conversations endpoint
      balance/route.ts          # Check balance endpoint
  lib/
    supp.ts                     # SDK singleton
```

## Learn more

- [supp-ts SDK](https://www.npmjs.com/package/supp-ts) — full SDK documentation
- [Supp Docs](https://supp.support/docs) — widget, API reference, routing, integrations
- [MCP Server Docs](https://github.com/supp-support/mcp-docs) — manage Supp via AI agents

## License

PolyForm Noncommercial 1.0.0
