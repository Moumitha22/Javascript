const list = document.querySelector(".draggable-list");
const items = list.querySelectorAll(".list-item");

let draggedItem = null;

items.forEach(item => {
    item.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        e.target.classList.add("dragging");
    });
    item.addEventListener("dragend",  (e) => {
        e.target.classList.remove("dragging");
        draggedItem = null;
    });
});

list.addEventListener("dragover", (e) => {
    e.preventDefault();
    
    const afterElement = getDragAfterElement(list, e.clientY); // e.clientY → The vertical position of the mouse while dragging.
    if (afterElement == null) {
        list.appendChild(draggedItem);  // Move dragged item to the last if no element below
    } else { 
        list.insertBefore(draggedItem, afterElement); // Insert before the closest item
    }
});

// Function to get the closest element to place the dragged item before
function getDragAfterElement(container, y) { // y → The vertical position of the mouse while dragging.

    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")]; // [... ] spreads the NodeList into an array, allowing us to use .reduce()

    return draggableElements.reduce((closest, child) => {
        // closest → stores the item that is closest to where we are dragging          
        //  child →  current li item

        const box = child.getBoundingClientRect(); 
        const offset = y - box.top - box.height / 2;
        // box.top → Distance from the top of the screen to the list item.
        // box.height → Height of the list item.


        // If offset is negative, the dragged item is above this list item.
        // If offset is positive, the dragged item is below this list item.
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }; // Sets new closest list item below.
        } else {
            return closest; // Keeps the previous closest.
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
    //  Initially, element is null & offset is Number.NEGATIVE_INFINITY 
    // Number.NEGATIVE_INFINITY is the lowest possible value in JS, so that any valid offset will be larger than it.
    //.element returns only the element from the object returned by reduce function -> {offset: , element:}
}
