import { useState } from "react";

function TaskDisplay({
  id,
  name,
  isCompleted,
  reload,
  dragStart,
  dragOver,
  refDraggedOver,
  drop,
}) {
  const [isDragHover, setIsDragHover] = useState(false);
  const [nameEdited, setNameEdited] = useState(name);
  const [isNameBeingEdited, setIsNameBeingEdited] = useState(false);
  return (
    <div
      className={
        "task-container " +
        (refDraggedOver.current === id ? "dragged-over" : "")
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
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: nameEdited.trim() }),
                }).then((item) => {
                  reload();
                }).catch(()=>alert('failed to update'));
              }
            }}
          />
        </div>
      ) : (
        <div
          className="flex1 pointer"
          onDoubleClick={() => {
            setNameEdited(name);
            setIsNameBeingEdited(true);
          }}
        >
          <div className="task-name">{name || ""}</div>
        </div>
      )}
      <div
        className="paddinglr pointer"
        onClick={() => {
          fetch(`http://localhost:3001/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted: !isCompleted }),
          }).then((item) => {
            reload();
          }).catch(()=>alert('failed to update'));
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
            headers: { "Content-Type": "application/json" },
          }).then((item) => {
            reload();
          }).catch(()=>alert('failed to delete'));
        }}
      >
        ❌
      </div>
    </div>
  );
}

export default TaskDisplay;
