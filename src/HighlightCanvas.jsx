import { useRef, useEffect, useState } from "react";

const HighlightCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [color, setColor] = useState("yellow"); // Default highlight color

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set drawing properties
    context.lineWidth = 10; // Line width for highlighting
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
    context.strokeStyle = color; // Set the selected color
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

  const handleColorChange = (event) => {
    setColor(event.target.value);
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
      <div>
        <button onClick={handleDrawButtonClick}>
          {drawMode ? "Disable Highlight Mode" : "Enable Highlight Mode"}
        </button>
        <input type="color" value={color} onChange={handleColorChange} />
      </div>
    </div>
  );
};

export default HighlightCanvas;
