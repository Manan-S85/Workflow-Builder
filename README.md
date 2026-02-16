# Workflow Builder Pro – AI Automation Studio

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Gemini-API-4285F4?style=for-the-badge" alt="Gemini"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

A production-ready SaaS application for building and executing AI-powered workflow automation using Next.js 14, MongoDB Atlas, and Google Gemini API.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" width="25" height="25" /> Features

- **User Authentication** - Secure login/register with NextAuth.js
- **Multi-Tenant Architecture** - Each user has isolated workflows and runs
- **Workflow Builder** - Create workflows with 2-4 AI-powered steps
- **7 AI Step Types** - Clean text, summarize, extract key points, categorize, sentiment analysis, rewrite professionally, generate titles
- **Real-time Execution** - Watch workflows execute step-by-step
- **Run History** - View and analyze past executions with pagination
- **Modern UI** - Beautiful SaaS design with dark mode support
- **Vercel Free Tier Compatible** - Optimized for serverless deployment

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clipboard.png" width="25" height="25" /> Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Google Gemini API key
- Git (optional)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" width="25" height="25" /> Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Free Tier
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflow-builder?retryWrites=true&w=majority

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=models/gemini-flash-latest

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

**Google Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create or select a project and generate an API key
3. Copy the key to your `.env` file as `GEMINI_API_KEY`
4. Set `GEMINI_MODEL=models/gemini-flash-latest`

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" width="25" height="25" /> Running Locally

```bash
# Development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png" width="25" height="25" /> Building for Production

```bash
npm run build
npm start
```

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Globe%20with%20Meridians.png" width="25" height="25" /> Deploying to Vercel (Free Tier)

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `MONGODB_URI`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL` (recommended: `models/gemini-flash-latest`)
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
vercel env add GEMINI_MODEL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Deploy to production
vercel --prod
```

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" width="25" height="25" /> Usage Guide

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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Artist%20Palette.png" width="25" height="25" /> Available Workflow Steps

1. **Clean Text** - Removes extra whitespace and normalizes text
2. **Summarize** - Creates a 3-5 sentence summary
3. **Extract Key Points** - Extracts main insights as bullet points
4. **Tag Category** - Assigns relevant categories
5. **Sentiment Analysis** - Determines Positive/Neutral/Negative sentiment
6. **Rewrite Professional** - Rewrites in professional tone
7. **Generate Title** - Creates a concise title

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" width="25" height="25" /> Security Features

- Password hashing using crypto module
- JWT-based session management
- Protected API routes
- Multi-tenant data isolation
- Input validation (5000 char limit)
- Rate limiting (10 requests/minute)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Building%20Construction.png" width="25" height="25" /> Project Structure

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
│   ├── gemini.ts        # Google Gemini API client
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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Test%20Tube.png" width="25" height="25" /> Testing

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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bug.png" width="25" height="25" /> Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify database user credentials

### Gemini API Errors
- Verify `GEMINI_API_KEY` is correct
- Check Gemini API quota/rate limits in Google AI Studio
- Ensure internet connectivity
- Verify `GEMINI_MODEL` is available for your key (recommended: `models/gemini-flash-latest`)

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" width="25" height="25" /> License

MIT License - feel free to use this project for learning or commercial purposes.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png" width="25" height="25" /> Contributing

This is a demonstration project. Feel free to fork and modify as needed.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/E-Mail.png" width="25" height="25" /> Support

For issues or questions, please create an issue in the repository.

---

<p align="center">
  <strong>Built with <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" width="20" height="20" /> using Next.js 14, MongoDB, and Google Gemini API</strong>
</p>
