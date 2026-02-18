import { jest } from "@jest/globals";
import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";

import Button from "./Button.svelte";

test("events should work", () => {
  const mock = jest.fn();
  const { getByRole } = render(Button, {
    props: { color: "green", onclick: mock },
  });
  const button = getByRole("button");
  fireEvent.click(button);
  expect(mock).toHaveBeenCalled();
});

test("events should only fire once", () => {
  const mock = jest.fn();
  const { getByRole } = render(Button, {
    props: { color: "green", onclick: mock },
  });
  const button = getByRole("button");
  fireEvent.click(button);
  expect(mock).toHaveBeenCalledTimes(1);
});

test("should show loading state", () => {
  const mock = jest.fn();
  const { getByRole } = render(Button, {
    props: { color: "green", loading: true, onclick: mock },
  });
  const button = getByRole("button");
  expect(button).toHaveClass("loading");
});

test("should be disabled", () => {
  const mock = jest.fn();
  const { getByRole } = render(Button, {
    props: { color: "green", disabled: true, onclick: mock },
  });
  const button = getByRole("button");
  expect(button).toBeDisabled();
});
