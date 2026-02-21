<script>
  import { _ } from "svelte-i18n";
  import { chapters } from "../../stores";
  import tippy from "sveltejs-tippy";

  let { chapter, onedit, children } = $props();
</script>

<li class:open={chapter.ui.open}>
  <button
    type="button"
    class="key"
    onclick={() => chapters.toggleChapterInSidebar(chapter.id)}>
    {chapter.title}
  </button>
  <span class="key-actions">
    <button
      type="button"
      class="lnr lnr-chevron-up collapse icon-btn"
      aria-label="Toggle chapter"
      onclick={() => chapters.toggleChapterInSidebar(chapter.id)}></button>
    <button
      type="button"
      class="lnr lnr-cog action icon-btn"
      aria-label="Edit chapter"
      use:tippy={{ content: $_('sidebar.editChapter'), placement: 'right' }}
      onclick={() => onedit?.(chapter)}></button>
  </span>
  {#if chapter.ui.open}
    <ul class="scenes">
      {@render children?.()}
    </ul>
  {/if}
</li>

<style lang="scss">
  @use "../../css/mixins/devices" as *;

  li {
    cursor: pointer;
    display: block;
    width: 100%;
    word-break: break-word;
    position: relative;

    span {
      text-decoration: none;
      opacity: 0.65;
    }

    .icon-btn {
      background: none;
      border: none;
      color: inherit;
      padding: 0;
      cursor: pointer;
    }

    .key {
      display: block;
      padding: 1rem;
      font-weight: bold;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: left;
      width: 100%;
    }

    .key-actions {
      position: absolute;
      right: 0;
      top: 0;
      padding: 1rem;
    }

    .collapse {
      float: right;
      transform: rotate(-90deg);

      &:hover {
        opacity: 1;
      }
    }

    .action {
      visibility: visible;
      float: right;
      margin-right: 1em;
      opacity: 0.65;
      transition: transform 0.2s;

      @include desktop {
        visibility: hidden;
      }

      &:hover {
        opacity: 1;
        transform: scale(1.25);
      }
    }

    &:hover {
      .key {
        opacity: 1;
        background-color: var(--menu-hover);
      }

      @include desktop {
        .action {
          visibility: visible;
        }
      }
    }
    &.open {
      .collapse {
        transform: rotate(0deg);
      }
    }

    .scenes {
      list-style-type: none;
      padding: 0;
    }
  }
</style>
