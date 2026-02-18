<script>
  let { children } = $props();
</script>

<div class="list">
  {@render children?.()}
</div>

<style lang="scss">
  .list {
    display: flex;
    flex-direction: row;
  }
</style>
