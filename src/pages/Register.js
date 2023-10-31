import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeAlert } from "../components/Alert";

function Register() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const register = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const respJSON = await resp.json();
      setIsLoading(false);
      return respJSON;
    } catch (_) {
      setIsLoading(false);
      return "Failed to Register User";
    }
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
          <td colSpan={3} style={{ textAlign: "center" }}>
            <h2>Register New User</h2>
          </td>
        </tr>
        <tr>
          <td className="register-label">
            <label for="email">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </td>
          <td colSpan={2}>
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
          <td colSpan={2}>
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
          <td></td>
          <td style={{ textAlign: "center" }}>
            {isLoading ? (
              <button className="create_user" disabled>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="loader-small"></span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
            ) : (
              <input
                className="create_user"
                type="submit"
                value="Create User"
                onClick={(e) => {
                  e.preventDefault();
                  register().then((respJSON) => {
                    if (typeof respJSON === "string") {
                      return makeAlert(respJSON);
                    }
                    history.replace("/");
                  });
                }}
              />
            )}
          </td>
          <td style={{ textAlign: "center" }}>
            <button
              disabled={isLoading}
              className="create_user"
              onClick={(e) => {
                history.replace("/");
              }}
            >
              Login as Existing User
            </button>
          </td>
        </tr>
      </table>
    </form>
  );
}

export default Register;
