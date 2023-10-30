import "./App.css";
import {BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import AppMain from "./components/AppMain";
import Register from "./components/Register";
function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
        <Route exact path="/" children={<AppMain />} />
        <Route exact path="/register" children={<Register />} />
        <Redirect from="*" to="/" />
      </Switch></Router>
    </div>
  );
}

export default App;
