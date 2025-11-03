## Added test

---

### Tests unitaires

#### Menu

- **Source** : `src/containers/Menu/index.test.js`
- **But** : Vérifier que les liens de navigation dans le `Menu` ont un `href` égal à l'id de la section correspondante.
- **Test** :

  ```js
  describe("a click is triggered on link", () => {
    it("navigation link has correct href attribute", async () => {
      render(<Menu />);

      const link = await screen.findByText("Nos services");

      expect(link.closest("a")).toHaveAttribute("href", "#nos-services");
    });
  });
  ```

#### EventCard

- **Source** : `src/components/EventCard/index.test.js`
- **But** : Vérifier que le composant `EventCard` utilise correctement ses valeurs par défaut quand certaines props optionnelles ne sont pas fournies
- **Test** :

  ```js
  describe("with default props", () => {
    it("uses default values when optional props are not provided", () => {
      render(
        <EventCard
          imageSrc="http://src-image"
          title="test event"
          label="test label"
          date={new Date("2022-04-01")}
        />
      );
      const imageElement = screen.getByTestId("card-image-testid");
      const cardElement = screen.getByTestId("card-testid");

      expect(imageElement.alt).toEqual("image");
      expect(cardElement.className.includes("EventCard--small")).toEqual(false);
    });
  });
  ```

#### Date

- **Source** : `src/helpers/Date/index.test.js`
- **But** : Vérifier que la fonction `getMonth()` retourne le bon nom de mois en français pour une date donnée
- **Test** :

  ```js
  describe("When getMonth is called", () => {
    it("the function return janvier for 2022-01-01 as date", () => {
      const date = new Date("2022-01-01");
      const result = getMonth(date);

      expect(result).toBe("janvier");
    });

    it("the function return juillet for 2022-07-08 as date", () => {
      const date = new Date("2022-07-08");
      const result = getMonth(date);

      expect(result).toBe("juillet");
    });
  });
  ```

---

### Tests d'intégration

#### Home

- **Source** : `src/pages/Home/index.test.js`
- **But** : Vérifier l'intégration et l'affichage correct de tous les composants et sections de la page d'accueil avec des données mockées
- **Tests** :

  **Affichage de la liste des événements** :

  ```js
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
  ```

  **Affichage de la liste des membres de l'équipe** :

  ```js
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
    // ... vérification de tous les membres et leurs postes
  });
  ```

  **Affichage du footer avec toutes ses informations** :

  ```js
  it("a footer is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    await screen.findByText("Notre derniére prestation");
    await screen.findByText("Contactez-nous");
    await screen.findByText("45 avenue de la République, 75000 Paris");

    // Vérification des liens de réseaux sociaux
    await waitFor(() => {
      expect(document.querySelector('a[href="#twitch"]')).toBeInTheDocument();
      expect(document.querySelector('a[href="#facebook"]')).toBeInTheDocument();
      expect(document.querySelector('a[href="#twitter"]')).toBeInTheDocument();
      expect(document.querySelector('a[href="#youtube"]')).toBeInTheDocument();
    });
  });
  ```

  **Affichage de la carte du dernier événement** :

  ```js
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
  ```

---
