## Bugs List

### Page

---

- [x] ⛔️ Failed prop type: The prop `imageSrc` is marked as required in `EventCard`, but its value is `undefined`
- [x] ⛔️ Failed prop type: The prop `title` is marked as required in `EventCard`, but its value is `undefined`

#### Bug Home - Propriété last manquante dans DataContext

- **Source** :  
  `contexts/DataContext/index.js`
- **Problème** :  
  Le `DataProvider` ne fournissait pas la propriété `last` dans le contexte, qui devrait contenir le dernier événement (celui avec la date la plus récente).  
  Résultat : dans le footer de la page Home, le composant `EventCard` recevait des valeurs `undefined` pour `imageSrc` et `title`, causant des erreurs de PropTypes et un affichage incorrect.
- **Solution** :  
  Calculer et ajouter la propriété `last` dans le contexte :

  ```js
  const last = data?.events
    ? data.events.reduce((latest, event) => {
        const eventDate = new Date(event.date);
        const latestDate = new Date(latest.date);
        return eventDate > latestDate ? event : latest;
      })
    : null;

  return (
    <DataContext.Provider
      value={{
        data,
        error,
        last, // Ajouter la propriété last
      }}
    >
      {children}
    </DataContext.Provider>
  );
  ```

---

### EventCard

---

- [x] ⛔️ When a event card is created › a title, a label and a month are displayed

```
TestingLibraryElementError:
Unable to find an element with the text: /avril/.
This could be because the text is broken up by multiple elements.
In this case, you can provide a function for your text matcher to make your matcher more flexible.
```

#### Bug EventCard - Récupération de la date

- **Source** :  
  `helpers/Date/index.js`
- **Problème** :  
  La fonction `getMonth()` renvoie une valeur de l'objet `MONTHS` en utilisant l'index fourni par `date.getMonth()` (qui commence à 0), mais l'objet `MONTHS` est indexé à partir de 1.  
  En conséquence, le mois affiché est toujours le mois précédent celui demandé.
- **Solution** :
  ```js
  getMonth = (date) => MONTHS[date.getMonth() + 1];
  ```

---

### Events

---

- [x] ⛔️ When Events is created › and we select a category › an filtered list is displayed

```
expect(element).not.toBeInTheDocument()
expected document not to contain element, found <div class="EventCard__title">Forum #productCON</div> instead
```

#### Bug Events - Filtrage par catégorie

- **Source** :  
  `components/Select/index.js`
- **Problème** :  
  Le composant `Select` n'envoyait pas la valeur sélectionnée à la fonction `onChange`.  
  Dans la fonction `changeValue()`, l'appel `onChange()` était fait sans paramètre, ce qui empêchait le filtrage des événements par type.  
  Résultat : tous les événements restaient affichés même après sélection d'une catégorie spécifique.
- **Solution** :  
  `onChange(newValue)` au lieu de `onChange()` dans la fonction `changeValue()`

#### Bug Events - Logique de filtrage défaillante

- **Source** :  
   `containers/Events/index.js`
- **Problème** :  
  La condition de filtrage `(!type ? data?.events : data?.events)` retournait toujours le même tableau `data?.events`, que la variable type soit définie ou non.  
  Le filtrage par type d'événement ne fonctionnait donc jamais.
- **Solution** :
  ```js
  const eventsByType =
    (!type
      ? data?.events
      : data?.events.filter((event) => event.type === type)) || [];
  ```

---

### Form

---

- [x] ⛔️ When Events is created › and a click is triggered on the submit button › the success action is called

```
expect(jest.fn()).toHaveBeenCalled()

Expected number of calls: >= 1
Received number of calls:    0
```

- [x] ⛔️ When Form is created › and a click is triggered on the submit button › the success message is displayed

```
Unable to find an element with the text: Message envoyé !.
This could be because the text is broken up by multiple elements.
In this case, you can provide a function for your text matcher to make your matcher more flexible.
```

#### Bug Form - Fonction onSuccess non appelée

- **Source** :  
  `containers/Form/index.js`
- **Problème** :  
  Dans la fonction `sendContact()`, après le succès de l'appel à `mockContactApi()`, la fonction `onSuccess()` n'était pas appelée.  
  Le code se contentait de faire `setSending(false)` sans déclencher le callback de succès.  
  Résultat : la modale de confirmation ne s'ouvrait jamais lors de la soumission du formulaire, et les tests échouaient car `onSuccess` n'était jamais invoquée.
- **Solution** :  
  Ajouter l'appel `onSuccess()` après `setSending(false)` dans le bloc `try` :

  ```js
  try {
    await mockContactApi();
    setSending(false);
    onSuccess();
  } catch (err) {
    setSending(false);
    onError(err);
  }
  ```

---

### Slider

---

- [x] ⛔️ When slider is created › a list card is displayed

```
Unable to find an element with the text: janvier.
This could be because the text is broken up by multiple elements.
In this case, you can provide a function for your text matcher to make your matcher more flexible.
```

- [x] ⛔️ Warning: Each child in a list should have a unique "key" prop.

#### Bug Slider - Clés React manquantes

- **Source** :  
  `containers/Slider/index.js`
- **Problème** :  
  Les éléments rendus dans les boucles `map()` n'avaient pas de propriété `key` unique, ce qui générait des warnings React.  
  React a besoin de clés uniques pour optimiser le rendu et identifier les changements dans les listes d'éléments.  
  Résultat : Warning "Each child in a list should have a unique 'key' prop" affiché dans la console.
