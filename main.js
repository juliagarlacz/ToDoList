document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById("click");
    const modal = document.getElementById("modal");
    const closeModalButton = document.getElementById("closeModal");
    

    openButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    closeModalButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    const addButton = document.getElementById("addTaskBtn");
    const newTaskInput = document.getElementById("newTask");
    const statusSelect = document.getElementById("status");
    const textArea = document.getElementById("text");
    const taskListToDo = document.querySelector(".to-do .tasks");
    let tasksArray = [];

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasksArray = JSON.parse(storedTasks);
        updateTaskList();
    }
    

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        const newTask = newTaskInput.value;
        const priority = statusSelect.value;
        const selectedStatusButton = document.querySelector(".progress button.selected");
        const status = selectedStatusButton.getAttribute("data-status");
        const description = textArea.value;

        if (newTask.trim() !== "") {
            const taskObject = {
                id: Date.now(),
                task: newTask,
                priority: priority,
                description: description,
            };

            tasksArray.push(taskObject);
            localStorage.setItem("tasks", JSON.stringify(tasksArray));
            console.log(tasksArray);

            newTaskInput.value = "";
            statusSelect.value = "low";
            textArea.value = "";
            modal.style.display = "none";
            updateTaskList();
        }
    });


    function updateTaskList() {
        taskListToDo.innerHTML = "";
        for (const taskObject of tasksArray) {
            const taskCard = createTaskCard(taskObject);
            taskListToDo.appendChild(taskCard);
        }
    }

    function createTaskCard(taskObj) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.id = taskObj.id;
        taskCard.draggable = true


        let showDescription = false;

        function updateCardContent() {
            taskCard.innerHTML = `
                <div class="mainTask">
                    <div class="task-header">
                        <p><b>Task:</b> ${taskObj.task}</p>
                        <div class="emoji">
                            <i class="fas fa-trash deleteIcon"></i>
                            <i class="fas fa-edit"></i>
                        </div>
                    </div>
                    <p><b>Priority:</b> ${taskObj.priority}</p>
                    ${
                        taskObj.description && showDescription
                            ? `<p><b>Description:</b> ${taskObj.description}</p>`
                            : ""
                    }
                </div>
            `;

            taskCard.classList.add("task-card");
        }
        

        updateCardContent();

        taskCard.addEventListener("click", (event) => {
            if (event.target.classList.contains("deleteIcon") || event.target.classList.contains("fa-edit")) {
                return;
            }
            showDescription = !showDescription;
            updateCardContent();
        });

        return taskCard;
    }
    const taskCards = document.querySelectorAll(".task-card");
    const progressDiv = document.querySelector(".in-progress")
    const compeleteDiv = document.querySelector(".compelete")


    taskCards.forEach(card => {
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragend", dragEnd);
        card.addEventListener("dragover", dragOver);
        card.addEventListener("dragenter", dragEnter);
        card.addEventListener("drop", drop);
    });


    let draggedCard = null;


    
    function dragStart(event) {
        draggedCard = this;
        setTimeout(() => {
            this.style.opacity = "0.4";
        }, 0);
    }

    function dragEnd() {
        draggedCard.style.opacity = "1";
        draggedCard = null;
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dragEnter(event) {
        event.preventDefault();
    }


    function drop() {
        if (draggedCard) {
            const newCardOrder = Array.from(this.parentNode.children).indexOf(this);
            const draggedCardOrder = Array.from(this.parentNode.children).indexOf(draggedCard);

            if (newCardOrder !== -1 && draggedCardOrder !== -1) {
                if (newCardOrder > draggedCardOrder) {
                    this.parentNode.insertBefore(draggedCard, this.nextSibling);
                } else {
                    this.parentNode.insertBefore(draggedCard, this);
                }

                const taskId = parseInt(draggedCard.id);
                const taskIndex = tasksArray.findIndex(item => item.id === taskId);

                if (taskIndex !== -1) {
                    tasksArray[taskIndex].order = newCardOrder;
                    localStorage.setItem("tasks", JSON.stringify(tasksArray));
                }
            }
        }
    }

    progressDiv.addEventListener("dragover", function(event){
        event.preventDefault();
    });
    
    progressDiv.addEventListener("drop", function(event){
        event.preventDefault();
        if (draggedCard) {
            progressDiv.appendChild(draggedCard);
        }
    });
    
    toDoDiv.addEventListener("dragover", function(event){
        event.preventDefault();
    });
    
    toDoDiv.addEventListener("drop", function(event){
        event.preventDefault();
        if (draggedCard) {
            toDoDiv.appendChild(draggedCard);
        }
    });


    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("deleteIcon")) {
            const taskCard = event.target.closest(".task-card");
            if (taskCard) {
                const taskId = parseInt(taskCard.id);
                const indexToRemove = tasksArray.findIndex(item => item.id === taskId);
                if (indexToRemove !== -1) {
                    tasksArray.splice(indexToRemove, 1);
                    updateTaskList();
                }
            }
        }

        else if (event.target.classList.contains("fa-edit")) {
            const taskCard = event.target.closest(".task-card");
            const taskId = taskCard.id;
            const taskIndex = tasksArray.findIndex(item => item.id === parseInt(taskId));
            
            if (taskIndex !== -1) {
                const taskToEdit = tasksArray[taskIndex];
        
                const changeTaskBtn = document.getElementById("changeTaskBtn");
                const addButton = document.getElementById("addTaskBtn");
        
                newTaskInput.value = taskToEdit.task;
                statusSelect.value = taskToEdit.priority;
                textArea.value = taskToEdit.description;
        
                changeTaskBtn.style.display = "block"; 
                addButton.style.display = "none"; 
        
                modal.style.display = "block";
        
                changeTaskBtn.addEventListener("click", (event) => {
                    event.preventDefault(); 
        
                    taskToEdit.task = newTaskInput.value;
                    taskToEdit.priority = statusSelect.value;
                    taskToEdit.description = textArea.value;
                    localStorage.setItem("tasks", JSON.stringify(tasksArray));
             
                    updateTaskList();
        
                    modal.style.display = "none";
        
                    addButton.style.display = "block";
                    changeTaskBtn.style.display = "none";
                    newTaskInput.value = "";
                    statusSelect.value = "low";
                    textArea.value = "";
                    modal.style.display = "none";
                    updateTaskList();
                });
            }
        }
    });
});
