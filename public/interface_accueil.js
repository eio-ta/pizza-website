
/*  AJOUTER LES ELEMENTS DES PLATS  ************************************************************************************/

function add_image_plat(indice, plat) {
    $('.' + plat + '-' + indice).prepend('<img class="img-responsive" src="/medias/images/' + plat + 's/' + plat + '-' + indice + '.png" style="width:100%; height: 200px;"></img>');
}

function change_prix_boisson(document, indice) {
    document.querySelector(".select-boisson-" + indice).addEventListener("change", function(evt){ 
        if(evt.target.value === "1") {
            document.getElementById("prix-boisson-" + indice).innerHTML = "1€";
        } else if(evt.target.value === "2") {
            document.getElementById("prix-boisson-" + indice).innerHTML = "1.50€";
        } else if(evt.target.value === "3") {
            document.getElementById("prix-boisson-" + indice).innerHTML = "2€";
        } else {
            document.getElementById("prix-boisson-" + indice).innerHTML = "2.50€";
        }
    }) 
}

function change_prix_pizza(document, indice) {
    if(indice !== 7) {
        document.querySelector(".select-pizza-" + indice).addEventListener("change", function(evt){
            if(evt.target.value === "1") {
                document.getElementById("prix-pizza-" + indice).innerHTML = "9€";
            } else if(evt.target.value === "2") {
                document.getElementById("prix-pizza-" + indice).innerHTML = "10€";
            } else if(evt.target.value === "3") {
                document.getElementById("prix-pizza-" + indice).innerHTML = "11€";
            } else {
                document.getElementById("prix-pizza-" + indice).innerHTML = "12€";
            }
        });
    }
}

function change_prix_taille_ingredient(document) {
    document.querySelector(".select-taille-ingredient").addEventListener("change", function(evt) {
        if(evt.target.value === "1") {
            document.getElementById("prix-ingredient-taille").innerHTML = "Taille : Small (6€).";
        } else if(evt.target.value === "2") {
            document.getElementById("prix-ingredient-taille").innerHTML = "Taille : Medium (7€).";
        } else if(evt.target.value === "3") {
            document.getElementById("prix-ingredient-taille").innerHTML = "Taille : Large (8€).";
        } else {
            document.getElementById("prix-ingredient-taille").innerHTML = "Taille : XLarge (9€).";
        }
        $(".section-pair-ingredient").show();
        $(".section-impair-ingredient").show();
    });
}

function change_prix_quantite_ingredient(document, indice) {
    document.querySelector("#select-ingredient-" + indice).addEventListener("change", function(evt) {

        var nb_ingredient = 0;
        for(let i=0; i<12; i++) {
            var element = document.getElementById('select-ingredient-' + i); 
            nb_ingredient += parseInt(element.options[element.selectedIndex].value, 10);
        }

        if(nb_ingredient > 3) {
            if(evt.target.value === "0") {
                document.getElementById("prix-ingredient-" + indice).innerHTML = "GRATUIT";
            } else if(evt.target.value === "1") {
                document.getElementById("prix-ingredient-" + indice).innerHTML = "1€";
            } else if(evt.target.value === "2") {
                document.getElementById("prix-ingredient-" + indice).innerHTML = "2€";
            } else {
                document.getElementById("prix-ingredient-" + indice).innerHTML = "3€";
            }
        }

        if(nb_ingredient >= 0 && nb_ingredient < 3) {
            for(let i=0; i<12; i++) {
                var element = document.getElementById('select-ingredient-' + i); 
                if(element.options[element.selectedIndex].value === "0") {
                    document.getElementById("prix-ingredient-" + i).innerHTML = "GRATUIT";
                }
            }
        } else {
            for(let i=0; i<12; i++) {
                var element = document.getElementById('select-ingredient-' + i);
                if(element.options[element.selectedIndex].value === "0") {
                    document.getElementById("prix-ingredient-" + i).innerHTML = "1€";
                }
            }
        }

        if(nb_ingredient > 3) {
            document.getElementById("prix-ingredient-quantite").innerHTML = "Nombre d'ingrédients supplémentaires : " + (nb_ingredient-3) + " (" + (nb_ingredient-3) + "€).";
            check_limite_ingredient();
        }
    });
}

