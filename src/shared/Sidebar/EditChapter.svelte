<script>
  import { _ } from "svelte-i18n";
  import { chapters } from "../../stores";
  import { Input, Button, ButtonGroup } from "../../components/Forms";
  import Modal from "../../shared/Modal.svelte";

  let { show = $bindable(), data = $bindable() } = $props();

  const editChapter = () => {
    chapters.setChapterTitle(data.id, data.title);
    show = false;
  };

  const removeChapter = chapterId => {
    let confirmed = confirm($_("sidebar.delete.chapter"));
    if (confirmed == true) {
      chapters.removeChapter(chapterId);
      show = false;
    }
  };
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('sidebar.editChapter')}</h2>{/snippet}
  <form onsubmit={(e) => { e.preventDefault(); editChapter(); }}>
    <Input
      label={$_('sidebar.modal.title')}
      bind:value={data.title}
      autocomplete="off"
      autofocus="true"
      placeholder={$_('placeholder.title')} />
    <ButtonGroup>
      <Button onclick={editChapter} disabled={data.title.length === 0}>
        {$_('sidebar.modal.edit.buttonSave')}
      </Button>
      <Button onclick={() => removeChapter(data.id)} color="red">
        {$_('sidebar.modal.edit.buttonDelete')}
      </Button>
    </ButtonGroup>
  </form>
</Modal>
