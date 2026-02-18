import { render, fireEvent } from "@testing-library/svelte";
import { describe, test, expect, vi } from "vitest";

import Button from "./Button.svelte";

describe("Button", () => {
  test("events should work", () => {
    const mock = vi.fn();
    const { getByRole } = render(Button, {
      props: { color: "green", onclick: mock },
    });
    const button = getByRole("button");
    fireEvent.click(button);
    expect(mock).toHaveBeenCalled();
  });

  test("events should only fire once", () => {
    const mock = vi.fn();
    const { getByRole } = render(Button, {
      props: { color: "green", onclick: mock },
    });
    const button = getByRole("button");
    fireEvent.click(button);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  test("should show loading state", () => {
    const { getByRole } = render(Button, {
      props: { color: "green", loading: true },
    });
    const button = getByRole("button");
    expect(button).toHaveClass("loading");
  });

  test("should be disabled", () => {
    const { getByRole } = render(Button, {
      props: { color: "green", disabled: true },
    });
    const button = getByRole("button");
    expect(button).toBeDisabled();
  });
});
