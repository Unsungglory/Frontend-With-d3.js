// MENU OPEN
function toggleMainMenu() {
    document.getElementById("nav-container").classList.toggle("blur");
    document.getElementById("menu-system").classList.toggle("menu-on");
    document.getElementById("menu-icon-ani").classList.toggle("menu-icon-rotate");
    document.getElementById("line-a").classList.toggle("line-rotate-l");
    document.getElementById("line-a").classList.toggle("icon-line");
    document.getElementById("line-b").classList.toggle("line-off");
    document.getElementById("line-c").classList.toggle("line-rotate-r");
    document.getElementById("line-c").classList.toggle("icon-line");
    document.getElementById("menu-links-ani").classList.toggle("opacity-on");
    document.getElementById("menu-logo-ani").classList.toggle("opacity-on");
    document.getElementById("tiles-ani").classList.toggle("opacity-on");
};

function closeMenu() {
    if (document.getElementById('menu-logo-ani').classList.value.includes('opacity-on'))
        toggleMainMenu(); // close menu

    else {
        setTimeout(() => {
            if (document.getElementById('menu-links-ani').classList.value.includes('opacity-on'))
                toggleMainMenu(); // close menu
        }, 100);
    }
}

