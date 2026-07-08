# Projet Express / TypeORM - Conventions et architecture

## 1. Vue d'ensemble du projet
- API e-commerce Express.js
- Langage : TypeScript 5.x
- ORM : TypeORM 0.3.x
- Base de données : PostgreSQL
- Tests : Jest 30.x, Supertest, @testcontainers/postgresql
- Architecture : clean architecture / DDD orientée cas d’usage

## 2. Structure de l’application
- `src/config/` : configuration de l’application et TypeORM
- `src/module/` : domaine métier, organisé par fonctionnalité/use case
- `src/module/{domaine}/{useCase}/` : chaque cas d’usage a son propre dossier
- `src/module/{domaine}/{useCase}/test/` : tests unitaires et E2E pour ce cas d’usage
- Racine du projet : documentation, configuration des outils, workflows GitHub

## 3. Conventions de nommage
- Use cases : `CreateProductUseCase`, `UpdateProductUseCase`, etc.
- Controllers : `createProductController.ts`, `updateProductController.ts`
- Repository interfaces : `CreateProductRepository.ts`, `UpdateProductRepository.ts`
- ORM adaptateurs : `CreateProductTypeOrmRepository.ts`, `UpdateProductTypeOrmRepository.ts`
- Entités : `Product.ts`, `Order.ts`, etc.
- Tests unitaires : `{useCase}.spec.ts`
- Tests E2E : `{useCase}.e2e.spec.ts`
- Fichiers de configuration : `db.config.ts`, `app.ts`

## 4. Convention d’architecture
- Architecture en vertical slice / feature-based
- Séparation claire :
  - controller = interface HTTP
  - use case = orchestration métier
  - repository = interface de persistance
  - adapter TypeORM = implémentation concrète
- Use cases demandent des objets porteurs de données (DTO) et délèguent la validation aux entités
- Les contrôleurs instancient les adaptateurs et injectent les dépendances dans les use cases

## 5. Entités et règles métier
- Les entités TypeORM contiennent de la logique métier et des validations
- Exemple `Product.ts` :
  - validation du titre
  - validation du prix
  - validation de la description
  - méthode `update()` pour modifier l’état en respectant les règles
- Règles métier connues pour le produit :
  - titre > 2 caractères
  - titre <= 20 caractères
  - titre ne doit pas commencer par un espace
  - titre ne doit pas contenir d’espaces
  - prix > 0 et < 10000
  - description ne doit pas contenir `@`

## 6. Tests et stratégie
- Unit tests : tests d’un use case isolé avec des doubles de repository
- E2E tests : supertest + PostgreSQL via testcontainers
- Naming des tests : description en français et structure Given-When-Then
- Exemple de double de repository : `CreateProductDummyRepository`

## 7. Conventions de code
- Identifiants en anglais
- Messages d’erreur et tests en français
- Importations : mélange de ES modules (`export`) et de CommonJS (`module.exports`) dans les contrôleurs
- Fichiers TypeScript : `src/**/*.ts`

## 8. Configuration et outils
- `package.json` expose les scripts : `dev`, `start`, `test`, `test:unit`, `test:e2e`, `lint`, `format`
- `prepare` exécute `husky`
- `jest.config.js` pour Jest
- `tsconfig.json` avec `experimentalDecorators`, `emitDecoratorMetadata`, `strict: true`
- TypeORM activé avec `synchronize: true` en dev
- `.env.local` utilisé pour `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PW`, `DB_NAME`

## 9. GitHub Actions
- Workflow attendu dans `.github/workflows/ci.yml`
- Trigger actuel : `push` sur `main`
- Étapes normales : checkout, setup-node, npm ci, npm run test

## 10. Recommandations pratiques
- Respecter le pattern `Feature / UseCase` dans `src/module`
- Garder les interfaces de repository minimalistes, en mode port
- Laisser la logique de validation dans les entités plutôt que dans les contrôleurs
- Écrire les tests unitaires avec des doubles simples et des assertions `resolves` / `rejects`
- Utiliser des messages d’erreur explicites en français pour la consommation API
