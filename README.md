# 📌 **Mode d'emploi : Lancer l'Application de Gestion de CD Audio avec Docker**

## 🛠️ **Prérequis**

Avant de commencer, assurez-vous d'avoir installé :

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 **1. Cloner le projet**

```sh
git clone <adresse repo>
cd <nom du dossier>
```

## 📦 **2. Configuration de l'environnement**

Créez un fichier `.env` dans le dossier **server** et ajoutez :

```ini
DB_USER=user
DB_PASSWORD=password
DB_NAME=cd_database
DB_HOST=postgres
DB_PORT=5432
PORT=5005
```

Modifiez en fonction de votre configuration `docker-compose.prod.yml`ou `docker-compose.dev.yml`

## 🛠️ **3. Lancer l’application avec Docker Compose**

Dans le répertoire racine du projet, exécutez :
Pour un déploiement production :

```sh
docker compose -f docker-compose.prod.yml up -d --build
```

Pour un déploiement de développement (uniquement base de donnée) :

```sh
docker compose -f docker-compose.dev.yml up -d
```

puis lancer le serveur :

```sh
    cd server
    npm run dev
```

et dans un autre terminal le client :

```sh
    cd client
    npm run dev
```

Cela va :

- Démarrer une base de données PostgreSQL
- Lancer le serveur backend Express (prod only)
- Démarrer le frontend React avec Vite (prod only)

## 🛠️ **4. Version Production**

La version mise en production est pensée pour tout faire automatiquement

## 🌍 **5. Accéder à l’application**

- **Backend (API REST) :** `http://localhost:5005/api/cds`
- **Frontend (React) :** `http://localhost:3000`

## 📌 **6. Tester l’application**

### **6.1. Vérifier la connexion à la base de données**

```sh
docker exec -it cd_db psql -U user -d cd_database -c "SELECT * FROM cds;"
```

_Pensez à adapter le nom du container `cd_db`, le nom de l'utilisateur `user` et de la base de donnée `cd_database` si vous la modifiez_

### **6.2. Effectuer une requête API avec `curl`**

```sh
curl -X POST "http://localhost:5005/api/cds" -H "Content-Type: application/json" \
-d '{"title": "Test CD", "artist": "Test Artist", "year": 2023}'
```

### **6.3. Vérifier les logs**

```sh
docker logs -f backend
```

## 🛑 **7. Arrêter l’application**

```sh
docker-compose down
```

## 🚀 **7. Création images**

Si vous souhaitez concevoir les images, notamment pour effectuer un docker scout, vous pouvez lancer les commandes suivantes :

```sh
docker build -t cd-audio-backend -f server/Dockerfile ./server
docker build -t cd-audio-frontend -f client/Dockerfile ./client
```

---

🚀 **Votre application est prête et fonctionnelle avec Docker !** 🎉
