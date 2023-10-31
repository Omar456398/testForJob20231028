import { useEffect, useRef, useState } from "react";
import { makeAlert } from "./Alert";

function TaskDisplay({
  id,
  name,
  isCompleted,
  reload,
  dragStart,
  dragOver,
  refDraggedOver,
  drop,
  accessToken,
  className,
}) {
  const [isDragHover, setIsDragHover] = useState(false);
  const [nameEdited, setNameEdited] = useState(name);
  const [isNameBeingEdited, setIsNameBeingEdited] = useState(false);
  const refClickCountReset = useRef(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 2) {
      setNameEdited(name);
      setIsNameBeingEdited(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickCount]);

  return (
    <div
      className={
        "task-container" +
        (refDraggedOver.current === id ? " dragged-over" : "") +
        (className ? ` ${className}` : "")
      }
      draggable={isDragHover}
      onDragStart={(e) => dragStart(e, id)}
      onDragEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dragOver(e, id);
      }}
      onDragEnd={(e) => drop(e)}
    >
      <div
        className="dragger"
        onMouseEnter={() => setIsDragHover(true)}
        onMouseLeave={() => setIsDragHover(false)}
      >
        🖱️
      </div>
      {isNameBeingEdited ? (
        <div className="flex1">
          <input
            className="edit_task_input"
            type="text"
            value={nameEdited}
            onChange={({ target: { value } }) => {
              setNameEdited(value);
            }}
            onKeyDown={(e) => {
              if (e.code === "Enter" && nameEdited.trim()) {
                setIsNameBeingEdited(false);
                fetch(`http://localhost:3001/tasks/${id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ name: nameEdited.trim() }),
                })
                  .then((item) => {
                    reload();
                  })
                  .catch(() => makeAlert("failed to update"));
              }
            }}
          />
        </div>
      ) : (
        <div
          className="flex1 pointer ellipsis_container task-name-container"
          onClick={() => {
            setClickCount((prev) => prev + 1);
            clearTimeout(refClickCountReset.current);
            refClickCountReset.current = setTimeout(
              () => setClickCount(0),
              300
            );
          }}
        >
          <div className="task-name ellipsis_text">{name || ""}</div>
        </div>
      )}
      <div
        className="paddinglr pointer"
        onClick={() => {
          fetch(`http://localhost:3001/tasks/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ isCompleted: !isCompleted }),
          })
            .then((item) => {
              reload();
            })
            .catch(() => makeAlert("failed to update"));
        }}
      >
        {isCompleted ? "✅" : "▶️"}
      </div>
      <div className="paddinglr"></div>
      <div
        className="paddinglr pointer"
        onClick={() => {
          fetch(`http://localhost:3001/tasks/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((item) => {
              reload();
            })
            .catch(() => makeAlert("failed to delete"));
        }}
      >
        ❌
      </div>
    </div>
  );
}

export default TaskDisplay;
