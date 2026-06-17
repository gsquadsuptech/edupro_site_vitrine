## ADDED Requirements

### Requirement: Affichage de la vidéo de présentation sur la page parcours

La page détail d'un parcours SHALL afficher la vidéo de présentation (`preview_video`) lorsqu'elle est renseignée, et SHALL se replier sur l'image de couverture sinon. La vidéo NE DOIT PAS être chargée au rendu initial : l'image de couverture sert de poster avec un bouton de lecture, et l'`<iframe>` YouTube n'est inséré qu'après interaction de l'utilisateur.

#### Scenario: Parcours avec vidéo de présentation

- **WHEN** un parcours dont `preview_video` est renseigné est affiché
- **THEN** le hero montre l'image de couverture comme poster avec un bouton Play en overlay
- **AND** aucune ressource YouTube n'est chargée tant que l'utilisateur ne clique pas

#### Scenario: Lecture au clic

- **WHEN** l'utilisateur clique sur le bouton Play
- **THEN** l'image est remplacée par une `<iframe>` YouTube qui démarre la lecture (autoplay)

#### Scenario: Parcours sans vidéo

- **WHEN** un parcours dont `preview_video` est vide ou null est affiché
- **THEN** le hero affiche uniquement l'image de couverture, sans bouton Play

#### Scenario: URL vidéo non normalisée

- **WHEN** `preview_video` contient une URL YouTube non-embed (ex. `watch?v=ID` ou `youtu.be/ID`)
- **THEN** la vitrine en extrait l'identifiant et construit une URL d'embed valide avant de l'utiliser

### Requirement: Formatage localisé des nombres sur la page parcours

Les nombres affichés sur la page parcours (ex. nombre d'apprenants) SHALL être formatés avec la locale `fr-FR` afin d'éviter une divergence de rendu serveur/navigateur (erreur d'hydratation React #418).

#### Scenario: Nombre d'apprenants supérieur à 1000

- **WHEN** un parcours comptant 2400 apprenants est rendu
- **THEN** le nombre est formaté de façon identique côté serveur et côté navigateur (locale `fr-FR`)
- **AND** aucune erreur d'hydratation n'est levée
