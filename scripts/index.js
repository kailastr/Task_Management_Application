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
                <button type='button' class='btn btn-outline-info mr-2' name=${id}>
                    <i class='fas fa-pencil-alt' name =${id}></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id}>
                    <i class='fas fa-trash-alt' name =${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${url && `<img width='100%' src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
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
            ${url &&
        `<img width ='100%' src=${url} alt='task images' class='img-fluid place_holder_image mb-3' />`
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