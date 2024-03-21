import { useRef, useEffect, useState } from "react";

const LineCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [drawMode, setDrawMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set line properties
    context.strokeStyle = "black"; // Color of the line
    context.lineWidth = 2; // Width of the line
  }, []);

  const handleMouseDown = (event) => {
    if (!drawMode) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setLines([
      ...lines,
      {
        startPoint: { x: offsetX, y: offsetY },
        endPoint: { x: offsetX, y: offsetY },
      },
    ]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || !drawMode) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const lastIndex = lines.length - 1;
    const updatedLines = [...lines];
    updatedLines[lastIndex].endPoint = { x: offsetX, y: offsetY };
    setLines(updatedLines);
  };

  useEffect(() => {
    if (!isDrawing || !drawMode) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach((line) => {
      context.beginPath();
      context.moveTo(line.startPoint.x, line.startPoint.y);
      context.lineTo(line.endPoint.x, line.endPoint.y);
      context.stroke();
    });
  }, [isDrawing, drawMode, lines]);

  const handleDrawButtonClick = () => {
    setDrawMode(!drawMode);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600} // Set canvas width
        height={400} // Set canvas height
        style={{ border: "1px solid black" }} // Optional: Add border for visualization
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <button onClick={handleDrawButtonClick}>
        {drawMode ? "Disable Draw Mode Line" : "Enable Draw Mode Line"}
      </button>
    </div>
  );
};

export default LineCanvas;
