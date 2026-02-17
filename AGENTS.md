# AGENTS.md

Agent guidelines for working with the OmniaWrite codebase.

## Project Overview

OmniaWrite is a text editor engineered for creative writing. It's a cross-platform application supporting:
- **Web** (PWA with service workers)
- **Desktop** (Electron)
- **Mobile** (Android via Capacitor)

**Tech Stack:**
- **Frontend**: Svelte 3 with svelte-spa-router
- **Styling**: SCSS with svelte-preprocess
- **Bundler**: Webpack 4
- **Testing**: Jest + @testing-library/svelte
- **Component Documentation**: Storybook 6
- **Cloud Backend**: Appwrite SDK

## Essential Commands

```bash
# Development
npm run dev                 # Start dev server with HMR

# Build
npm run build               # Production build (with license prep)
npm run svelte-build        # Build Svelte only (no license step)
npm run build:cap           # Build + sync Capacitor for mobile

# Testing
npm test                    # Run Jest tests
node ./tests/langcompare.js # Check translation completeness

# Linting & Formatting
npm run lint                # ESLint on src/
npm run prettier            # Format all src/ files

# Electron
npm run electron            # Build then run Electron app
npm run pure-electron       # Run Electron without rebuild

# Storybook
npm run storybook           # Start Storybook on port 6006
npm run build-storybook     # Build static Storybook

# Capacitor
npm run cap:sync            # Sync web build to native platforms
```

## Project Structure

```
src/
├── main.js              # App entry point
├── App.svelte           # Root component with routing
├── stores.js            # Svelte stores (projects, chapters, scenes, etc.)
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
public/                  # Static assets and index.html
android/                 # Capacitor Android project
tests/                   # Test utilities
```

## Code Patterns & Conventions

### Svelte Components

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

**Component props:**
```javascript
export let color;
export let loading = false;  // Default values
export let disabled = false;
```

**Event forwarding:**
```svelte
<button on:click|preventDefault>
```

### State Management

All app state lives in `src/stores.js` using Svelte writable stores with localStorage persistence:

```javascript
// Main stores
import { state, projects, chapters, scenes, tabs, cards, settings, intern, ui } from "./stores";

// Reading store values
$projects  // Reactive subscription in Svelte
get(projects)  // One-time read (import { get } from "svelte/store")

// Store methods
projects.createProject(title, author, description, publisher, language);
scenes.setSceneContent(id, content);
state.setCurrentProject(projectId);
```

**Data hierarchy:**
- `projects` → contains chapters → contains scenes
- `cards` → reference cards (characters, locations) linked to projects
- `tabs` → open editor tabs linked to projects

### Routing

Uses `svelte-spa-router` with hash-based routing:

```javascript
import Router, { push, replace, location } from "svelte-spa-router";

// Navigate programmatically
push("/write/" + sceneId);

// Route params
export let params = {};  // { sceneId: "123" }
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
2. Run `node ./tests/langcompare.js` to see missing translations in other languages

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

- SCSS with preprocessor
- CSS custom properties for theming (`--background-color`, `--text-color`, etc.)
- Device-specific styles via mixins:

```scss
@import "css/mixins/devices";

.container {
  // Mobile-first styles

  @include desktop {
    // Desktop overrides (min-width: 960px)
  }
}
```

**Themes:** `dark` and `light` applied as body class.

## Testing Patterns

Tests use Jest with @testing-library/svelte:

```javascript
import { render, fireEvent } from "@testing-library/svelte";
import html from "svelte-htm";
import Button from "./Button.svelte";

test("events should work", () => {
  const mock = jest.fn();
  const { getByText } = render(
    html`<${Button} color="green" on:click=${mock}>Button<//>`
  );
  fireEvent.click(getByText("Button"));
  expect(mock).toHaveBeenCalled();
});
```

**Test file location:** Co-located with components (e.g., `Button.test.js` next to `Button.svelte`)

**Mocks required:** Jest config mocks static assets (see `jest.config.js`)

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

## CI/CD

GitHub Actions workflows:
- `test.yml` - Runs on push/PR: `npm test` and `node ./tests/langcompare.js`
- `lint.yml` - Runs ESLint on PRs
- `build.yml` - Electron builds on all platforms, releases on version tags

## Important Gotchas

1. **Svelte 3**: This project uses Svelte 3, not Svelte 5. Don't use runes (`$state`, `$derived`, etc.).

2. **localStorage-based state**: All data is stored in localStorage. The stores auto-persist on subscription changes.

3. **ID generation**: Uses random numbers (0-999999). Check `doesIdExist()` in stores.js to avoid collisions.

4. **Service worker**: Only registers in production web builds (not localhost, Electron, or Capacitor).

5. **ESLint ignores test files**: Test files (`*.test.js`) and `public/` are excluded from linting.

6. **Webpack 4**: Not Webpack 5. Some newer features/syntax may not work.

7. **Editor component**: The main editor is `omnia-editor`, a separate npm package.

8. **Export APIs**: Export functionality uses serverless functions in `/api/` (deployed to Vercel).

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

**Examples:**
```bash
feat(editor): add word count display
fix(cloud): handle backup restore timeout
docs(readme): update installation steps
style(components): format Button with prettier
refactor(stores): simplify scene content update
test(Button): add disabled state test
chore(deps): upgrade svelte to 3.35.0
```

**Scope** (optional): Component or area affected (e.g., `editor`, `cloud`, `sidebar`, `stores`, `i18n`)

## Adding New Features

### New Route
1. Create component in `src/routes/`
2. Add route to `App.svelte` routes object
3. Add navigation link in `Header.svelte` if needed

### New Component
1. Create `.svelte` file in appropriate `src/components/` folder
2. Add `.stories.js` for Storybook documentation
3. Add `.test.js` for unit tests
4. Export from `index.js` if part of a component group

### New Translation Key
1. Add to `src/lang/en.json`
2. Use with `{$_('path.to.key')}`
3. Run `node ./tests/langcompare.js` to check coverage
