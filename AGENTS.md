# AGENTS.md

Agent guidelines for working with the OmniaWrite codebase.

## Project Overview

OmniaWrite is a text editor engineered for creative writing. It's a cross-platform application supporting:
- **Web** (PWA with service workers)
- **Desktop** (Electron)
- **Mobile** (Android via Capacitor)

**Tech Stack:**
- **Frontend**: Svelte 5 (runes mode) with @keenmate/svelte-spa-router
- **Styling**: SCSS via vitePreprocess
- **Bundler**: Vite 7 (run via Bun)
- **Runtime**: Bun
- **Testing**: Vitest + @testing-library/svelte
- **Component Documentation**: Storybook 6
- **Cloud Backend**: Appwrite SDK

## Essential Commands

```bash
# Development
bun run dev                 # Start Vite dev server on port 8080

# Build
bun run build               # Production build (with license prep)
bun run svelte-build        # Build Svelte only (no license step)
bun run build:cap           # Build + sync Capacitor for mobile
bun run preview             # Preview production build

# Testing
bun run test                # Run Vitest tests
node ./tests/langcompare.cjs # Check translation completeness

# Linting & Formatting
bun run lint                # ESLint on src/
bun run prettier            # Format all src/ files

# Electron
bun run electron            # Build then run Electron app
bun run pure-electron       # Run Electron without rebuild

# Storybook
bun run storybook           # Start Storybook on port 6006
bun run build-storybook     # Build static Storybook

# Capacitor
bun run cap:sync            # Sync web build to native platforms
```

## Project Structure

```
src/
├── main.js              # App entry point
├── App.svelte           # Root component with routing
├── stores.js            # Svelte writable stores (appState, projects, chapters, etc.)
├── appwrite.js          # Cloud backend API wrapper
├── bridge.js            # Platform detection (Electron/Capacitor/Web)
├── utils.js             # Utility functions (text processing, formatting)
├── components/          # Reusable UI components
│   ├── Forms/           # Form inputs (Button, Input, Select, etc.)
│   ├── Grid/            # Grid layout components
│   └── Table/           # Table components
├── shared/              # App-wide shared components
│   ├── Header.svelte    # Main navigation header
│   ├── Sidebar.svelte   # Project navigation sidebar
│   ├── Modal.svelte     # Modal dialog
│   └── Sidebar/         # Sidebar sub-components
├── routes/              # Page components (route handlers)
│   ├── Overview.svelte  # Project list
│   ├── Write.svelte     # Main editor
│   ├── Cards.svelte     # Character/location cards
│   ├── Settings.svelte  # User settings
│   ├── Cloud.svelte     # Cloud sync features
│   └── Export.svelte    # Export functionality
├── lang/                # i18n translation files (JSON)
├── css/                 # Global styles and fonts
└── stories/             # Storybook decorators

api/                     # Serverless API functions (Vercel)
public/                  # Static assets (icons, manifest, splash)
index.html               # Vite entry point (project root)
vite.config.js           # Vite configuration
vitest.config.js         # Vitest test configuration
resources/               # Electron app icon
android/                 # Capacitor Android project
tests/                   # Test utilities
```

## Code Patterns & Conventions

### Svelte 5 Components

This project uses **Svelte 5 with runes**. All components use runes syntax.

**File organization** (enforced by Prettier):
```svelte
<script>
  // Scripts first
</script>

<!-- Markup second -->

<style lang="scss">
  /* Styles last */
</style>
```

**Component props (runes):**
```javascript
let { color, loading = false, disabled = false, children } = $props();
```

**Local reactive state:**
```javascript
let count = $state(0);
let doubled = $derived(count * 2);
```

**Event handlers:**
```svelte
<button type="button" onclick={handleClick}>
```

**Bindable props:**
```javascript
let { show = $bindable(false) } = $props();
```

**Snippets (replaces slots):**
```svelte
{@render children?.()}
{@render header?.()}
```

### State Management

App state lives in `src/stores.js` using Svelte writable stores with localStorage persistence.

**Important:** The state store is exported as `appState` (not `state`) to avoid conflicts with the `$state` rune.

```javascript
// Main stores
import { appState, projects, chapters, scenes, tabs, cards, settings, intern, ui } from "./stores";

// Reading store values in Svelte components
$projects  // Reactive subscription
$appState.currentProject  // Access state properties

// One-time read in JS
import { get } from "svelte/store";
get(projects)

// Store methods
projects.createProject(title, author, description, publisher, language);
scenes.setSceneContent(id, content);
appState.setCurrentProject(projectId);
```

**Data hierarchy:**
- `projects` → contains chapters → contains scenes
- `cards` → reference cards (characters, locations) linked to projects
- `tabs` → open editor tabs linked to projects

### Routing

Uses `@keenmate/svelte-spa-router` with hash-based routing:

```javascript
import Router, { push, replace, location } from "@keenmate/svelte-spa-router";
import active from "@keenmate/svelte-spa-router/active";

// Navigate programmatically
push("/write/" + sceneId);

// Route params
let { params } = $props();
```

**Route definitions in App.svelte:**
```javascript
const routes = {
  "/": OverviewRoute,
  "/write/:sceneId?": WriteRoute,
  "/cards": CardsRoute,
  // ...
};
```

### Internationalization

Uses `svelte-i18n`:

```javascript
import { _, locale, isLoading } from "svelte-i18n";

// In templates
{$_('header.write.title')}
{$_('common.update-toast')}

// Set locale
locale.set($settings.language);
```

**Translation files:** `src/lang/*.json` (en.json is the reference)

