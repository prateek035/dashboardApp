import React, { useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [percentUpload, setPercentUpload] = useState(0);
  const onChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onClickHandler = () => {
    const data = new FormData();
    data.append("file", selectedFile);

    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        // console.log(`${loaded}kb of ${total}kb | ${percent}%`);

        if (percent < 100) {
          setPercentUpload(percent);
        }
      },
    };

    axios.post("/upload", data, options).then((res) => {
      setPercentUpload(100);
      setTimeout(() => {
        setSelectedFile(null);
        setPercentUpload(0);
      }, 2000);
    });
  };

  return (
    <div id="container">
      <input
        type="file"
        name="file"
        accept=".xlsx"
        onChange={(e) => onChangeHandler(e)}
      />
      <button type="button" onClick={onClickHandler}>
        Upload
      </button>

      {percentUpload > 0 && (
        <ProgressBar
          className="mt-4"
          striped
          variant="success"
          now={percentUpload}
          label={`${percentUpload}%`}
        />
      )}
    </div>
  );
};

export default FileUpload;
