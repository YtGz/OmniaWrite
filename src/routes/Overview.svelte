<script>
  import { fade } from "svelte/transition";
  import { appState, projects, chapters } from "../stores.svelte";
  import { reloadWindow } from "../bridge";
  import { _ } from "svelte-i18n";
  import { Grid, GridElement } from "../components/Grid";
  import CreateProject from "./Overview/CreateProject.svelte";
  import ProjectOverview from "./Overview/Project.svelte";
  import { formatDistance } from "../utils";

  let showCreateProject = $state(false);

  const changeProject = project => {
    appState.setCurrentProject(project);
    projects.updateProjectTimestamp(project);
    reloadWindow();
  };

  const sort = (b, a) => {
    if (a.lastOpen < b.lastOpen) {
      return -1;
    }
    if (a.lastOpen > b.lastOpen) {
      return 1;
    }
    return 0;
  };
</script>

<CreateProject
  bind:showCreateProject
  onchangeProject={(project) => changeProject(project)} />

<div in:fade={{ duration: 100 }} class="overview">
  {#each projects.filter(project => project.id == appState.currentProject) as project}
    <h1>{project.title}</h1>
    <ProjectOverview />
  {/each}
  <h1>{$_('overview.projects.title')}</h1>
  <Grid>
    <GridElement action="true" onclick={() => (showCreateProject = true)}>
      <span class="lnr lnr-plus-circle"></span>
    </GridElement>
    {#each projects.sort(sort) as project}
      <GridElement
        title={project.title}
        onclick={() => changeProject(project.id)}>
        <p>
          {$_('overview.projects.opened')}
          {formatDistance(project.lastOpen)}
        </p>
        <p>
          {$_('overview.project.chapters')}:
          {chapters.filter(n => n.project == project.id).length}
        </p>
      </GridElement>
    {/each}
  </Grid>
</div>

<style>
  .overview {
    max-width: 800px;
    margin: auto;
    text-align: center;
  }
</style>
