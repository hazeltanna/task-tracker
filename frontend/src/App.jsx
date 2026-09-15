import { useEffect, useState } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";
function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(
  `${API_URL}/tasks`
);

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, []);

  async function addTask() {
    if (task.trim() === "") return;

    try {
      const response = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: task }),
        }
      );

      const newTask = await response.json();

      setTasks([...tasks, newTask]);
      setTask("");
    } catch (error) {
      console.error(error);
      alert("Could not save task");
    }
  }

  async function toggleTask(id) {
    const currentTask = tasks.find((item) => item.id === id);

    try {
      const response = await fetch(
        `${API_URL}/tasks/${currentTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !currentTask.completed,
          }),
        }
      );

      const updatedTask = await response.json();

     const updatedTasks = tasks.map((item) =>
  item.id === id ? updatedTask : item
);

setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
      alert("Could not update task");
    }
  }

  async function deleteTask(id) {
  const currentTask = tasks.find((item) => item.id === id);

    try {
      await fetch(
        `${API_URL}/tasks/${currentTask.id}`,
        {
          method: "DELETE",
        }
      );

      setTasks(tasks.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Could not delete task");
    }
  }

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length;

  const activeTasks = tasks.length - completedTasks;
  const filteredTasks = tasks.filter((item) => {
  if (filter === "active") return !item.completed;
  if (filter === "completed") return item.completed;
  return true;
});

  return (
    <div className="app">
      <div className="container">

        <header>
          <p className="eyebrow">TASK MANAGER</p>
          <h1>Get things done.</h1>
          <p className="subtitle">
            Keep track of what needs to be done.
          </p>
        </header>

        <div className="input-section">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button onClick={addTask}>
            Add task
          </button>
        </div>

        <div className="stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total</span>
          </div>

          <div>
            <strong>{activeTasks}</strong>
            <span>Active</span>
          </div>

          <div>
            <strong>{completedTasks}</strong>
            <span>Completed</span>
          </div>
        </div>
        <div className="filters">
  <button
    className={filter === "all" ? "active-filter" : ""}
    onClick={() => setFilter("all")}
  >
    All ({tasks.length})
  </button>

  <button
    className={filter === "active" ? "active-filter" : ""}
    onClick={() => setFilter("active")}
  >
    Active ({activeTasks})
  </button>

  <button
    className={filter === "completed" ? "active-filter" : ""}
    onClick={() => setFilter("completed")}
  >
    Completed ({completedTasks})
  </button>
</div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet.</p>
              <span>Add something above to get started.</span>
            </div>
          ) : (
            filteredTasks.map((item, index) => (
              <div
                className={`task-card ${
                  item.completed ? "completed" : ""
                }`}
                key={item.id}
              >
                <div className="task-left">
                  <button
                    className="checkbox"
                    onClick={() => toggleTask(item.id)}
                  >
                    {item.completed ? "✓" : ""}
                  </button>

                  <span className="task-text">
                    {item.text}
                  </span>
                </div>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default App;