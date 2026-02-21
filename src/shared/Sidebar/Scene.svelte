<script>
  import { _ } from "svelte-i18n";
  import { push } from "@keenmate/svelte-spa-router";
  import active from "@keenmate/svelte-spa-router/active";
  import tippy from "sveltejs-tippy";

  let { scene, onedit } = $props();
</script>

<li use:active={'/write/' + scene.id}>
  <a href="#/write/{scene.id}">{scene.title}</a>
  <button
    type="button"
    class="lnr lnr-cog action"
    aria-label="Edit scene"
    use:tippy={{ content: $_('sidebar.editScene'), placement: 'right' }}
    onclick={() => onedit?.(scene)}></button>
</li>

<style lang="scss">
  @use "../../css/mixins/devices" as *;

  li {
    padding: 0.5rem 0 0.5rem 2rem;
    word-break: break-word;
    line-height: 1.5rem;

    a,
    button {
      text-decoration: none;
      opacity: 0.65;
    }

    .action {
      background: none;
      border: none;
      color: inherit;
      padding: 0;
      cursor: pointer;
      visibility: visible;
      float: right;
      margin-right: 1em;
      opacity: 0.65;
      line-height: 1.5rem;
      transition: transform 0.2s;

      @include desktop {
        visibility: hidden;
        &:hover {
          transform: scale(1.25);
          opacity: 1;
        }
      }
    }

    &:hover {
      background-color: var(--menu-hover);

      a {
        opacity: 1;
      }

      @include desktop {
        .action {
          visibility: visible;
        }
      }
    }
  }
  :global(li.active) {
    background-color: var(--menu-active);

    a {
      opacity: 1;
    }
  }
</style>
