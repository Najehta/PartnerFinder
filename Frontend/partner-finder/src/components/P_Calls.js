import React from "react";
import "./calls.css";

import Getcalls from "./Getcalls";
import Alert from "./Alert";
import Search from "./Search";

function Calls() {
  return (
    <div className="Calls-grid">
      <div className="div1">
        <Getcalls></Getcalls>
      </div>
      <div className="div2">
        <Alert></Alert>
      </div>
      <div className="div3">
        <Search></Search>
      </div>
    </div>
  );
}

export default Calls;