function check_limite_ingredient() {
    var nb_ingredient = 0;
    for(let i=0; i<12; i++) {
        var element = document.getElementById('select-ingredient-' + i); 
        nb_ingredient += parseInt(element.options[element.selectedIndex].value, 10);
    }
    if(nb_ingredient < 7) {
        document.getElementById("prix-ingredient-final").disabled = false;
        $('.alert-warning').hide();
    } else {
        document.getElementById("prix-ingredient-final").disabled = true;
        $('.alert-warning').show();
    }
}

function check_Price() {
    if(document.getElementById('prix-total-panier').innerText === '0') {
        document.querySelector('.btn-panier-final').disabled = true;
    } else document.querySelector('.btn-panier-final').disabled = false;
}

function add_prix_total(value) {
    var p = document.getElementById('prix-total-panier').innerText;
    var new_prix = parseFloat(p) + parseFloat(value);
    document.getElementById('prix-total-panier').innerHTML = new_prix;
    check_Price();
}

function sub_prix_total(value) {
    var p = document.getElementById('prix-total-panier').innerText;
    var new_prix = parseFloat(p) - parseFloat(value);
    if(new_prix <= 0) new_prix = 0;
    document.getElementById('prix-total-panier').innerHTML = new_prix;
    check_Price();
}

function add_to_cart_entree(i) {
    $('.btn-panier-entree-' + i).click(function() {
        $.post("/add_to_cart", {
            plat: "entree",
            id: i,
            option: "",
            prix: 4
        });

        add_prix_total(4);
        alert("Votre article a bien été ajouté.");

        var nom = document.getElementById('nom-entree-' + i).innerText;
        $(".modal-body-panier").prepend('<div class="element-panier"><div class="flex-container"><img src="/medias/images/entrees/entree-' + i +'.png" width="75"><div id="description-panier"><p style="text-transform: uppercase;">' + nom + '</p><p>Supplément : #</p><p style="font-weight: bold;">4€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>');

        $('.btn-panier-remove').click(function() {
            $(this).closest('.element-panier').hide();
            $.post("/remove_to_cart", {
                plat: "entree",
                id: i,
                option: "",
                prix: 4
            });
            sub_prix_total(4);
            
        });
    });

    $('.btn-panier-entree-' + i + '-sauce').click(function() {
        var element = document.getElementById('select-entree-' + i);
        var value = element.options[element.selectedIndex].value;
        $.post("/add_to_cart", {
            plat: "entree",
            id: i,
            option: value,
            prix: 4
        });

        add_prix_total(4);
        alert("Votre article a bien été ajouté.");

        var nom = document.getElementById('nom-entree-' + i).innerText;
        var supp = element.options[element.selectedIndex].textContent;
        $(".modal-body-panier").prepend('<div class="element-panier"><div class="flex-container"><img src="/medias/images/entrees/entree-' + i +'.png" width="75"><div id="description-panier"><p style="text-transform: uppercase;">' + nom + '</p><p>Supplément : ' + supp + '</p><p style="font-weight: bold;">4€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>');

        $('.btn-panier-remove').click(function() {
            $(this).closest('.element-panier').hide();
            $.post("/remove_to_cart", {
                plat: "entree",
                id: i,
                option: value,
                prix: 4
            });
            sub_prix_total(4);
            
        });
    });
}

