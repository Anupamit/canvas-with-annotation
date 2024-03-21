import { useRef, useEffect, useState } from "react";

const RectangleCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [drawMode, setDrawMode] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set rectangle properties
    context.strokeStyle = "black"; // Outline color
    context.lineWidth = 2; // Outline width
    context.fillStyle = "rgba(255, 0, 0, 0.2)"; // Fill color with transparency
  }, []);

  const handleMouseDown = (event) => {
    if (!drawMode) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    setEndPoint({ x: offsetX, y: offsetY }); // Set initial end point to starting point
  };

  const handleMouseUp = () => {
    if (!drawMode || !isDrawing) return;
    setIsDrawing(false);
    const newRectangle = { start: startPoint, end: endPoint };
    setRectangles([...rectangles, newRectangle]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || !drawMode) return;
    const { offsetX, offsetY } = event.nativeEvent;
    setEndPoint({ x: offsetX, y: offsetY });
  };

  useEffect(() => {
    if (!isDrawing || !drawMode) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rect) => {
      const width = rect.end.x - rect.start.x;
      const height = rect.end.y - rect.start.y;
      context.beginPath();
      context.rect(rect.start.x, rect.start.y, width, height);
      context.stroke();
      context.fill();
    });

    if (isDrawing) {
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;
      context.beginPath();
      context.rect(startPoint.x, startPoint.y, width, height);
      context.stroke();
      context.fill();
    }
  }, [isDrawing, drawMode, rectangles, startPoint, endPoint]);

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
        {drawMode
          ? "Disable Draw Mode Rectangle"
          : "Enable Draw Mode Rectangle"}
      </button>
    </div>
  );
};

export default RectangleCanvas;
