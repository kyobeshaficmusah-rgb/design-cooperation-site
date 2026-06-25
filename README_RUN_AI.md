Local AI chatbot setup for Design Cooperation

1. Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)

2. Install dependencies
Open a terminal in the project folder and run:

```bash
npm install
```

3. Add your OpenAI API key
Create a file named `.env` in the project root (next to `server.js`) and add:

```
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-3.5-turbo
PORT=3000
```

Never commit or share the `.env` file.

4. Run the local server

```bash
npm run start
```

This will start an Express server that serves the site and exposes an API proxy at `/api/chat` which calls the OpenAI API using your server-side key.

5. Open the site
Visit `http://localhost:3000` in your browser. Use the AI Consultant chat UI in the site — messages will be sent to the server and forwarded to OpenAI.

Security
- Keep your OpenAI API key secret; do not expose it client-side.
- For production, run the server in a secure environment and consider rate-limiting and authentication.

If you want, I can create an example serverless function for Vercel or Netlify instead of the local Express server.