<!-- /*# BIS AI-Powered Recommendation Engine

AI-powered recommendation system for identifying potentially applicable **Indian Standards (IS)** from procurement specifications, product descriptions, technical requirements, and tender documents.


---

## 1. What It Does

The system takes a procurement query or tender document and recommends relevant Indian Standards.

It can provide:

* IS number and title
* Current edition/version
* Scope and applicability
* Technical requirements
* Testing and inspection information
* Allied/referenced standards
* Certification/CRS information where available
* Procurement relevance
* Confidence information
* Supporting evidence
* Standard relationships

### Core Principle

> Retrieve relevant BIS evidence first, then use the LLM to explain it.

The LLM is not treated as the source of truth.

---

# 2. System Architecture

```text
User
 │
 ▼
React Frontend
 │
 │ REST API
 ▼
Node.js + Express Backend
 │
 ├──────────────► MongoDB Atlas
 │
 ▼
Python FastAPI RAG
 │
 ├── Query Processing
 ├── Vector Search
 ├── Keyword Search
 ├── Ranking
 ├── Relevance Filtering
 ├── Confidence Scoring
 ├── Metadata Enrichment
 ├── Standard Relationships
 ├── Evidence
 └── LLM
       │
       ▼
 Structured JSON
       │
       ▼
 Backend
       │
       ▼
 Frontend
```

---

# 3. Repository Structure

```text
bis-recommendation-engine/
│
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           # Node.js/Express API
│   ├── src/
│   ├── package.json
│   └── .env
│
├── rag/               # Python RAG engine
│   ├── app/
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# 4. Technology Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Frontend        | React + TypeScript          |
| Build           | Vite                        |
| Styling         | Tailwind CSS                |
| State           | Zustand                     |
| Server State    | TanStack React Query        |
| HTTP            | Axios                       |
| Animation       | Framer Motion               |
| Backend         | Node.js + Express           |
| Database        | MongoDB Atlas               |
| ODM             | Mongoose                    |
| Authentication  | JWT + bcryptjs              |
| RAG API         | Python + FastAPI            |
| Embeddings      | BAAI/bge-small-en-v1.5      |
| Vector Search   | MongoDB Atlas Vector Search |
| Keyword Search  | MongoDB Atlas Search        |
| PDF Processing  | PyMuPDF                     |
| Validation      | Pydantic                    |
| LLM             | Groq / Mistral / OpenRouter |
| Version Control | Git + GitHub                |

---

# 5. Prerequisites

Install:

* Git
* Node.js
* npm
* Python 3.10+
* MongoDB Atlas account

Check installations:

```bash
git --version
node --version
npm --version
python --version
```

---

# 6. Clone the Project

```bash
git clone <REPOSITORY_URL>
cd bis-recommendation-engine
```

---

# 7. Frontend Setup

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Production build:

```bash
npm run build
```

---

# 8. Backend Setup

Open another terminal:

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
MONGO_URI=<MONGODB_ATLAS_CONNECTION_STRING>
JWT_SECRET=<YOUR_SECRET>
RAG_BASE_URL=http://localhost:8000
```

Start backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

The backend is responsible for:

* Authentication
* JWT authorization
* API routes
* Request validation
* MongoDB operations
* Recommendation history
* Communication with RAG

The backend does **not** perform embeddings or vector retrieval.

---

# 9. RAG Setup

Open another terminal:

```bash
cd rag
```

Create a Python environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
rag/.env
```

Add the required configuration, for example:

```env
MONGO_URI=<MONGODB_ATLAS_CONNECTION_STRING>

GROQ_API_KEY=<KEY>
MISTRAL_API_KEY=<KEY>
OPENROUTER_API_KEY=<KEY>
```

Start RAG:

```bash
uvicorn app.main:app --reload --port 8000
```

RAG API:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# 10. Run the Complete System

Three services should be running.

### Terminal 1

```bash
cd rag
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Terminal 2

```bash
cd backend
npm run dev
```

### Terminal 3

```bash
cd frontend
npm run dev
```

Final flow:

```text
http://localhost:5173
        │
        ▼
http://localhost:5000
        │
        ▼
http://localhost:8000
        │
        ▼
MongoDB Atlas
```

---

# 11. Frontend

The frontend provides the procurement interface.

Main responsibilities:

```text
User Input
File Selection
Authentication
API Requests
Loading States
Recommendation Display
History Display
Error Display
```

The frontend does **not** call the RAG service directly.

```text
Frontend
   │
   ▼
Backend
   │
   ▼
RAG
```

Main frontend technologies:

```text
React
TypeScript
Vite
Tailwind CSS
Axios
Zustand
React Query
Framer Motion
Lucide React
```

---

# 12. Backend API

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Recommendations

```http
POST /api/recommendations
GET  /api/recommendations/history
```

The recommendation endpoint is protected using JWT.

Example header:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend sends recommendation requests to the RAG service.

---

# 13. RAG API

The Python service provides:

```http
GET  /health
POST /recommend
POST /recommend/llm
POST /recommend/llm/tender
```

Documentation:

```text
http://localhost:8000/docs
```

Example:

```json
{
  "query": "Indian Standard for reinforced concrete water storage tanks"
}
```

---

# 14. RAG Pipeline

```text
Query / Tender
      │
      ▼
Query Normalization
      │
      ▼
┌───────────────────┐
│ Hybrid Retrieval  │
│                   │
│ Vector + Keyword  │
└─────────┬─────────┘
          ▼
       Ranking
          ▼
Relevance Filtering
          ▼
Confidence Scoring
          ▼
Metadata Enrichment
          ▼
Standard Relationships
          ▼
       Evidence
          ▼
         LLM
          ▼
  Structured JSON
```

---

# 15. Semantic Search

The RAG engine uses:

```text
BAAI/bge-small-en-v1.5
```

Embedding size:

```text
384 dimensions
```

Vectors are stored/searchable using:

```text
MongoDB Atlas Vector Search
```

Semantic search finds standards that are conceptually related even when the exact words are different.

---

# 16. Keyword Search

MongoDB Atlas Search is used for exact/keyword matching.

Important fields include:

```text
IS numbers
Part numbers
Standard titles
Product terminology
Technical terminology
Keywords
```

Example:

```text
IS 456
IS 3370
IS 3589
```

---

# 17. Hybrid Retrieval

Both retrieval methods are used together:

```text
Query
 │
 ├──► Vector Search
 │
 └──► Keyword Search
          │
          ▼
       Combine
          │
          ▼
        Rank
          │
          ▼
       Filter
          │
          ▼
    Final Results
```

This improves retrieval for both:

* Conceptual queries
* Exact IS numbers and technical terms

---

# 18. Knowledge Base

MongoDB Atlas contains the RAG knowledge base.

```text
MongoDB Atlas
│
├── standards
└── chunks
```

A standard record can contain:

```text
Standard Number
Title
Scope
Category
Applicable Domains
Keywords
Technical Requirements
Testing
Inspection
Allied Standards
Current Edition
Amendments
Compliance
Procurement Relevance
Relationships
Source
```

Large documents are divided into searchable evidence chunks.

---

# 19. Tender Processing

Tender documents can provide information such as:

```text
Product
Materials
Performance
Testing
Certification
Intended Use
Installation Context
```

The extracted requirements are passed through the same RAG pipeline:

```text
Tender
  │
  ▼
Text Extraction
  │
  ▼
Requirement Extraction
  │
  ▼
Hybrid Retrieval
  │
  ▼
Ranking
  │
  ▼
Evidence
  │
  ▼
Recommendation
```

---

# 20. LLM Layer

LLM providers are used as a fallback chain:

```text
Groq
  ↓
Mistral
  ↓
OpenRouter
  ↓
Deterministic RAG Response
```

The LLM receives retrieved evidence and generates the explanation.

If all LLM providers fail, the system can still return a structured evidence-based response.

---

# 21. Example

Query:

```text
What Indian Standard applies to reinforced concrete
water storage tanks?
```

Possible recommendation:

```text
Primary:
IS 3370 (Part 2):2021

Supporting:
IS 3370 (Part 1):2021

Related:
IS 456:2000
```

The response can additionally contain:

```text
Title
Scope
Edition
Relevance
Testing
Certification
Amendments
Relationships
Evidence
Confidence
```

---

# 22. Authentication Flow

```text
Register/Login
      │
      ▼
Backend
      │
      ▼
Password Verification
      │
      ▼
JWT Token
      │
      ▼
Frontend
      │
      ▼
Protected API Request
      │
      ▼
JWT Middleware
      │
      ▼
Controller
```

Passwords are hashed using bcryptjs.

---

# 23. Recommendation History

Authenticated recommendation requests can be stored in MongoDB.

```text
User
 │
 ├── Recommendation 1
 ├── Recommendation 2
 └── Recommendation N
```

Retrieve history:

```http
GET /api/recommendations/history
```

---

# 24. Environment Variables

Never commit real credentials.

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend:

```env
PORT=5000
MONGO_URI=<MONGODB_CONNECTION_STRING>
JWT_SECRET=<SECRET>
RAG_BASE_URL=http://localhost:8000
```

RAG:

```env
MONGO_URI=<MONGODB_CONNECTION_STRING>
GROQ_API_KEY=<KEY>
MISTRAL_API_KEY=<KEY>
OPENROUTER_API_KEY=<KEY>
```

Only add variables required by the implementation.

---

# 25. Important Separation

### Frontend

Handles:

```text
UI
User interaction
Authentication UI
Input
Files
Results
History
```

### Backend

Handles:

```text
REST API
Authentication
Authorization
MongoDB
History
Validation
RAG communication
```

### RAG

Handles:

```text
Document processing
Embeddings
Vector search
Keyword search
Hybrid retrieval
Ranking
Filtering
Confidence
Relationships
Evidence
LLM
```

---

# 26. Important Rule

The frontend must not call Python RAG directly.

Correct:

```text
React
  ↓
Node.js
  ↓
Python RAG
```

Not:

```text
React
  ↓
Python RAG
```

This keeps authentication, validation, database operations, and service communication inside the backend.

---

# 27. Performance

Representative RAG timings:

```text
Parallel retrieval:       ~0.54 s
Metadata enrichment:      ~0.87 s
Relationship expansion:   ~0.32 s
Total RAG:                ~1.8 s
Full LLM request:         ~4.55 s
```

Actual performance depends on network, database, query size, and LLM provider.

---

# 28. Limitations

* Results depend on the indexed BIS dataset.
* Semantic similarity does not always mean procurement applicability.
* Certification requirements can depend on current regulations and QCOs.
* The knowledge base may not contain the complete BIS catalogue.
* LLM output depends on retrieved evidence.
* External LLM providers can have downtime or latency.
* Final procurement decisions should be verified against authoritative BIS sources.

---

# 29. Future Work

* Expand BIS standards coverage
* Domain-specific reranking
* Multilingual retrieval
* Automated BIS source verification
* Expanded certification/QCO mapping
* OCR for scanned tenders
* Better table extraction
* Retrieval evaluation benchmarks
* Automatic standards update detection

---

# 30. Core Idea

```text
BIS Knowledge Base
        │
        ▼
     Retrieval
        │
        ▼
      Ranking
        │
        ▼
     Evidence
        │
        ▼
       LLM
        │
        ▼
Structured Recommendation
        │
        ▼
       User
```

//> **Retrieve first. Reason over retrieved evidence second.**

--- */ -->
