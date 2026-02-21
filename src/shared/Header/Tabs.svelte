<script>
  import { link, location } from "@keenmate/svelte-spa-router";
  import active from "@keenmate/svelte-spa-router/active";

  import { appState, tabs, scenes } from "../../stores.svelte";

  const createTab = () => {
    tabs.createTab(appState.currentProject, location());
  };

  const getTitle = location => {
    const [type, id] = location.split("/").filter(String);
    switch (type) {
      case "write":
        return scenes.find(s => s.id == id).title;

      default:
        return "-";
    }
  };
</script>

<div class="tabs" style="-webkit-app-region: no-drag">
  <ul>
    {#each tabs.filter(tabs => tabs.project == appState.currentProject) as tab}
      <li class="tab" use:active={tab.link}>
        <a href={tab.link} use:link>{getTitle(tab.link)}</a>
        <button
          type="button"
          class="lnr lnr-cross tab-action"
          aria-label="Close tab"
          onclick={() => tabs.removeTab(tab.id)}></button>
      </li>
    {/each}
    {#if location() != '/write/' && location().includes('write') && !tabs.some(tab => tab.link == location())}
      <li class="tab new">
        <button type="button" class="tab-btn" aria-label="Add tab" onclick={createTab}>
          <span class="lnr lnr-plus-circle"></span>
        </button>
      </li>
    {/if}
  </ul>
</div>

<style lang="scss">
  .tabs {
    background-color: var(--secondary-color);
    box-shadow: 0 -1px 0 #495865 inset;
    text-align: left;
    width: 100vw;

    ul {
      list-style-type: none;
      overflow-x: auto;
      scrollbar-width: none;
      overflow-y: hidden;
      height: 2rem;
      margin: 0;
      padding: 0;
      list-style-position: inside;
      white-space: nowrap;

      .tab {
        font-size: 0.9rem;
        line-height: 2rem;
        margin-right: 0.5rem;
        display: inline-block;
        opacity: 0.65;
        height: 32px;

        a {
          padding: 0 0.5rem;
          text-decoration: none;
        }

        span {
          margin-bottom: 3px;
          font-size: 1rem;
        }

        .tab-action {
          background: none;
          border: none;
          color: inherit;
          padding: 0;
          cursor: pointer;

          &:hover {
            color: #4aaed9;
          }
        }

        .tab-btn {
          background: none;
          border: none;
          color: inherit;
          font: inherit;
          padding: 0;
          cursor: pointer;
        }

        &:hover {
          box-shadow: 0 -3px 0 #4aaed9 inset;
          transition: box-shadow 0.2s ease-in;
        }
      }
    }

    & ul::-webkit-scrollbar {
      width: 0rem;
      height: 0rem;
    }
  }
  :global(.tab.active) {
    opacity: 1;
    box-shadow: 0 -3px 0 #4aaed9 inset;
    transition: box-shadow 0.2s ease-in;
    background: none;
  }
</style>
