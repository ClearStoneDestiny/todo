
const todoInput = document.querySelector('.todoInput');
const todoBtn = document.querySelector('.addTask');
const taskList = document.querySelector('.list-items');
const message = document.querySelector('.message');

let task;
let localTasks = [];

let storedTasks = JSON.parse(localStorage.getItem('todo-list')) || [];

if(storedTasks.length > 0){
    storedTasks.forEach(todoItem => {
        addTaskToList(todoItem);
    });
}

localTasks = storedTasks.slice();

todoBtn.addEventListener('click', function(){
    addTask();
    message.innerText = 'Task created successfully';
    removeMessage();
});

todoInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        addTask();
        message.innerText = 'Task created successfully';
        removeMessage();
    }
})


function addTask(){
    if(todoInput.value === ''){
        message.innerText = 'Please enter your todo text!';
        return;
    }
    
    addTaskToList(todoInput.value);

    localTasks.push(todoInput.value);
    writeToDoToStorage();

    todoInput.value = '';
    message.innerText = '';

}


function addTaskToList(taskText){
    let li = document.createElement('li');
    let taskDiv = document.createElement('div');

    taskDiv.innerText = taskText;
    taskDiv.addEventListener('click', function(){
        completeTask(taskDiv);
    });

    let imgDiv = document.createElement('div');
    imgDiv.className = 'todo-images';

    let editImg = document.createElement('img');
    editImg.src = './img/pencil.png';
    editImg.alt = 'pencil';
    editImg.className = 'edit todo-controls';
    editImg.addEventListener('click', function(){
        updateTask(editImg);
    });

    let deleteImg = document.createElement('img');
    deleteImg.src = './img/trashcan1.png';
    deleteImg.alt = 'trashcan';
    deleteImg.className = 'delete todo-controls';
    deleteImg.addEventListener('click', function() {
        deleteTask(deleteImg);
    });

    imgDiv.appendChild(editImg);
    imgDiv.appendChild(deleteImg);

    li.appendChild(taskDiv);
    li.appendChild(imgDiv);
    taskList.appendChild(li);
}

function writeToDoToStorage(){
    localStorage.setItem('todo-list', JSON.stringify(localTasks));
}


function completeTask(element){
    console.log(element.parentElement);
    if(element.style.textDecoration === ''){
        element.style.textDecoration = 'line-through';
        element.style.color = '#9CA3BE';
    }
    else{
        element.style.textDecoration = '';
        element.style.color = '#000000';
    }
}

function saveUpdatedTask(element){
    let index = localTasks.findIndex(item => item === element.innerText);
    if(index !== -1){
        localTasks[index] = todoInput.value;
        if(localTasks[index] === ''){
            localTasks.splice(index, 1); 
        }
    }
    localStorage.setItem('todo-list', JSON.stringify(localTasks));

    element.parentElement.remove();
    message.innerText = 'Task updated!';
    todoBtn.setAttribute('src', './/img/plus.png');
    removeMessage();
}

function updateTask(e){
    task = e.parentElement.parentElement.querySelector('div');
    if(task.innerText !== ''){
        todoInput.value = task.innerText;

        todoBtn.onclick = function(){
            saveUpdatedTask(task);
        };
        
        todoInput.addEventListener('keypress', function(event){
            if(event.key === 'Enter'){
                saveUpdatedTask(task);
            }
        });

        todoBtn.src = './img/refresh.png';

        console.log(task.innerText);
    }
}

function deleteTask(e){

    const taskItem = e.parentElement.parentElement;
    taskItem.classList.add('deleted-item');

    taskItem.addEventListener('animationend', function() {
        taskItem.remove(); // Удаляем элемент из DOM после завершения анимации
        message.innerText = 'Task deleted';
        removeMessage();

        let deletedTaskText = taskItem.querySelector('div').innerText;
        localTasks = localTasks.filter(function(taskText){
            return taskText !== deletedTaskText;
        });
        writeToDoToStorage();
    });

    // e.parentElement.parentElement.remove();
    // message.innerText = 'Task deleted';
    // removeMessage();

    // e.parentElement.parentElement.setAttribute('class', 'deleted-item');
    
    // let deletedTaskText = e.parentElement.parentElement.querySelector('div').innerText;

    // localTasks = localTasks.filter(function(taskText){
    //     return taskText != deletedTaskText;
    // })
    // writeToDoToStorage();
}

function removeMessage(){
    message.classList.add('fade-out');
    setTimeout(function(){
        message.innerText = '';
        message.classList.remove('fade-out'); 
    }, 2000);
}

