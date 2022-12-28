function check_Price() {
    if(document.getElementById('prix-total-panier').innerText === '0') {
        document.querySelector('.btn-panier-final').disabled = true;
    } else document.querySelector('.btn-panier-final').disabled = false;
}

function show_menu_entrees() {
    $('#section-main-contenu').hide();
    $('#section-main-contenu-personnalisation').hide();
    $('#pizzas').hide();
    $('#boissons').hide();
    $('#section-main-menu').hide();
    $('.bg-img-homepage').show();
    $('#entrees').show();
    $('#section-main-contenu-carte').show();
}

function show_menu_pizzas() {
    $('#section-main-contenu').hide();
    $('#section-main-contenu-personnalisation').hide();
    $('#entrees').hide();
    $('#boissons').hide();
    $('#section-main-menu').hide();
    $('.bg-img-homepage').show();
    $('#pizzas').show();
    $('#section-main-contenu-carte').show();
}

function show_menu_boissons() {
    $('#section-main-contenu').hide();
    $('#section-main-contenu-personnalisation').hide();
    $('#entrees').hide();
    $('#pizzas').hide();
    $('#section-main-menu').hide();
    $('.bg-img-homepage').show();
    $('#boissons').show();
    $('#section-main-contenu-carte').show();
}

function show_menu_personnalisation() {
    $('.bg-img-homepage').hide();
    $('#section-main-contenu').hide();
    $('#section-main-contenu-carte').hide();
    $('#section-main-menu').hide();
    $('#section-main-contenu-personnalisation').show();
}

function show_menu() {
    $('#section-main-contenu').hide();
    $('#section-main-contenu-personnalisation').hide();
    $('#entrees').hide();
    $('#pizzas').hide();
    $('#boissons').hide();
    $('#section-main-menu').hide();
    $('.bg-img-homepage').show();
    $('#section-main-menu').show();
    $('#menu-EM-affichage').show();
}

function indexOfMenu(menu_comp, elm) {
    for(let i=0; i<menu_comp.length; i++) {
        if(menu_comp[i][0] === elm[0]) {
            if(menu_comp[i][1] === elm[1]) {
                if(menu_comp[i][2] === elm[2]) {
                    return i;
                }
            }
        }
    }
    return -1;
}



