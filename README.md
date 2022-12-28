# Projet PW6 2022 : Italian Pizza

## Sommaire

1. [Introduction et informations](README.md#introduction-et-informations)
2. [Configuration de la base de données Postgre](README.md#configuration-de-la-base-de-donnees-postgre)
3. [Compilation et exécution](README.md#compilation-et-execution)

---

## Introduction et informations

**Informations généraux**

- Prérequis à installer : Html, Css, Node (notamment ejs, express, pg), Postgre

**Identifiants et membres du groupe**

1. BOUDJABOUT Manissa [22018741]
2. TANG Elody [21953199]

## Configuration de la base de donnees Postgre

1. Première étape : installer les modules correspondants

☼ Lancer la commande `npm install pg` pour installer le module de Postgre dans le dossier `nodes_modules`.

☼ Créer un nouvel utilisateur, une nouvelle database dans Postgre :

```
sudo -i -u postgres;
create user [nom] with password [password];
create database [database];
```

2. Deuxième étape : remplacement des données dans les fichiers correspondants de Node

☼ Ouvrir le fichier `main.js`.

☼ Remplacer les données des lignes 12 à 18 du fichier ouvert avec les données de la première étape.

```
const pool = new Pool({
    user: [nom],
    host: "localhost",
    database: [database],
    password: [password],
    port: 5432
});
```

3. Remplir la base de données avec PSQL

```
sudo -u postgres psql testdb < init.sql
```

S'il n'y a pas d'erreur, il devrait y avoir sur votre terminal :

```
DROP TABLE
DROP TABLE
DROP TABLE
DROP TABLE
DROP TABLE
DROP TABLE
DROP TABLE
DROP TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
INSERT 0 8
INSERT 0 8
INSERT 0 8
INSERT 0 12
INSERT 0 1
INSERT 0 1
```

## Compilation et execution

- `node main.js` lancera le serveur pour notre site de pizza.
