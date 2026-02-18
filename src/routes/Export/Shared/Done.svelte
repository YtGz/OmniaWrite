<script>
  import Download from "./Download.svelte";
  import Filesystem from "./Filesystem.svelte";

  let { file } = $props();
</script>

{#if file.type === 'download'}
  <Download {...file} />
{/if}
{#if file.type === 'filesystem'}
  <Filesystem {...file} />
{/if}
