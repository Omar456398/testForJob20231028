import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import { makeAlert } from "../components/Alert";

function Login() {
  const [loginData, setLoginData] = useState({});
  const [isLoading, setIsLoading] = useState("");
  const history = useHistory();

  const setLoginValue = ({ target: { name, value } }) => {
    setLoginData((prev) => ({ ...prev, [name]: value }));
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

  const login = async () => {
    try {
      setIsLoading(true);
      const loginResp = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const loginRespJSON = await loginResp.json();

      setIsLoading(false);
      if (typeof loginRespJSON === "string") {
        return makeAlert(loginRespJSON);
      }
      localStorage.setItem("accessToken", loginRespJSON.accessToken);
      history.replace("/");
    } catch (_) {
      setIsLoading(false);
      makeAlert("Failed to Login!");
    }
  };

  return (
    <form>
      <table className="register-table">
        <tr>
          <td colSpan={3} style={{ textAlign: "center" }}>
            <h2>Enter your Credentials</h2>
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
              value={loginData.email || ""}
              onChange={setLoginValue}
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
              value={loginData.password || ""}
              onChange={setLoginValue}
            />
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td></td>
          <td style={{ textAlign: "center" }}>
            {isLoading ? (
              <button className="create_user" disabled>
                &nbsp;&nbsp;
                <span class="loader-small"></span>
                &nbsp;&nbsp;
              </button>
            ) : (
              <input
                className="create_user"
                type="submit"
                value="Login"
                onClick={(e) => {
                  e.preventDefault();
                  login();
                }}
              />
            )}
          </td>
          <td style={{ textAlign: "center" }}>
            <button
              disabled={isLoading}
              className="create_user"
              onClick={(e) => {
                history.replace("/register");
              }}
            >
              Register as New User
            </button>
          </td>
        </tr>
      </table>
    </form>
  );
}

export default Login;
