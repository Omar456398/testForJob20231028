import { useEffect, useRef, useState } from "react";
import "./App.css";
import TaskDisplay from "./components/TaskDisplay";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [tasks, setTasks] = useState([]);
  const [reloadToggle, setReloadToggle] = useState(false);
  const [newTask, setNewTask] = useState("");
  const dragItem = useRef();
  const dragOverItem = useRef();
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("http://localhost:3001/tasks");
        const respJSON = await resp.json();
        setTasks(respJSON.sort((a, b) => a.order - b.order));
      } catch(err) {
        alert('error connecting to server, please reload page')
      }
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
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToAdd),
    }).then(() => {
      setNewTask("");
      reload();
    });
  };
  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragOver = (e, position) => {
    dragOverItem.current = position;
  };
  const dragAway = (e, position) => {
    dragOverItem.current = undefined;
  };
  const drop = (e) => {
    if (dragOverItem.current) {
      const currentDragItem = dragItem.current;
      const currentDragOverItem = dragOverItem.current;
      const currentDragItemOrder = tasks.find(
        (item) => (item.id === currentDragItem)
      ).order;
      const currentDragOverItemOrder = tasks.find(
        (item) => (item.id === currentDragOverItem)
      ).order;

      if (currentDragItemOrder !== currentDragOverItemOrder) {
        let newDragItemOrder = currentDragOverItemOrder;
        let increment = 1
        if(currentDragItemOrder > currentDragOverItemOrder) {
          increment = -1
        }
        while((newDragItemOrder + increment) <= 0 || tasks.find(item => item.order === newDragItemOrder + increment)) {
          increment /= 10
        }
        newDragItemOrder += increment
        fetch(`http://localhost:3001/tasks/${currentDragItem}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newDragItemOrder }),
        }).then(() => {
          reload();
        });
      }
    }
    dragOverItem.current = undefined;
    dragItem.current = undefined;
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
            <input
              type="submit"
              className="add_task"
              onClick={addTask}
              value={"add new task"}
            />
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
            dragStart={dragStart}
            dragOver={dragOver}
            dragAway={dragAway}
            refDraggedOver={dragOverItem}
            drop={drop}
          />
        );
      })}
    </div>
  );
}

export default App;
