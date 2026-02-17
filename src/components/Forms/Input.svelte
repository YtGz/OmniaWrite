<script>
  import { onMount } from "svelte";
  import { getRandomNumber } from "../../utils";
  import { Field } from ".";

  let {
    label,
    id = label + getRandomNumber(),
    value = $bindable(),
    placeholder,
    helper,
    autocomplete = "off",
    required = false,
    autofocus = false
  } = $props();

  let element;

  onMount(() => {
    if (element && autofocus) {
      element.focus();
    }
  });
</script>

<Field {id} {label} {helper}>
  <input
    {id}
    {autocomplete}
    {placeholder}
    bind:this={element}
    {required}
    type="text"
    bind:value />
</Field>

<style lang="scss">
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    width: 100%;
    margin: 0;
    padding: 0 0.25rem;
    border: none;
    border-radius: 0;
    box-shadow: none;
    height: 1.2rem;
    color: var(--text-color);
    display: inline-block;
    border-bottom: 1px solid #999;
    max-height: 1.2rem;
    font-size: 1rem;
    opacity: 0.65;
    background: linear-gradient(
        to bottom,
        transparent 95%,
        var(--input-border-color) 95%
      )
      no-repeat;
    background-size: 0 100%;
    transition: background-size 0.2s ease;

    &:focus {
      border-bottom: 1px solid var(--input-border-color);
      background-size: 100% 100%;
      outline: 0;
      opacity: 1;
    }
  }
</style>