function add_to_cart_pizza(i) {
    $('.btn-panier-pizza-' + i).click(function() {
        var price = document.getElementById('prix-pizza-' + i).innerText;
        var p = price.substring(0, price.length-1);
        var element = document.getElementById('select-pizza-' + i);
        var taille = element.options[element.selectedIndex].textContent;
        var value = element.options[element.selectedIndex].value;
        $.post("/add_to_cart", {
            plat: "pizza",
            id: i,
            option: value,
            prix: p
        });

        add_prix_total(p);
        alert("Votre article a bien été ajouté.");

        var nom = document.getElementById('nom-pizza-' + i).innerText;
        $(".modal-body-panier").prepend('<div class="element-panier"><div class="flex-container"><img src="/medias/images/pizzas/pizza-' + i +'.png" width="75"><div id="description-panier"><p style="text-transform: uppercase;">' + nom + '</p><p>Supplément : ' + taille + '</p><p style="font-weight: bold;">' + p + '€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>');

        $('.btn-panier-remove').click(function() {
            $(this).closest('.element-panier').hide();
            $.post("/remove_to_cart", {
                plat: "pizza",
                id: i,
                option: value,
                prix: p
            });
            sub_prix_total(p);
            
        });
    });
}

function add_to_cart_boisson(i) {
    $('.btn-panier-boisson-' + i).click(function() {
        var price = document.getElementById('prix-boisson-' + i).innerText;
        var p = price.substring(0, price.length-1);
        var element = document.getElementById('select-boisson-' + i);
        var taille = element.options[element.selectedIndex].textContent;
        var value = element.options[element.selectedIndex].value;
        $.post("/add_to_cart", {
            plat: "boisson",
            id: i,
            option: value,
            prix: p
        });

        add_prix_total(p);
        alert("Votre article a bien été ajouté.");

        var nom = document.getElementById('nom-boisson-' + i).innerText;
        $(".modal-body-panier").prepend('<div class="element-panier"><div class="flex-container"><img src="/medias/images/boissons/boisson-' + i +'.png" width="75"><div id="description-panier"><p style="text-transform: uppercase;">' + nom + '</p><p>Supplément : ' + taille + '</p><p style="font-weight: bold;">' + p + '€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>');

        $('.btn-panier-remove').click(function() {
            $(this).closest('.element-panier').hide();
            $.post("/remove_to_cart", {
                plat: "boisson",
                id: i,
                option: value,
                prix: p
            });
            sub_prix_total(p);
            
        });
    });
}

function add_to_cart_compo() {
    $('#prix-ingredient-final').click(function() {
        var prix = 0;
        var option = [];
        for(let i=0; i<12; i++) {
            var element = document.getElementById('select-ingredient-' + i);
            var quantite = parseInt(element.options[element.selectedIndex].value, 10);
            prix += quantite;
            if(quantite != 0) {
                option.push([i, element.options[element.selectedIndex].value]);
            }
        }

        var element = document.getElementById('select-taille-ingredient');
        var taille = parseInt(element.options[element.selectedIndex].value, 10);
        prix += taille + 5;
        if(taille === 1) { option.push([12, 0]);
        } else if(taille === 2) { option.push([13, 0]);
        } else if(taille === 3) { option.push([14, 0]);
        } else { option.push([15, 0]); }

        $.post("/add_to_cart", {
            plat: "pizzaC",
            id: "Pizza composable",
            option: option,
            prix: prix
        });

        add_prix_total(prix);
        alert("Votre article a bien été ajouté.");

        var html = '<div class="element-panier"><div class="flex-container"><img src="/medias/images/pizzas/pizza-7.png" width="75"><div id="description-panier"><p style="text-transform: uppercase;">Pizza composable</p><p>Supplément : ';

        for(let k=0; k<option.length; k++) {
            if(option[k][0] === 0){ html += 'Sauce Tomate (' + option[k][1] + '),';
            } else if(option[k][0] === 1){ html += 'Mozarella (' + option[k][1] + '),';
            } else if(option[k][0] === 2){ html += 'Jambon (' + option[k][1] + '),';
            } else if(option[k][0] === 3){ html += 'Pepperoni (' + option[k][1] + '),';
            } else if(option[k][0] === 4){ html += 'Merguez (' + option[k][1] + '),';
            } else if(option[k][0] === 5){ html += 'Fromage râpée (' + option[k][1] + '),';
            } else if(option[k][0] === 6){ html += 'Champignons (' + option[k][1] + '),';
            } else if(option[k][0] === 7){ html += 'Poivrons (' + option[k][1] + '),';
            } else if(option[k][0] === 8){ html += 'Olives (' + option[k][1] + '),';
            } else if(option[k][0] === 9){ html += 'Tomates (' + option[k][1] + '),';
            } else if(option[k][0] === 10){ html += 'Boulettes de Boeuf (' + option[k][1] + '),';
            } else if(option[k][0] === 11){ html += 'Oignons (' + option[k][1] + '),';
            } else if(option[k][0] === 12){ html += 'Small,';
            } else if(option[k][0] === 13){ html += 'Medium,';
            } else if(option[k][0] === 14){ html += 'Large,';
            } else { html += 'XLarge,'; }
        }

        html += '</p><p style="font-weight: bold;">' + prix + '€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>';

        $(".modal-body-panier").prepend(html);

        $('.btn-panier-remove').click(function() {
            $(this).closest('.element-panier').hide();
            $.post("/remove_to_cart", {
                plat: "pizzaC",
                id: "Pizza composable",
                option: option,
                prix: prix
            });
            sub_prix_total(prix);
            
        });
    });
}