When adding new strings:
1. Add to `src/lang/en.json` first
2. Run `node ./tests/langcompare.cjs` to see missing translations in other languages

### Platform Detection

```javascript
import { isRunningCapacitor, isRunningElectron } from "./bridge";

if (isRunningElectron) {
  // Electron-specific code
}
if (isRunningCapacitor) {
  // Mobile-specific code
}
```

### Styling

- SCSS via vitePreprocess
- CSS custom properties for theming (`--background-color`, `--text-color`, etc.)
- Use `@use` (not `@import`) for SCSS modules:

```scss
@use "css/mixins/devices" as *;

.container {
  // Mobile-first styles

  @include desktop {
    // Desktop overrides (min-width: 960px)
  }
}
```

**Themes:** `dark` and `light` applied as body class.

### Accessibility

All interactive elements must use semantic HTML:
- Use `<button type="button">` for clickable actions, not `<div>` or `<span>`
- Use `<a href="...">` for navigation links
- Add `aria-label` to icon-only buttons
- Use `role="presentation"` for decorative backdrops with click handlers

## Testing Patterns

Tests use Vitest with @testing-library/svelte:

```javascript
import { render, fireEvent } from "@testing-library/svelte";
import html from "svelte-htm";
import Button from "./Button.svelte";

test("events should work", () => {
  const mock = vi.fn();
  const { getByText } = render(
    html`<${Button} color="green" on:click=${mock}>Button<//>`
  );
  fireEvent.click(getByText("Button"));
  expect(mock).toHaveBeenCalled();
});
```

**Test file location:** Co-located with components (e.g., `Button.test.js` next to `Button.svelte`)

**Config files:** `vitest.config.js` (test config), `vitest-setup.js` (setup)

## Storybook

Stories use CSF format with decorators for slots:

```javascript
import { withSlots, fromText } from "../../stories/decorators/svelte-slots";
import Button from "./Button.svelte";

export default {
  title: "OmniaWrite/Components/Forms/Button",
  component: Button,
  decorators: [withSlots({ default: fromText("Label") })],
};

export const Default = Template.bind({});
```

**Story file location:** Co-located with components (e.g., `Button.stories.js`)

## Cloud Integration

The Appwrite backend (`src/appwrite.js`) provides:
- User authentication (login, register, password recovery)
- Cloud backup/restore
- Session management

**Key functions:**
```javascript
import cloud from "./appwrite";

await cloud.login(email, password);
await cloud.saveToCloud();
await cloud.restoreBackup(backupId);
await cloud.getAllBackups();
```

**Environment variables** (handled by Vite `define`):
- `APPWRITE_ENDPOINT` — Appwrite server URL
- `APPWRITE_PROJECT` — Project ID
- `APPWRITE_BUCKET_ID` — Storage bucket for backups

## CI/CD

GitHub Actions workflows (all use `oven-sh/setup-bun`):
- `test.yml` — Runs on push/PR: `bun run test` and `node ./tests/langcompare.cjs`
- `lint.yml` — Runs ESLint on PRs
- `build.yml` — Electron builds on all platforms, releases on version tags

## Important Gotchas

1. **Svelte 5 runes**: This project uses Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`). Do not use Svelte 3/4 patterns (`export let`, `on:click`, `<slot>`).

2. **Store naming**: The state store is `appState`, not `state`. Using `state` as a variable name conflicts with the `$state` rune.

3. **localStorage-based state**: All data is stored in localStorage. The stores auto-persist on subscription changes.

4. **ID generation**: Uses random numbers (0-999999). Check `doesIdExist()` in stores.js to avoid collisions.

5. **Service worker**: Only registers in production web builds (not localhost, Electron, or Capacitor).

6. **ESLint ignores test files**: Test files (`*.test.js`) and `public/` are excluded from linting.

7. **ESM package**: `package.json` has `"type": "module"`. CommonJS files must use `.cjs` extension (e.g., `electron.cjs`, `langcompare.cjs`).

8. **Editor component**: The main editor is `@ytgz/omnia-editor`, installed from a local tarball.

9. **Export APIs**: Export functionality uses serverless functions in `/api/` (deployed to Vercel).

10. **Build output**: Vite outputs to `build/` (not `public/`). Static assets in `public/` are copied as-is.

11. **SCSS**: Use `@use` not `@import`. Sass `@import` is deprecated and will be removed in Dart Sass 3.0.

12. **svelte-spa-router active**: Import as default: `import active from "@keenmate/svelte-spa-router/active"` (not named export).

## Code Style (Prettier)

```json
{
  "arrowParens": "avoid",
  "semi": true,
  "tabWidth": 2,
  "svelteSortOrder": "scripts-markup-styles",
  "svelteStrictMode": false,
  "svelteBracketNewLine": false,
  "svelteAllowShorthand": true
}
```

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, semicolons, etc.)
- `refactor` - Code refactoring (no feature/fix)
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, tooling

**Scope** (optional): Component or area affected (e.g., `editor`, `cloud`, `sidebar`, `stores`, `i18n`)

## Adding New Features

### New Route
1. Create component in `src/routes/`
2. Add route to `App.svelte` routes object
3. Add navigation link in `Header.svelte` if needed

### New Component
1. Create `.svelte` file in appropriate `src/components/` folder
2. Use Svelte 5 runes: `$props()`, `$state()`, `$derived()`, `$effect()`
3. Add `.stories.js` for Storybook documentation
4. Add `.test.js` for unit tests
5. Export from `index.js` if part of a component group

### New Translation Key
1. Add to `src/lang/en.json`
2. Use with `{$_('path.to.key')}`
3. Run `node ./tests/langcompare.cjs` to check coverage
