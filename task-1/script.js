let tasks = [];
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const emptyImage = document.querySelector('.empty-image');
const todosContainer = document.querySelector('.todos-container');
const progressBar = document.getElementById('progress');
const progressCount = document.getElementById('count');
let editIndex = null;

const getTasks = () => {
    const todosJson = localStorage.getItem('tasks') || "[]";
    return JSON.parse(todosJson);
}

const saveTasks = () => {
    const todosJson = JSON.stringify(tasks)
    localStorage.setItem('tasks', todosJson);
}

const updateProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress =  (completedTasks/ totalTasks) * 100;
    progressBar.style.width = totalTasks ? `${progress}%` : '0%';
    progressCount.textContent = `${completedTasks} / ${totalTasks}` ;

    if(totalTasks > 0 && completedTasks === totalTasks){
        blastConfetti();
    }
};

const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
}

const toggleTaskComplete = (taskIndex) => {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks(); 
    updateTodoList();
}

const updateTodoList = () => {
    taskList.innerHTML = "";
    tasks.forEach((task,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn" onclick="editTask(${index})"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        if(task.completed){
            li.classList.add('completed');
        }

        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", () => toggleTaskComplete(index));

        taskList.appendChild(li);
        toggleEmptyState();   
    });
    updateProgress();  
}

// Add / edit task
const addTask = () => {
    let taskText = taskInput.value.trim();
    
    if(!taskText)
        return;

    if(editIndex !== null){
         // Update existing task
        tasks[editIndex].taskText = taskText;
        editIndex = null; 
        addTaskBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    }
    else{
        // Add new task
        tasks.push({taskText: taskText, completed: false });    
    }
     
    saveTasks();
    updateTodoList();
    taskInput.value = '';
}


const deleteTask = (taskIndex) => {
    tasks.splice(taskIndex,1);
    saveTasks();
    updateTodoList();
    toggleEmptyState();
}

const editTask = (taskIndex) =>{
    if(!tasks[taskIndex].completed){
        taskInput.value = tasks[taskIndex].taskText;
        editIndex = taskIndex; 
        addTaskBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    }
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter'){
        addTask();
    }
})

const  blastConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
}

tasks = getTasks();
updateTodoList();