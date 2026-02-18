<script>
  import { _ } from "svelte-i18n";

  let { children } = $props();
</script>

<div class="placeholder">
  {#if children}
    {@render children()}
  {:else}
    {$_('common.no-project-selected')}
  {/if}
</div>

<style>
  .placeholder {
    position: relative;
    top: 50%;
    text-align: center;
    opacity: 0.5;
    font-style: italic;
  }
</style>
