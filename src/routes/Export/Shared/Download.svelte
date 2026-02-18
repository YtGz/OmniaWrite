<script>
  import { _ } from "svelte-i18n";

  import ButtonGroup from "../../../components/Forms/ButtonGroup.svelte";
  import Button from "../../../components/Forms/Button.svelte";

  let { download } = $props();
</script>

<ButtonGroup>
  <Button onclick={download}>
    <span class="lnr lnr-download"></span>
    {$_('export.finished.download')}
  </Button>
</ButtonGroup>
