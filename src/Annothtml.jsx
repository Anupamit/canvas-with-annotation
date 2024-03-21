import React, { useState, useRef, useEffect } from "react";

const Annothtml = () => {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(5);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [startRectX, setStartRectX] = useState(0);
  const [startRectY, setStartRectY] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightStartX, setHighlightStartX] = useState(0);
  const [highlightStartY, setHighlightStartY] = useState(0);
  const [isDrawingStraightLine, setIsDrawingStraightLine] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [isDrawingText, setIsDrawingText] = useState(false);
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);
  const canvasRef = useRef(null);

  const handleColorChange = (e) => {
    setBrushColor(e.target.value);
  };

  const handleBrushSizeChange = (e) => {
    setBrushRadius(parseInt(e.target.value));
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handlePrev = () => {
    navigateToPreviousPage(); // You need to define `navigateToPreviousPage` function
  };

  const handleNext = () => {
    navigateToNextPage(); // You need to define `navigateToNextPage` function
  };

  const handleZoomOut = () => {
    setCanvasScale((currentScale) => currentScale - 0.1); // You need to define `setCanvasScale` function
  };

  const handleIn = () => {
    setCanvasScale((currentScale) => currentScale + 0.1); // You need to define `setCanvasScale` function
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const action = redoStack.pop(); // You need to define `redoStack` array
      applyAction(action); // You need to define `applyAction` function
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const action = undoStack.pop(); // You need to define `undoStack` array
      revertAction(action); // You need to define `revertAction` function
    }
  };

  const handleSelect = () => {
    console.log("Select");
    // Implement select logic here
  };

  const handleLine = () => {
    setIsDrawingStraightLine(true);
  };

  const handleFreehand = () => {
    setIsDrawingStraightLine(false);
    setIsHighlighting(false);
    setIsDrawingText(false);
  };

  const handleHighlight = () => {
    setIsHighlighting(true);
    setIsDrawingStraightLine(false);
    setIsDrawingText(false);
  };

  const handleRectangle = () => {
    setIsDrawingRectangle(true);
    setIsDrawingStraightLine(false);
    setIsHighlighting(false);
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
    console.log("Download");
    // Implement your download logic here
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    setPrevX(e.nativeEvent.offsetX);
    setPrevY(e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (isDrawingRectangle) {
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;
      const width = mouseX - startRectX;
      const height = mouseY - startRectY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.rect(startRectX, startRectY, width, height);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushRadius * 2;
      ctx.stroke();
    } else if (isHighlighting) {
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.rect(
        highlightStartX,
        highlightStartY,
        mouseX - highlightStartX,
        mouseY - highlightStartY
      );
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushRadius * 2;
      ctx.stroke();
    } else if (isDrawingStraightLine) {
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushRadius * 2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushRadius * 2;
      ctx.stroke();

      setPrevX(e.nativeEvent.offsetX);
      setPrevY(e.nativeEvent.offsetY);
    }
  };

  const stopDrawing = (e) => {
    setIsDrawing(false);

    if (isDrawingRectangle) {
      setIsDrawingRectangle(false);
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;
      const width = mouseX - startRectX;
      const height = mouseY - startRectY;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.rect(startRectX, startRectY, width, height);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushRadius * 2;
      ctx.stroke();
    }
  };

  const handleMouseDown = (e) => {
    if (isDrawingRectangle) {
      setStartRectX(e.nativeEvent.offsetX);
      setStartRectY(e.nativeEvent.offsetY);
    } else if (isHighlighting) {
      setHighlightStart;
      setHighlightStartX(e.nativeEvent.offsetX);
      setHighlightStartY(e.nativeEvent.offsetY);
    } else if (isDrawingStraightLine) {
      setStartX(e.nativeEvent.offsetX);
      setStartY(e.nativeEvent.offsetY);
    } else if (isDrawingText) {
      setTextX(e.nativeEvent.offsetX);
      setTextY(e.nativeEvent.offsetY);
    } else {
      startDrawing(e);
    }
  };

  const drawHighlightOrStraightLine = (e) => {
    if (isHighlighting || isDrawingStraightLine) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHighlighting) {
        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;
        ctx.beginPath();
        ctx.rect(
          highlightStartX,
          highlightStartY,
          mouseX - highlightStartX,
          mouseY - highlightStartY
        );
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushRadius * 2;
        ctx.stroke();
      } else if (isDrawingStraightLine) {
        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushRadius * 2;
        ctx.stroke();
      }
    } else {
      draw(e);
    }
  };

  const drawText = () => {
    if (!isDrawingText) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = `${brushRadius * 2}px Arial`;
    ctx.fillStyle = brushColor;
    ctx.fillText(textInput, textX, textY);
  };

  const handleMouseUp = () => {
    if (isDrawingText) {
      setIsDrawingText(false);
    } else {
      stopDrawing();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage]);

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
        <button onClick={handlePrev}>Previous Page</button>
        <button onClick={handleNext}>Next Page</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleIn}>Zoom In</button>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={handleSelect}>Select</button>
        <button onClick={handleRectangle}>Rectangle</button>
        <button onClick={handleLine}>Line</button>
        <button onClick={handleFreehand}>FreeHand</button>
        <button onClick={handleHighlight}>Highlight</button>
        <button onClick={drawText}>Text</button>
        <button onClick={handleClearCanvas}>Clear</button>
        <button onClick={handleDownload}>Download</button>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: "2px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={drawHighlightOrStraightLine}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      />
    </div>
  );
};

export default Annothtml;
