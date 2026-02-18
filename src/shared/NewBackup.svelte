<script>
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { state } from "../stores";
  import { reloadWindow } from "../bridge";
  import cloud from "../appwrite";
  import Modal from "./Modal.svelte";
  import Spinner from "./Spinner.svelte";
  import { formatDistance } from "../utils";

  let latest = $state();
  let show = $state(false);
  let loading = $state(false);

  onMount(async () => {
    latest = await cloud.getLatestBackup();

    if (latest.files.length === 0) return;

    const latestTimestamp = new Date(latest.files[0].$createdAt).getTime() / 1000;
    show = $state.lastCloudSave < latestTimestamp;
  });

  const download = () => {
    loading = true;
    cloud.restoreBackup(latest.files[0].$id).then(
      () => {
        loading = false;
        reloadWindow();
      },
      () => {
        loading = false;
      }
    );
  };

  const formatBytes = (a, b) => {
    if (0 == a) return "0 Bytes";
    let c = 1024,
      d = b || 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  };

  const getTimestamp = file => new Date(file.$createdAt).getTime() / 1000;
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('common.modals.newBackup.header')}</h2>{/snippet}
  <p>{$_('common.modals.newBackup.subtitle')}</p>
  {#if loading}
    <center>
      <Spinner />
    </center>
  {:else}
    <ul>
      <li onclick={download}>
        <span class="from-now">
          {formatDistance(getTimestamp(latest.files[0]))}
        </span>
        <span class="file-size">
          {formatBytes(latest.files[0].sizeOriginal)}
        </span>
        <span class="lnr lnr-cloud-download"></span>
      </li>
    </ul>
    <p class="hint">{$_('common.modals.newBackup.warning')}</p>
  {/if}
</Modal>

<style>
  ul {
    padding-inline-start: 0px;
    margin-block-start: 0;
    margin-block-end: 0;
  }
  ul li {
    padding: 2rem 1rem;
    display: flex;
    justify-content: space-between;
    opacity: 1;
    transition: all 0.5s ease;
    max-width: 800px;
    cursor: pointer;
  }

  ul li:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .from-now {
    flex: 2;
  }

  .file-size {
    flex: 1;
  }

  .lnr {
    font-size: 2rem;
    margin-top: -0.5rem;
  }

  .file-size,
  .hint {
    font-size: 0.8rem;
  }
</style>
