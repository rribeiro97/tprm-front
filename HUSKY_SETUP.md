# Husky Pre-commit Hooks Setup

## ✅ Status: CONFIGURED AND ACTIVE

This project uses **Husky** to enforce code quality standards before every commit.

---

## What Happens on Every Commit

When you run `git commit`, the pre-commit hook **automatically** runs:

1. **Biome** - Code formatting and linting
   - Fixes formatting issues automatically
   - Reports code quality problems
   - Checks for security issues (XSS, dangerouslySetInnerHTML)
   - Warns about console.log statements

2. **TypeScript** - Type checking
   - Validates all TypeScript types
   - Catches type errors before commit
   - Ensures type safety

**If any check fails, the commit is blocked.**

---

## Configuration Files

### 1. `.husky/pre-commit` (Git Root)
```bash
#!/bin/sh

# TPRM Client Pre-commit Validation
cd tprm-client && npx lint-staged
```

### 2. `package.json` - lint-staged config
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --write --no-errors-on-unmatched",
      "tsc --noEmit"
    ]
  }
}
```

### 3. `biome.json` - Biome configuration
- Code formatting rules
- Linting rules (no explicit any, no console.log, etc.)
- Import organization
- Security checks

---

## How to Use

### Normal Workflow (Hooks Run Automatically)

```bash
# Make your changes
git add src/components/MyComponent.tsx

# Commit - hooks run automatically
git commit -m "feat: add new component"

# If validation passes ✅
# → Commit succeeds

# If validation fails ❌
# → Fix the issues shown in the error
# → Stage the fixes: git add .
# → Try committing again
```

### Manual Validation (Before Committing)

```bash
# Check formatting and lint
npm run format

# Check TypeScript types
npm run type-check

# Or run lint-staged manually
npx lint-staged
```

---

## Common Scenarios

### ✅ Validation Passes
```bash
$ git commit -m "feat: add login component"
✔ Running tasks for staged files...
[main abc1234] feat: add login component
 1 file changed, 50 insertions(+)
```

### ❌ Biome Finds Issues
```bash
$ git commit -m "feat: add component"
✖ biome check failed:

src/components/Login.tsx:15:1
  ✖ Missing semicolon

src/components/Login.tsx:23:5
  ✖ Found console.log (not allowed in production)

husky - pre-commit hook exited with code 1 (error)
```

**Fix:** Correct the issues and commit again.

### ❌ TypeScript Errors
```bash
$ git commit -m "feat: add component"
✖ tsc --noEmit failed:

src/components/Login.tsx:15:20
  Error: Property 'username' does not exist on type '{}'

husky - pre-commit hook exited with code 1 (error)
```

**Fix:** Add proper types and commit again.

---

## Skipping Hooks (Emergency Only)

**⚠️ NOT RECOMMENDED - Only for emergencies**

```bash
git commit --no-verify -m "emergency fix"
```

**When to use:**
- Production is down and you need an immediate hotfix
- The validation system itself is broken
- You're fixing the validation configuration

**⚠️ Your PR will still be reviewed and may be rejected if code quality is poor.**

---

## Installed Packages

```json
{
  "devDependencies": {
    "husky": "^9.1.7",           // Git hooks manager
    "lint-staged": "^16.2.7",    // Run tasks on staged files
    "@biomejs/biome": "^2.3.14"  // Fast linter and formatter
  }
}
```

---

## Troubleshooting

### Hook Not Running

```bash
# Reinstall Husky hooks
npm run prepare

# Or manually
npx husky install
```

### "lint-staged: command not found"

```bash
# Install dependencies
npm install
```

### Biome Formatting Conflicts with ESLint

Biome is configured to work alongside ESLint. If conflicts occur:
1. Biome handles formatting
2. ESLint handles code quality rules
3. Configure ESLint to disable formatting rules

### TypeScript Errors on Valid Code

```bash
# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build
```

---

## Benefits

✅ **Catches errors early** - Before code review
✅ **Consistent code style** - Automatically formatted
✅ **Prevents bad commits** - Type errors caught immediately
✅ **Faster reviews** - Reviewers focus on logic, not style
✅ **Security** - Catches common vulnerabilities
✅ **No manual formatting** - Biome fixes it automatically

---

## Scripts Reference

```bash
# Development
npm run dev          # Start dev server

# Code Quality (Manual)
npm run format       # Format with Biome
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint
npx lint-staged      # Test pre-commit checks

# Husky
npm run prepare      # Install/reinstall hooks
```

---

## For New Team Members

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd tprm-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Husky hooks are installed automatically** (via `prepare` script)

4. **Start coding** - hooks will run on your first commit

---

## Configuration Details

### Biome Rules

- **Formatting**: 2 spaces, single quotes, semicolons
- **Security**: No dangerouslySetInnerHTML
- **Quality**: No explicit `any`, warn on console.log
- **Complexity**: Warn on excessive cognitive complexity

### TypeScript

- Strict mode enabled
- No implicit any
- Checks all `.ts` and `.tsx` files

### lint-staged

- **Only checks staged files** (fast)
- **Runs in parallel** when possible
- **Automatically fixes** what it can

---

## Need Help?

- Check [CLAUDE.md](CLAUDE.md) for development guidelines
- Run `npm run format` to see what Biome will fix
- Run `npm run type-check` to see TypeScript errors
- Ask @rribeiro97 for configuration changes

---

**Last Updated:** 2026-02-06
**Status:** ✅ Active and enforced on all commits
