<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { _ } from "svelte-i18n";
  import { projects, chapters, scenes, state } from "../../stores";
  import { reloadWindow } from "../../bridge";
  import { Input, Button, ButtonGroup, Select } from "../../components/Forms";

  import Modal from "../../shared/Modal.svelte";

  let { show = $bindable(false), id } = $props();

  let form = $state({
    title: "",
    author: "",
    description: "",
    publisher: "",
    language: "",
  });

  let checkForm = $derived(form.title !== "");

  onMount(() => {
    form = get(projects).filter(project => project.id == id)[0];
  });

  const save = () => {
    if (checkForm) {
      projects.setProject(form);
      show = false;
    }
  };

  const removeProject = project => {
    let confirmed = confirm($_("overview.project.confirmDelete"));
    if (confirmed == true) {
      $chapters
        .filter(ch => ch.project == project)
        .forEach(chapter => {
          scenes.removeAllScenes(chapter.id);
        });
      chapters.removeAllChapters(project);
      projects.removeProject(project);

      scenes.removeAllScenes(project);
      state.setCurrentProject(false);
      reloadWindow();
    }
  };

  const languages = ["en", "de", "ru", "es", "pt", "fr", "it"].map(language => {
    return {
      value: language,
      text: $_(`settings.appereance.language.${language}`),
    };
  });
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('sidebar.editProject')}</h2>{/snippet}
  <form onsubmit={(e) => { e.preventDefault(); save(); }}>
    <Input
      label={$_('export.title')}
      bind:value={form.title}
      autofocus="true"
      autocomplete="off"
      placeholder={$_('placeholder.title')} />
    <Input
      label={$_('export.author')}
      bind:value={form.author}
      placeholder="John Doe"
      autocomplete="off" />
    <Input
      label={$_('export.publisher')}
      bind:value={form.publisher}
      autocomplete="off"
      placeholder="OmniaWrite"
      helper={$_('export.helpers.publisher')} />
    <Select
      label={$_('export.language')}
      bind:value={form.language}
      options={languages}
      required="true"
      helper={$_('export.helpers.language')} />
    <Input
      label={$_('export.description')}
      placeholder="This book is awesome..."
      bind:value={form.description}
      helper={$_('export.helpers.description')} />
    <ButtonGroup>
      <Button onclick={() => save()} disabled={!checkForm}>
        {$_('overview.project.save')}
      </Button>
      <Button onclick={() => removeProject(id)} color="red">
        {$_('overview.project.delete')}
      </Button>
    </ButtonGroup>
  </form>
</Modal>
