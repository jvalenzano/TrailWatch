# Troubleshooting: Silent Module Evaluation Failures

This guide documents the "Silent Death" failure mode—when the application renders a blank screen with zero console errors—and how to diagnose and prevent it.

## The Symptom: Total Blackout
- Browser shows a blank screen.
- DevTools Console is empty (or only shows unrelated warnings).
- Even the first line of `main.tsx` (e.g., `console.log('App starting')`) does not execute.

## The Cause: Parse-Time Failures
This occurs when the ESM (ES Module) loader fails to **parse** a module in the dependency graph. ESM loading happens in stages:
1. **Construction (Parsing)**: Detects `import`/`export` keywords and builds the module graph.
2. **Instantiation**: Maps exports to imports in memory.
3. **Evaluation**: Executes the actual JavaScript code.

If a SyntaxError occurs during **Parsing**, the browser stops dead. Since no code has executed yet (not even the entry point), there is no runtime context to catch the error or log it to the console.

### Common Poisoned Module Culprits
- **Malformed String Literals**: Unescaped newlines or hidden Unicode characters (Zero-Width Spaces, Smart Quotes).
- **Missing Exports**: Importing a named export that doesn't exist in a module which failed to parse.
- **Top-Level Hook Execution**: Calling React hooks (e.g. `useSearchParams`) at module scope.

## Diagnostic Workflow
When facing a silent crash, use the **Import Bisection** method:

1. **Isolate the Entry Point**: Add a `console.log` to the very top of `main.tsx`. If it doesn't log, the failure is in the import tree.
2. **Binary Search on Imports**: Comment out imports in `App.tsx` or `Dashboard.tsx` until the entry point log appears.
3. **Import vs Usage**: If commenting out the *import statement itself* (even if the variable isn't used) fixes the crash, the issue is a parse-time failure in that specific module or its children.
4. **Hex/OD Check**: Use `od -c <filename>` to look for hidden characters if the syntax looks correct but fails.

## Prevention & Optimization

### 1. Prefer Type-Only Imports
Use `import type` for interfaces and types. These are erased at compile time and do not create runtime module dependencies.
```typescript
// ✅ Good: No runtime dependency
import type { HazardReport } from './types';
```

### 2. Linting for Hidden Characters
Enforce rules to catch irregular whitespace and control characters.
```json
// .eslintrc.json
{
  "rules": {
    "no-irregular-whitespace": "error",
    "no-control-regex": "error"
  }
}
```

### 3. Surface Parse Errors early
Use tools like `vite-plugin-checker` to force syntax errors to appear overlayed in the browser during development.

---
*Reference: Case Study 2026-01-18 - "HazardReport Export Syntax Error"*
