// Run with: npx prisma db seed
import { config } from "dotenv";
config();
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── System item types (per seed-spec.md) ──────────────────────────────────
const SYSTEM_TYPES = [
  { name: "snippet", icon: "Code",       color: "#3b82f6", isSystem: true },
  { name: "prompt",  icon: "Sparkles",   color: "#8b5cf6", isSystem: true },
  { name: "command", icon: "Terminal",   color: "#f97316", isSystem: true },
  { name: "note",    icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "file",    icon: "File",       color: "#6b7280", isSystem: true },
  { name: "image",   icon: "Image",      color: "#ec4899", isSystem: true },
  { name: "link",    icon: "Link",       color: "#10b981", isSystem: true },
] as const;

async function main() {
  // ── 1. Clean slate — delete in FK-safe order ────────────────────────────
  const existingUser = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    select: { id: true },
  });
  if (existingUser) {
    await prisma.itemCollection.deleteMany({
      where: { item: { userId: existingUser.id } },
    });
    await prisma.item.deleteMany({ where: { userId: existingUser.id } });
    await prisma.collection.deleteMany({ where: { userId: existingUser.id } });
    await prisma.user.delete({ where: { id: existingUser.id } });
  }
  await prisma.itemType.deleteMany({ where: { isSystem: true } });

  // ── 2. System item types ──────────────────────────────────────────────────
  await prisma.itemType.createMany({
    data: SYSTEM_TYPES.map((t) => ({ ...t, userId: null })),
  });
  const typeRows = await prisma.itemType.findMany({ where: { isSystem: true } });
  const type = Object.fromEntries(typeRows.map((t) => [t.name, t.id]));
  console.log(`Seeded ${SYSTEM_TYPES.length} system ItemTypes.`);

  // ── 3. Demo user ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.create({
    data: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      emailVerified: new Date(),
      isPro: false,
    },
  });
  console.log(`Created demo user: ${user.email}`);

  // ── 4. Collections + items ────────────────────────────────────────────────

  // ── React Patterns ────────────────────────────────────────────────────────
  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
    },
  });

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "useDebounce & useLocalStorage",
        description: "Custom hooks for debouncing values and persisting state in localStorage",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = (v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };

  return [value, set] as const;
}`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Context Provider + Compound Component",
        description: "Type-safe context provider and compound component patterns",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `import { createContext, useContext, useState, type ReactNode } from 'react';

// ── Context provider ──────────────────────────────────────────
interface ThemeCtx { theme: string; setTheme: (t: string) => void }

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// ── Compound component ────────────────────────────────────────
function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="card-body">{children}</div>;
};

