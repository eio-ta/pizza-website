/*  Initialisation à la base de données et au serveur Express  *********************************************************/

const express = require("express");
const serv = express();
serv.set("view engine", "ejs");
serv.use(express.static("public"));
serv.use(express.urlencoded({ extended: true }));

const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "",
    password: "",
    port: 5432,
});

console.log("Connexion à la base de données et configuration du serveur : OK.");

/*  Initialisation des variables utiles pour les différentes pages du serveur  *****************************************/

var connected = false;
var livreur = false;
var mail_connected = "";
var panier = [];

const menu = [
    { image: "menu-entrees", title: "Les entrées", id: "entrees" },
    { image: "menu-pizzas", title: "Les pizzas", id: "pizzas" },
    { image: "menu-boissons", title: "Les boissons", id: "boissons" },
];

const extra_menu = [{
        id: 1,
        image: "menu-EM",
        title: "Extra Menu",
        description: "1 entrée, 1 pizza Médium, 1 boissons de 33cL",
        prix: 10,
    },
    {
        id: 2,
        image: "menu-MM",
        title: "Méga Menu",
        description: "1 entrée, 2 pizzas Médium, 1 boisson d’1l",
        prix: 28,
    },
    {
        id: 3,
        image: "menu-GM",
        title: "Giga Menu",
        description: "2 entrées, 2 pizzas Large, 2 boisson d’1l",
        prix: 23,
    },
];

console.log("Préparation des données à utiliser : OK.");

/*  Bibliothèque de fonctions utiles (requête SQL, ajout au panier...)  ************************************************/

/* Requêtes SQL avec le module PostGre */
async function query(reqSQL) {
    const client = await pool.connect();
    let res;
    try {
        await client.query("BEGIN");
        try {
            res = await client.query(reqSQL);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
    } finally {
        client.release();
    }
    return res;
}

/* Récupère l'index d'un article au panier */
function indexOfPanier(element) {
    for (let i = 0; i < panier.length; i++) {
        const e = panier[i];
        if (
            e[0] === element[0] &&
            e[1] === element[1] &&
            e[2] === element[2] &&
            e[3] === element[3]
        )
            return i;
    }
    return -1;
}

/* Ajoute un article au panier */
serv.post("/add_to_cart", function(req) {
    response = {
        plat: req.body.plat,
        id: req.body.id,
        option: req.body.option,
        prix: req.body.prix,
    };

    panier.push(response);
    console.log("Ajout de l'article au panier : OK.");
});

/* Supprimer un article du panier */
serv.post("/remove_to_cart", function(req) {
    response = {
        plat: req.body.plat,
        id: req.body.id,
        option: req.body.option,
        prix: req.body.prix,
    };

    const number = indexOfPanier(response);
    if (number !== -1) {
        panier.splice(number, 1);
        console.log("Suppresion de l'article au panier : OK.");
    }
});

serv.post("/remove_to_cart_2", function(req, res, next) {
    var index = Number(req.body.index);
    if (index !== -1) {
        panier.splice(index, 1);
        console.log("Suppresion de l'article au panier : OK.");
    }
});

/* Mettre à jour une livraison */
serv.post("/update_livraison", async(req, res) => {
    try {
        const sql =
            "SELECT id_livreur FROM Livreurs WHERE mail='" + mail_connected + "'";
        const l_rows_array = (await query(sql)).rows;

        const sql1 =
            "SELECT * FROM commandes WHERE id_livreur='" +
            l_rows_array[0].id_livreur +
            "' ORDER BY heure_de_livraison";
        const c_rows_array = (await query(sql1)).rows;

        const sql2 =
            "DELETE FROM commandes_details WHERE id_commande='" +
            c_rows_array[0].id_commande +
            "'";
        const cd_rows = await query(sql2);

        const sql3 =
            "DELETE FROM commandes WHERE id_commande='" +
            c_rows_array[0].id_commande +
            "'";
        const c2_rows = await query(sql3);

        console.log("Livraison effectuée : OK.");
    } catch (err) {
        console.log("Database " + err);
    }
});

/* Traitement des pages et redirection du client en fonction de ses choix  *********************************************/

serv.listen(8080);

serv.get("/", function(req, res) {
    res.redirect("accueil");
});

/*  COTE CLIENT */

/* Traitement de la page d'accueil */
serv.get("/accueil", async(req, res) => {
    if (livreur) {
        res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
    } else {
        try {
            const sql = "SELECT * FROM Entrees ORDER BY id_entree";
            const sql2 = "SELECT * FROM Boissons ORDER BY id_boisson";
            const sql3 = "SELECT * FROM Pizzas ORDER BY id_pizza";
            const sql4 = "SELECT * FROM Ingredients ORDER BY id_ingredient";

            const e_rows_array = (await query(sql)).rows;
            const b_rows_array = (await query(sql2)).rows;
            const p_rows_array = (await query(sql3)).rows;
            const i_rows_array = (await query(sql4)).rows;

            res.render("pages/accueil.ejs", {
                c: connected,
                l: livreur,
                p: panier,
                menu: menu,
                extra_menu: extra_menu,
                entrees: e_rows_array,
                pizzas: p_rows_array,
                boissons: b_rows_array,
                ingredients: i_rows_array,
            });
        } catch (err) {
            console.log("Database " + err);
        }
    }
});

serv.post("/accueil", async(req, res) => {
    try {
        response = {
            email: req.body.mail,
            mdp: req.body.mdp,
        };

        const sql0 =
            "SELECT id_client FROM clients WHERE mail='" +
            response.email +
            "' and mdp='" +
            response.mdp +
            "'";
        const i_user = (await query(sql0)).rows;

        if (i_user.length === 0) {
            res.render("pages/connexion.ejs", {
                c: connected,
                l: livreur,
                p: panier,
                err: false,
            });
            return;
        }

        connected = true;
        mail_connected = response.email;

        const sql = "SELECT * FROM Entrees ORDER BY id_entree";
        const sql2 = "SELECT * FROM Boissons ORDER BY id_boisson";
        const sql3 = "SELECT * FROM Pizzas ORDER BY id_pizza";
        const sql4 = "SELECT * FROM Ingredients ORDER BY id_ingredient";

        const e_rows_array = (await query(sql)).rows;
        const b_rows_array = (await query(sql2)).rows;
        const p_rows_array = (await query(sql3)).rows;
        const i_rows_array = (await query(sql4)).rows;

        res.render("pages/accueil.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            menu: menu,
            extra_menu: extra_menu,
            entrees: e_rows_array,
            pizzas: p_rows_array,
            boissons: b_rows_array,
            ingredients: i_rows_array,
        });
    } catch (err) {
        console.log("Database " + err);
    }
});

