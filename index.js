const Api = "https://691349d6f34a2ff1170b6cb0.mockapi.io/users";

const err = document.getElementById("showerror");
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const upbtn = document.getElementById("update-btn");
const cancelbtn = document.getElementById("cancel-btn");
const load = document.getElementById("load");
const updatebtnc = document.getElementById("updatebtnC");
const tasklist = document.getElementById("task-list");

let newid = null;
const showerror = (msg) => {
  err.style.display = "inline-block";
  err.textContent = msg;

  setTimeout(() => {
    err.style.display = "none";
  }, 3000);
};

// showerror("Something went wrong");

async function fetchTasks() {
  load.style.display = "inline-block";
  tasklist.innerHTML = "";
  try {
    const res = await fetch(Api);

    const tasks = await res.json();

    load.style.display = "none";

    if (tasks.length === 0) {
      tasklist.innerHTML = `<div>No tasks available</div>`;
    }

    tasks.forEach((x) => {
      const li = document.createElement("li");

      li.className = "list";

      li.innerHTML = `
       <div>
            <div id="task-content" class="task-content">${x.name}</div>

            <div id="id" class="id">${x.id}</div>
          </div>

          <div id="update-task" class="update-task">
           <button id="bt" class="bt" onclick="btn(this)"><svg width="20" height="20" viewBox="0 0 24 24"
     xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="5" r="1.5" fill="#333"/>
  <circle cx="12" cy="12" r="1.5" fill="#333"/>
  <circle cx="12" cy="19" r="1.5" fill="#333"/>
</svg>
</button>


            <button id="done" class="done" onclick ="editTask()">Done</button>
            <button id="edit" class="edit" onclick = "updateTask('${x.id}', '${x.name}')">Edit</button>
            <button id="Delete" class="Delete" onclick ="deletTask('${x.id}')">Delete</button>
           <button class ="xbtn" onclick = "closebtn(this)">✘</button>
          
          </div>

`;

      tasklist.appendChild(li);
    });
  } catch (error) {
    showerror("Unable to fetch data");
    load.style.display = "none";
  }
}

function btn(el) {
  const cl = el.parentElement.querySelectorAll(
    ".done , .edit , .Delete , .xbtn",
  );

  cl.forEach((x) => {
    x.style.display = "inline-block";
  });

  el.style.display = "none";
}

function closebtn(el) {
  const cls = el.parentElement.querySelectorAll(
    ".done , .edit , .Delete , .xbtn",
  );

  cls.forEach((x) => {
    x.style.display = "none";
  });

  const bt = el.parentElement.querySelector(".bt");
  bt.style.display = "inline-block";
}

//POST

async function createTask() {
  const name = taskInput.value;
  if (!name) {
    showerror("Plz Enter a task");
  }
  try {
    const res = await fetch(Api, {
      method: "POST",

      headers: { "content-Type": "application/json" },

      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      taskInput.value = "";
      fetchTasks();
    }
  } catch (error) {
    showerror("Unable to fetch data");
    load.style.display = "none";
  }
}

addBtn.addEventListener("click", () => {
  createTask();
});

// PUT

async function updateTask(id, name) {
  addBtn.style.display = "none";
  updatebtnc.style.display = "flex";

  newid = id;

  taskInput.value = name;

  taskInput.focus();
}

// Edit task

async function editTask() {
  try {
    const newName = taskInput.value;
    const res = await fetch(`${Api}/${newid}`, {
      method: "PUT",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      fetchTasks();

      taskInput.value = "";
    }
  } catch (error) {
    showerror("Unable to fetch data");
    load.style.display = "none";
  }
}

upbtn.addEventListener("click", () => {
  editTask();
});

cancelbtn.addEventListener("click", () => {
  updatebtnc.style.display = "none";

  addBtn.style.display = "inline-block";
});

// Delet

async function deletTask(id) {
  try {
    const res = await fetch(`${Api}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchTasks();
    }
  } catch (error) {
    showerror("Unable to fetch data");
    load.style.display = "none";
  }
}

fetchTasks();
