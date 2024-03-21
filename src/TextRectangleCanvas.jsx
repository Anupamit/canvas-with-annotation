import { useRef, useEffect, useState } from "react";

const TextRectangleCanvas = () => {
  const canvasRef = useRef(null);

  const [rectangles, setRectangles] = useState([]);
  const [drawMode, setDrawMode] = useState(false);
  const [resizingRectIndex, setResizingRectIndex] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set rectangle properties
    context.strokeStyle = "black"; // Outline color
    context.lineWidth = 2; // Outline width
    context.fillStyle = "rgba(255, 0, 0, 0.2)"; // Fill color with transparency

    // Event listener for double-click on canvas
    canvas.addEventListener("dblclick", handleDoubleClick);

    return () => {
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [rectangles]); // Adding rectangles as a dependency to ensure event listener updates when rectangles change

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

  const handleDoubleClick = (event) => {
    const { offsetX, offsetY } = event;

    // Find if double-click occurred within any existing rectangle
    const clickedRectangle = rectangles.find((rect) => {
      return (
        offsetX >= rect.start.x &&
        offsetX <= rect.end.x &&
        offsetY >= rect.start.y &&
        offsetY <= rect.end.y
      );
    });

    // If a rectangle is found, allow adding text
    if (clickedRectangle) {
      const newText = prompt("Enter text:");
      if (newText !== null) {
        setRectangles((prevRectangles) => {
          return prevRectangles.map((rect) => {
            if (rect === clickedRectangle) {
              return { ...rect, text: newText };
            }
            return rect;
          });
        });
      }
    }
  };

  const handleDrawButtonClick = () => {
    setDrawMode(!drawMode);
  };

  const handleCanvasClick = (event) => {
    if (drawMode) {
      const { offsetX, offsetY } = event.nativeEvent;
      const newRectangle = {
        start: { x: offsetX, y: offsetY },
        end: { x: offsetX + 100, y: offsetY + 50 },
        text: "",
      };
      setRectangles([...rectangles, newRectangle]);
    } else {
      // Check if resizing rectangle
      const { offsetX, offsetY } = event.nativeEvent;
      const clickedRectangleIndex = rectangles.findIndex((rect) => {
        return (
          offsetX >= rect.start.x &&
          offsetX <= rect.end.x &&
          offsetY >= rect.start.y &&
          offsetY <= rect.end.y
        );
      });
      if (clickedRectangleIndex !== -1) {
        setResizingRectIndex(clickedRectangleIndex);
        // Determine resize direction
        const clickedRect = rectangles[clickedRectangleIndex];
        const { x, y } = clickedRect.start;
        const { end } = clickedRect;
        const rectWidth = end.x - x;
        const rectHeight = end.y - y;
        if (
          offsetX >= x + rectWidth - 5 &&
          offsetX <= x + rectWidth + 5 &&
          offsetY >= y + rectHeight - 5 &&
          offsetY <= y + rectHeight + 5
        ) {
          setResizeDirection("bottomRight");
        } else {
          setResizeDirection(null);
        }
      } else {
        setResizingRectIndex(null);
        setResizeDirection(null);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (resizingRectIndex !== null && resizeDirection) {
      const { offsetX, offsetY } = event.nativeEvent;
      setRectangles((prevRectangles) => {
        const updatedRectangles = [...prevRectangles];
        const clickedRect = updatedRectangles[resizingRectIndex];
        const { end } = clickedRect;
        switch (resizeDirection) {
          case "bottomRight":
            end.x = offsetX;
            end.y = offsetY;
            break;
          default:
            break;
        }
        return updatedRectangles;
      });
    }
  };

  const handleMouseUp = () => {
    setResizingRectIndex(null);
    setResizeDirection(null);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        width={600} // Set canvas width
        height={400} // Set canvas height
        style={{ border: "1px solid black" }} // Optional: Add border for visualization
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {rectangles.map((rect, index) => (
        <div
          key={index}
          contentEditable
          style={{
            position: "absolute",
            top: rect.start.y,
            left: rect.start.x,
            width: rect.end.x - rect.start.x,
            height: rect.end.y - rect.start.y,
            border: "1px solid transparent", // Invisible border
            pointerEvents: "auto", // Enable mouse events
            overflow: "hidden", // Prevent text overflow
          }}
        >
          {rect.text}
        </div>
      ))}
      <div>
        <button onClick={handleDrawButtonClick}>
          {drawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
        </button>
      </div>
    </div>
  );
};

export default TextRectangleCanvas;
