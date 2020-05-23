import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileUpload from "./components/FileUpload";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h3>Please upload any xlsx file</h3>
      <FileUpload />
    </div>
  );
}

export default App;
