import { fireEvent, render, screen } from "@testing-library/react";
import Menu from "./index";

describe("When Menu is mounted", () => {
  it("a list of mandatories links and the logo are displayed", async () => {
    render(<Menu />);
    await screen.findByText("Nos services");
    await screen.findByText("Nos réalisations");
    await screen.findByText("Notre équipe");
    await screen.findByText("Contact");
  });

  describe("a click is triggered on a navigation link", () => {
    it("navigation link has correct href attribute", async () => {
      render(<Menu />);

      const link = await screen.findByText("Nos services");

      expect(link.closest("a")).toHaveAttribute("href", "#nos-services");
    });
  });

  describe("and a click is triggered on contact button", () => {
    it("document location  href change", async () => {
      render(<Menu />);
      fireEvent(
        await screen.findByText("Contact"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      expect(window.document.location.hash).toEqual("#contact");
    });
  });
});
