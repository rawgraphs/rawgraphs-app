import React, { useCallback, useState } from "react";
import {
  InputGroup,
  DropdownButton,
  Dropdown,
  FormControl,
} from "react-bootstrap";

function downloadBlob(url, filename) {
  // Create a new anchor element
  const a = document.createElement("a");

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || "download";

  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // Comment out this line if you don't want an automatic download of the blob content
  a.click();

  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a;
}

export default function Exporter({ rawViz }) {
  const downloadSvg = useCallback(
    (filename) => {
      var svgString = new XMLSerializer().serializeToString(
        rawViz._node.firstChild
      );
      var DOMURL = window.URL || window.webkitURL || window;
      var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      var url = DOMURL.createObjectURL(svg);
      downloadBlob(url, filename);
      DOMURL.revokeObjectURL(svg)
    },
    [rawViz]
  );

  const downloadImage = useCallback(
    (format, filename) => {
      var svgString = new XMLSerializer().serializeToString(
        rawViz._node.firstChild
      );
      var DOMURL = window.URL || window.webkitURL || window;
      var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      var url = DOMURL.createObjectURL(svg);
      var canvas = document.createElement("canvas");
      canvas.height = rawViz._node.firstChild.clientHeight;
      canvas.width = rawViz._node.firstChild.clientWidth;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var dataUrl = canvas.toDataURL(format);
        downloadBlob(dataUrl, filename);
        DOMURL.revokeObjectURL(svg)
      };
      img.src = url;
    },
    [rawViz]
  );

  const [currentFormat, setCurrentFormat] = useState("svg");
  const [currentFile, setCurrentFile] = useState("viz");

  const downloadViz = useCallback(() => {
    switch (currentFormat) {
      case "svg":
        downloadSvg(`${currentFile}.svg`);
        break;
      case "png":
        downloadImage("image/png", `${currentFile}.png`);
        break;
      case "jpg":
        downloadImage("image/jpeg", `${currentFile}.jpg`);
        break;

      default:
        break;
    }
  }, [currentFile, currentFormat, downloadImage, downloadSvg]);

  return (
    <div className="row">
      <div className="col col-sm-4">
        <InputGroup className="mb-3">
          <input
            type="text"
            className="form-control"
            value={currentFile}
            onChange={(e) => setCurrentFile(e.target.value)}
          ></input>

          <DropdownButton
            as={InputGroup.Append}
            title={`.${currentFormat}`}
            id="input-group-dropdown-1"
          >
            <Dropdown.Item href="#" onClick={() => setCurrentFormat("svg")}>
              .svg
            </Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setCurrentFormat("png")}>
              .png
            </Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setCurrentFormat("jpg")}>
              .jpg
            </Dropdown.Item>
          </DropdownButton>
        </InputGroup>
      </div>

      <div className="col col-sm-4">
        <button className="btn btn-primary" onClick={downloadViz}>Download</button>
      </div>
    </div>

    //   <button
    //     onClick={() => {
    //       downloadSvg();
    //     }}
    //   >
    //     svg
    //   </button>
    //   <button
    //     onClick={() => {
    //       downloadImage("image/png");
    //     }}
    //   >
    //     png
    //   </button>
    //   <button
    //     onClick={() => {
    //       downloadImage("image/jpeg");
    //     }}
    //   >
    //     jpeg
    //   </button>
    // </div>
  );
}
