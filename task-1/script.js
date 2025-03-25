let tasks = [];
const taskInput = document.getElementById('task-input');
const addTskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const emptyImage = document.querySelector('.empty-image');
const todosContainer = document.querySelector('.todos-container');
let editIndex = null;

const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
}

tasks = JSON.parse(localStorage.getItem('taskStore')) || [];
tasksLoad();

function saveTasks() {
  localStorage.setItem('taskStore', JSON.stringify(tasks));
}

function tasksLoad(){
    console.log(tasks); 
    taskList.innerHTML="";
    tasks.forEach((task,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span>${task}</span>
            <div class="task-buttons">
                <button class="edit-btn" onclick="editTask(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
         `;
        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();     
    });
}

// Adding Tasks
// function addTask(){
//     let taskText = taskInput.value.trim();
//     if(!taskText)
//         return;
//     tasks.push(taskText);
//     taskInput.value = '';
//     saveTasks();
//     tasksLoad();
// }

function addTask() {
    let task = taskInput.value.trim();
    if (!task) 
        return;

    if (editIndex !== null) {
        // Update existing task
        tasks[editIndex] = task;
        editIndex = null; 
        addTskBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`; 
    } else {
        // Add new task
        tasks.push(task);
    }

    taskInput.value = '';
    saveTasks();
    tasksLoad();
}
addTskBtn.addEventListener("click", addTask);
taskInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter'){
        addTask();
    }
})

//Deleting Tasks
function deleteTask(taskIndex){
    tasks.splice(taskIndex,1);
    saveTasks();
    tasksLoad();
    toggleEmptyState();
}

//Editing Tasks
// function editTask(taskIndex){
//     const newTask = prompt("Edit Task:",tasks[taskIndex]);
//     if(newTask !== null){
//         tasks[taskIndex] = newTask;
//         saveTasks();
//         tasksLoad();
//     }
// }

function editTask(taskIndex) {
    taskInput.value = tasks[taskIndex];
    editIndex = taskIndex; 
    addTskBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
}