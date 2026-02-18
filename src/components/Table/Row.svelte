<script>
  let { onclick, children } = $props();
</script>

<tr {onclick}>
  {@render children?.()}
</tr>

<style lang="scss">
  tr {
    width: 100%;
    transition: all 0.5s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--menu-active);
    }
  }
</style>