/* Traitement de la page de connexion */
serv.get("/connexion", function(req, res) {
    if (connected)
        res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
    else
        res.render("pages/connexion.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            err: true,
        });
});

/* Traitement de la page d'inscription */
serv.get("/inscription", function(req, res) {
    if (connected)
        res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
    else
        res.render("pages/inscription.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            err: true,
        });
});

serv.post("/inscription", async(req, res) => {
    var response = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        adresse: req.body.adresse,
        mail: req.body.mail,
        mdp: req.body.mdp,
    };

    try {
        const sql = "SELECT * FROM clients";
        const i_user = (await query(sql)).rows;

        for (let i = 0; i < i_user.length; i++) {
            if (i_user[i].mail === response.mail) {
                res.render("pages/inscription.ejs", {
                    c: connected,
                    l: livreur,
                    p: panier,
                    err: false,
                });
                return;
            }
        }

        const sql1 =
            "INSERT INTO clients VALUES(" +
            i_user.length +
            ", '" +
            response.nom +
            "', '" +
            response.prenom +
            "', '" +
            response.adresse +
            "', '" +
            response.mail +
            "', '" +
            response.mdp +
            "')";
        console.log(sql1);
        const insert_user = (await query(sql1)).rows;

        connected = true;
        mail_connected = response.mail;

        console.log("Nouveau client ajouté.");

        res.redirect("accueil");
    } catch (err) {
        console.log("Database " + err);
    }
});

