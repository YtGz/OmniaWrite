<script>
  let { state = $bindable() } = $props();
</script>

{#if state}
  <div
    class="backdrop"
    role="presentation"
    onclick={() => (state = false)}
    onkeydown={(e) => e.key === 'Escape' && (state = false)}
    style="-webkit-app-region: no-drag"></div>
{/if}

<style lang="scss">
  @use "../../css/mixins/devices" as *;

  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: -1;

    @include desktop {
      display: none;
    }
  }
</style>
