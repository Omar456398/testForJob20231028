import "./App.css";
import {BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import AppMain from "./pages/AppMain";
import Register from "./pages/Register";
import { Alert } from "./components/Alert";
import Login from "./pages/Login";
function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
        <Route exact path="/" children={<AppMain />} />
        <Route exact path="/register" children={<Register />} />
        <Route exact path="/login" children={<Login />} />
        <Redirect from="*" to="/" />
      </Switch></Router>
      <Alert />
    </div>
  );
}

export default App;
