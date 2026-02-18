<script>
  import { _ } from "svelte-i18n";
  let { uri } = $props();
</script>

<p><b>{$_('export.finished.savedTo')}</b></p>
<p class="path">{uri}</p>

<style lang="scss">
  .path {
    word-break: break-all;
  }
</style>
