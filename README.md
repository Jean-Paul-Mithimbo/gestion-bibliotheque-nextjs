# 📚 Système de Gestion de Bibliothèque

Une application complète de gestion de bibliothèque construite avec Next.js, MongoDB et shadcn/ui.

## 🚀 Fonctionnalités

- **Gestion des auteurs** : Créer, lire, modifier et supprimer des auteurs
- **Gestion des livres** : Gérer la collection de livres avec statut de disponibilité
- **Gestion des lecteurs** : Inscrire et gérer les lecteurs
- **Système d'emprunts** : Créer des emprunts et gérer les retours
- **Interface moderne** : Design responsive avec shadcn/ui
- **Données en temps réel** : Mise à jour automatique avec SWR

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 13 (Pages Router), React 18
- **Base de données** : MongoDB avec Mongoose
- **Styling** : Tailwind CSS
- **Composants UI** : shadcn/ui
- **Gestion d'état** : SWR pour les données
- **Formulaires** : React Hook Form avec validation Zod

## 📦 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd library-management
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**

   **Option 1 : MongoDB local**
   - Installer MongoDB localement
   - Créer une base de données nommée `bibliotheque`
   - L'URI par défaut est : `mongodb://localhost:27017/bibliotheque`

   **Option 2 : MongoDB Atlas (recommandé)**
   - Créer un compte sur [MongoDB Atlas](https://cloud.mongodb.com/)
   - Créer un cluster et une base de données
   - Récupérer l'URI de connexion

4. **Configuration des variables d'environnement**
```bash
# Copier le fichier d'exemple
cp .env.local.example .env.local

# Éditer le fichier .env.local avec vos informations
```

Contenu du fichier `.env.local` :
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bibliotheque

# Pour MongoDB Atlas :
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bibliotheque?retryWrites=true&w=majority
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
├── components/
│   ├── Layout.js              # Layout principal avec navigation
│   └── ui/                    # Composants UI réutilisables
│       ├── loading.js         # Composants de chargement
│       └── error.js           # Composants d'erreur
├── lib/
│   ├── mongodb.js             # Configuration MongoDB
│   └── models/                # Modèles Mongoose
│       ├── Auteur.js
│       ├── Livre.js
│       ├── Lecteur.js
│       └── Emprunt.js
├── pages/
│   ├── api/                   # API Routes
│   │   ├── auteurs/
│   │   ├── livres/
│   │   ├── lecteurs/
│   │   └── emprunts/
│   ├── auteurs/               # Pages auteurs
│   ├── livres/                # Pages livres
│   ├── lecteurs/              # Pages lecteurs
│   ├── emprunts/              # Pages emprunts
│   ├── _app.js                # Configuration globale
│   └── index.js               # Page d'accueil
└── ...
```

## 🗄️ Modèle de données

### Auteur
- `nom` : String (requis)
- `nationalite` : String (requis)
- `date_naissance` : Date (requis)

### Livre
- `titre` : String (requis)
- `auteur_id` : ObjectId (référence Auteur)
- `date_publication` : Date (requis)
- `disponible` : Boolean (défaut: true)

### Lecteur
- `nom` : String (requis)
- `email` : String (requis, unique)
- `date_inscription` : Date (défaut: Date.now)

### Emprunt
- `lecteur_id` : ObjectId (référence Lecteur)
- `livre_id` : ObjectId (référence Livre)
- `date_emprunt` : Date (défaut: Date.now)
- `date_retour` : Date (optionnel)

## 🔗 API Routes

### Auteurs
- `GET /api/auteurs` - Liste tous les auteurs
- `POST /api/auteurs` - Créer un nouvel auteur
- `GET /api/auteurs/[id]` - Récupérer un auteur
- `PUT /api/auteurs/[id]` - Modifier un auteur
- `DELETE /api/auteurs/[id]` - Supprimer un auteur

### Livres
- `GET /api/livres` - Liste tous les livres
- `POST /api/livres` - Créer un nouveau livre
- `GET /api/livres/[id]` - Récupérer un livre
- `PUT /api/livres/[id]` - Modifier un livre
- `DELETE /api/livres/[id]` - Supprimer un livre

### Lecteurs
- `GET /api/lecteurs` - Liste tous les lecteurs
- `POST /api/lecteurs` - Créer un nouveau lecteur
- `GET /api/lecteurs/[id]` - Récupérer un lecteur
- `PUT /api/lecteurs/[id]` - Modifier un lecteur
- `DELETE /api/lecteurs/[id]` - Supprimer un lecteur

### Emprunts
- `GET /api/emprunts` - Liste tous les emprunts
- `POST /api/emprunts` - Créer un nouvel emprunt
- `PUT /api/emprunts/[id]/retour` - Marquer un livre comme retourné

## 🎨 Interface utilisateur

L'application utilise shadcn/ui pour une interface moderne et responsive :

- **Tableau de bord** : Statistiques et actions rapides
- **Gestion des entités** : Vues liste et détail pour chaque entité
- **Formulaires** : Validation en temps réel
- **Navigation** : Menu de navigation principal
- **Feedback** : Messages de succès et d'erreur
- **Responsive** : Optimisé pour mobile et desktop

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Préparer le projet**
```bash
npm run build
```

2. **Déployer sur Vercel**
```bash
npx vercel
```

3. **Configurer les variables d'environnement**
- Aller dans les paramètres du projet Vercel
- Ajouter `MONGODB_URI` dans les variables d'environnement

### Variables d'environnement de production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bibliotheque?retryWrites=true&w=majority
```

## 🔧 Développement

### Commandes disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linting
npm run lint
```

### Ajouter de nouvelles fonctionnalités

1. **Nouveau modèle** : Créer dans `lib/models/`
2. **Nouvelle API** : Ajouter dans `pages/api/`
3. **Nouvelle page** : Créer dans `pages/`
4. **Nouveaux composants** : Ajouter dans `components/`

## 📝 Notes importantes

- L'application utilise le Pages Router de Next.js (pas App Router)
- Les données sont mises à jour en temps réel grâce à SWR
- La validation est faite côté client et serveur
- L'interface est entièrement responsive
- Le système gère automatiquement la disponibilité des livres

## 🆘 Résolution des problèmes

### Problèmes de connexion MongoDB
- Vérifier que MongoDB est en cours d'exécution
- Contrôler l'URI de connexion dans `.env.local`
- Pour Atlas : vérifier les IP autorisées et les credentials

### Problèmes de build
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller : `npm install`
- Rebuild : `npm run build`

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.