export { Card };`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Utility Functions",
        description: "cn, formatBytes, truncate, and sleep utilities",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} \${sizes[i]}\`;
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? \`\${str.slice(0, maxLen)}…\` : str;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function groupBy<T, K extends string>(
  arr: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item);
      (acc[k] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}`,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: reactItems.map((item) => ({ itemId: item.id, collectionId: reactPatterns.id })),
  });
  console.log(`Created "React Patterns" collection with ${reactItems.length} items.`);

  // ── AI Workflows ──────────────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  });

  const aiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Code Review Prompt",
        description: "Structured prompt for thorough AI-assisted code reviews",
        contentType: "text",
        userId: user.id,
        itemTypeId: type.prompt,
        content: `You are an expert code reviewer. Review the following code for:

- **Security**: injection, XSS, CSRF, insecure deserialization, secrets in code
- **Performance**: N+1 queries, unnecessary re-renders, memory leaks, blocking operations
- **Logic**: edge cases, off-by-one errors, incorrect assumptions
- **Type safety**: missing types, unsafe casts, any usage
- **Clarity**: confusing names, missing abstractions, duplicated logic

For each issue, provide:
1. The specific line(s) affected
2. Why it's a problem
3. A concrete fix

Rate each issue: 🔴 Critical | 🟡 Warning | 🔵 Suggestion

\`\`\`
[paste code here]
\`\`\``,
      },
    }),

    prisma.item.create({
      data: {
        title: "Documentation Generation",
        description: "Prompt to generate JSDoc-compatible docs for any function or module",
        contentType: "text",
        userId: user.id,
        itemTypeId: type.prompt,
        content: `Generate comprehensive documentation for the following code.

Output format — JSDoc compatible with TypeScript:

1. **@summary** — What it does in one sentence
2. **@param** — Every parameter with type and description
3. **@returns** — Return value and type
4. **@throws** — Errors it can raise and when
5. **@example** — 2–3 realistic usage examples
6. **@remarks** — Non-obvious behavior, edge cases, performance notes

Keep descriptions concise but complete. Use TypeScript types exactly as they appear in the signature.

\`\`\`
[paste code here]
\`\`\``,
      },
    }),

    prisma.item.create({
      data: {
        title: "Refactoring Assistance",
        description: "Prompt to improve code quality while preserving behavior",
        contentType: "text",
        userId: user.id,
        itemTypeId: type.prompt,
        content: `Refactor the following code to improve readability, performance, and type safety.

Rules:
- Preserve existing behavior exactly — no silent regressions
- Keep the same public API / function signatures unless a change is clearly better
- Add TypeScript types where missing
- Eliminate duplication using the right abstraction (not a premature one)
- Prefer explicit over clever

Output:
1. The refactored code in full
2. A bullet list of every change made and why

\`\`\`
[paste code here]
\`\`\``,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: aiItems.map((item) => ({ itemId: item.id, collectionId: aiWorkflows.id })),
  });
  console.log(`Created "AI Workflows" collection with ${aiItems.length} items.`);

  // ── DevOps ────────────────────────────────────────────────────────────────
  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  const devopsItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Docker Compose — App + Postgres",
        description: "Production-ready Docker Compose config with health-checked Postgres",
        contentType: "text",
        language: "yaml",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `version: '3.9'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: \${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Deploy via SSH",
        description: "Pull latest, install deps, build, and restart with PM2 over SSH",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: type.command,
        content: `ssh deploy@prod-server 'cd /app && git pull origin main && npm ci --omit=dev && npm run build && pm2 restart app'`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Docker Documentation",
        description: "Official Docker reference docs",
        contentType: "text",
        url: "https://docs.docker.com/",
        userId: user.id,
        itemTypeId: type.link,
      },
    }),

    prisma.item.create({
      data: {
        title: "GitHub Actions Docs",
        description: "Official GitHub Actions reference and workflow syntax",
        contentType: "text",
        url: "https://docs.github.com/en/actions",
        userId: user.id,
        itemTypeId: type.link,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: devopsItems.map((item) => ({ itemId: item.id, collectionId: devops.id })),
  });
  console.log(`Created "DevOps" collection with ${devopsItems.length} items.`);

  // ── Terminal Commands ─────────────────────────────────────────────────────
  const terminalCmds = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  const terminalItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Git Operations",
        description: "Undo commits, stash/pop, and clean up merged branches",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: type.command,
        content: `# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Stash with a description
git stash push -m "WIP: description"

# Apply latest stash and remove it from the list
git stash pop

# Delete all local branches already merged into main
git branch --merged main | grep -v "\\* main" | xargs git branch -d`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Docker Cleanup",
        description: "Remove stopped containers, dangling images, unused volumes and networks",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: type.command,
        content: `# Remove stopped containers, dangling images, unused networks
docker system prune -af

# Also remove unused volumes (warning: data loss)
docker volume prune -f

# Stop and remove every running container
docker ps -aq | xargs -r docker stop | xargs -r docker rm`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Kill Process on Port",
        description: "Find and kill whatever is listening on a given port (macOS/Linux/Windows)",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: type.command,
        content: `# macOS / Linux
lsof -ti :3000 | xargs kill -9

# Alternative (Linux)
fuser -k 3000/tcp

# Windows — find PID, then kill
netstat -ano | findstr :3000
taskkill /PID <PID> /F`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Package Manager Utilities",
        description: "Audit, upgrade, and clean install with npm / pnpm",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: type.command,
        content: `# Check for outdated packages
npm outdated

# Interactive upgrade (uses ncu)
npx npm-check-updates -i

# Audit and auto-fix vulnerabilities
npm audit fix

# Clean install — delete node_modules first
rm -rf node_modules && npm ci

# pnpm equivalents
pnpm outdated
pnpm update --interactive
pnpm audit --fix`,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: terminalItems.map((item) => ({ itemId: item.id, collectionId: terminalCmds.id })),
  });
  console.log(`Created "Terminal Commands" collection with ${terminalItems.length} items.`);

  // ── Design Resources ──────────────────────────────────────────────────────
  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  const designItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Tailwind CSS Docs",
        description: "Official Tailwind CSS utility reference and configuration guide",
        contentType: "text",
        url: "https://tailwindcss.com/docs",
        userId: user.id,
        itemTypeId: type.link,
      },
    }),

    prisma.item.create({
      data: {
        title: "shadcn/ui",
        description: "Copy-paste accessible component library built on Radix + Tailwind",
        contentType: "text",
        url: "https://ui.shadcn.com/",
        userId: user.id,
        itemTypeId: type.link,
      },
    }),

    prisma.item.create({
      data: {
        title: "Radix UI Primitives",
        description: "Unstyled, accessible component primitives for building design systems",
        contentType: "text",
        url: "https://www.radix-ui.com/primitives",
        userId: user.id,
        itemTypeId: type.link,
      },
    }),

    prisma.item.create({
      data: {
        title: "Lucide Icons",
        description: "Open-source icon library with 1000+ consistent SVG icons",
        contentType: "text",
        url: "https://lucide.dev/",
        userId: user.id,
        itemTypeId: type.link,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: designItems.map((item) => ({ itemId: item.id, collectionId: designResources.id })),
  });
  console.log(`Created "Design Resources" collection with ${designItems.length} items.`);

  // ── CSS Tricks (★ favorite) ──────────────────────────────────────────────
  const cssTricks = await prisma.collection.create({
    data: {
      name: "CSS Tricks",
      description: "Modern CSS patterns, layouts, and animations",
      isFavorite: true,
      userId: user.id,
    },
  });

  const cssItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Container Queries",
        description: "Responsive components that adapt to their container, not the viewport",
        contentType: "text",
        language: "css",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Scroll-Driven Animations",
        description: "CSS-only scroll-linked animations using animation-timeline",
        contentType: "text",
        language: "css",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `.hero {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

@keyframes fade-in {
  from { opacity: 0; translate: 0 40px; }
  to   { opacity: 1; translate: 0 0; }
}

.progress-bar {
  animation: grow-width linear;
  animation-timeline: scroll();
  transform-origin: left;
}

@keyframes grow-width {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}`,
      },
    }),

    prisma.item.create({
      data: {
        title: "CSS Nesting & :has()",
        description: "Modern CSS selectors for parent-aware and nested styling",
        contentType: "text",
        language: "css",
        userId: user.id,
        itemTypeId: type.snippet,
        isFavorite: true,
        content: `.form-field {
  & label {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  & input {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
  }

  &:has(input:invalid) {
    & label { color: var(--error); }
    & input { border-color: var(--error); }
  }

  &:has(input:focus) {
    & label { color: var(--accent); }
  }
}`,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: cssItems.map((item) => ({ itemId: item.id, collectionId: cssTricks.id })),
  });
  console.log(`Created "CSS Tricks" collection (★) with ${cssItems.length} items.`);

  // ── API Patterns (★ favorite) ────────────────────────────────────────────
  const apiPatterns = await prisma.collection.create({
    data: {
      name: "API Patterns",
      description: "REST, error handling, and API design best practices",
      isFavorite: true,
      userId: user.id,
    },
  });

  const apiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Typed API Response Helper",
        description: "Type-safe success/error response wrappers for Next.js API routes",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: string; code?: string };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function fail(error: string, code?: string): ApiError {
  return { success: false, error, code };
}

// Usage in a Server Action:
export async function createItem(formData: FormData): Promise<ApiResponse<{ id: string }>> {
  try {
    const title = formData.get('title') as string;
    if (!title) return fail('Title is required', 'VALIDATION');
    const item = await db.item.create({ data: { title } });
    return ok({ id: item.id });
  } catch {
    return fail('Failed to create item', 'INTERNAL');
  }
}`,
      },
    }),

    prisma.item.create({
      data: {
        title: "Rate Limiting Middleware",
        description: "Simple in-memory rate limiter using a sliding window",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: type.snippet,
        content: `const rateMap = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const hits = rateMap.get(key)?.filter((t) => t > now - windowMs) ?? [];
  hits.push(now);
  rateMap.set(key, hits);

  return {
    allowed: hits.length <= limit,
    remaining: Math.max(0, limit - hits.length),
  };
}`,
      },
    }),

    prisma.item.create({
      data: {
        title: "REST API Design Notes",
        description: "Quick reference for consistent REST API design decisions",
        contentType: "text",
        userId: user.id,
        itemTypeId: type.note,
        content: `## URL Conventions
- Plural nouns: /users, /items, /collections
- Nested resources: /collections/:id/items
- Filter via query params: /items?type=snippet&favorite=true

## Status Codes
- 200 OK — successful GET/PUT/PATCH
- 201 Created — successful POST
- 204 No Content — successful DELETE
- 400 Bad Request — validation errors
- 401 Unauthorized — missing/invalid auth
- 403 Forbidden — valid auth but no permission
- 404 Not Found — resource doesn't exist
- 409 Conflict — duplicate or state conflict
- 429 Too Many Requests — rate limited

## Pagination
- Cursor-based preferred: ?cursor=abc&limit=20
- Offset-based for simple cases: ?page=2&limit=20
- Always return: { data, nextCursor?, total? }`,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: apiItems.map((item) => ({ itemId: item.id, collectionId: apiPatterns.id })),
  });
  console.log(`Created "API Patterns" collection (★) with ${apiItems.length} items.`);

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
