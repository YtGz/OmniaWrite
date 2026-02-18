# Svelte 5 Migration TODO

## Completed

- [x] Update `main.js` to use `mount()` instead of `new App()`
- [x] Migrate Form components to Svelte 5 runes:
  - [x] Button.svelte
  - [x] ButtonGroup.svelte
  - [x] Checkbox.svelte
  - [x] Field.svelte
  - [x] File.svelte
  - [x] Input.svelte
  - [x] InputEmail.svelte
  - [x] InputPassword.svelte
  - [x] Range.svelte
  - [x] Search.svelte
  - [x] Select.svelte
  - [x] Textarea.svelte
- [x] Migrate remaining components to Svelte 5 runes

### src/components/
- [x] Grid/Grid.svelte
- [x] Grid/GridElement.svelte
- [x] List.svelte
- [x] Table/Cell.svelte
- [x] Table/Heading.svelte
- [x] Table/Row.svelte
- [x] Table/Table.svelte

### src/shared/
- [x] Alert.svelte
- [x] BrowserSupport.svelte
- [x] Disclaimer.svelte (no changes needed)
- [x] Header.svelte
- [x] Header/Tabs.svelte
- [x] Install.svelte
- [x] Modal.svelte
- [x] NewBackup.svelte
- [x] NewUpdate.svelte
- [x] Placeholder.svelte
- [x] Sidebar.svelte
- [x] Sidebar/Backdrop.svelte
- [x] Sidebar/Chapter.svelte
- [x] Sidebar/Close.svelte
- [x] Sidebar/CreateChapter.svelte
- [x] Sidebar/CreateScene.svelte
- [x] Sidebar/EditChapter.svelte
- [x] Sidebar/EditProject.svelte
- [x] Sidebar/EditScene.svelte
- [x] Sidebar/ReArrange.svelte
- [x] Sidebar/Scene.svelte
- [x] Spinner.svelte
- [x] Support.svelte
- [x] ThirdParty.svelte (no changes needed)
- [x] Toast.svelte

### src/routes/
- [x] App.svelte
- [x] Cards.svelte
- [x] Cloud.svelte
- [x] Cloud/Backups.svelte
- [x] Cloud/Login.svelte
- [x] Cloud/Logout.svelte (no changes needed)
- [x] Cloud/Policy.svelte (no changes needed)
- [x] Cloud/Profile.svelte (no changes needed)
- [x] Cloud/Profile/Email.svelte
- [x] Cloud/Profile/Name.svelte
- [x] Cloud/Profile/Password.svelte
- [x] Cloud/Register.svelte
- [x] Cloud/ResetPassword.svelte
- [x] Cloud/Security.svelte
- [x] Export.svelte
- [x] Export/Cloud.svelte
- [x] Export/Markdown.svelte
- [x] Export/RTF.svelte
- [x] Export/Shared/Done.svelte
- [x] Export/Shared/Download.svelte
- [x] Export/Shared/Filesystem.svelte
- [x] Overview.svelte
- [x] Overview/CreateProject.svelte
- [x] Overview/Project.svelte (no changes needed)
- [x] Settings.svelte
- [x] Write.svelte
- [x] Write/Overview.svelte

### Test infrastructure
- [x] Update jest.config.js for Svelte 5 ESM compatibility
- [x] Update Button.test.js to use Svelte 5 patterns (remove svelte-htm dependency)

## Known Issues

- `svelte-jester` does not support Svelte 5 (requires CJS mode). Tests need migration to Vitest.
- `svelte-htm` is incompatible with Svelte 5 (depends on removed `svelte/internal`).
- `omnia-editor` still uses Svelte 3/4 event syntax (`on:init`, `on:input`, `on:change`) - works via Svelte compatibility mode.
- `svelte-spa-router` still uses Svelte 3/4 event syntax (`on:routeLoaded`) - works via Svelte compatibility mode.

## Migration Patterns

### Props
```svelte
// Old (Svelte 4)
export let prop;
export let prop = defaultValue;

// New (Svelte 5)
let { prop, prop2 = defaultValue } = $props();
```

### Bindable Props
```svelte
// Old (Svelte 4)
export let value;
<Child bind:value />

// New (Svelte 5)
let { value = $bindable() } = $props();
<Child bind:value />
```

### Reactive Statements
```svelte
// Old (Svelte 4)
$: doubled = count * 2;
$: { sideEffect(); }

// New (Svelte 5)
let doubled = $derived(count * 2);
$effect(() => { sideEffect(); });
```

### Slots
```svelte
// Old (Svelte 4)
<slot />
<slot name="header" />

// New (Svelte 5)
{@render children?.()}
{@render header?.()}

// Props declaration
let { children, header } = $props();
```

### Events
```svelte
// Old (Svelte 4)
<button on:click={handler}>
<button on:click|preventDefault>

// New (Svelte 5)
<button onclick={handler}>
<button onclick={(e) => { e.preventDefault(); onclick?.(e); }}>

// Component events: use callback props instead of createEventDispatcher
```

### Self-closing tags
```svelte
// Old (allowed)
<span />

// New (required for non-void elements)
<span></span>
```

## Notes

- Svelte 5 still supports legacy syntax in compatibility mode
- The webpack config has been updated with Svelte 5 subpath aliases
- `onMount`, `onDestroy` lifecycle hooks still work in Svelte 5
- Stores (`writable`, `get`) still work - no migration needed for stores.js
- `mql.addListener` replaced with `mql.addEventListener("change", ...)` (deprecated API)
