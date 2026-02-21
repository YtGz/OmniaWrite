<script>
  import { _ } from "svelte-i18n";
  import { appState, chapters } from "../../stores";
  import { Input, Button, ButtonGroup } from "../../components/Forms";
  import Modal from "../Modal.svelte";

  let { show = $bindable() } = $props();

  let title = $state("");

  const createChapter = () => {
    chapters.createChapter($appState.currentProject, title);
    show = false;
    title = "";
  };
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('sidebar.modal.newChapter.header')}</h2>{/snippet}
  <form onsubmit={(e) => { e.preventDefault(); createChapter(); }}>
    <Input
      label={$_('sidebar.modal.title')}
      bind:value={title}
      autofocus="true"
      autocomplete="off"
      placeholder={$_('placeholder.title')} />
    <ButtonGroup>
      <Button onclick={createChapter} disabled={title.length === 0}>
        {$_('sidebar.modal.newChapter.button')}
      </Button>
    </ButtonGroup>
  </form>
</Modal>
