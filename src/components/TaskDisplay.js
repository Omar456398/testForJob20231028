function TaskDisplay({ id, name, isCompleted, reload }) {
  return (
    <div className="task-container">
      <div className="flex1">{name || ""}</div>
      <div className="paddinglr pointer" onClick={() => {
        fetch(`http://localhost:3001/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({isCompleted: !isCompleted})
          }).then((item) => {
            reload();
          });
      }}>{isCompleted ? "✅" : "▶️"}</div>
      <div className="paddinglr"></div>
      <div className="paddinglr pointer" onClick={() => {
        fetch(`http://localhost:3001/tasks/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }).then((item) => {
            reload();
          });
      }}>❌</div>
    </div>
  );
}

export default TaskDisplay;
