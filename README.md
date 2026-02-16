# Workflow Builder Pro – AI Automation Studio

A production-ready SaaS application for building and executing AI-powered workflow automation using Next.js 14, MongoDB Atlas, and OpenRouter API (with Google Gemini models).

## 🚀 Features

- **User Authentication** - Secure login/register with NextAuth.js
- **Multi-Tenant Architecture** - Each user has isolated workflows and runs
- **Workflow Builder** - Create workflows with 2-4 AI-powered steps
- **7 AI Step Types** - Clean text, summarize, extract key points, categorize, sentiment analysis, rewrite professionally, generate titles
- **Real-time Execution** - Watch workflows execute step-by-step
- **Run History** - View and analyze past executions with pagination
- **Modern UI** - Beautiful SaaS design with dark mode support
- **Vercel Free Tier Compatible** - Optimized for serverless deployment

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- OpenRouter API key (for accessing Gemini models)
- Git (optional)

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Free Tier
MONGODB_URI=your_mongodb_uri_here

# OpenRouter API (for Gemini models)
GEMINI_API_KEY=your_openrouter_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

**To generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Get Your API Keys

**MongoDB Atlas (Free Tier):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string and replace `<password>` with your database password

**OpenRouter API:**
1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Create a free account and generate an API key
3. Copy the key to your `.env` file as `GEMINI_API_KEY`
4. OpenRouter provides access to Google Gemini models with free credits

## 🚀 Running Locally

```bash
# Development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🌐 Deploying to Vercel (Free Tier)

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY` (your OpenRouter API key)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel deployment URL)
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add GEMINI_API_KEY
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Deploy to production
vercel --prod
```

## 📖 Usage Guide

### 1. Register an Account
- Navigate to `/register`
- Enter your name, email, and password (min 6 characters)
- Click "Create Account"

### 2. Create a Workflow
- Go to "Workflows" page
- Click "Create Workflow"
- Name your workflow
- Select 2-4 steps from available options
- Click "Create Workflow"

### 3. Run a Workflow
- Go to "Run" page
- Select a workflow from the dropdown
- Enter your input text (max 5000 characters)
- Click "Run Workflow"
- Watch the step-by-step execution
- Copy or download results

### 4. View History
- Go to "History" page
- View all past executions
- Click "Show Details" to see step outputs
- Navigate through pages

## 🎨 Available Workflow Steps

1. **Clean Text** - Removes extra whitespace and normalizes text
2. **Summarize** - Creates a 3-5 sentence summary
3. **Extract Key Points** - Extracts main insights as bullet points
4. **Tag Category** - Assigns relevant categories
5. **Sentiment Analysis** - Determines Positive/Neutral/Negative sentiment
6. **Rewrite Professional** - Rewrites in professional tone
7. **Generate Title** - Creates a concise title

## 🔒 Security Features

- Password hashing using crypto module
- JWT-based session management
- Protected API routes
- Multi-tenant data isolation
- Input validation (5000 char limit)
- Rate limiting (10 requests/minute)

## 🏗️ Project Structure

```
workflow-builder-pro/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── workflows/        # Workflow management
│   ├── run/             # Run workflow page
│   ├── history/         # Run history
│   ├── settings/        # User settings
│   ├── login/           # Login page
│   ├── register/        # Register page
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # ShadCN UI components
│   ├── navbar.tsx       # Navigation
│   └── providers.tsx    # Context providers
├── lib/
│   ├── mongodb.ts       # Database connection
│   ├── gemini.ts        # OpenRouter AI client (Gemini models)
│   ├── auth.ts          # NextAuth config
│   ├── workflowProcessor.ts  # Workflow engine
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── models/
│   ├── User.ts          # User model
│   ├── Workflow.ts      # Workflow model
│   └── Run.ts           # Run model
└── middleware.ts        # Route protection
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Create workflow with 2-4 steps
- [ ] Edit existing workflow
- [ ] Delete workflow
- [ ] Duplicate workflow
- [ ] Run workflow with sample text
- [ ] View step-by-step execution
- [ ] Copy step outputs
- [ ] Download results as JSON
- [ ] View run history
- [ ] Pagination works
- [ ] Dark mode toggle works
- [ ] Logout works

### Sample Test Input

```
The quick brown fox jumps over the lazy dog. This is a sample text for testing the workflow automation system. It contains multiple sentences and should work well with all the AI processing steps available in the system.
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify database user credentials

### OpenRouter API Errors
- Verify API key is correct
- Check OpenRouter credits/limits at https://openrouter.ai/credits
- Ensure internet connectivity
- Verify the Gemini model is available on OpenRouter

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify as needed.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js 14, MongoDB, and OpenRouter API (Google Gemini models)**
