# Garde-manger - Project Spec 

## 1️⃣ Définir le besoin

L’application a pour objectif de résoudre le problème lié à la récupération des recettes.

Les utilisateurs trouvent des recettes sur TikTok, Instagram, Pinterest, mais **ils ne peuvent pas les centraliser** facilement.

**RecipeAI permet :**

- De centraliser les recettes
- De les catégoriser
- De les retrouver rapidement
- De gagner du temps au quotidien

### 🎯 Public cible

- Tous les utilisateurs voulant cuisiner leurs recettes préférées
- Les personnes qui planifient leurs repas
- Ceux qui cuisinent souvent

### 🎯 V1

- Ajouter, lire, modifier, supprimer des recettes
- Ajouter un lien vidéo pour avoir un visuel

---

## 2️⃣ Fonctionnalités

### 🔥 Fonctionnalités principales (V1)

- CRUD des recettes
- Ajout d’un lien vidéo
- Ajout d’une image
- Catégorisation des recettes
- Ajouter en favoris (toggle)

### 🌱 Fonctionnalités secondaires / futures (V2+)

- Recherche multi-catégories
- Suggestions automatiques
- Notifications

---

## 3️⃣ Parcours utilisateur

- Connexion / création de compte
- Dashboard : liste des recettes (tri du plus récent au plus ancien)
- Ajouter une recette via modal ou page
    - Titre, description, temps, catégorie, ingrédients, quantité, image, lien vidéo
- Visualisation / modification / suppression d’une recette
- Ajouter en favoris → apparaît dans la page Favoris

---

## 4️⃣ Schéma des données

```
Recipe {
  id: string (uuid)
  title: string
  description: string
  imageUrl: string | null        // upload Cloudinary / Supabase
  videoUrl: string | null        // URL simple
  time: string                   // ex. "15 min"
  categories: string[]           // ex. asiatique, français, healthy
  ingredients: string[]
  isFavorite: boolean
  userId: string                 // propriétaire
  createdAt: Date
  updatedAt: Date
}

```

---

## 5️⃣ API

### Endpoints CRUD

- **GET /recettes** → liste des recettes de l’utilisateur
- **GET /recette/:id** → détail d’une recette
- **POST /recette** → créer une recette
- **PUT /recette/:id** → modifier une recette (payload inclut `isFavorite`)
- **DELETE /recette/:id** → supprimer une recette

**Favoris** : géré par le `PUT` via `isFavorite: true/false`

---

## 6️⃣ Architecture front-end

### a. Pages

- `/login` → connexion / création de compte
- `/dashboard` → toutes les recettes
- `/recipe/:id` → détails d’une recette
- `/add` → formulaire d’ajout
- `/edit/:id` → modification
- `/favorites` → recettes favorites

### b. Composants

- `RecipeCard` → miniature
- `RecipeDetail` → détail complet
- `RecipeForm` → ajout / modification
- `Navbar` → navigation
- `Modal` → ajout rapide / confirmation
- `Button`, `Input`, `Select` → génériques réutilisables

### c. Gestion du state

- **Zustand** → recherche, favoris temporaires, filtres
- **React Query** → fetch / cache API
- **State local** → formulaires, modals

### d. Architecture dossiers

```
src/
  recipes/
  auth/
  favorites/
  components/
  utils/

```

---

## 7️⃣ Design System

### a. Couleurs

- Text : `#1F2937`
- Accent : `#FBBF24`
- Background : `#FFFFFF`

### b. Typographie

- Titres : `font-bold`
- Corps : `font-normal`

### c. Composants réutilisables

- Button (primary / secondary / disabled)
- Input (text, number, textarea)
- Card (recette miniature)
- Modal (overlay + contenu)
- Skeleton (loading state)

### d. Grille & spacing

- Dashboard : **2 colonnes mobile** / **4 desktop**
- Spacing : `p-4`, `m-4`

---

## 8️⃣ Roadmap technique

### 🔽 Ordre de développement

1. Backend : Prisma + BDD
2. API CRUD recettes
3. Auth utilisateur
4. Frontend : pages + navigation
5. Dashboard : affichage via API
6. Ajout / modification / suppression
7. Favoris via `isFavorite`
8. Design system
9. Tests unitaires / intégration / E2E
10. Optimisation responsive

---

## 9️⃣ Contraintes techniques

- **React + TailwindCSS**
- **Zustand**
- **React Query**
- **Node.js + Express**
- **Prisma + SQLite/PostgreSQL**
- **Cloudinary / Supabase Storage**
- Sécurité : bcrypt, validation input
- Performance : cache front, pagination

---

## 🔟 Stratégie de scale (optimisations futures)

- Frontend : composants réutilisables → nouvelles pages facilement
- Backend : endpoints modulaires → potentiels microservices
- BDD : tables pivot pour favoris / catégories → scalable multi-user
- Stockage médias : **S3 / Cloudinary**
- Monitoring/logs : **Sentry / LogRocket**
- Optimisations :
    - CDN
    - Cache serveur
    - Recherche avancée
    - Notifications

---

# 🧪 Tests & CI/CD

### 1. Tests unitaires

- Front : Jest + Testing Library
- Back : Jest / Supertest
- Couverture cible : 70–80%

### 2. Tests d’intégration

- Vérification du flux complet : CRUD recette

### 3. Tests end-to-end

- Cypress / Playwright
- Scénarios : login → ajouter recette → favoris → dashboard

### 4. CI/CD

Via GitHub Actions :

- Install dependencies
- Lancer tests
- Build frontend
- Déploiement staging/prod si OK

### 5. Monitoring

- Sentry / LogRocket
- Alertes automatiques en cas d’erreurs
