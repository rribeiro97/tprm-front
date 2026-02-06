# CLAUDE.md - TPRM Client (Frontend)

This file provides guidance to Claude Code when working with the frontend of the TPRM platform.

---

## 🚨 CRITICAL RULES - READ FIRST

### 1. **NEVER Push Directly to Production**

**You MUST always open a Pull Request that will be reviewed before merging.**

- ❌ **NEVER**: `git push origin main`
- ✅ **ALWAYS**: Create a feature branch, push, and open a PR

```bash
# Correct workflow
git checkout -b feature/your-feature-name
git add .
git commit -m "feat: your descriptive message"
git push origin feature/your-feature-name
# Then open PR on GitHub for review by @rribeiro97
```

### 2. **Library Usage - Be Extremely Cautious**

**Avoid adding libraries that don't make sense for the project.**

- Only add dependencies if absolutely necessary
- If you need to add a library for progression, **ADD A COMMENT** calling attention:

```tsx
// ⚠️ TODO(@rribeiro97): Review this library usage
// Added [library-name] for [specific reason]
// Consider alternatives: [list alternatives if any]
import { something } from 'new-library';
```

### 3. **Use Established Project Patterns**

**Always follow patterns already established in the codebase.**

- Before creating a new pattern, search for existing implementations
- Use Glob/Grep to find similar components/patterns
- Match the coding style, structure, and conventions already in use

---

## Project Overview

**TPRM Frontend** is a vendor risk management and third-party due diligence platform. This Next.js application provides the user interface for tracking vendors, conducting security assessments, and managing compliance documentation.

**Repository:** https://github.com/rribeiro97/tprm-front

---

## Tech Stack

- **Next.js 14+** (App Router)
- **Material UI (MUI)** - Component library
- **TypeScript** - Type safety
- **SWR** - Data fetching
- **Zod** - Runtime validation

---

## Mandatory Code Quality Checks

Before **EVERY** commit, you **MUST** run these 4 validation prompts:

### 1. 🔐 Security Audit
```
Audit this code for XSS. Where does external data enter without sanitization?
List all sensitive data leaking to the console, localStorage, or the bundle.
```

### 2. 💪 Robustness Test
```
Write tests trying to break this component:
- undefined props
- empty arrays
- corrupted data
- user clicking a thousand times in a row
- failed requests
- loading states
```

### 3. 🧹 Memory Leak Check
```
Find all memory leaks:
- useEffect without cleanup
- event listeners not removed
- timers running after unmount
- subscriptions not canceled
```

### 4. ⚡ Race Condition Check
```
Identify race conditions:
- async calls without debounce
- multiple setState calls
- concurrent fetches
- state updates after unmount
```

---

## Automation Tools

### Quality Scanners (Run Regularly)

```bash
# Code quality and formatting
npx @biomejs/biome check --write

# TypeScript type checking
tsc --noEmit

# Performance audit
lighthouse-ci

# Bundle size monitoring
bundlesize

# Security vulnerabilities
npm audit

# Security code analysis
semgrep --config=auto .
```

### Pre-commit Hook Setup ✅ CONFIGURED

**Husky is configured and will automatically run validations before every commit.**

The project uses **Husky + lint-staged** to enforce quality checks:

```json
// package.json - Already configured!
{
  "scripts": {
    "prepare": "husky"  // Auto-installs hooks
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --write --no-errors-on-unmatched",
      "tsc --noEmit"
    ]
  }
}
```

**Pre-commit hook location:** `/.husky/pre-commit`

Every commit will automatically:
1. ✅ Format code with Biome
2. ✅ Check TypeScript types
3. ✅ Lint code for issues
4. ❌ **Block commit if validation fails**

```bash
# Test the hook manually
npx lint-staged

# Or just commit - the hook runs automatically
git commit -m "feat: add feature"
```

**If pre-commit fails:**
- Fix the reported issues
- Stage the fixed files: `git add .`
- Try committing again

**Never skip hooks with `--no-verify`** unless absolutely necessary (emergency fixes only).

---

## Frontend Best Practices

### Always Handle the Three States

For **every** data-dependent component:

#### 1. Loading State
```tsx
{isLoading && <CircularProgress />}
{isLoading && <Skeleton variant="rectangular" height={200} />}
```

#### 2. Error State
```tsx
{error && (
  <Alert severity="error">
    Failed to load data. Please try again.
    <Button onClick={retry}>Retry</Button>
  </Alert>
)}
```

#### 3. Empty State
```tsx
{!isLoading && !error && data.length === 0 && (
  <Box textAlign="center" py={8}>
    <Typography variant="h6">No items yet</Typography>
    <Button variant="contained" onClick={onCreate}>
      Create First Item
    </Button>
  </Box>
)}
```

### Security - Never Expose Sensitive Data

❌ **NEVER do this:**
```tsx
console.log('User password:', password)
localStorage.setItem('token', accessToken)
console.log('Full user object:', user)
```

