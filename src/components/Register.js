import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    return fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((resp) => resp.json());
  };

  const setValueByStateFunc = ({ target: { value } }, stateFunc) => {
    stateFunc(value);
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem("accessToken")) {
        throw new Error("");
      }
      const decoded = jwtDecode(localStorage.getItem("accessToken"));
      if (decoded.exp * 1000 <= new Date().getTime()) {
        throw new Error("");
      }
      history.replace("/");
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <form>
      <table className="register-table">
        <tr>
          <td colSpan={2} style={{ textAlign: "center" }}>
            <h2>Register New User</h2>
          </td>
        </tr>
        <tr>
          <td className="register-label">
            <label for="email">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </td>
          <td>
            <input
              type="email"
              className="register-input"
              required
              name="email"
              value={email}
              onChange={(e) => setValueByStateFunc(e, setEmail)}
            />
          </td>
        </tr>
        <tr>
          <td className="register-label">
            <label for="password">
              Password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
          </td>
          <td>
            <input
              className="register-input"
              type="password"
              required
              name="password"
              value={password}
              onChange={(e) => setValueByStateFunc(e, setPassword)}
            />
          </td>
        </tr>
        <tr></tr>
        <tr>
          {" "}
          <td colSpan={2} style={{ textAlign: "center" }}>
            <input
              className="create_user"
              type="submit"
              value="Create User"
              onClick={(e) => {
                e.preventDefault();
                register().then((respJSON) => {
                  if (typeof respJSON === "string") {
                    return alert(respJSON);
                  }
                  history.replace("/");
                });
              }}
            />
          </td>
        </tr>
      </table>
    </form>
  );
}

export default Register;
