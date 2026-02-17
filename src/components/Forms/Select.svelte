<script>
  import { getRandomNumber } from "../../utils";
  import { Field } from ".";

  let { label, id = label + getRandomNumber(), value = $bindable(), options = [], helper } = $props();
</script>

<Field {id} {label} {helper}>
  <select {id} bind:value>
    {#each options as option}
      <option value={option.value}>{option.text}</option>
    {/each}
  </select>
</Field>

<style>
  select {
    background-color: var(--select-background);
    width: 100%;
    font-size: 1rem;
    color: var(--text-color);
    -webkit-text-fill-color: var(--text-color);
    border: 0;
    cursor: pointer;
  }
</style>
