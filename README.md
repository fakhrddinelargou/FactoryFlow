# FactoryFlow

API REST de gestion de production pour un atelier : matières premières, stock, produits (recettes) et ordres de fabrication.
Chaque variation de stock est tracée par un mouvement, et les opérations critiques sont exécutées dans des **transactions MongoDB**.

---

## Sommaire

- [Stack technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [Rôles et permissions](#rôles-et-permissions)
- [Endpoints](#endpoints)
- [Règles métier](#règles-métier)
- [Tests](#tests)
- [Gestion de projet](#gestion-de-projet)

---

## Stack technique

| Domaine | Outil |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express |
| Base de données | MongoDB 7 (replica set `rs0`) + Mongoose |
| Validation | Zod |
| Authentification | JWT (`jsonwebtoken`) + `bcrypt` |
| Conteneurisation | Docker + Docker Compose |
| Dev | nodemon (`-L`, bind mount) |

---

## Fonctionnalités

| Epic | Contenu |
|---|---|
| **E1 – Docker et socle** | Dockerfile, compose (volumes, healthcheck), replica set initialisé automatiquement, architecture en couches |
| **E2 – Installation** | Création du premier admin une seule fois (singleton + transaction) |
| **E3 – Authentification et utilisateurs** | Login JWT, middlewares `authenticate` / `authorize`, création d'opérateurs, profil `/me` |
| **E4 – Matières premières et stock** | CRUD matières, entrées de stock, historique des mouvements, alertes de seuil |
| **E5 – Produits et composition** | Produits avec recette (matière + quantité par unité) |
| **E6 – Ordres de fabrication** | Création avec copie de la composition, liste filtrée et paginée, espace opérateur |
| **E7 – Démarrage, clôture et cohérence du stock** | Calcul des besoins, contrôle du stock, consommation en transaction |

---

## Architecture

Architecture en couches :

```
Route → Middlewares (authenticate, authorize, validate) → Controller → Service → Repository → MongoDB
```

| Couche | Rôle |
|---|---|
| **Routes** | Déclaration des endpoints et chaînage des middlewares |
| **Middlewares** | Authentification JWT, contrôle des rôles, validation Zod (body / query / ObjectId) |
| **Controllers** | Lecture de `req`, appel du service, envoi de la réponse |
| **Services** | Logique métier, règles, transactions |
| **Repositories** | Accès aux données (Mongoose), acceptent une `session` optionnelle |
| **Models** | Schémas Mongoose |

```
src/
├── config/          # connexion DB, env
├── models/          # User, Installation, Material, StockMovement, Product, ProductionOrder
├── repositories/    # accès DB + helper withTransaction
├── services/        # logique métier
├── controllers/
├── routes/
├── middlewares/     # authenticate, authorize, validate, validateQuery, validateObjectId
├── validators/      # schémas Zod
├── utils/           # AppError, asyncHandler
├── app.js
└── server.js
```

### Helper `withTransaction`

Toutes les opérations multi-documents passent par un helper unique (`repositories/transaction.js`) qui ouvre une session, exécute le callback, puis fait un **commit** ou un **abort** automatique en cas d'erreur.

```js
await withTransaction(async (session) => {
  await decrementQuantity(materialId, qty, session);
  await createMovement({ ... }, session);
});
```

---

## Installation et lancement

### Prérequis

- Docker et Docker Compose

### Lancement

```bash
git clone <url-du-repo>
cd factoryFlow
cp .env.example .env
docker compose up --build
```

L'API est disponible sur `http://localhost:3000`.

Au démarrage :
1. Le conteneur `mongo` démarre en replica set `rs0`.
2. Le healthcheck initialise le replica set automatiquement (idempotent).
3. Le conteneur `api` démarre uniquement quand Mongo est **healthy**.

### Commandes utiles

```bash
docker compose up --build        # lancer
docker compose down              # arrêter (les données sont conservées)
docker compose down -v           # arrêter et supprimer les données
docker exec -it factoryflow-mongo mongosh   # shell MongoDB
```

### Lancer l'API hors Docker (Mongo dans Docker)

```dotenv
MONGO_URI=mongodb://localhost:27017/factoryflow?directConnection=true
```

`directConnection=true` est nécessaire car le replica set est configuré avec l'hôte `mongo:27017`, qui n'est résolu qu'à l'intérieur du réseau Docker.

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port de l'API | `3000` |
| `MONGO_URI` | URI MongoDB | `mongodb://mongo:27017/factoryflow?replicaSet=rs0` |
| `JWT_SECRET` | Secret de signature des tokens | chaîne longue et aléatoire |
| `JWT_EXPIRES_IN` | Durée de validité du token | `1d` |

---

## Rôles et permissions

| Rôle | Accès |
|---|---|
| **admin** | Gestion des utilisateurs, matières, stock, produits et ordres |
| **operateur** | Profil, ses propres ordres (liste et détail) |

Toutes les routes protégées attendent le header :

```
Authorization: Bearer <token>
```

- Token absent ou invalide → **401**
- Rôle insuffisant → **403**

---

## Endpoints

### Installation

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/installation/status` | Public | `{ installed: true/false }` |
| POST | `/api/installation` | Public (une seule fois) | Crée le premier admin |

### Authentification et utilisateurs

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Retourne un token JWT |
| GET | `/api/users/me` | Admin, Opérateur | Profil de l'utilisateur connecté |
| POST | `/api/users` | Admin | Créer un opérateur |

### Matières premières et stock

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/materials` | Admin | Créer une matière (+ mouvement IN si stock initial > 0) |
| GET | `/api/materials` | Admin | Liste des matières |
| GET | `/api/materials/alerts` | Admin | Matières sous leur seuil d'alerte |
| GET | `/api/materials/:id` | Admin | Détail d'une matière |
| PATCH | `/api/materials/:id` | Admin | Modifier `reference`, `name`, `unit`, `alertThreshold` |
| POST | `/api/materials/:id/stock-entries` | Admin | Entrée de stock (`$inc` + mouvement IN) |
| GET | `/api/stock-movements` | Admin | Historique (filtres `material`, `type`, pagination) |

### Produits

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/products` | Admin | Créer un produit avec sa composition |
| GET | `/api/products` | Admin | Liste des produits |
| PATCH | `/api/products/:id` | Admin | Modifier un produit (composition remplacée entièrement) |

### Ordres de fabrication

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/orders` | Admin | Créer un ordre (statut `PLANNED`, composition copiée) |
| GET | `/api/orders` | Admin | Liste (filtres `status`, `product`, `from`, `to`, pagination) |
| PATCH | `/api/orders/:id` | Admin | Modifier un ordre `PLANNED` |
| GET | `/api/orders/mine` | Opérateur | Ordres assignés à l'opérateur connecté |
| GET | `/api/orders/:id` | Admin, Opérateur (propriétaire) | Détail d'un ordre |
| POST | `/api/orders/:id/start` | Selon brief | Démarrer un ordre (consommation du stock) |

> Les routes statiques (`/alerts`, `/mine`) sont déclarées **avant** `/:id` pour ne pas être capturées par le paramètre.

---

## Règles métier

### Installation
- Un document **singleton** (`key: 'singleton'`, index unique) stocke l'état `installed`.
- La création du premier admin et le passage à `installed: true` se font dans **une seule transaction**.
- Une seconde installation renvoie **409**.

### Stock
- `availableQuantity` n'est **jamais** modifiée directement (PATCH refusé en **400** grâce au mode `.strict()` de Zod).
- Le stock évolue uniquement via :
  - **Stock initial** à la création (mouvement `IN`)
  - **Entrée de stock** (mouvement `IN`)
  - **Démarrage d'un ordre** (mouvements `OUT`)
- Chaque modification de stock et son mouvement sont écrits dans la **même transaction**.
- Invariant de cohérence : `availableQuantity = Σ IN − Σ OUT`.
- La décrémentation utilise un filtre conditionnel (`availableQuantity >= besoin`) + `$inc` : le stock ne peut jamais devenir négatif, même en concurrence.

### Alertes
- Une matière est en alerte si `availableQuantity < alertThreshold` (comparaison stricte via `$expr`).
- Stock égal au seuil ou seuil à 0 → pas d'alerte.

### Produits
- Référence unique (contrôle hors produit lui-même en modification).
- Composition : au moins une matière, pas de doublon, `quantity > 0`.
- Existence des matières vérifiée en **une seule requête** (`$in`) ; les ids inconnus sont listés dans le message d'erreur (**400**).

### Ordres de fabrication
- La composition du produit est **copiée** dans l'ordre à la création : modifier le produit ensuite ne change pas les ordres existants.
- `assignedTo` doit être un utilisateur existant avec le rôle opérateur.
- Aucun contrôle de stock à la création ; le contrôle se fait au démarrage.
- Un opérateur ne voit que ses ordres (filtre `assignedTo` issu du **token**, jamais de l'URL ou du body).

### Démarrage d'un ordre
1. Calcul des besoins : `quantité par unité × quantité de l'ordre`.
2. Comparaison avec le stock disponible ; si insuffisant → **409** avec la liste `{ matière, requis, disponible }`.
3. En transaction : décrémentation de chaque matière, création des mouvements `OUT` liés à l'ordre, passage au statut `IN_PROGRESS`.
4. Toute erreur annule l'ensemble (rollback).

---

## Tests

### Postman
Une collection Postman couvre les cas nominaux et les cas d'erreur de chaque story (201, 400, 401, 403, 404, 409).

Astuce : un script post-response sur le login enregistre automatiquement le token :

```js
pm.environment.set('token', pm.response.json().data.token);
```

### Tests unitaires
- `calculateRequirements` (fonction pure) et la comparaison avec le stock sont testées avec un repository mocké.

```bash
npm test
```

### Vérifications manuelles (mongosh)

```js
db.installations.find()
db.materials.getIndexes()
db.stockmovements.find().sort({ createdAt: -1 })
```

---

## Gestion de projet

- Méthodologie **Agile** (Scrum), suivi sur **Jira** : epics E1 → E7, user stories avec DoD, sous-tâches.
- Branches Git nommées par ticket (ex. `FC-91`).

---

## Auteur

**Fakhreddine Largou** — Développeur Full Stack JS, YouCode.