<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { scenes, chapters, cards, state, settings, ui } from "../stores";
  import { push } from "@keenmate/svelte-spa-router";
  import { _ } from "svelte-i18n";
  import { OmniaEditor } from "@ytgz/omnia-editor";
  import tippy from "sveltejs-tippy";
  import Overview from "./Write/Overview.svelte";
  import Placeholder from "../shared/Placeholder.svelte";
  import Modal from "../shared/Modal.svelte";

  let { routeParams = {} } = $props();
  let editor = $state();
  let editorStatus = $state(0);
  let showCards = $state(false);
  let filteredCards = $state([]);

  let currentScene = $derived($scenes.find(scene => scene.id == routeParams.sceneId));

  $effect(() => {
    state.setCurrentTitle(
      routeParams.sceneId ? currentScene.title : "No scene selected!"
    );
  });

  const titleInput = () => {
    scenes.setSceneTitle(currentScene.id, currentScene.title);
  };

  onMount(() => {
    window.addEventListener("hashchange", routeChange, false);
  });

  onDestroy(() => {
    window.removeEventListener("hashchange", routeChange, false);
  });

  const routeChange = () => {
    document.querySelector(".content")?.scrollTo(0, 0);
  };

  const change = () => {
    const html = editor.getHTML();
    scenes.setSceneContent(routeParams.sceneId, html);
    editorStatus = 2;
    filteredCards = $cards
      .filter(c => c.showTooltip && c.project == $state.currentProject)
      .filter(c => html.includes(c.title));
  };

  const switchScene = e => {
    push("/write/" + e.target.value);
    e.target.selectedIndex = 0;
  };

  const toggleFocus = () => {
    $ui.focus = !$ui.focus;
  };

  const undo = () => {
    editor.undo();
  };

  const redo = () => {
    editor.redo();
  };
</script>

<div in:fade={{ duration: 100 }}>
  {#if $state.currentProject}
    {#if routeParams.sceneId !== null}
      <Modal bind:show={showCards}>
        {#snippet header()}<h2>{$_('write.toolbar.cards')}</h2>{/snippet}
        {#each filteredCards as card}
          <div>
            <h2>{card.title}</h2>
            <p>{card.content}</p>
          </div>
        {:else}
          <p>
            <Placeholder>{$_('write.toolbar.cardsEmpty')}</Placeholder>
          </p>
        {/each}
      </Modal>
      <div class="toolbar">
        <div class="inner">
          <div>
            <span
              class="lnr lnr-undo"
              use:tippy={{ content: $_('write.toolbar.undo'), placement: 'bottom' }}
              onclick={undo}></span>
            <span
              class="lnr lnr-redo"
              use:tippy={{ content: $_('write.toolbar.redo'), placement: 'bottom' }}
              onclick={redo}></span>
          </div>
          <div>
            {#if filteredCards.length > 0}
              <span
                transition:fade={{ duration: 100 }}
                class="lnr lnr-bookmark"
                use:tippy={{ content: $_('write.toolbar.cards'), placement: 'bottom' }}
                onclick={() => (showCards = true)}></span>
            {/if}
            {#if $ui.focus}
              <select
                id="focusSceneSelect"
                transition:fade={{ duration: 100 }}
                onchange={switchScene}
                class="lnr"
                use:tippy={{ content: $_('write.toolbar.switchScene'), placement: 'bottom' }}>
                <option value="" selected="selected">&#xe871;</option>
                {#each $chapters.filter(chapter => chapter.project == $state.currentProject) as chapter}
                  <optgroup label={chapter.title}>
                    {#each $scenes.filter(scene => scene.chapter == chapter.id) as scene}
                      <option value={scene.id}>{scene.title}</option>
                    {/each}
                  </optgroup>
                {/each}
              </select>
            {/if}
          </div>
          <div>
            <span
              class="lnr"
              use:tippy={{ content: $_('write.toolbar.focus'), placement: 'bottom' }}
              onclick={toggleFocus}
              class:lnr-eye={!$ui.focus}
              class:lnr-exit={$ui.focus}></span>
            <span
              class="lnr"
              use:tippy={{ content: $_('write.toolbar.savestate'), placement: 'bottom' }}
              class:lnr-sync={editorStatus === 1}
              class:spinner={editorStatus === 1}
              class:lnr-checkmark-circle={editorStatus === 2}></span>
          </div>
        </div>
      </div>
      <div class="editpane" style="--quotation-marks:{$_('write.quote.marks')}">
        <h1
          contenteditable
          bind:textContent={currentScene.title}
          oninput={titleInput}></h1>
        <OmniaEditor
          bind:this={editor}
          value={currentScene.content || ""}
          spellcheck={$settings.spellCheck}
          oninit={() => (editorStatus = 0)}
          onchange={change} />
      </div>
    {:else}
      <Overview />
    {/if}
  {:else}
    <Placeholder />
  {/if}
</div>

<style lang="scss">
  * {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
    -webkit-focus-ring-color: rgba(255, 255, 255, 0) !important;
    outline: 0 !important;
  }

  .editpane {
    margin: 0 auto;
    max-width: 800px;
    margin-bottom: 50vh;

    @media (min-width: 1200px) {
      padding: 10px;
      box-shadow: 0 5px 26px 2px rgba(0, 0, 0, 0.2);
    }

    > h1 {
      font-family: "Libre Baskerville";
      text-align: center;
    }
  }

  select#focusSceneSelect {
    background-color: var(--select-background);
    font-weight: bold;
    width: 1.5rem;
    color: var(--text-color);
    text-align: center;
    -webkit-appearance: none;
    border: 0;
    cursor: pointer;

    &:focus,
    &:active {
      border: 0;
      outline: 0;
    }
  }

  .toolbar {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    background-color: var(--background-color);
    padding: 1rem;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    z-index: 8;

    > .inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      margin: auto;
      max-width: 800px;

      > div {
        * {
          margin: 0 0.5rem;
          opacity: 0.65;
          cursor: pointer;
        }
        *:hover {
          opacity: 1;
        }
        span {
          font-size: 1rem;
        }
        .lnr {
          font-size: unset;

          &.spinner {
            display: inline-block;
            -webkit-animation: spin 2s infinite linear;
            animation: spin 2s infinite linear;
          }
          @keyframes spin {
            0% {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
            }

            100% {
              -webkit-transform: rotate(359deg);
              transform: rotate(359deg);
            }
          }
        }
      }
    }
  }
</style>
