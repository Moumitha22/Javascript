const container = document.getElementById("color-container");
const loading = document.getElementById("loading");

const colorsPerLoad = 10; // Number of colors per fetch
let isLoading = false;

// Fetch colors from API
async function fetchColors() {
    if (isLoading)  // Prevent multiple calls
        return;
    
    isLoading = true;
    loading.style.display = "block"; // Show loading indicator

    try {
        const response = await fetch(`https://random-flat-colors.vercel.app/api/random?count=10`);
        const data = await response.json();

        // If no colors are available, remove the scroll listener
        if (data.colors && data.colors.length === 0) {
            window.removeEventListener('scroll', handleScroll);  
            return; 
        }

        if (data.colors) {
            data.colors.forEach(color => {
                const box = document.createElement("div");
                box.classList.add("color-box");
                box.style.backgroundColor = color;
                box.textContent = color;
                container.appendChild(box);
            });
        }

    } catch (error) {
        console.error("Error fetching colors:", error);
    } finally {
        loading.style.display = "none"; // Hide loading indicator
        isLoading = false;
    }
}

function isNearBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
}

function handleScroll() {
    if (isNearBottom()) {
        fetchColors();
    }
}

// Detect scroll near bottom & load more colors
window.addEventListener("scroll", handleScroll);

// Load first 10 colors
fetchColors();
