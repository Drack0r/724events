## Tâches à compléter

_Ce document à destination du prochain développeur a pour but de lister les choses à faire avant la mise en ligne du nouveau site._

### Les bugs à fixer

J’ai repéré les bugs suivants :

- Le carrousel affiche les évènements par ordre aléatoire alors qu'il devrait les afficher par date en ordre décroissant.
- Le filtre pour la section "Nos réalisations" ne fonctionne pas. Il faut que les réalisations soient filtrables et affichent les bons mois.
- Le formulaire s’envoie, mais le message de confirmation ne s’affiche pas.

Pour fixer ces bugs, il faudra implémenter des petites portions de codes manquantes et il y aura des “typos” à corriger.

Je n’ai pas eu le temps de repérer tous les bugs. Il faudra rechercher les autres et les fixer en fonction du besoin de Jean-Baptiste. Certains sont détectables via les tests. Possibilité de trouver les bugs grâce aux tests invalides.

Je conseille d’utiliser React Developer Tools pour comprendre l’architecture du projet et la propagation du state/context.

### La partie tests

L’application est testée en grande partie :

- les composants sont testés (test unitaire)
- le code est entièrement testé.

Attention à ce que tous les voyants de tests passent au vert une fois les bugs résolus.

Enfin, il sera nécessaire de réaliser un cahier de recette pour confirmer que le site est fiable et qu’il corresponde aux besoins de 77events. Plus tard, il pourra aussi servir de base pour valider les futurs développements.

### Pour aller plus loin

J’avais aussi prévu de réaliser 3 tests unitaires et 3 tests d’intégration afin d’améliorer la couverture de code. Cette étape est facultative, mais intéressante à suivre si le temps le permet.
