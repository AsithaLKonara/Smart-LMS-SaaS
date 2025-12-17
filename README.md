# Smart LMS SaaS

**AI-Powered Smart Learning Management System - Multi-Tenant SaaS Platform**

A modern, dark-themed, futuristic Learning Management System built with Next.js 14+, featuring AI-powered tutoring, live classes, comprehensive analytics, and multi-tenant architecture.

![Tech Stack](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## 🚀 Features

### Core Features
- **🎓 Course Management** - Create, manage, and deliver courses with rich content
- **🤖 AI-Powered Tutoring** - OpenAI-integrated AI assistant for personalized learning
- **📹 Live Classes** - Integration with Zoom, Google Meet, and Microsoft Teams
- **📝 Exams & Assignments** - Comprehensive assessment system with auto-grading
- **📊 Analytics Dashboard** - Real-time insights for students, instructors, and admins
- **🏆 Gamification** - Badges, streaks, and achievements to boost engagement
- **🏢 Multi-Tenancy** - Complete tenant isolation with custom branding
- **📱 Mobile-First** - Responsive design optimized for all devices

### Design Highlights
- **Dark 3D Futuristic UI** - Modern glassmorphism design
- **Neon Accent Colors** - Cyan (#22D3EE) and Purple (#A855F7)
- **Smooth Animations** - Purposeful 150-300ms transitions
- **Accessibility** - WCAG 2.1 AA compliant

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Phase Implementation](#-phase-implementation)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.0+
- **UI Components:** Custom components with Radix UI primitives
- **Animations:** Framer Motion / CSS Animations
- **Fonts:** Inter (body), Space Grotesk (headings)

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Validation:** Zod

### Services & Integrations
- **AI:** OpenAI API (GPT-4)
- **Video:** YouTube/Vimeo embedding
- **Live Classes:** Zoom, Google Meet, Microsoft Teams
- **Email:** SendGrid / Resend
- **File Storage:** AWS S3 / Cloudinary
- **Monitoring:** Sentry, Vercel Analytics

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Testing:** Jest/Vitest, Playwright
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```
Smart-LMS-SaaS/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── (student)/       # Student dashboard
│   │   ├── (instructor)/    # Instructor dashboard
│   │   └── (admin)/         # Admin dashboard
│   ├── (landing)/           # Landing page
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── layout/              # Layout components
│   ├── features/            # Feature components
│   └── providers/           # Context providers
├── lib/                     # Utility libraries
│   ├── db/                  # Database utilities
│   ├── auth/                # Authentication utilities
│   ├── ai/                  # AI integration
│   └── utils/               # General utilities
├── types/                   # TypeScript type definitions
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
├── hooks/                   # Custom React hooks
├── constants/               # App constants
└── docs/                    # Documentation
    ├── E2E_IMPLEMENTATION_PLAN.md
    ├── PHASE_*.md
    └── PHASE_PLANS_INDEX.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 18.x or higher
- **PostgreSQL:** 15.x or higher
- **npm:** 9.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsithaLKonara/Smart-LMS-SaaS.git
   cd Smart-LMS-SaaS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/smartlms"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # Email (optional)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="user@example.com"
   EMAIL_SERVER_PASSWORD="password"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 📊 Phase Implementation

The project is organized into 12 phases. See [docs/E2E_IMPLEMENTATION_PLAN.md](docs/E2E_IMPLEMENTATION_PLAN.md) for the complete overview.

### Phase Status

- ✅ **Phase 1:** Project Foundation & Setup
  - ✅ 1.1 Project Initialization
  - ✅ 1.2 Database Setup
  - ✅ 1.3 Authentication Foundation

- ✅ **Phase 2:** Design System & UI Components
  - ✅ 2.1 Design System Configuration
  - ✅ 2.2 Core UI Components

- ✅ **Phase 3:** Landing Page & Authentication
  - ✅ 3.1 Landing Page
  - ✅ 3.2 Authentication Pages

- 📋 **Phase 4:** Multi-Tenancy & Student Dashboard
- 📋 **Phase 5:** Course Management
- 📋 **Phase 6:** Live Classes & Exams
- 📋 **Phase 7:** AI Integration
- 📋 **Phase 8:** Instructor & Admin Dashboards
- 📋 **Phase 9:** Gamification & Analytics
- 📋 **Phase 10:** Settings & API
- 📋 **Phase 11:** Testing & Performance
- 📋 **Phase 12:** Deployment & Documentation

### Detailed Phase Plans

All detailed phase plans are available in the [docs/](docs/) directory:

- [Phase Plans Index](docs/PHASE_PLANS_INDEX.md)
- [E2E Implementation Plan](docs/E2E_IMPLEMENTATION_PLAN.md)
- Individual phase plans: `docs/PHASE_X.X_PLAN.md`

---

## 📚 Documentation

### Main Documentation

- **[E2E Implementation Plan](docs/E2E_IMPLEMENTATION_PLAN.md)** - Complete project blueprint
- **[Phase Plans Index](docs/PHASE_PLANS_INDEX.md)** - Overview of all phase plans

### Phase Documentation

- **[Phase 1.1](docs/PHASE_1.1_PLAN.md)** - Project Initialization
- **[Phase 1.2](docs/PHASE_1.2_PLAN.md)** - Database Setup
- **[Phase 1.3](docs/PHASE_1.3_PLAN.md)** - Authentication Foundation
- **[Phase 2.1](docs/PHASE_2.1_PLAN.md)** - Design System Configuration
- **[Phase 2.2](docs/PHASE_2.2_PLAN.md)** - Core UI Components
- **[Phase 3.1](docs/PHASE_3.1_PLAN.md)** - Landing Page
- **[Phase 3.2](docs/PHASE_3.2_PLAN.md)** - Authentication Pages

### Requirements

- **[Project Requirements](requirement.txt)** - Complete UI/UX and feature requirements

---

## 🎨 Design System

### Colors

- **Primary Background:** `#0B0F1A` (Deep Space Blue)
- **Secondary Panels:** `#111827`
- **Card Background:** `rgba(255,255,255,0.03)`
- **Primary Accent:** `#22D3EE` (Neon Cyan)
- **Secondary Accent:** `#A855F7` (Electric Purple)

### Typography

- **Headings:** Space Grotesk
- **Body:** Inter
- **Line Height:** 1.6 (for readability)

### Animations

- **Duration:** 150-300ms
- **Easing:** ease-out
- **Purpose:** Explain, not entertain

---

## 🔒 Security

- **Authentication:** NextAuth.js v5 with JWT
- **Password Hashing:** bcryptjs
- **Input Validation:** Zod schemas
- **SQL Injection:** Prisma ORM protection
- **XSS Protection:** React's built-in escaping
- **CSRF Protection:** NextAuth.js built-in
- **Rate Limiting:** API route middleware
- **Environment Variables:** Secure secret management

---

## 🧪 Testing

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** Critical flows
- **E2E Tests:** User journeys
- **Accessibility:** WCAG 2.1 AA compliance

### Running Tests

```bash
npm run test         # Unit tests
npm run test:watch   # Watch mode
npm run test:e2e     # E2E tests
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Domain and subdomain routing set up
- [ ] Monitoring and error tracking configured
- [ ] Backup strategy implemented
- [ ] Performance optimization completed
- [ ] Security audit passed

### Deployment Platforms

- **Recommended:** Vercel (Next.js optimized)
- **Alternatives:** Netlify, AWS, Railway

### Environment Setup

1. Set up production PostgreSQL database
2. Configure environment variables
3. Set up CI/CD pipeline (GitHub Actions)
4. Deploy to hosting platform
5. Configure domain and DNS
6. Set up monitoring (Sentry, Analytics)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer:** AsithaLKonara
- **Repository:** [Smart-LMS-SaaS](https://github.com/AsithaLKonara/Smart-LMS-SaaS)

---

## 📞 Support

For support, email support@smartlms.com or open an issue in the repository.

---

## 🗺 Roadmap

### Q1 2025
- ✅ Project setup and foundation
- ✅ Design system implementation
- 📋 Core features development

### Q2 2025
- 📋 AI integration completion
- 📋 Multi-tenancy optimization
- 📋 Performance improvements

### Q3 2025
- 📋 Advanced analytics
- 📋 Mobile app (future)
- 📋 Enterprise features

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent ORM
- OpenAI for AI capabilities
- All open-source contributors

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

