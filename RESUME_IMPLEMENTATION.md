# Résumé des réalisations — Fonctionnalités list & delete produit

## Fonctionnalité 1 — Liste des produits (US-3)

**Route** : `GET /api/product` → réponse `200` avec un tableau `[{title, price}]`

### Fichiers créés

| Fichier | Rôle |
|---|---|
| `src/module/product/listProducts/listProductsRepository.ts` | Interface avec `findAll(): Promise<Product[]>` |
| `src/module/product/listProducts/listProductsTypeOrmRepository.ts` | Implémentation TypeORM |
| `src/module/product/listProducts/listProductsUseCase.ts` | Logique : mappe chaque produit en `{title, price}` |
| `src/module/product/listProducts/listProductsController.ts` | Route Express GET |

### Tests unitaires — `listProductsUseCase.spec.ts` (4 scénarios)

- **Scénario 1** : liste réussie avec plusieurs produits
- **Scénario 2** : liste réussie sans produits → tableau vide
- **Scénario 3** : la réponse ne contient que `title` et `price` (pas `id`, pas `description`)
- **Scénario 4** : erreur base de données → `'erreur lors de la récupération des produits'`

### Tests E2E — `listProducts.e2e.spec.ts` (3 scénarios, vrai container PostgreSQL)

- **Scénario 1** : `200` + tableau avec titre et prix
- **Scénario 2** : `200` + tableau vide
- **Scénario 3** : `200` + vérification que `description` et `id` sont absents de la réponse

---

## Fonctionnalité 2 — Suppression de produit (US-4)

**Route** : `DELETE /api/product/:id` → `201` si ok, `404` si non trouvé

### Fichiers créés

| Fichier | Rôle |
|---|---|
| `src/module/product/deleteProduct/deleteProductRepository.ts` | Interface avec `findOneById()` et `delete()` |
| `src/module/product/deleteProduct/deleteProductTypeOrmRepository.ts` | Implémentation TypeORM |
| `src/module/product/deleteProduct/deleteProductUseCase.ts` | Logique + classe `ProductNotFoundError` |
| `src/module/product/deleteProduct/deleteProductController.ts` | Route Express DELETE, distingue `404` vs `400` |

### Tests unitaires — `deleteProductUseCase.spec.ts` (3 scénarios)

- **Scénario 1** : suppression réussie → pas d'erreur
- **Scénario 2** : produit non trouvé → `ProductNotFoundError` + message `'produit non trouvé'`
- **Scénario 3** : erreur base de données → `'erreur lors de la suppression du produit'`

### Tests E2E — `deleteProduct.e2e.spec.ts` (2 scénarios, vrai container PostgreSQL)

- **Scénario 1** : `201` + vérification que le produit n'existe plus en base
- **Scénario 2** : `404` + message `'produit non trouvé'`

---

## Modification de `src/config/app.ts`

Les deux nouveaux controllers sont enregistrés dans l'application Express :

```typescript
app.use('/api', listProductsController);
app.use('/api', deleteProductController);
```
