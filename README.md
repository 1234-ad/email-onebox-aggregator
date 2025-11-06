# Email Onebox Aggregator

A feature-rich email aggregator with real-time IMAP synchronization, AI-powered categorization, Elasticsearch search, and RAG-based reply suggestions.

## 🚀 Features

### ✅ Implemented Features

1. **Real-Time Email Synchronization**
   - Sync multiple IMAP accounts simultaneously (minimum 2)
   - Fetch last 30 days of emails
   - Persistent IMAP IDLE connections for real-time updates
   - No cron jobs - true push notifications

2. **Searchable Storage with Elasticsearch**
   - Locally hosted Elasticsearch (Docker)
   - Full-text search across all emails
   - Filter by folder and account
   - Advanced indexing for fast queries

3. **AI-Based Email Categorization**
   - Automatic categorization into:
     - Interested
     - Meeting Booked
     - Not Interested
     - Spam
     - Out of Office
   - Powered by OpenAI GPT models

4. **Slack & Webhook Integration**
   - Slack notifications for "Interested" emails
   - Webhook triggers for external automation
   - Configurable webhook URLs

5. **Frontend Interface**
   - Clean, modern UI built with React + TypeScript
   - Email list with categorization badges
   - Search and filter functionality
   - Account and folder filtering
   - Responsive design

6. **AI-Powered Suggested Replies (RAG)**
   - Vector database for product/outreach context
   - Retrieval-Augmented Generation for smart replies
   - Context-aware suggestions based on email content
   - Customizable training data

## 🛠️ Tech Stack

- **Backend**: TypeScript, Node.js, Express
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Database**: Elasticsearch (Docker)
- **Vector DB**: Chroma (for RAG)
- **AI**: OpenAI GPT-4
- **Email**: node-imap with IDLE support
- **Notifications**: Slack webhooks

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- OpenAI API key
- Slack webhook URL (optional)
- Email accounts with IMAP access enabled

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/1234-ad/email-onebox-aggregator.git
cd email-onebox-aggregator
```

### 2. Start Elasticsearch

```bash
docker-compose up -d
```

### 3. Configure environment variables

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your credentials
```

### 4. Install dependencies and start backend

```bash
npm install
npm run dev
```

### 5. Start frontend (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

### 6. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Elasticsearch: http://localhost:9200

## 📁 Project Structure

```
email-onebox-aggregator/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   │   ├── imap.service.ts
│   │   │   ├── elasticsearch.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── rag.service.ts
│   │   │   └── webhook.service.ts
│   │   ├── routes/          # API routes
│   │   ├── models/          # Data models
│   │   ├── utils/           # Utilities
│   │   └── server.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API clients
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Email Accounts

Add your email accounts in `.env`:

```env
# Account 1
IMAP_HOST_1=imap.gmail.com
IMAP_PORT_1=993
IMAP_USER_1=your-email@gmail.com
IMAP_PASSWORD_1=your-app-password

# Account 2
IMAP_HOST_2=imap.outlook.com
IMAP_PORT_2=993
IMAP_USER_2=your-email@outlook.com
IMAP_PASSWORD_2=your-password
```

### AI Configuration

```env
OPENAI_API_KEY=your-openai-api-key
```

### Webhook Configuration

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
GENERIC_WEBHOOK_URL=https://webhook.site/your-unique-url
```

## 📡 API Endpoints

### Email Management
- `GET /api/emails` - List all emails with filters
- `GET /api/emails/:id` - Get email details
- `GET /api/emails/search` - Search emails
- `POST /api/emails/sync` - Trigger manual sync

### Account Management
- `GET /api/accounts` - List configured accounts
- `GET /api/accounts/:id/folders` - Get folders for account

### AI Features
- `POST /api/ai/categorize/:emailId` - Categorize email
- `POST /api/ai/suggest-reply/:emailId` - Get reply suggestion

### Webhooks
- `POST /api/webhooks/test` - Test webhook configuration

## 🧪 Testing with Postman

1. Import the Postman collection from `postman/collection.json`
2. Set environment variables
3. Test each endpoint sequentially

## 🎯 Feature Completion Status

- [x] Real-time IMAP synchronization (2+ accounts)
- [x] Elasticsearch storage and search
- [x] AI email categorization
- [x] Slack notifications
- [x] Webhook integration
- [x] Frontend interface
- [x] RAG-powered reply suggestions

## 🏆 Leaderboard Submission

This project implements all 6 required features:
1. ✅ Real-time IMAP sync with IDLE mode
2. ✅ Elasticsearch with Docker
3. ✅ AI categorization (5 categories)
4. ✅ Slack + webhook integration
5. ✅ Full frontend interface
6. ✅ RAG-based reply suggestions

## 📝 Notes

- Gmail users: Enable "Less secure app access" or use App Passwords
- Outlook users: Enable IMAP in settings
- The system syncs last 30 days on first run
- IDLE connections maintain real-time sync
- Vector DB stores product/outreach context for RAG

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Built for the Email Onebox Assignment

---

**Status**: All features implemented and tested ✅
