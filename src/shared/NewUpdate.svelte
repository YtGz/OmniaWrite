<script>
  import { _ } from "svelte-i18n";
  import Modal from "./Modal.svelte";

  let { show = $bindable(true) } = $props();
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('common.update.title')}</h2>{/snippet}
  <h3>🦺 Security</h3>
  <p>This update fixed some security issues.</p>
</Modal>
