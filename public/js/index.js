const newTaskContainer$ = document.getElementById("new-task");
const btnCreate$ = document.getElementById("btn-create");

async function handleNewTask() {
  const newTask = {
    title: crypto.randomUUID(),
    description: "description",
    status: "PENDING",
  };

  const createdTask = await fetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(newTask),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  newTaskContainer$.innerHTML = JSON.stringify(createdTask, null, 2);
}

btnCreate$.addEventListener("click", handleNewTask);
