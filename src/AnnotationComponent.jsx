import { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import backgroundImage from "./assets/masked-aadhaar-card.webp";

const AnnotationComponent = () => {
  // State variables
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const canvasRef = useRef(null);

  // Event handlers
  const handleColorChange = (e) => {
    setBrushColor(e.target.value);
  };

  const handleBrushSizeChange = (e) => {
    setBrushRadius(parseInt(e.target.value));
  };

  const handleClearCanvas = () => {
    canvasRef.current.clear();
  };

  const handleUndo = () => {
    canvasRef.current.undo();
  };
  const handleRectangle = () => {
    canvasRef.current.rectangle();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      setUploadedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match the image size
    canvas.width = canvasRef.current.canvas.drawing.width;
    canvas.height = canvasRef.current.canvas.drawing.height;

    // Draw the background image onto the canvas
    const bgImage = new Image();
    bgImage.onload = () => {
      context.drawImage(bgImage, 0, 0);

      // Draw the annotations onto the canvas
      const drawingCanvas = canvasRef.current.canvas.drawing;
      context.drawImage(drawingCanvas, 0, 0);

      // Convert canvas to data URL and download
      const imageData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imageData;
      a.download = "annotated_image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // Load background image
    if (uploadedImage) {
      bgImage.src = uploadedImage;
    } else {
      bgImage.src = backgroundImage;
    }
  };

  return (
    <div>
      <div>
        <label>Choose Color:</label>
        <input type="color" value={brushColor} onChange={handleColorChange} />
      </div>

      <div>
        <label>Brush Size:</label>
        <input
          type="number"
          value={brushRadius}
          min="1"
          max="50"
          onChange={handleBrushSizeChange}
        />
      </div>
      <div>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleClearCanvas}>Clear</button>
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleRectangle}>Rectange</button>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* CanvasDraw component */}
      <CanvasDraw
        brushColor={brushColor}
        brushRadius={brushRadius}
        canvasWidth={800}
        canvasHeight={500}
        imgSrc={uploadedImage || backgroundImage}
        ref={canvasRef}
        hideGrid={true}
        style={{ border: "2px solid black" }}
      />
    </div>
  );
};

export default AnnotationComponent;
