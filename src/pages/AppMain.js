import { useLayoutEffect, useMemo, useRef, useState } from "react";
import TaskDisplay from "../components/TaskDisplay";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import { makeAlert } from "../components/Alert";

function AppMain() {
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [reloadToggle, setReloadToggle] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();
  const history = useHistory();

  useLayoutEffect(() => {
    (async () => {
      let continueLoading = true;
      try {
        if (!localStorage.getItem("accessToken")) {
          throw new Error("");
        }
        const decoded = jwtDecode(localStorage.getItem("accessToken"));
        if (decoded.exp * 1000 <= new Date().getTime()) {
          throw new Error("");
        }
        const userDataResp = await fetch(
          `http://localhost:3001/users/${decoded.sub}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const userDataRespJSON = await userDataResp.json();
        if (typeof userDataRespJSON === "string") {
          throw new Error("");
        }
        setUserData(decoded);
        setAccessToken(localStorage.getItem("accessToken"));
      } catch (_) {
        localStorage.removeItem("accessToken")
        history.replace("/login");
        continueLoading = false;
      }
      if (continueLoading) {
        try {
          setIsLoading(true);
          const resp = await fetch("http://localhost:3001/tasks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          const respJSON = await resp.json();
          if (
            respJSON ===
            "Private resource access: entity must have a reference to the owner id"
          ) {
            setTasks([]);
          } else {
            setTasks(respJSON.sort((a, b) => a.order - b.order));
          }
          setIsLoading(false);
        } catch (err) {
          makeAlert("Failed to load content, please reload page!");
          setIsLoading(false);
          setIsError(true);
        }
      }
    })();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToggle]);

  const reload = () => {
    setReloadToggle((prev) => !prev);
  };
  const addTask = (e) => {
    e?.preventDefault?.();
    if (!newTask.trim()) {
      return makeAlert("Please input task name");
    }
    const dataToAdd = {
      order: Math.floor(Math.max(0, ...tasks.map((item) => item.order))) + 1,
      name: newTask,
      isCompleted: false,
      id: uuidv4(),
      userId: userData.sub,
    };
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dataToAdd),
    })
      .then(() => {
        setNewTask("");
        reload();
        setFilter("All");
      })
      .catch(() => makeAlert("failed to add task"));
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
      if (
        Math.abs(
          tasks.findIndex((item) => item.id === currentDragItem) -
            tasks.findIndex((item) => item.id === currentDragOverItem)
        ) === 1
      ) {
        (async () => {
          try {
            await fetch(`http://localhost:3001/tasks/${currentDragItem}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ order: currentDragOverItemOrder }),
            });
            await fetch(`http://localhost:3001/tasks/${currentDragOverItem}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ order: currentDragItemOrder }),
            });
            reload();
          } catch (_) {
            makeAlert("failed to reorder");
          }
        })();
      } else if (currentDragItem !== currentDragOverItem) {
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
          return makeAlert("failed to reorder");
        }
        newDragItemOrder += increment;
        fetch(`http://localhost:3001/tasks/${currentDragItem}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ order: newDragItemOrder }),
        })
          .then(() => {
            reload();
          })
          .catch(() => makeAlert("failed to reorder"));
      }
    }
    dragOverItem.current = undefined;
    dragItem.current = undefined;
  };

  const tasksToShow = useMemo(
    () =>
      tasks.filter((item) =>
        filter === "All"
          ? true
          : filter === "Completed"
          ? item.isCompleted
          : !item.isCompleted
      ),
    [tasks, filter]
  );

  return (
    <div className="main_app">
      <div className="logged_in_placeholder"></div>
      <div className="logged_in">
        <div className="logged_in_as">logged in as: {userData.email}</div>
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            reload();
          }}
          className="log_out"
        >
          Log out
        </button>
      </div>
      {isError || isLoading ? (
        <div className="icon_container">
          {isLoading ? <span class="loader"></span> : <>❌</>}
        </div>
      ) : (
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
      )}
      <div
        className={`tasks-header-container${
          isLoading || isError ? " loading_task_display" : ""
        }`}
      >
        <div className="flex1">
          <h3 style={{ margin: 0 }}>List of Tasks</h3>
        </div>
        <select
          value={filter}
          onChange={({ target: { value } }) => {
            setFilter(value);
          }}
        >
          <option>All</option>
          <option>Completed</option>
          <option>Running</option>
        </select>
      </div>
      {isError
        ? null
        : tasksToShow.map((item) => {
            return (
              <TaskDisplay
                className={isLoading ? "loading_task_display" : undefined}
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
    </div>
  );
}

export default AppMain;
