/**
 * Static mock data for dashboard UI until the database is wired up.
 * Shape loosely follows context/project-overview.md (User, Item, ItemType, Collection).
 */

export type MockUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  isPro: boolean;
};

export type MockItemTypeSlug =
  | "snippet"
  | "prompt"
  | "note"
  | "command"
  | "link"
  | "file"
  | "image";

export type MockItemType = {
  id: string;
  slug: MockItemTypeSlug;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

export type MockCollection = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  /** Accent for UI cards — mirrors dominant item type tint in starter-ui */
  accentSlug: MockItemTypeSlug;
  /** Denormalized count for sidebar / cards */
  itemCount: number;
};

export type MockItem = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  contentType: "text" | "file";
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  tagNames: string[];
  collectionIds: string[];
  /** Short relative label for “Recently used” (e.g. "12m", "yesterday") */
  lastUsedLabel: string;
  /** When `true`, preview uses prose styling instead of monospace */
  previewIsProse?: boolean;
};

export const mockCurrentUser: MockUser = {
  id: "usr_mock_dashboard",
  email: "maya@gmail.com",
  name: "Maya Kellner",
  image: null,
  isPro: false,
};

export const mockItemTypes: MockItemType[] = [
  {
    id: "ity_snippet",
    slug: "snippet",
    name: "Snippet",
    icon: "snippet",
    color: "#0099ff",
    isSystem: true,
  },
  {
    id: "ity_prompt",
    slug: "prompt",
    name: "Prompt",
    icon: "prompt",
    color: "#b980ff",
    isSystem: true,
  },
  {
    id: "ity_note",
    slug: "note",
    name: "Note",
    icon: "note",
    color: "#ffb257",
    isSystem: true,
  },
  {
    id: "ity_command",
    slug: "command",
    name: "Command",
    icon: "command",
    color: "#35d08a",
    isSystem: true,
  },
  {
    id: "ity_link",
    slug: "link",
    name: "Link",
    icon: "link",
    color: "#ff6a8a",
    isSystem: true,
  },
  {
    id: "ity_file",
    slug: "file",
    name: "File",
    icon: "file",
    color: "#7aa8ff",
    isSystem: true,
  },
  {
    id: "ity_image",
    slug: "image",
    name: "Image",
    icon: "image",
    color: "#ff9e5e",
    isSystem: true,
  },
];

export const mockCollections: MockCollection[] = [
  {
    id: "col_react_patterns",
    userId: mockCurrentUser.id,
    name: "React Patterns",
    description:
      "Hooks, composition tricks, render-prop variants, and memoization recipes.",
    isFavorite: true,
    accentSlug: "snippet",
    itemCount: 24,
  },
  {
    id: "col_ai_prompts",
    userId: mockCurrentUser.id,
    name: "AI Prompts",
    description: "System messages, eval rubrics, and reusable scaffolds for GPT-5.",
    isFavorite: true,
    accentSlug: "prompt",
    itemCount: 31,
  },
  {
    id: "col_shell",
    userId: mockCurrentUser.id,
    name: "Shell Commands",
    description: "Everyday one-liners — git, docker, kubectl, ffmpeg, jq.",
    isFavorite: false,
    accentSlug: "command",
    itemCount: 18,
  },
  {
    id: "col_interview",
    userId: mockCurrentUser.id,
    name: "Interview Prep",
    description: "Big-O notes, system design cheatsheets, behavioral prompts.",
    isFavorite: false,
    accentSlug: "note",
    itemCount: 12,
  },
  {
    id: "col_python",
    userId: mockCurrentUser.id,
    name: "Python Utils",
    description: "Small, pure helpers that keep showing up across projects.",
    isFavorite: true,
    accentSlug: "snippet",
    itemCount: 27,
  },
  {
    id: "col_read_later",
    userId: mockCurrentUser.id,
    name: "Read Later",
    description: "Papers, articles, and blog posts queued for weekend reading.",
    isFavorite: false,
    accentSlug: "link",
    itemCount: 9,
  },
  {
    id: "col_design_system",
    userId: mockCurrentUser.id,
    name: "Design System",
    description: "Tokens, component specs, and usage notes for UI kit.",
    isFavorite: false,
    accentSlug: "note",
    itemCount: 14,
  },
];

const uid = mockCurrentUser.id;

