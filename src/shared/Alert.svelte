<script>
  let {
    show = $bindable(false),
    danger = false,
    success = false,
    info = false,
    warning = false,
    duration = 10000,
    title,
    children
  } = $props();

  $effect(() => {
    if (show) {
      setTimeout(() => {
        show = false;
      }, duration);
    }
  });
</script>

{#if show}
  <div class="alert" class:danger class:success class:warning class:info>
    <button type="button" class="closebtn" aria-label="Close" onclick={() => (show = false)}>
      <span class="lnr lnr-cross"></span>
    </button>
    {@render title?.()}
    {@render children?.()}
  </div>
{/if}

<style lang="scss">
  .alert {
    padding: 20px;

    &.danger {
      background-color: #f44336;
    }
    &.success {
      background-color: #4caf50;
    }
    &.info {
      background-color: #2196f3;
    }
    &.warning {
      background-color: #ff9800;
    }
    span {
      line-height: normal;
    }
  }

  .closebtn {
    background: none;
    border: none;
    color: white;
    float: right;
    line-height: 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.3s;
    opacity: 0.65;
    padding: 0;

    &:hover {
      opacity: 1;
    }
  }
</style>
