# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. In production, implement JWT or OAuth2.

## Endpoints

### Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Emails

#### Get All Emails
**GET** `/emails`

Retrieve emails with optional filters.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `accountId` (string, optional): Filter by account
- `folder` (string, optional): Filter by folder
- `category` (string, optional): Filter by category
- `q` (string, optional): Search query

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "accountId": "account_1",
      "from": "sender@example.com",
      "to": ["recipient@example.com"],
      "subject": "Email subject",
      "body": "Email body",
      "date": "2024-01-01T00:00:00.000Z",
      "folder": "INBOX",
      "category": "Interested",
      "read": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Search Emails
**GET** `/emails/search`

Full-text search across emails.

**Query Parameters:**
- `q` (string, required): Search query
- `accountId`, `folder`, `category` (optional): Additional filters

#### Get Email by ID
**GET** `/emails/:id`

Get detailed information about a specific email.

#### Categorize Email
**POST** `/emails/:id/categorize`

Trigger AI categorization for an email.

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "Interested"
  }
}
```

---

### Accounts

#### Get All Accounts
**GET** `/accounts`

List all configured email accounts and their connection status.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "account_1",
      "user": "user@gmail.com",
      "host": "imap.gmail.com",
      "connected": true
    }
  ]
}
```

#### Sync Accounts
**POST** `/accounts/sync`

Trigger manual sync (note: automatic sync via IDLE is always active).

---

### AI Features

#### Add RAG Context
**POST** `/ai/context`

Add product/outreach context to the vector database for RAG.

**Request Body:**
```json
{
  "product": "Your product name",
  "agenda": "Your outreach agenda",
  "meetingLink": "https://cal.com/your-link",
  "additionalInfo": "Any additional context"
}
```

#### Initialize Default Context
**POST** `/ai/context/initialize`

Initialize the vector database with default context.

#### Suggest Reply
**POST** `/ai/suggest-reply/:emailId`

Generate an AI-powered reply suggestion using RAG.

**Response:**
```json
{
  "success": true,
  "data": {
    "emailId": "uuid",
    "suggestedReply": "Thank you for your interest..."
  }
}
```

---

### Webhooks

#### Test Webhooks
**POST** `/webhooks/test`

Test Slack and generic webhook configurations.

**Response:**
```json
{
  "success": true,
  "data": {
    "slack": "Success",
    "generic": "Success"
  }
}
```

---

## Email Categories

- `Interested`: Sender shows interest
- `Meeting Booked`: Meeting confirmed/scheduled
- `Not Interested`: Sender declines
- `Spam`: Promotional/unsolicited
- `Out of Office`: Automated OOO reply
- `Uncategorized`: Not yet categorized

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request
- `404`: Not found
- `500`: Internal server error
