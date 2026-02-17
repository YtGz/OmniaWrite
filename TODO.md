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

## In Progress

- [ ] Migrate remaining components to Svelte 5 runes

## Remaining Components

### src/components/
- [ ] Grid/Grid.svelte
- [ ] Grid/GridElement.svelte
- [ ] List.svelte
- [ ] ListElement.svelte
- [ ] Table/Cell.svelte
- [ ] Table/Heading.svelte
- [ ] Table/Row.svelte
- [ ] Table/Table.svelte

### src/shared/
- [ ] Header.svelte
- [ ] Sidebar.svelte
- [ ] Sidebar/*.svelte (multiple files)
- [ ] Modal.svelte
- [ ] Toast.svelte
- [ ] Spinner.svelte
- [ ] Support.svelte
- [ ] Install.svelte
- [ ] NewBackup.svelte
- [ ] NewUpdate.svelte
- [ ] ThirdParty.svelte
- [ ] Disclaimer.svelte
- [ ] BrowserSupport.svelte
- [ ] Placeholder.svelte

### src/routes/
- [ ] Overview.svelte
- [ ] Write.svelte
- [ ] Cards.svelte
- [ ] Settings.svelte
- [ ] Cloud.svelte
- [ ] Cloud/*.svelte (multiple files)
- [ ] Export.svelte
- [ ] Export/*.svelte (multiple files)

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
