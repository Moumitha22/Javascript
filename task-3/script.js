const images = document.querySelectorAll(".images-container img");
const modal = document.querySelector(".modal");

let currentIndex = 0; // Track the current image index

images.forEach((image, index) => {
    image.addEventListener("click", () => {
        currentIndex = index; 
        openModal(currentIndex);
    });
});

function openModal(index) {
    modal.innerHTML = `
    <div class="modal-container">
        <div class="btn close-btn"><i class="fas fa-times"></i></div>
            <div class="btn prev-btn"><i class="fas fa-angle-left"></i></div>
            <img src="${images[index].src}" class="modal-img">
            <div class="btn next-btn"><i class="fas fa-angle-right"></i></div>
        </div>
    `;
    
    modal.classList.add("show")

    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => closeModal());

    const prevBtn = modal.querySelector(".prev-btn");
    prevBtn.addEventListener("click", () => changeImage(-1));

    const nextBtn = modal.querySelector(".next-btn");
    nextBtn.addEventListener("click", () => changeImage(1));
}

function closeModal() {
    modal.classList.remove("show")
    modal.innerHTML = ""; 
}

function changeImage(direction) {
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = images.length - 1; // To go to last image
    } else if (currentIndex >= images.length) {
        currentIndex = 0; // To go to first image
    }

    openModal(currentIndex);
}