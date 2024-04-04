import { useRef, useEffect, useState } from "react";

const Test = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [drawMode, setDrawMode] = useState(false);
  const [selectedRectangleIndex, setSelectedRectangleIndex] = useState(null);
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
    const { offsetX, offsetY } = event.nativeEvent;

    // Check if mouse down is inside any existing rectangle
    const clickedRectangleIndex = rectangles.findIndex((rect) => {
      return (
        offsetX >= rect.start.x &&
        offsetX <= rect.end.x &&
        offsetY >= rect.start.y &&
        offsetY <= rect.end.y
      );
    });

    if (clickedRectangleIndex !== -1) {
      // If mouse down inside an existing rectangle, set it as selected for resizing
      setSelectedRectangleIndex(clickedRectangleIndex);
    } else {
      setIsDrawing(true);
      setStartPoint({ x: offsetX, y: offsetY });
      setEndPoint({ x: offsetX, y: offsetY }); // Set initial end point to starting point
    }
  };

  const handleMouseUp = () => {
    if (!drawMode) return;
    if (isDrawing) {
      setIsDrawing(false);
      const newRectangle = { start: startPoint, end: endPoint };
      setRectangles([...rectangles, newRectangle]);
    }
    setSelectedRectangleIndex(null); // Reset selected rectangle index after resizing
  };

  const handleMouseMove = (event) => {
    if (!drawMode) return;
    const { offsetX, offsetY } = event.nativeEvent;
    if (isDrawing) {
      setEndPoint({ x: offsetX, y: offsetY });
    } else if (selectedRectangleIndex !== null) {
      // Resize the selected rectangle
      const newRectangles = [...rectangles];
      const selectedRectangle = newRectangles[selectedRectangleIndex];
      selectedRectangle.end = { x: offsetX, y: offsetY };
      newRectangles[selectedRectangleIndex] = selectedRectangle;
      setRectangles(newRectangles);
    }
  };

  useEffect(() => {
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
  }, [isDrawing, rectangles, startPoint, endPoint]);

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

export default Test;
