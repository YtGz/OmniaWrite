<script>
  import { fly } from "svelte/transition";

  let {
    show = $bindable(false),
    text = "A notification message..",
    duration = 5000,
    onclick,
    children
  } = $props();

  $effect(() => {
    if (show && duration != "forever") {
      setTimeout(() => {
        show = false;
      }, duration);
    }
  });
</script>

{#if show}
  <button
    type="button"
    {onclick}
    in:fly={{ y: -100, duration: 500 }}
    out:fly={{ x: 100, duration: 500 }}>
    {@html text}
    {@render children?.()}
  </button>
{/if}

<style type="scss">
  button {
    border: none;
    cursor: pointer;
    font: inherit;
    width: 100%;
    background-color: var(--snackbar);
    color: var(--text-color);
    text-align: center;
    padding: 1rem;
    position: fixed;
    z-index: 9999;
    bottom: 0;
    right: 0;
  }
  @media (min-width: 960px) {
    button {
      width: 18rem;
      border-radius: 1rem;
      bottom: 1rem;
      right: 1rem;
    }
  }
</style>