/* Traitement de la page du paiement */
serv.get("/paiement", async(req, res) => {
    if (connected) {
        console.log(panier);
        const sql1 = "SELECT * FROM clients WHERE mail='" + mail_connected + "'";
        const sql2 = "SELECT * FROM Entrees ORDER BY id_entree";
        const sql3 = "SELECT * FROM Boissons ORDER BY id_boisson";
        const sql4 = "SELECT * FROM Pizzas ORDER BY id_pizza";
        const sql5 = "SELECT * FROM Ingredients ORDER BY id_ingredient";

        const pr_rows_array = (await query(sql1)).rows;
        const e_rows_array = (await query(sql2)).rows;
        const b_rows_array = (await query(sql3)).rows;
        const p_rows_array = (await query(sql4)).rows;
        const i_rows_array = (await query(sql5)).rows;

        res.render("pages/paiement.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            profil: pr_rows_array,
            entrees: e_rows_array,
            pizzas: p_rows_array,
            boissons: b_rows_array,
            ingredients: i_rows_array,
            err: false,
        });
    } else res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
});

serv.post("/paiement", async(req, res) => {
    response = {
        time: req.body.time,
    };
    console.log(response.time);
    const n = panier.length;

    try {
        // On récupère le numéro id du client
        const sql0 =
            "SELECT id_client FROM clients WHERE mail='" + mail_connected + "'";
        const id_c_rows = (await query(sql0)).rows[0].id_client;

        // On récupère le numéro de commande dans la base de données
        const sql = "SELECT count(id_commande) FROM commandes";
        const nb_commande = (await query(sql)).rows[0].count;

        // On récupère le nombre d'article dans la base de données
        const sql1 = "SELECT count(id_article) FROM commandes_details";
        var nb_article = (await query(sql1)).rows[0].count;

        // On récupère les menus
        const sql1p = "SELECT * FROM clients WHERE mail='" + mail_connected + "'";
        const sql2 = "SELECT * FROM Entrees ORDER BY id_entree";
        const sql3 = "SELECT * FROM Boissons ORDER BY id_boisson";
        const sql4 = "SELECT * FROM Pizzas ORDER BY id_pizza";
        const sql5 = "SELECT * FROM Ingredients ORDER BY id_ingredient";

        const pr_rows_array = (await query(sql1p)).rows;
        const e_rows_array = (await query(sql2)).rows;
        const b_rows_array = (await query(sql3)).rows;
        const p_rows_array = (await query(sql4)).rows;
        const i_rows_array = (await query(sql5)).rows;

        // On insère les valeurs
        var prix_total = 0;
        for (let i = 0; i < n; i++) {
            var insert_sql = "INSERT INTO commandes_details VALUES (";
            insert_sql += nb_article + ", ";
            nb_article++;
            insert_sql += nb_commande + ", '";

            if (panier[i].plat === "entree") {
                insert_sql += e_rows_array[panier[i].id].nom + "', '";
                if (panier[i].option === "1") insert_sql += "Ketchup', ";
                else if (panier[i].option === "2") insert_sql += "Mayonnaise', ";
                else if (panier[i].option === "3") insert_sql += "Barbecue', ";
                else if (panier[i].option === "4") insert_sql += "Curry', ";
                else insert_sql += "#', ";
            } else if (panier[i].plat === "pizza") {
                insert_sql += p_rows_array[panier[i].id].nom + "', '";
                if (panier[i].option === "1") insert_sql += "Small', ";
                else if (panier[i].option === "2") insert_sql += "Medium', ";
                else if (panier[i].option === "3") insert_sql += "Large', ";
                else insert_sql += "XLarge', ";
            } else if (panier[i].plat === "boisson") {
                insert_sql += b_rows_array[panier[i].id].nom + "', '";
                if (panier[i].option === "1") insert_sql += "25cL', ";
                else if (panier[i].option === "2") insert_sql += "33cL', ";
                else if (panier[i].option === "3") insert_sql += "50cL', ";
                else insert_sql += "1L', ";
            } else if (panier[i].plat === "menu") {
                insert_sql += "Menu', '";
                var array = panier[i].option;
                for (let j = 0; j < array.length; j++) {
                    if (array[j][0] === "entree") {
                        insert_sql += e_rows_array[array[j][1]].nom + ", ";
                    } else if (array[j][0] === "pizza") {
                        insert_sql += p_rows_array[array[j][1]].nom + ", ";
                    } else if (array[j][0] === "boisson") {
                        insert_sql += b_rows_array[array[j][1]].nom + ", ";
                    }
                }
                insert_sql += "', ";
            } else {
                insert_sql += "Pizza Composable', '";
                const n2 = panier[i].option.length;
                const o_array = panier[i].option;
                for (let j = 0; j < n2; j++) {
                    if (j !== n2 - 1) {
                        insert_sql +=
                            i_rows_array[o_array[j][0]].nom + " (" + o_array[j][1] + "), ";
                    } else {
                        if (o_array[j][0] === "12") insert_sql += "Small', ";
                        else if (o_array[j][0] === "13") insert_sql += "Medium', ";
                        else if (o_array[j][0] === "14") insert_sql += "Large', ";
                        else insert_sql += "XLarge', ";
                    }
                }
            }

            insert_sql += panier[i].prix + ")";
            prix_total += parseFloat(panier[i].prix);

            console.log(insert_sql);
            const insert = await query(insert_sql);
        }

        console.log("Détails de la commande ajoutée à la base de données : OK.");

        // On insère la commande dans la base de données
        const sql6 =
            "INSERT INTO commandes VALUES (" +
            nb_commande +
            ", " +
            id_c_rows +
            ", 0, '" +
            response.time +
            "', " +
            prix_total +
            ")";
        const add_commande = await query(sql6);

        console.log("Commande ajoutée à la base de données : OK.");

        panier = [];

        res.render("pages/paiement.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            profil: pr_rows_array,
            entrees: e_rows_array,
            pizzas: p_rows_array,
            boissons: b_rows_array,
            ingredients: i_rows_array,
            err: true,
        });
    } catch (err) {
        console.log("Database " + err);
    }
});

