import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

describe("Portfolio App", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the home page and navigates to About", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "My Portfolio" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Welcome to my full stack portfolio website/i)
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "About", exact: true })
    );

    expect(
      screen.getByRole("heading", { name: "About Me" })
    ).toBeInTheDocument();

    expect(screen.getByText("Mahammad Mammadov")).toBeInTheDocument();
  });
});