import { useEffect, useRef, useState } from "react";
import TaskDisplay from "./TaskDisplay";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";

function AppMain() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [reloadToggle, setReloadToggle] = useState(false);
  const [newTask, setNewTask] = useState("");
  const dragItem = useRef();
  const dragOverItem = useRef();
  const history = useHistory();

  useEffect(() => {
    try {
      if (!localStorage.getItem("accessToken")) {
        throw new Error("");
      }
      const decoded = jwtDecode(localStorage.getItem("accessToken"));
      if (decoded.exp >= new Date().getTime) {
        throw new Error("");
      }
      setUserId(decoded.sub);
      setAccessToken(localStorage.getItem("accessToken"));
    } catch (_) {
      history.replace("/register");
      return () => {};
    }
    if (accessToken) {
      (async () => {
        try {
          const resp = await fetch("http://localhost:3001/tasks", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const respJSON = await resp.json();
          if (
            respJSON !==
            "Private resource access: entity must have a reference to the owner id"
          ) {
            setTasks(respJSON.sort((a, b) => a.order - b.order));
          }
        } catch (err) {
          console.log(err.message);
        }
      })();
    }
    return () => {};
  }, [reloadToggle, history, accessToken]);

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
      userId
    };
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(dataToAdd),
    })
      .then(() => {
        setNewTask("");
        reload();
      })
      .catch(() => alert("failed to add task"));
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
        (item) => item.id === currentDragItem
      ).order;
      const currentDragOverItemOrder = tasks.find(
        (item) => item.id === currentDragOverItem
      ).order;

      if (currentDragItemOrder !== currentDragOverItemOrder) {
        let newDragItemOrder = currentDragOverItemOrder;
        let increment = 1;
        if (currentDragItemOrder > currentDragOverItemOrder) {
          increment = -1;
        }
        while (newDragItemOrder + increment !== newDragItemOrder) {
          const sum = newDragItemOrder + increment;
          if (!tasks.find((item) => item.order === sum)) {
            break;
          }
          increment /= 10;
        }
        if (newDragItemOrder + increment === newDragItemOrder) {
          return alert("failed to reorder");
        }
        newDragItemOrder += increment;
        fetch(`http://localhost:3001/tasks/${currentDragItem}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ order: newDragItemOrder }),
        })
          .then(() => {
            reload();
          })
          .catch(() => alert("failed to reorder"));
      }
    }
    dragOverItem.current = undefined;
    dragItem.current = undefined;
  };
  return (
    <>
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
            accessToken={accessToken}
          />
        );
      })}
    </>
  );
}

export default AppMain;
