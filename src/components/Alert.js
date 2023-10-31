import { useState } from "react";

let makeAlert = () => {};
const Alert = () => {
  const [alertMessage, setAlertMessage] = useState("");
  makeAlert = setAlertMessage;
  return alertMessage ? (
    <div className="alert_overlay">
      <div className="alert_container">
        <div className="alert_message">{alertMessage}</div>
        <br />
        <button className="alert_close" onClick={() => setAlertMessage('')}>OK</button>
      </div>
    </div>
  ) : null;
};

export { Alert, makeAlert };
