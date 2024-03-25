const taskCounter$ = document.getElementById("task-counter");

async function loadInitialCount() {
  const pendingCounter = await fetch("/api/tasks/pending").then((res) =>
    res.json()
  );
  taskCounter$.innerText = pendingCounter.length || 0;
}

function connectToWebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");

  socket.onmessage = (event) => {
    const { type, payload } = JSON.parse(event.data);

    console.log({ type, payload });

    if (type !== "on-task-count-changed") return;

    taskCounter$.innerText = payload;
  };

  socket.onclose = (event) => {
    console.log("Connection closed");
    setTimeout(() => {
      console.log("retrying to connect");
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log("Connected");
  };
}

// Init
loadInitialCount();
connectToWebSockets();