$(document).ready(function () {


    /*  ACCUEIL ET BOUTONS *********************************************************************************************/

    $('.btn-panier-remove').click(function() {
        $(this).closest('.element-panier').hide();
        var i = $('.element-panier').index($(this).closest('.element-panier'));

        var prix = 0.0;
        for(let i=0; i<($('.element-panier').length); i++) {
            var element = document.getElementsByClassName('element-panier');
            if(element[i].style.display != 'none') {
                var description = document.getElementsByClassName('prix-element');
                prix += parseFloat(description[i].innerText.substring(0, description[i].innerText.length-1));
            }
        }
        document.getElementById('prix-total-panier').innerHTML = prix;
        check_Price();

        $.post("/remove_to_cart_2", {
            index: i
        });
    });
    
    $('.choix-sauce').hide();
    $('.choix-taille').hide();
    $(".choix-button").click(function () { $(this).next().fadeIn(); });




    /*  PROFIL ET FORMULAIRES  *****************************************************************************************/

    $("#button1-modal").click(function () {
        $('#form-modal-nom').css({ display: "inline"});
        $('#form-modal-prenom').css({ display: "inline"});
        $('#form-modal-adresse').css({ display: "none" });
    });

    $("#button2-modal").click(function() {
        $('#form-modal-nom').css({ display: "none"});
        $('#form-modal-prenom').css({ display: "none"});
        $('#form-modal-adresse').css({ display: "inline"});
    });




    /*  PAGE DU LIVREUR  ***********************************************************************************************/

    if(window.location.href.indexOf("/accueil_livreur") > -1) {
        $('#btn-livraison-eff').click(function() {
            $.post("/update_livraison", { });
            location.reload();
        });
    }

    if(window.location.href.indexOf("/accueil") > -1 || window.location.href.indexOf("/deconnexion") > -1) {
        if(window.location.href.indexOf("/accueil") > -1) check_Price();

        $('#section-main-contenu-carte').hide();
        $('#section-main-contenu-personnalisation').hide();
        $('#section-main-menu').hide();

        $('#nav-la-carte').click(function () { show_menu_entrees(); });
        $('.menu-entrees-link').click(function () { show_menu_entrees(); });
        $('.menu-pizzas-link').click(function () { show_menu_pizzas(); });
        $('.menu-boissons-link').click(function () { show_menu_boissons(); });

        var menu_quantite;

        $('.menu-EM-link').click(function () {
            show_menu();
            menu_quantite = [1, 1, 1];

            $('.add-card-menu').click(function () {
                $.post("/add_to_cart", {
                    plat: "menu",
                    id: 1,
                    option: menu_comp,
                    prix: 10
                });
                add_prix_total(10);
                alert("Votre article a bien été ajouté.");

                var html = '<div class="element-panier"><div class="flex-container"><img src="/medias/images/menu-EM.png" alt="image_EM" width="75"><div id="description-panier"><p style="text-transform: uppercase;">Menu</p><p>Supplément : 1 entrée, 1 pizza Médium, 1 boissons de 33cL</p><p style="font-weight: bold;">10€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>';
                $(".modal-body-panier").prepend(html);

                $('.btn-panier-remove').click(function() {
                    $(this).closest('.element-panier').hide();
                    $.post("/remove_to_cart", {
                        plat: "menu",
                        id: 1,
                        option: menu_comp,
                        prix: 10
                    });
                    sub_prix_total(10);
                });
            });
        });

        $('.menu-MM-link').click(function () {
            show_menu();
            menu_quantite = [1, 2, 1];

            $('.add-card-menu').click(function () {
                $.post("/add_to_cart", {
                    plat: "menu",
                    id: 2,
                    option: menu_comp,
                    prix: 28
                });
                add_prix_total(28);
                alert("Votre article a bien été ajouté.");

                var html = '<div class="element-panier"><div class="flex-container"><img src="/medias/images/menu-MM.png" alt="image_menu" width="75"><div id="description-panier"><p style="text-transform: uppercase;">Menu</p><p>Supplément : 1 entrée, 2 pizzas Médium, 1 boisson d’1l</p><p style="font-weight: bold;">28€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>';
                $(".modal-body-panier").prepend(html);

                $('.btn-panier-remove').click(function() {
                    $(this).closest('.element-panier').hide();
                    $.post("/remove_to_cart", {
                        plat: "menu",
                        id: 2,
                        option: menu_comp,
                        prix: 28
                    });
                    sub_prix_total(28);
                });
            });
        });

        $('.menu-GM-link').click(function () {
            show_menu();
            menu_quantite = [2, 2, 2];

            $('.add-card-menu').click(function () {
                $.post("/add_to_cart", {
                    plat: "menu",
                    id: 3,
                    option: menu_comp,
                    prix: 23
                });
                add_prix_total(23);
                alert("Votre article a bien été ajouté.");

                var html = '<div class="element-panier"><div class="flex-container"><img src="/medias/images/menu-GM.png" alt="image_menu" width="75"><div id="description-panier"><p style="text-transform: uppercase;">Menu</p><p>Supplément : 2 entrées, 2 pizzas Large, 2 boisson d’1l</p><p style="font-weight: bold;">23€</p></div><button class="button btn-panier-remove" style="height: 50px;"><i class="bi-x"></i></button></div><div class="separator"></div></div>';
                $(".modal-body-panier").prepend(html);

                $('.btn-panier-remove').click(function() {
                    $(this).closest('.element-panier').hide();
                    $.post("/remove_to_cart", {
                        plat: "menu",
                        id: 3,
                        option: menu_comp,
                        prix: 23
                    });
                    sub_prix_total(23);
                });
            });
        });

        var nb_e = 0;
        var nb_p = 0;
        var nb_b = 0;

        var menu_comp = [];

        for(let i=0; i<8; i++) {
            $('.add-entree-' + i + '-menu').click(function () {
                if(nb_e != menu_quantite[0]) {
                    $(this).hide();
                    $(this).next().show();
                    var element = document.getElementById('select-entree-' + i);
                    if(element == null) {
                        menu_comp.push(['entree', i, '']);
                    } else {
                        var value = element.options[element.selectedIndex].value;
                        menu_comp.push(['entree', i, value]);
                    }
                    nb_e += 1;
                }
            });

            $('.remove-entree-' + i + '-menu').click(function () {
                $(this).hide();
                $('.add-entree-' + i + '-menu').show();
                var element = document.getElementById('select-entree-' + i);
                if(element == null) {
                    var index = indexOfMenu(menu_comp, ['entree', i, '']);
                    menu_comp.splice(index, 1);
                } else {
                    var value = element.options[element.selectedIndex].value;
                    var index = indexOfMenu(menu_comp, ['entree', i, value]);
                    menu_comp.splice(index, 1);
                }
                nb_e -= 1;
            });

            $('.add-pizza-' + i + '-menu').click(function () {
                if(nb_p != menu_quantite[1]) {
                    $(this).hide();
                    $('.remove-pizza-' + i + '-menu').show();
                    menu_comp.push(['pizza', i, 2]);
                    nb_p += 1;
                }
            });

            $('.remove-pizza-' + i + '-menu').click(function () {
                $(this).hide();
                $('.add-pizza-' + i + '-menu').show();
                var index = indexOfMenu(menu_comp, ['pizza', i, 2]);
                menu_comp.splice(index, 1);
                nb_p -= 1;
            });

            $('.add-boisson-' + i + '-menu').click(function () {
                if(nb_b != menu_quantite[2]) {
                    $(this).hide();
                    $('.remove-boisson-' + i + '-menu').show();
                    menu_comp.push(['boisson', i, 2]);
                    nb_b += 1;
                }
            });

            $('.remove-boisson-' + i + '-menu').click(function () {
                $(this).hide();
                $('.add-boisson-' + i + '-menu').show();
                var index = indexOfMenu(menu_comp, ['boisson', i, 2]);
                menu_comp.splice(index, 1);
                nb_b -= 1;
            });
        }
    }
});