✅ **Always do this:**
```tsx
// Store tokens in memory or httpOnly cookies
const [token, setToken] = useState<string>()

// Sanitized logs
console.log('User logged in:', { userId: user.id })
```

### Form Validation with Zod

```tsx
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;
```

### Component Size Guidelines

- **Max 300 lines per file** - Split into smaller components if exceeded
- **Single Responsibility** - Each component should do one thing well
- **Reusable Components** - Extract common patterns to `src/components/ui/`

### TypeScript Best Practices

- ❌ **NEVER use `any`** - Use `unknown` or proper types
- ✅ **Always define types** - No implicit any
- ✅ **Use type inference** - Let TypeScript infer when obvious
- ✅ **Use Zod for runtime validation** - `z.infer<typeof schema>`

---

## Git Workflow

### Branch Naming

```
feature/feature-name     # New features
fix/bug-description      # Bug fixes
refactor/component-name  # Code refactoring
docs/what-changed        # Documentation
```

### Commit Messages

Follow conventional commits:

```bash
feat: add vendor management screen
fix: resolve authentication redirect loop
refactor: extract vendor table to separate component
docs: update API integration guide
style: format code with biome
test: add unit tests for vendor service
```

### Pull Request Checklist

Before opening a PR:

- [ ] All 4 quality checks executed
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Biome checks pass (`npx @biomejs/biome check`)
- [ ] Loading, error, empty states handled
- [ ] No sensitive data exposed
- [ ] No unnecessary libraries added
- [ ] Follows established project patterns
- [ ] API specification created (if needed)
- [ ] Lint-staged runs before every commit
- [] Feel free to add comments, if you find something interesting or if you have any questions, that I can learn from you during my review.

---

## Project Structure

```
tprm-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth-protected routes
│   │   ├── login/             # Login page
│   │   ├── dashboard/         # Dashboard
│   │   ├── vendors/           # Vendor management
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── forms/             # Form components
│   │   ├── layouts/           # Layout components
│   │   └── features/          # Feature-specific components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── services/              # API client functions
│   ├── types/                 # TypeScript type definitions
│   └── contexts/              # React contexts
├── public/                    # Static assets
├── docs/                      # Documentation
│   └── api-specs/            # Backend API specifications
└── CLAUDE.md                  # This file
```

---

## API Integration

### API Client Setup

```tsx
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Service Layer Pattern

```tsx
// services/vendors.ts
import api from '@/lib/api';
import { Vendor } from '@/types/vendor';

export const vendorService = {
  async list() {
    const { data } = await api.get<{ data: Vendor[] }>('/api/vendors');
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get<{ data: Vendor }>(`/api/vendors/${id}`);
    return data.data;
  },

  async create(vendor: CreateVendorDto) {
    const { data } = await api.post<{ data: Vendor }>('/api/vendors', vendor);
    return data.data;
  },
};
```

---

## Guidelines References

Follow these industry best practices:

- **React Best Practices:** https://lnkd.in/ewM-YGfH
- **Frontend Guidelines:** https://lnkd.in/erPty-gT
- **Frontend Patterns:** https://lnkd.in/eyzXUrgN
- **Next.js Docs:** https://nextjs.org/docs
- **Material UI:** https://mui.com/material-ui/

---

## Development Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Build & Production
npm run build        # Create production build
npm run start        # Run production build

# Code Quality
npm run lint         # Run ESLint
tsc --noEmit        # Type check
npx @biomejs/biome check --write  # Format and lint

# Pre-commit
npx lint-staged     # Run pre-commit checks
```

---

## Quick Reference

### When Starting a New Feature

1. **Create feature branch** - `git checkout -b feature/name`
2. **Search for patterns** - Use Glob/Grep to find similar implementations
3. **Implement with quality** - Handle loading/error/empty states
4. **Run 4 quality checks** - Security, robustness, memory leaks, race conditions
5. **Run automation tools** - Biome, TypeScript, tests
6. **Open PR** - Never push directly to main

### Before Every Commit

```bash
# Run these commands
npx @biomejs/biome check --write
tsc --noEmit
npm run build
npm run test  # If tests exist

# Then commit
git add .
git commit -m "feat: descriptive message"
```

### When Adding a Library

```bash
# Before installing, ask yourself:
# 1. Is this absolutely necessary?
# 2. Can I use existing project dependencies?
# 3. Is there a lighter alternative?

# If yes, install and add TODO comment
npm install new-library

# Add comment in code:
// ⚠️ TODO(@rribeiro97): Review this library usage
```

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Push directly to main/production
- Add libraries without careful consideration
- Use `any` type in TypeScript
- Skip loading/error/empty states
- Console.log sensitive data
- Commit without running quality checks
- Create components over 300 lines

✅ **Do:**
- Always open PRs for review
- Follow established project patterns
- Use proper TypeScript types
- Handle all three states (loading, error, empty)
- Run all 4 quality checks before commit
- Keep components small and focused
- Write descriptive commit messages

---

**Remember:** Quality over speed. Take time to do it right.
