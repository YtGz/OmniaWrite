<script>
  let { state = $bindable(), right = true } = $props();
</script>

{#if state}
  <button
    type="button"
    class="close"
    aria-label="Close"
    class:right
    onclick={() => (state = false)}
    style="-webkit-app-region: no-drag">
    <span class="lnr lnr-cross"></span>
  </button>
{/if}

<style lang="scss">
  @use "../../css/mixins/devices" as *;

  .close {
    background: none;
    border: none;
    color: inherit;
    padding: 0;
    cursor: pointer;
    font-size: 2rem;
    position: fixed;
    top: 0.5rem;
    left: 1.5rem;
    right: auto;

    &.right {
      right: 1.5rem;
      left: auto;
    }

    @include desktop {
      display: none;
    }
  }
</style>
