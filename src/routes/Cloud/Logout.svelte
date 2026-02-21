<script>
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { reloadWindow } from "../../bridge";
  import { appState } from "../../stores.svelte";

  import cloud from "../../appwrite";

  onMount(() => {
    cloud.logoutSession("current").then(
      setTimeout(() => {
        appState.setLogin(false);
        window.location.hash = "#/cloud";
        reloadWindow();
      }, 1500)
    );
  });
</script>

<h2>{$_('cloud.logout.success')}</h2>
