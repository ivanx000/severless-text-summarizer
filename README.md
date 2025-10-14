# 🧠 Serverless Text Summarizer

A cloud-based full-stack app that summarizes long text passages using a serverless backend on AWS and a modern Next.js frontend.

## 🚀 Tech Stack
- **Frontend:** Next.js 14, TailwindCSS, React
- **Backend:** AWS Lambda, API Gateway, DynamoDB, Python (NLTK + Sumy)
- **Infrastructure:** AWS SAM (Serverless Application Model)

## 🧩 Architecture
Frontend → API Gateway → Lambda → DynamoDB  
Fully serverless, pay-per-request model with no servers to manage.

## ⚙️ Setup

### Frontend
```bash
cd summarizer-frontend
npm install
npm run dev