/*  AJOUTER LES INTERACTIONS  ******************************************************************************************/

$(document).ready(function () {

    if(window.location.href.indexOf("/accueil") > -1 || window.location.href.indexOf("/deconnexion") > -1) {

        var pizzas_predefinies = [
            [0, 1, 5],
            [0, 1, 2],
            [0, 1, 3],
            [0, 1, 4],
            [0, 6, 7],
            [0, 5, 9],
            [0, 1, 10]
        ]

        for(let i=0; i<12; i++) {
            document.getElementById("prix-ingredient-" + i).innerHTML = "GRATUIT";
        }

        for(let i=0; i<8; i++) {
            add_image_plat(i, 'entree');
            add_to_cart_entree(i);
            add_image_plat(i, 'pizza');
            change_prix_pizza(document, i);
            add_to_cart_pizza(i);
            add_image_plat(i, 'boisson');
            change_prix_boisson(document, i);
            add_to_cart_boisson(i);   
        }

        for(let i=0; i<12; i++) {
            add_image_plat(i, 'ingredient');
            change_prix_quantite_ingredient(document, i);
            $('.link-personnalisation-' + i).click(function() {
                $('.choix-taille').hide();
                show_menu_personnalisation();
                $(".section-pair-ingredient").show();
                $(".section-impair-ingredient").show();
                document.getElementById("prix-ingredient-taille").innerHTML = "Taille : Small (6€).";
                for(let j=0; j<3; j++) {
                    $('.choix-taille-' + pizzas_predefinies[i][j]).show();
                    document.querySelector('#select-ingredient-' + pizzas_predefinies[i][j]).value = '1';
                }
                for(let k=0; k<12; k++) {
                    document.getElementById("prix-ingredient-" + k).innerHTML = "1€";
                }
                check_limite_ingredient();
            });
        } 

        $('.link-personnalisation').click(function() {
            $(".section-pair-ingredient").hide();
            $(".section-impair-ingredient").hide();
            document.getElementById("prix-ingredient-taille").innerHTML = "Choisir la taille de la pizza.";
            document.getElementById("prix-ingredient-quantite").innerHTML = "Choisir les ingrédients. Jusqu'à 6 ingrédients maximum.";
            for(let k=0; k<12; k++) {
                document.querySelector('#select-ingredient-' + k).value = '0';
                document.getElementById("prix-ingredient-" + k).innerHTML = "GRATUIT";
            }
            $('.choix-taille').hide();
            check_limite_ingredient();
            show_menu_personnalisation();
        });
        change_prix_taille_ingredient(document);
        
        add_to_cart_compo();
    }
});