export const mockItems: MockItem[] = [
  {
    id: "itm_debounce_hook",
    userId: uid,
    title: "useDebouncedValue — React hook",
    description:
      "Lightweight hook for debouncing rapidly-changing values. Useful for search inputs, resize observers, and any derived state you don't want to recompute on every keystroke.",
    contentType: "text",
    content:
      "export function useDebouncedValue<T>(value: T, delay = 250) {\n  const [debounced, setDebounced] = useState(value);\n  // ...\n}",
    url: null,
    language: "ts",
    isFavorite: true,
    isPinned: true,
    itemTypeId: "ity_snippet",
    tagNames: ["react", "hooks", "typescript", "performance"],
    collectionIds: ["col_react_patterns", "col_interview"],
    lastUsedLabel: "12m",
  },
  {
    id: "itm_code_review_prompt",
    userId: uid,
    title: "Code review — senior staff engineer",
    description: null,
    contentType: "text",
    content:
      "You are a senior staff engineer reviewing a pull request. Focus on correctness, edge cases, and hidden coupling. Return…",
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_prompt",
    tagNames: ["review", "gpt-5", "system"],
    collectionIds: ["col_ai_prompts"],
    lastUsedLabel: "1h",
    previewIsProse: true,
  },
  {
    id: "itm_git_reset",
    userId: uid,
    title: "Reset branch to origin/main",
    description: null,
    contentType: "text",
    content: "git fetch origin && git reset --hard origin/main && git clean -fd",
    url: null,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_command",
    tagNames: ["git", "recovery"],
    collectionIds: ["col_shell"],
    lastUsedLabel: "3h",
  },
  {
    id: "itm_pg_fts",
    userId: uid,
    title: "Postgres full-text search cheatsheet",
    description: null,
    contentType: "text",
    content:
      "tsvector vs. tsquery — remember to_tsvector('english', col) && plainto_tsquery('english', $1) and GIN index the generated column.",
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_note",
    tagNames: ["postgres", "search"],
    collectionIds: ["col_interview"],
    lastUsedLabel: "yesterday",
    previewIsProse: true,
  },
  {
    id: "itm_grug",
    userId: uid,
    title: "The grug brugged developer",
    description: null,
    contentType: "text",
    content: "grugbrain.dev — a hilariously-good primer on complexity and the art of saying no.",
    url: "https://grugbrain.dev",
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_link",
    tagNames: ["reading", "career"],
    collectionIds: ["col_read_later"],
    lastUsedLabel: "2d",
    previewIsProse: true,
  },
  {
    id: "itm_tw_merge",
    userId: uid,
    title: "tailwind-merge helper",
    description: null,
    contentType: "text",
    content:
      "import { twMerge } from 'tailwind-merge';\nimport { clsx, type ClassValue } from 'clsx';\nexport const cn = (...i: ClassValue[]) => twMerge(clsx(i));",
    url: null,
    language: "ts",
    isFavorite: false,
    isPinned: true,
    itemTypeId: "ity_snippet",
    tagNames: ["tailwind", "util"],
    collectionIds: ["col_react_patterns"],
    lastUsedLabel: "2d",
  },
  {
    id: "itm_refactor_prompt",
    userId: uid,
    title: "Refactor for testability",
    description: null,
    contentType: "text",
    content:
      "Given the file below, identify seams for unit testing. Suggest minimal refactors to make dependencies explicit without changing public behavior.",
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_prompt",
    tagNames: ["refactor", "testing"],
    collectionIds: ["col_ai_prompts"],
    lastUsedLabel: "3d",
    previewIsProse: true,
  },
  {
    id: "itm_kill_3000",
    userId: uid,
    title: "Kill port 3000 (macOS)",
    description: null,
    contentType: "text",
    content: "lsof -ti:3000 | xargs kill -9",
    url: null,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_command",
    tagNames: ["macos", "ports"],
    collectionIds: ["col_shell"],
    lastUsedLabel: "4d",
  },
  {
    id: "itm_framer_transition",
    userId: uid,
    title: "Framer-motion page transition",
    description: null,
    contentType: "text",
    content:
      "<AnimatePresence mode='wait'>\n  <motion.div key={path} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} />",
    url: null,
    language: "tsx",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "ity_snippet",
    tagNames: ["motion", "react"],
    collectionIds: ["col_react_patterns"],
    lastUsedLabel: "5d",
  },
];

/** Single bundle import for dashboard mocks */
export const mockDashboardData = {
  user: mockCurrentUser,
  itemTypes: mockItemTypes,
  collections: mockCollections,
  items: mockItems,
};
