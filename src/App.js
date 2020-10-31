import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/about" exact component={About} />
      <Route path="/works" exact component={Works} />
    </Router>
  );
}

export default App;
