# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Email    │  │ Search   │  │ Filters  │  │ AI Reply │   │
│  │ List     │  │ Bar      │  │          │  │ Suggest  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                         │  │
│  │  /emails  /accounts  /ai  /webhooks                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Controllers                         │  │
│  │  Email  │  Account  │  AI  │  Webhook                │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Services                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   IMAP   │  │Elastic   │  │   AI     │           │  │
│  │  │ Service  │  │ Search   │  │ Service  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │  ┌──────────┐  ┌──────────┐                          │  │
│  │  │   RAG    │  │ Webhook  │                          │  │
│  │  │ Service  │  │ Service  │                          │  │
│  │  └──────────┘  └──────────┘                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
         ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Email        │ │Elastic   │ │ OpenAI   │ │ Slack/       │
│ Servers      │ │ search   │ │ API      │ │ Webhooks     │
│ (IMAP IDLE)  │ │ (Docker) │ │          │ │              │
└──────────────┘ └──────────┘ └──────────┘ └──────────────┘
```

## Component Details

### Frontend Layer

**Technology**: React 18 + TypeScript + Vite + TailwindCSS

**Components**:
- `EmailList`: Displays paginated email list with categories
- `EmailDetail`: Shows full email content with AI reply button
- `SearchBar`: Search and filter interface
- `App`: Main application container

**Features**:
- Real-time email updates
- Full-text search
- Category filtering
- Account filtering
- AI-powered reply suggestions
- Responsive design

### Backend Layer

**Technology**: Node.js + Express + TypeScript

**Architecture Pattern**: Service-oriented architecture

#### API Routes
- `/api/emails` - Email management
- `/api/accounts` - Account status
- `/api/ai` - AI features (categorization, RAG)
- `/api/webhooks` - Webhook testing

#### Services

**IMAP Service**:
- Manages persistent IMAP connections
- Implements IDLE mode for real-time sync
- Handles multiple accounts simultaneously
- Parses emails using mailparser
- Syncs last 30 days on startup

**Elasticsearch Service**:
- Indexes emails for fast search
- Provides full-text search
- Supports filtering by account, folder, category
- Handles bulk operations

**AI Service**:
- Email categorization using GPT-4
- Reply generation with context
- 5 category classification

**RAG Service**:
- Vector database management (Chroma)
- Context storage and retrieval
- Semantic search for relevant context
- Reply suggestion with RAG

**Webhook Service**:
- Slack notifications for interested emails
- Generic webhook triggers
- Webhook testing utilities

### Data Layer

**Elasticsearch**:
- Document store for emails
- Full-text search engine
- Runs in Docker container
- Index: `emails`

**Chroma Vector DB**:
- Stores product/outreach context
- Enables semantic search
- Powers RAG for reply suggestions

**IMAP Servers**:
- Gmail, Outlook, etc.
- Persistent IDLE connections
- Real-time push notifications

### External Integrations

**OpenAI API**:
- Model: GPT-4 Turbo
- Used for categorization and reply generation

**Slack**:
- Incoming webhooks
- Notifications for interested emails

**Generic Webhooks**:
- Configurable webhook URL
- JSON payload with email data

## Data Flow

### Email Synchronization Flow

```
1. IMAP Connection Established
   ↓
2. IDLE Mode Activated
   ↓
3. New Email Arrives → IMAP Server Notifies
   ↓
4. Email Fetched and Parsed
   ↓
5. Indexed in Elasticsearch
   ↓
6. AI Categorization Triggered
   ↓
7. If "Interested" → Webhooks Triggered
   ↓
8. Frontend Receives Update
```

### Search Flow

```
1. User Enters Search Query
   ↓
2. Frontend Sends Request to Backend
   ↓
3. Elasticsearch Query Executed
   ↓
4. Results Filtered and Sorted
   ↓
5. Response Sent to Frontend
   ↓
6. UI Updates with Results
```

### RAG Reply Suggestion Flow

```
1. User Clicks "Suggest Reply"
   ↓
2. Email Content Sent to RAG Service
   ↓
3. Vector DB Queried for Relevant Context
   ↓
4. Context + Email Sent to OpenAI
   ↓
5. AI Generates Contextual Reply
   ↓
6. Reply Displayed in UI
```

## Key Design Decisions

### Why IMAP IDLE?
- Real-time updates without polling
- Efficient resource usage
- Standard protocol support
- No cron jobs needed

### Why Elasticsearch?
- Fast full-text search
- Scalable for large email volumes
- Rich query capabilities
- Easy filtering and aggregation

### Why RAG?
- Context-aware replies
- Customizable for different use cases
- Better than generic AI responses
- Maintains consistency

### Why TypeScript?
- Type safety
- Better IDE support
- Fewer runtime errors
- Improved maintainability

## Scalability Considerations

### Current Limitations
- Single server deployment
- In-memory IMAP connections
- Local Elasticsearch instance

### Scaling Strategies

**Horizontal Scaling**:
- Load balancer for API servers
- Separate IMAP workers per account
- Distributed Elasticsearch cluster

**Vertical Scaling**:
- Increase server resources
- Optimize Elasticsearch indices
- Cache frequently accessed data

**Performance Optimizations**:
- Implement Redis caching
- Use connection pooling
- Batch email processing
- Lazy loading in frontend

## Security Considerations

### Current Implementation
- Environment variables for secrets
- HTTPS for IMAP connections
- No authentication (development only)

### Production Requirements
- JWT or OAuth2 authentication
- Rate limiting
- Input validation and sanitization
- HTTPS everywhere
- Encrypted credentials storage
- Audit logging
- CORS configuration

## Monitoring and Logging

**Current Logging**:
- Winston logger
- Console and file outputs
- Error tracking

**Production Monitoring**:
- Application metrics (Prometheus)
- Error tracking (Sentry)
- Log aggregation (ELK stack)
- Uptime monitoring
- Performance monitoring (New Relic, DataDog)

## Future Enhancements

1. **Multi-user Support**: User authentication and isolation
2. **Email Sending**: Reply directly from the app
3. **Advanced Filters**: Custom filter creation
4. **Email Templates**: Pre-defined reply templates
5. **Analytics Dashboard**: Email statistics and insights
6. **Mobile App**: React Native mobile client
7. **Offline Support**: PWA with service workers
8. **Email Rules**: Automated actions based on rules
9. **Calendar Integration**: Meeting scheduling
10. **Team Collaboration**: Shared inboxes and assignments