- **Solution** :  
  Ajouter des clés uniques pour chaque élément des listes :

  ```js
  // Pour les slides
  {
    byDateDesc?.map((event, idx) => (
      <div
        key={event.cover || idx}
        className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
      >
        {/* contenu du slide */}
      </div>
    ));
  }

  // Pour la pagination
  {
    byDateDesc?.map((event, radioIdx) => (
      <input
        key={`pagination-${event.cover || radioIdx}`}
        type="radio"
        name="radio-button"
        checked={index === radioIdx}
        readOnly
      />
    ));
  }
  ```

  Utilisation de `event.cover` (URL unique de l'image) comme clé principale, avec l'index en fallback.

---

- [x] ⛔️ Uncaught TypeError: Cannot read properties of undefined (reading 'length')

#### Bug Slider - Gestion des données non définies

- **Source** :  
  `containers/Slider/index.js`
- **Problème** :  
  Tentative d'accès à la propriété `.length` sur `byDateDesc` qui pouvait être `undefined` pendant le chargement des données.  
  Le code `data?.focus.sort(...)` ne protégeait pas suffisamment contre le cas où `data.focus` n'existe pas encore, et la vérification `byDateDesc.length` dans `nextCard()` générait une erreur quand `byDateDesc` était `undefined`.  
  Résultat : "Uncaught TypeError: Cannot read properties of undefined (reading 'length')" lors du chargement initial.
- **Solution** :  
  Renforcer l'optional chaining et ajouter des vérifications :

  ```js
  // Sécuriser le tri avec optional chaining complet
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  // Vérifier l'existence des données dans nextCard
  const nextCard = () => {
    if (byDateDesc && byDateDesc.length > 0) {
      setTimeout(
        () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
        5000
      );
    }
  };

  // Rendu conditionnel pour éviter le rendu avec des données manquantes
  if (!byDateDesc || byDateDesc.length === 0) {
    return <div className="SlideCardList">Loading...</div>;
  }
  ```

---

### Home

---

- [x] ⛔️ Warning: Failed prop type: The prop `imageSrc` is marked as required in `EventCard`, but its value is `undefined`
- [x] ⛔️ Warning: Failed prop type: The prop `title` is marked as required in `EventCard`, but its value is `undefined`

```
at EventCard (/Users/antonin/Dropbox/Développement_Web/02-Projets_OpenClassrooms/09-724events/724events/src/components/EventCard/index.js:7:3)
at Page (/Users/antonin/Dropbox/Développement_Web/02-Projets_OpenClassrooms/09-724events/724events/src/pages/Home/index.js:16:18)
```

#### Bug Home - Rendu conditionnel manquant pour EventCard

- **Source** :  
  `pages/Home/index.js`
- **Problème** :  
  Le composant `EventCard` était rendu même quand la propriété `last` était `null` ou `undefined` (pendant le chargement des données).  
  Bien que l'optional chaining (`last?.cover`, `last?.title`) évitait les erreurs JavaScript, les PropTypes de React déclenchaient des warnings car les props marquées comme `required` recevaient des valeurs `undefined`.  
  Résultat : des erreurs PropTypes s'affichaient dans la console même si le composant fonctionnait visuellement.
- **Solution** :  
  Ajouter une condition pour ne rendre l'EventCard que quand les données sont disponibles :

  ```js
  {
    last && (
      <EventCard
        imageSrc={last.cover}
        title={last.title}
        date={new Date(last.date)}
        small
        label="boom"
      />
    );
  }
  ```

  Et supprimer l'optional chaining devenu inutile (`last?.cover` → `last.cover`, `last?.title` → `last.title`, etc.).

---

### Others

---

- [x] ⛔️ Warning: Unsupported style property font-family. Did you mean fontFamily?
- [x] ⛔️ Warning: Unsupported style property font-size. Did you mean fontSize?
- [x] ⛔️ Warning: Unsupported style property font-weight. Did you mean fontWeight?
- [x] ⛔️ Warning: Unsupported style property white-space. Did you mean whiteSpace?

```
at text
at svg
at div
at Logo (/Users/antonin/Dropbox/Développement_Web/02-Projets_OpenClassrooms/09-724events/724events/src/components/Logo/index.js:5:17)
at nav
at Menu
at header
at Page (/Users/antonin/Dropbox/Développement_Web/02-Projets_OpenClassrooms/09-724events/724events/src/pages/Home/index.js:16:18)
```

- **Source** :  
  `components/Logo/index.js`
- **Problème** :  
  Les propriétés CSS `font-family`, `font-size`, `font-weight` et `white-space` sont renseignées en kebab-case, or en React on écrit les propriétés CSS en camelCase. Les tests renvoyaient donc une erreur.
- **Solution** :  
   On corrige les propriétés en kebab-case vers du camelCase :

  ```js
  <text
    fill="url(#paint5_linear_56_57)"
    style={{
      fontFamily: "Kalimati",
      fontSize: "39px",
      fontWeight: 700,
      whiteSpace: "pre",
    }}
    x="-1.125"
    y="44.995"
  >
    724
  </text>
  ```

---

### Tests Results

```
Test Suites: 16 passed, 16 total
Tests:       3 skipped, 48 passed, 51 total
Snapshots:   0 total
Time:        1.227 s
```
