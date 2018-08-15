import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.css";
import "./index.css";
import { makeMainRoutes } from "./routes";

const routes = makeMainRoutes();

ReactDOM.render(routes, document.getElementById("root"));
