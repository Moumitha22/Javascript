const routes = {
    home: "<h2>Welcome to Home Page</h2><p>This is the home section.</p>",
    about: "<h2>About Us</h2><p>Learn more about us.</p>",
    contact: "<h2>Contact Us</h2><p>Get in touch with us here.</p>",
    services: "<h2>Services</h2><p>We offer a variety of services.</p>"
};

function loadContent() {
    const hash = location.hash.substring(1); 
    
    const content = document.getElementById("content");
    content.innerHTML = routes[hash] || routes.home;

    document.querySelectorAll("nav a").forEach(link => {
        link.classList.remove("active"); 
        if (link.getAttribute("href") === `#${hash}`) {
            link.classList.add("active"); 
        }
    });
}

window.addEventListener("hashchange", loadContent);
window.addEventListener("load", loadContent);
