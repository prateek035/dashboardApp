import React, { useState, Fragment } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";
import Spinner from "./Spinner";

import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [timer, setTimer] = useState(1);
  const [percentUpload, setPercentUpload] = useState(0);
  const [show, setShow] = useState(false);

  const onChangeHandler = (event) => {
    if (event.target.files[0] === undefined) {
      setSelectedFile(null);
      return;
    }
    let extension = event.target.files[0].name.split(".").slice(-1)[0];

    if (extension === "xlsx") setSelectedFile(event.target.files[0]);
    else setSelectedFile(null);
  };

  const onClickHandler = () => {
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("timer", timer);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);

        if (percent === 100) setShow(true);
        setPercentUpload(percent);
      },
    };

    axios.post("/upload", data, options).then((res) => {
      setShow(false);
      setTimeout(() => {
        setSelectedFile(null);
        setPercentUpload(0);
      }, 1000);
    });
  };

  return (
    <div id="container">
      <input
        type="file"
        name="file"
        accept=".xlsx"
        onChange={(e) => onChangeHandler(e)}
        onClick={(e) => {
          setSelectedFile(null);
          e.target.value = null;
        }}
      />
      <br />
      <br />
      <label htmlFor="timer">Timer </label>
      <input
        type="number"
        name="timer"
        value={timer}
        min="0"
        onChange={(e) => setTimer(parseInt(e.target.value))}
      />
      <br />
      <br />

      {selectedFile !== null && (
        <button type="button" onClick={onClickHandler}>
          Upload
        </button>
      )}

      {percentUpload < 100 && percentUpload > 0 && (
        <ProgressBar
          className="mt-4"
          striped
          variant="success"
          now={percentUpload}
          label={`${percentUpload}%`}
        />
      )}
      {percentUpload === 100 && (
        <div>
          <Alert
            show={show}
            variant="success"
            onClose={() => setShow(false)}
            dismissible
          >
            <Alert.Heading>
              Data uploaded to Server Successfully !
            </Alert.Heading>
            <p> Dispatching data now to Main Server</p>
          </Alert>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
