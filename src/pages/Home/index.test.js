import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import Home from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  events: [
    {
      id: 1,
      type: "conférence",
      date: "2022-04-29T20:28:45.744Z",
      title: "User&product MixUsers",
      cover: "/images/alexandre-pellaes-6vAjp0pscX0-unsplash.png",
      description: "Présentation des nouveaux usages UX.",
      nb_guesses: 900,
      periode: "14-15-16 Avril",
      prestations: [
        "1 espace d'exposition",
        "1 scéne principale",
        "1 espace de restaurations",
      ],
    },
    {
      id: 2,
      type: "expérience digitale",
      date: "2022-08-29T20:28:45.744Z",
      title: "#DigitonPARIS",
      cover: "/images/charlesdeluvio-wn7dOzUh3Rs-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d'exposition",
        "1 scéne principale",
        "1 site web dédié",
      ],
    },
  ],
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
  ],
};

beforeEach(() => {
  window.console.error = jest.fn();
});

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  beforeEach(() => {
    api.loadData = jest.fn().mockResolvedValue(data);
  });

  it("a list of events is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    let eventsSection;
    await waitFor(() => {
      eventsSection = document.querySelector(".EventsContainer");
      expect(eventsSection).toBeInTheDocument();

      const heading = within(eventsSection).getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Nos réalisations");
    });

    await within(eventsSection).findByText("User&product MixUsers");
    await within(eventsSection).findByText("#DigitonPARIS");
  });

  it("a list a people is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    await waitFor(() => {
      const teamSection = document.querySelector(".PeoplesContainer");
      expect(teamSection).toBeInTheDocument();

      const heading = within(teamSection).getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Notre équipe");
    });

    await screen.findByText("Samira");
    await screen.findByText("Jean-baptiste");
    await screen.findByText("Alice");
    await screen.findByText("Luís");
    await screen.findByText("Christine");
    await screen.findByText("Isabelle");

    await screen.findByText("CEO");
    await screen.findByText("Directeur marketing");
    await screen.findByText("CXO");
    await screen.findByText("Animateur");
    await screen.findByText("VP animation");
    await screen.findByText("VP communication");
  });

  it("a footer is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    await screen.findByText("Notre derniére prestation");
    await screen.findByText("Contactez-nous");
    await screen.findByText("45 avenue de la République, 75000 Paris");
    await screen.findByText("01 23 45 67 89");
    await screen.findByText("contact@724events.com");

    await waitFor(() => {
      expect(document.querySelector('a[href="#twitch"]')).toBeInTheDocument();
      expect(document.querySelector('a[href="#facebook"]')).toBeInTheDocument();
      expect(document.querySelector('a[href="#twitter"]')).toBeInTheDocument();
      expect(document.querySelector('a[href="#youtube"]')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Une agence événementielle propose des prestations de service/
      )
    ).toBeInTheDocument();
  });

  it("an event card, with the last event, is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    await screen.findByText("Notre derniére prestation");

    await waitFor(() => {
      const footerSection = screen
        .getByText("Notre derniére prestation")
        .closest(".col");

      expect(
        within(footerSection).getByText("#DigitonPARIS")
      ).toBeInTheDocument();

      const lastEventCard = within(footerSection).getByTestId("card-testid");
      expect(lastEventCard.className).toContain("EventCard--small");

      expect(within(footerSection).getByText("boom")).toBeInTheDocument();
    });
  });
});
