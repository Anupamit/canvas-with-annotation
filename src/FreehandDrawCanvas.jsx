import { useRef, useEffect, useState } from "react";

const FreehandDrawCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set drawing properties
    context.strokeStyle = "black"; // Line color
    context.lineWidth = 2; // Line width
    context.lineCap = "round"; // Rounded line ends
    context.lineJoin = "round"; // Rounded line corners
  }, []);

  const startDrawing = (event) => {
    if (!drawMode) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = event.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const continueDrawing = (event) => {
    if (!drawMode || !isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = event.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const finishDrawing = () => {
    if (!drawMode) return;
    setIsDrawing(false);
  };

  const handleDrawButtonClick = () => {
    setDrawMode(!drawMode);
    setIsDrawing(false); // Reset drawing when toggling mode
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600} // Set canvas width
        height={400} // Set canvas height
        style={{ border: "1px solid black" }} // Optional: Add border for visualization
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={continueDrawing}
      />
      <button onClick={handleDrawButtonClick}>
        {drawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
      </button>
    </div>
  );
};

export default FreehandDrawCanvas;
