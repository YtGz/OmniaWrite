<script>
  let { children } = $props();
</script>

<table>
  {@render children?.()}
</table>

<style lang="scss">
  table {
    border: 0;
    margin: 0 auto;
    width: 100%;
  }
</style>
