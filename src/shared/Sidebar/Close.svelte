<script>
  let { state = $bindable(), right = true } = $props();
</script>

{#if state}
  <div
    class="close"
    class:right
    onclick={() => (state = false)}
    style="-webkit-app-region: no-drag">
    <span class="lnr lnr-cross"></span>
  </div>
{/if}

<style lang="scss">
  @import "../../css/mixins/devices";

  .close {
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
