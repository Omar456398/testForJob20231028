import { useEffect, useState } from "react";
import "./App.css";
import TaskDisplay from "./components/TaskDisplay";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [tasks, setTasks] = useState([]);
  const [reloadToggle, setReloadToggle] = useState(false);
  const [newTask, setNewTask] = useState("");
  useEffect(() => {
    (async () => {
      const resp = await fetch("http://localhost:3001/tasks");
      const respJSON = await resp.json();
      setTasks(respJSON.sort((a, b) => a.order - b.order));
    })();
  }, [reloadToggle]);

  const reload = () => {
    setReloadToggle((prev) => !prev);
  };
  const addTask = (e) => {
    e?.preventDefault?.();
    if (!newTask.trim()) {
      return alert("Please input task name");
    }
    const dataToAdd = {
      order: Math.floor(Math.max(0, ...tasks.map((item) => item.order))) + 1,
      name: newTask,
      isCompleted: false,
      id: uuidv4(),
    };
    console.log(dataToAdd);
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToAdd),
    }).then((item) => {
      setNewTask("");
      reload();
    });
  };
  return (
    <div className="App">
      <form>
        <div className="add_task_container">
          <div className="flex1">
            <input
              className="add_task_input"
              type="text"
              value={newTask}
              onChange={({ target: { value } }) => {
                setNewTask(value);
              }}
            />
          </div>
          <div>
            <input type="submit" className="add_task" onClick={addTask} value={'add new task'} />
          </div>
        </div>
      </form>
      {tasks.map((item) => {
        return (
          <TaskDisplay
            key={item.id}
            id={item.id}
            name={item.name}
            isCompleted={item.isCompleted}
            reload={reload}
          />
        );
      })}
    </div>
  );
}

export default App;
