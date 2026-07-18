const topSection = document.querySelector('#top-section')
const taskInput = document.querySelector('#task-input')
const taskList = document.querySelector('#task-list')
const taskSection = document.querySelector('#task-section')
const taskCheckbox = document.querySelectorAll('.task-checkbox')
const btn = document.querySelectorAll('.delete-btn')


let userData = JSON.parse(localStorage.getItem(('taskData'))) || []

function saveToLocalStorage(){
    localStorage.setItem('taskData', JSON.stringify(userData))
}



function renderTasks(){
    taskList.innerHTML = ''
    saveToLocalStorage()

    userData.forEach(task => {
        let status = ''
        let taskDone = ''
        if(task.done === true){
             status = 'checked'
             taskDone = 'task-done'
        }

        taskList.innerHTML +=
            `<li class="task-container" data-id='${task.Id}'>

                <input type="checkbox" class="task-checkbox" aria-label="task-checkbox" ${status}>
                <div class='task-text-container'>
                    <span class="task-text ${taskDone}">
                        ${task.text}
                    </span>
                </div>
                <button class="delete-btn" aria-label="delete-task">
                    <svg viewBox = "0 0 28 28">
                        <rect
                            x=0
                            y=0
                            width=28
                            height=28
                            fill="none"
                        />
                        <path 
                        d="
                        M 4,4
                        L 24,24
                        M 4,24
                        L 24,4
                        "
                        stroke=""
                        stroke-linecap="round"
                        stroke-width=2
                        />
                    </svg>
                </button>
                
            </li>`
    })

    if(userData.length === 0){
        taskList.innerHTML = `<p id="no-tasks">No tasks</p>`
        taskList.classList.add('task-list-no-tasks')
        return
    } else{
        taskList.classList.remove('task-list-no-tasks')
    }

}
renderTasks()

let currentId = JSON.parse(localStorage.getItem('currentId')) || 0


topSection.addEventListener('click', (e) => {

    let addBtn = e.target.closest('#add-task')


    // add the task and render the task array if add btn is clicked and input is not empty
       
    if(addBtn && taskInput.value.trim() !== ''){
        userData.push({
            text: taskInput.value,
            done:false,
            Id: currentId++
        })
        taskInput.value = ''
        console.log(userData)
        console.log()

        
        renderTasks()
    }

})


taskInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){

    // add the task and render the task array if input is not empty
       
    if(taskInput.value.trim() !== ''){
        userData.push({
            text: taskInput.value,
            done:false,
            Id: currentId++
        })
        localStorage.setItem('currentId', JSON.stringify(currentId))
        taskInput.value = ''
        console.log(userData)
        console.log()

        
        renderTasks()
    }
    }
})




document.addEventListener('click', (e) => {

    // Remove the task when delete button is clicked

    const delBtn = e.target.closest('.delete-btn')

    if(delBtn) {
       const task =  e.target.closest('.task-container')

        userData.forEach((data, index) => {
            if(data.Id === Number(task.dataset.id)){
                userData.splice(index, 1)
            }
        })

       renderTasks()
    }



    //Edit the task and save to local storage

    const taskText = e.target.closest('.task-text')
    const taskEdit = document.querySelector('.task-edit')

    if(taskText && !(taskText.classList.contains('task-done'))) {

        const existingEdit = taskSection.querySelector('.task-edit')

        if(existingEdit){
            const existingEditText = existingEdit.value
            const taskTextContainer = existingEdit.closest('.task-text-container')
            const taskContainer = existingEdit.closest('.task-container')

            if(existingEditText.trim() === '') {
                userData.forEach((data, index) => {
                    if (data.Id === Number(taskContainer.dataset.id)) {
                        userData.splice(index, 1)
                    }
                })
                renderTasks()
            } else {
                taskTextContainer.innerHTML = `<span class="task-text">${existingEditText}</span>`
                userData.forEach(data => {
                    if(data.Id === Number(taskContainer.dataset.id)){
                        data.text = existingEditText
                    }
                })
            }

            saveToLocalStorage()
        }


        const taskTextContainer = taskText.parentElement
        taskTextContainer.innerHTML = `<textarea class="task-edit" rows="1"></textarea>`

        const taskEdit = taskSection.querySelector('.task-edit')
        taskEdit.value = taskText.textContent.trim()

        taskEdit.focus()
        taskEdit.setSelectionRange(taskEdit.value.length, taskEdit.value.length)

        taskEdit.style.height = "auto"
        taskEdit.style.height = (taskEdit.scrollHeight ) + 'px'

        taskEdit.addEventListener("input", () => {
            taskEdit.style.height = "auto"
            taskEdit.style.height = (taskEdit.scrollHeight) + "px";
        });

        taskEdit.addEventListener('keydown', (e) => {
            if(e.key === 'Enter'){
                const newText = taskEdit.value
                const taskTextContainer = taskEdit.closest('.task-text-container')
                const taskCont = taskEdit.closest('.task-container')

                if(taskEdit.value.trim() === '') {
                        userData.forEach((data, index) => {
                            if(data.Id === Number(taskCont.dataset.id)){
                                userData.splice(index, 1)
                            }
                        })

                    renderTasks()
                    return
                }

                taskTextContainer.innerHTML = `
                    <span class="task-text">
                        ${newText}
                    </span>
                `

                userData.forEach(data => {
                    if(data.Id === Number(taskCont.dataset.id)){
                        data.text = newText
                    }
                })
                saveToLocalStorage()
            }
        })

        return
    }

    if(taskEdit && !(taskEdit.contains(e.target))){

        const newText = taskEdit.value
        const taskTextContainer = taskEdit.closest('.task-text-container')
        const taskCont = taskEdit.closest('.task-container')


        if(taskEdit.value.trim() === '') {
            userData.forEach((data, index) => {
                if(data.Id === Number(taskCont.dataset.id)){
                    userData.splice(index, 1)
                }
            })

            renderTasks()
        }

        taskTextContainer.innerHTML = `
            <span class="task-text">
                ${newText}
            </span>
        `

        userData.forEach(data => {
            if(data.Id === Number(taskCont.dataset.id)){
                data.text = newText
            }
        })
        saveToLocalStorage()
    }


        
    
   
})

taskSection.addEventListener('change', (e) => {
    let checkBox = e.target.closest('.task-checkbox')

    if(!checkBox) return

    const task =  e.target.closest('.task-container')
    let text = task.querySelector('.task-text')

    const dataTask = userData.find(dataTask => dataTask.Id === Number(task.dataset.id))

    //cross out the task if checkbox is checked

    if(checkBox.checked) {
        text.classList.add('task-done')
        dataTask.done = true
    } else {
        text.classList.remove('task-done')
        dataTask.done = false
    }
    saveToLocalStorage()
})


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(error => console.log(error));
    });
}