/* COTE LIVREUR */

/* Traitement de la page d'accueil du livreur */
serv.get("/accueil_livreur", async(req, res) => {
    if (livreur && connected) {
        try {
            const sql =
                "SELECT id_livreur FROM Livreurs WHERE mail='" + mail_connected + "'";
            const l_rows_array = (await query(sql)).rows;

            const sql1 =
                "SELECT * FROM commandes WHERE id_livreur='" +
                l_rows_array[0].id_livreur +
                "' ORDER BY heure_de_livraison";
            const sql2 = "SELECT * FROM commandes_details";
            const sql3 = "SELECT * FROM clients ORDER BY id_client";

            const c_rows_array = (await query(sql1)).rows;
            const cd_rows_array = (await query(sql2)).rows;
            const cl_rows_array = (await query(sql3)).rows;

            res.render("pages/livreur.ejs", {
                c: connected,
                l: livreur,
                p: panier,
                commandes: c_rows_array,
                commandes_details: cd_rows_array,
                clients: cl_rows_array,
            });
        } catch (err) {
            console.log("Database " + err);
        }
    } else res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
});

serv.post("/accueil_livreur", async(req, res) => {
    connected = true;
    livreur = true;
    if (livreur && connected) {
        try {
            response = {
                email: req.body.mail,
                mdp: req.body.mdp,
            };

            const sql0 =
                "SELECT id_livreur FROM livreurs WHERE mail='" +
                response.email +
                "' and mdp='" +
                response.mdp +
                "'";
            const i_rows_array = (await query(sql0)).rows;

            if (i_rows_array.length === 0) {
                connected = false;
                livreur = false;
                res.render("pages/connexion.ejs", {
                    c: connected,
                    l: livreur,
                    p: panier,
                    err: false,
                });
                return;
            }

            mail_connected = response.email;

            const sql =
                "SELECT id_livreur FROM Livreurs WHERE mail='" + mail_connected + "'";
            const l_rows_array = (await query(sql)).rows;

            const sql1 =
                "SELECT * FROM commandes WHERE id_livreur='" +
                l_rows_array[0].id_livreur +
                "' ORDER BY heure_de_livraison";
            const sql2 = "SELECT * FROM commandes_details";
            const sql3 = "SELECT * FROM clients ORDER BY id_client";

            const c_rows_array = (await query(sql1)).rows;
            const cd_rows_array = (await query(sql2)).rows;
            const cl_rows_array = (await query(sql3)).rows;

            res.render("pages/livreur.ejs", {
                c: connected,
                l: livreur,
                p: panier,
                commandes: c_rows_array,
                commandes_details: cd_rows_array,
                clients: cl_rows_array,
            });
        } catch (err) {
            console.log("Database " + err);
        }
    } else {
        connected = false;
        livreur = false;
        res.render("pages/connexion.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            err: false,
        });
    }
});

/* Traitement de la page de connexion du livreur */
serv.get("/livraison", function(req, res) {
    if (connected)
        res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
    else
        res.render("pages/connexion.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            err: true,
        });
});

/* DES DEUX COTES */

