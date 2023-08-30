// console.error("sheryenna");

const state = {
    taskList: []
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal_body");

//to generate html code as task card we could use template literals (backticks)
const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
                    <i class='fas fa-pencil-alt' name =${id}></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)"> 
                <!-- here the onclick function is used to call that function when we click on the specific button. In this case since arrow functions doesnt support "this" object, we use ".apply" and using "this" we could get the current object and could pass all the arguments inside the functions using "arguments"-->
                    <i class='fas fa-trash-alt' name =${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${url
        ? `<img width='100%' height="250px" style="object-fit: cover; object-position: center" src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
        : `<img width='100%' height="250px" style="object-fit: cover; object-position: center" src="https://www.shutterstock.com/shutterstock/photos/1904598853/display_1500/stock-photo-tasks-word-on-wooden-cubes-on-a-beautiful-gray-background-business-concept-1904598853.jpg" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
    }
                <h4 class ='task__card__title'>${title}</h4>
                <p class='description trim-3-lines text-muted' data-gram-editor='false'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
            </div>
            <div class='card-footer'>
                <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='#showTask' id=${id} onclick='openTask.apply(this, arguments)'> Open Task</button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = ({ id, title, url, description }) => {
    const date = new Date(parseInt(id));
    return `
        <div id=${id}>
        ${url
            ? `<img width='100%' height="250px" style="object-fit: cover; object-position: center" src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            : `<img width='100%' height="250px" style="object-fit: cover; object-position: center" src="https://www.shutterstock.com/shutterstock/photos/1904598853/display_1500/stock-photo-tasks-word-on-wooden-cubes-on-a-beautiful-gray-background-business-concept-1904598853.jpg" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
        }
            <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
            <h2 class=''my-3>${title}</h2>
            <p class='lead'>${description}</p>
        </div>
    `;
};

//converting the object into string to save the datas in the browser's local Storage
const updateLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify({
        tasks: state.taskList,
    })
    );
};

//converting back to load the code in the browser
const LoadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks); //since the local storage itself acts as an object we should not have to specify "localStorage.getitem()" here

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate)); //"insertAdjacentHTML" helps us to insert HTML codes to a JS file
    });
};

//to save tasks when we press submit button in "Add New" modal section
const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById('imageUrl').value,
        title: document.getElementById('taskTitle').value,
        type: document.getElementById('taskType').value,
        description: document.getElementById('taskDescription').value
    };

    //we dont want to make a task card if any of the "add new" fields are empty for that :
    if (input.title === '' || input.type === '' || input.description === "") {
        return alert("Hey dumpoo.. Enter all the task Fields..")
    }

    taskContents.insertAdjacentHTML("beforeend",
        htmlTaskContent({
            ...input, //in the case of calling an object inside another object it will be like inner and outer object. By using "..." operator we could combine both objects or could call the object with extra keys and values into it
            id,
        })
    );

    state.taskList.push({ ...input, id });
    updateLocalStorage();
};

const openTask = (e) => {
    if (!e) {
        e = window.Event;
    }

    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask); //here it goes to the inner HTML of the second Modal and adds the required HTML present in the "htmlModalContent"
};

//function to delete task on the delete button
const deleteTask = (e) => {
    if (!e) e = window.Event;

    const targetID = e.target.getAttribute("name"); //using this method we could get the name of ID of the task card which the button for delete button is clicked in the targetID variable
    const type = e.target.tagName; //gives the type of the event (here in this case since there is an icon inside the button it could be the type of the icon (ie; I) or the type button)
    const removeTask = state.taskList.filter(({ id }) => id !== targetID);
    state.taskList = removeTask; //updating the taskList

    updateLocalStorage(); //updating the localStorage of the browser

    if (type === "BUTTON") { //if the type is button we should have to reach its 4th parent node and from there only we could remove the child(ie; the task card to be deleted) 
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    } //if the type is I (icon inside the button) we should have to reach its 4th parent (including the button as a parent) node and from there only we could remove the child(ie; the task card to be deleted)
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

//function to edit the task card
const editTask = (e) => {
    if (!e) e = window.Event;

    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    }
    else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1]

    //to give permission to the JS to edit the HTML codes
    taskTitle.setAttribute('contenteditable', 'true');
    taskDescription.setAttribute('contenteditable', 'true');
    taskType.setAttribute('contenteditable', 'true');

    submitButton.setAttribute('onClick', 'saveEdit.apply(this, arguments)'); //to save the edited things in the localstorage we have created a function here called "saveEdit"

    //while editing the task card to stop being the button direct to a modal we should remove the following two attributes from the button tag
    submitButton.removeAttribute('data-bs-toggle');
    submitButton.removeAttribute('data-bs-target');
    submitButton.innerHTML = "Update Changes"; //this will change the button text from Open task to Update changes

};

const saveEdit = (e) => {
    if (!e) e = window.Event;

    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML
    };

    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task) =>
        task.id === targetID ?
            {
                id: task.id,
                title: updateData.taskTitle,
                description: updateData.taskDescription,
                type: updateData.taskType,
                url: task.url
            } :
            task
    );

    state.taskList = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute('contenteditable', 'false');
    taskDescription.setAttribute('contenteditable', 'false');
    taskType.setAttribute('contenteditable', 'false');

    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");

    submitButton.setAttribute('data-bs-target', 'modal');
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
};

//to activate the search bar
const searchTask = (e) => {
    if (!e) e = window.Event;

    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);

    }

    const resultData = state.taskList.filter(({ title }) => {
        return title.toLowerCase().includes(e.target.value.toLowerCase());
    });

    // console.log(resultData);
    resultData.map((cardData) => {
        taskContents.insertAdjacentHTML('beforeend', htmlTaskContent(cardData));
    });
};