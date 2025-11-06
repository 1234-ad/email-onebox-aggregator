# Setup Guide

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and npm installed
- **Docker** and Docker Compose installed
- **OpenAI API key** (get from https://platform.openai.com)
- **Email accounts** with IMAP access enabled
- **Slack webhook URL** (optional, for notifications)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/1234-ad/email-onebox-aggregator.git
cd email-onebox-aggregator
```

### 2. Start Elasticsearch

```bash
docker-compose up -d
```

Wait for Elasticsearch to be ready (check with `docker-compose logs -f`).

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Gmail Account (Example)
IMAP_HOST_1=imap.gmail.com
IMAP_PORT_1=993
IMAP_USER_1=your-email@gmail.com
IMAP_PASSWORD_1=your-app-password
IMAP_TLS_1=true

# Outlook Account (Example)
IMAP_HOST_2=imap-mail.outlook.com
IMAP_PORT_2=993
IMAP_USER_2=your-email@outlook.com
IMAP_PASSWORD_2=your-password
IMAP_TLS_2=true

# Webhooks (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
GENERIC_WEBHOOK_URL=https://webhook.site/your-unique-url
```

### 4. Install Backend Dependencies

```bash
npm install
```

### 5. Start Backend

```bash
npm run dev
```

The backend will:
- Connect to Elasticsearch
- Initialize the vector database
- Connect to your email accounts via IMAP
- Start listening on port 3000

### 6. Configure Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

### 7. Start Frontend

```bash
npm run dev
```

The frontend will start on http://localhost:5173

### 8. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/health
- **Elasticsearch**: http://localhost:9200
- **Kibana** (optional): http://localhost:5601

## Email Account Setup

### Gmail

1. Enable IMAP in Gmail settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Use the app password in `.env` as `IMAP_PASSWORD_1`

### Outlook/Hotmail

1. Go to Outlook settings
2. Enable IMAP access
3. Use your regular password in `.env`

### Other Providers

Most email providers support IMAP. Check their documentation for:
- IMAP server address
- Port (usually 993 for SSL/TLS)
- Authentication requirements

## Webhook Setup

### Slack

1. Go to https://api.slack.com/apps
2. Create a new app
3. Enable "Incoming Webhooks"
4. Add webhook to workspace
5. Copy the webhook URL to `.env`

### Generic Webhook

1. Go to https://webhook.site
2. Copy your unique URL
3. Add to `.env` as `GENERIC_WEBHOOK_URL`

## Testing with Postman

1. Import `postman/collection.json` into Postman
2. Set the `base_url` variable to `http://localhost:3000`
3. Test each endpoint sequentially:
   - Health check
   - Get accounts
   - Get emails
   - Search emails
   - Categorize email
   - Add RAG context
   - Suggest reply
   - Test webhooks

## Troubleshooting

### Elasticsearch Connection Failed

```bash
# Check if Elasticsearch is running
docker-compose ps

# View logs
docker-compose logs elasticsearch

# Restart
docker-compose restart elasticsearch
```

### IMAP Connection Failed

- Verify credentials in `.env`
- Check if IMAP is enabled for your account
- For Gmail, ensure you're using an App Password
- Check firewall/network settings

### OpenAI API Errors

- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure you have access to GPT-4 (or change model in config)

### Port Already in Use

```bash
# Backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

## Next Steps

1. **Add more email accounts**: Add `IMAP_HOST_3`, `IMAP_HOST_4`, etc. in `.env`
2. **Customize RAG context**: Use the `/api/ai/context` endpoint
3. **Set up webhooks**: Configure Slack and other integrations
4. **Explore the UI**: Search, filter, and categorize emails
5. **Test AI replies**: Click "Suggest Reply" on any email

## Production Deployment

For production:

1. Use environment variables instead of `.env` files
2. Set up proper authentication (JWT/OAuth2)
3. Use managed Elasticsearch (AWS, Elastic Cloud)
4. Enable HTTPS
5. Set up monitoring and logging
6. Configure rate limiting
7. Use a process manager (PM2, systemd)

## Support

For issues or questions:
- Check the [API Documentation](./API.md)
- Review the [Troubleshooting](#troubleshooting) section
- Open an issue on GitHub