/* Traitement de la page du profil */
serv.get("/profil", async(req, res) => {
    if (connected === false)
        res.render("pages/error.ejs", { c: connected, l: livreur, p: panier });
    else {
        try {
            const sql = "SELECT * FROM Entrees ORDER BY id_entree";
            const sql2 = "SELECT * FROM Boissons ORDER BY id_boisson";
            const sql3 = "SELECT * FROM Pizzas ORDER BY id_pizza";
            const sql4 = "SELECT * FROM Ingredients ORDER BY id_ingredient";
            var sql5;
            if (livreur)
                sql5 = "SELECT * FROM Livreurs WHERE mail='" + mail_connected + "'";
            else sql5 = "SELECT * FROM Clients WHERE mail='" + mail_connected + "'";

            const e_rows_array = (await query(sql)).rows;
            const b_rows_array = (await query(sql2)).rows;
            const p_rows_array = (await query(sql3)).rows;
            const i_rows_array = (await query(sql4)).rows;
            const c_rows_array = (await query(sql5)).rows;

            res.render("pages/profil.ejs", {
                c: connected,
                l: livreur,
                p: panier,
                entrees: e_rows_array,
                pizzas: p_rows_array,
                boissons: b_rows_array,
                ingredients: i_rows_array,
                profil: c_rows_array,
            });
        } catch (err) {
            console.log("Database " + err);
        }
    }
});

serv.post("/profil", async(req, res) => {
    response = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        adresse: req.body.adresse,
    };

    try {
        var sql;
        if (livreur)
            sql =
            "UPDATE livreurs SET nom ='" +
            response.nom +
            "', prenom = '" +
            response.prenom +
            "', adresse = '" +
            response.adresse +
            "' WHERE mail='" +
            mail_connected +
            "'";
        else
            sql =
            "UPDATE clients SET nom ='" +
            response.nom +
            "', prenom = '" +
            response.prenom +
            "', adresse = '" +
            response.adresse +
            "' WHERE mail='" +
            mail_connected +
            "'";

        const sql1 = "SELECT * FROM Entrees ORDER BY id_entree";
        const sql2 = "SELECT * FROM Boissons ORDER BY id_boisson";
        const sql3 = "SELECT * FROM Pizzas ORDER BY id_pizza";
        const sql4 = "SELECT * FROM Ingredients ORDER BY id_ingredient";
        var sql5;
        if (livreur)
            sql5 = "SELECT * FROM Livreurs WHERE mail='" + mail_connected + "'";
        else sql5 = "SELECT * FROM Clients WHERE mail='" + mail_connected + "'";

        const u_rows = await query(sql);
        const e_rows_array = (await query(sql1)).rows;
        const b_rows_array = (await query(sql2)).rows;
        const p_rows_array = (await query(sql3)).rows;
        const i_rows_array = (await query(sql4)).rows;
        const c_rows_array = (await query(sql5)).rows;

        res.render("pages/profil.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            entrees: e_rows_array,
            pizzas: p_rows_array,
            boissons: b_rows_array,
            ingredients: i_rows_array,
            profil: c_rows_array,
        });
    } catch (err) {
        console.log("Database " + err);
    }
});

/* Traitement de deconnexion */
serv.get("/deconnexion", async(req, res) => {
    connected = false;
    livreur = false;
    mail_connected = "";

    try {
        const sql = "SELECT * FROM Entrees ORDER BY id_entree";
        const sql2 = "SELECT * FROM Boissons ORDER BY id_boisson";
        const sql3 = "SELECT * FROM Pizzas ORDER BY id_pizza";
        const sql4 = "SELECT * FROM Ingredients ORDER BY id_ingredient";

        const e_rows_array = (await query(sql)).rows;
        const b_rows_array = (await query(sql2)).rows;
        const p_rows_array = (await query(sql3)).rows;
        const i_rows_array = (await query(sql4)).rows;

        res.render("pages/accueil.ejs", {
            c: connected,
            l: livreur,
            p: panier,
            menu: menu,
            extra_menu: extra_menu,
            entrees: e_rows_array,
            pizzas: p_rows_array,
            boissons: b_rows_array,
            ingredients: i_rows_array,
        });
    } catch (err) {
        console.log("Database " + err);
    }
});

console.log("Écoute sur le port 8080.");
console.log("Le serveur est prêt à recevoir des clients : OK.");