import { useRef, useEffect, useState } from "react";

const SelectableRectangleCanvas = () => {
  const canvasRef = useRef(null);
  const [rectangles, setRectangles] = useState([]);
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [drawMode, setDrawMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set rectangle properties
    context.strokeStyle = "black"; // Outline color
    context.lineWidth = 2; // Outline width
    context.fillStyle = "rgba(255, 0, 0, 0.2)"; // Fill color with transparency

    // Event listeners for canvas
    canvas.addEventListener("mousedown", handleCanvasMouseDown);
    canvas.addEventListener("mousemove", handleCanvasMouseMove);
    canvas.addEventListener("mouseup", handleCanvasMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleCanvasMouseDown);
      canvas.removeEventListener("mousemove", handleCanvasMouseMove);
      canvas.removeEventListener("mouseup", handleCanvasMouseUp);
    };
  }, [rectangles, selectedRectangle]);

  const handleCanvasMouseDown = (event) => {
    if (drawMode) {
      //   const { offsetX, offsetY } = event;
      const newRectangle = {
        start: { x: offsetX, y: offsetY },
        end: { x: offsetX, y: offsetY },
        text: "",
      };
      setRectangles([...rectangles, newRectangle]);
      setSelectedRectangle(newRectangle);
      const offsetX = event.clientX - newRectangle.start.x;
      const offsetY = event.clientY - newRectangle.start.y;
      setMouseOffset({ x: offsetX, y: offsetY });
    } else {
      const { offsetX, offsetY } = event;
      const clickedRectangle = rectangles.find((rect) => {
        return (
          offsetX >= rect.start.x &&
          offsetX <= rect.end.x &&
          offsetY >= rect.start.y &&
          offsetY <= rect.end.y
        );
      });
      if (clickedRectangle) {
        setSelectedRectangle(clickedRectangle);
        const offsetX = event.clientX - clickedRectangle.start.x;
        const offsetY = event.clientY - clickedRectangle.start.y;
        setMouseOffset({ x: offsetX, y: offsetY });
      } else {
        setSelectedRectangle(null);
      }
    }
  };

  const handleCanvasMouseMove = (event) => {
    if (selectedRectangle && !drawMode) {
      const { clientX, clientY } = event;
      const newStartX = clientX - mouseOffset.x;
      const newStartY = clientY - mouseOffset.y;
      const newEndX =
        newStartX + (selectedRectangle.end.x - selectedRectangle.start.x);
      const newEndY =
        newStartY + (selectedRectangle.end.y - selectedRectangle.start.y);
      const updatedRectangle = {
        start: { x: newStartX, y: newStartY },
        end: { x: newEndX, y: newEndY },
        text: selectedRectangle.text,
      };
      setRectangles((prevRectangles) => {
        return prevRectangles.map((rect) =>
          rect === selectedRectangle ? updatedRectangle : rect
        );
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setSelectedRectangle(null);
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
      if (rect.text) {
        context.fillStyle = "black";
        context.font = "12px Arial";
        context.fillText(rect.text, rect.start.x + 5, rect.start.y + 15);
      }
    });
  }, [rectangles]);

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
      />
      <div>
        <button onClick={handleDrawButtonClick}>
          {drawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
        </button>
      </div>
    </div>
  );
};

export default SelectableRectangleCanvas;
