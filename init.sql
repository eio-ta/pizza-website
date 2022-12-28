drop table if exists entrees cascade;
drop table if exists pizzas cascade;
drop table if exists boissons cascade;
drop table if exists ingredients cascade;
drop table if exists commandes_details cascade;
drop table if exists commandes cascade;
drop table if exists livreurs cascade;
drop table if exists clients cascade;

create table entrees (id_entree integer primary key, nom text not null, description text not null, prix integer, deroulant varchar(3) not null);
create table pizzas (id_pizza integer primary key, nom text not null, description text not null, prix integer);
create table boissons (id_boisson integer primary key, nom text not null, prix integer);
create table ingredients (id_ingredient integer primary key, nom text not null, prix integer);
create table clients (id_client integer primary key, nom text, prenom text, adresse text, mail text not null, mdp text not null);
create table livreurs (id_livreur integer primary key, nom text, prenom text, adresse text, mail text not null, mdp text not null);
create table commandes (id_commande integer primary key, id_client integer, id_livreur integer references livreurs, heure_de_livraison text not null, prix_total integer);
create table commandes_details (id_article integer primary key, id_commande integer, nom_article text not null, supplement text not null, prix integer);


INSERT INTO entrees VALUES
(0, 'Cheesy Bread', 'Bâtonnets de pâte à pizza, mozzarella, emmental, assaisonnement à l''ail.', 4, 'non'),
(1, 'Kick''n Chicken', '6 morceaux de blancs de poulet dans une chapelure croustillante. Servis avec une sauce au choix.', 4, 'oui'),
(2, 'Chickenito', '6 morceaux de blancs de poulet dans une chapelure croustillante. Servis avec une sauce au choix.', 4, 'oui'),
(3, 'Buffalo wings', '8 ailerons de poulet marinés grillés. Servis avec une sauce au choix.', 4, 'oui'),
(4, 'Cheesy Crunch', '6 bouchées panées au gouda fondant.', 4, 'non'),
(5, 'La petite verte', 'Quelques feuilles de salade verte et lamelles de carottes en toute simplicité pour accompagner vos entrées ou pizzas.', 4, 'non'),
(6, 'La Caesar', 'Mélange de salades, émincés de poulet rôti, fromage italien, tomates cerises, croûtons grillés.', 4, 'non'),
(7, 'Potatoes', 'Pommes de terre dorées au four et délicatement épicées. Servi avec une sauce au choix.', 4, 'oui');

INSERT INTO pizzas VALUES
(0, 'Margharitha', 'Sauce tomate, mozzarella, fromage rapé.', 9),
(1, 'Jambon', 'Sauce tomate, mozzarella, jambon.', 9),
(2, 'Pepperoni', 'Sauce tomate, mozarella, pepperoni.', 9),
(3, 'Spéciale Merguez', 'Sauce tomate, mozzarella, merguez.', 9),
(4, 'Vegan Peppina', 'Sauce tomate, champignons, poivrons.', 9),
(5, 'Vegan Margharita', 'Sauce tomate, fromage rapé, tomates.', 9),
(6, 'Steak & Cheese', 'Sauce tomate, mozzarella, boulettes de boeuf.', 9),
(7, 'Crée ta pizza', 'Sauce tomate, Mozarella, Jambon, Pepperoni, Merguez, Fromage râpée, Champignons, Poivrons, Olives, Tomates, Boulettes de boeuf, Oignons', 0);

INSERT INTO boissons VALUES
(0, 'Sprite Original', 1),
(1, 'Schweppes agrumes', 1),
(2, 'Oasis Tropical', 1),
(3, 'Fanta Orange', 1),
(4, 'Fuzetea Pêche', 1),
(5, 'Evian', 1),
(6, 'Coca Cola', 1),
(7, 'Badoit', 1);

INSERT INTO ingredients VALUES
(0, 'Sauce tomate', 1),
(1, 'Mozarella', 1),
(2, 'Jambon', 1),
(3, 'Pepperoni', 1),
(4, 'Merguez', 1),
(5, 'Fromage râpée', 1),
(6, 'Champignons', 1),
(7, 'Poivrons', 1),
(8, 'Olives', 1),
(9, 'Tomates', 1),
(10, 'Boulettes de boeuf', 1),
(11, 'Oignons', 1);

INSERT INTO livreurs VALUES
(0, '', '', '', 'livreur@test', 'test');

INSERT INTO clients VALUES
(0, 'Nom du client', 'Prénom du client', 'Adresse du client', 'client@test', 'test');