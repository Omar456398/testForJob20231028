import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const login = () => {
    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName
      }),
    });
    
  }

  useEffect(() => {
    try {
      if (!localStorage.getItem("accessToken")) {
        throw new Error("");
      }
      const decoded = jwtDecode(localStorage.getItem("accessToken"));
      if (decoded.exp >= new Date().getTime) {
        throw new Error("");
      }
      history.replace('/')
    } catch (_) {
      return () => {};
    }
  }, [history]);
  return <></>;
}

export default Register;
