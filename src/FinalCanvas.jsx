import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const FinalCanvas = ({ shapeType }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [drawModeLine, setDrawModeLine] = useState(false);
  const [drawModeRect, setDrawModeRect] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (shapeType === "line") {
      context.strokeStyle = "black"; // Color of the line
      context.lineWidth = 2; // Width of the line
    } else if (shapeType === "rectangle") {
      context.strokeStyle = "black"; // Outline color
      context.lineWidth = 2; // Outline width
      context.fillStyle = "rgba(255, 0, 0, 0.2)"; // Fill color with transparency
    }
  }, [shapeType]);

  const handleMouseDown = (event) => {
    if ((!drawModeLine && !drawModeRect) || isDrawing) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    setEndPoint({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = () => {
    if (!drawMode || !isDrawing) return;
    setIsDrawing(false);

    if (
      (shapeType === "line" && drawModeLine) ||
      (shapeType === "rectangle" && drawModeRect)
    ) {
      if (shapeType === "line") {
        const newLine = { start: startPoint, end: endPoint };
        setShapes([...shapes, newLine]);
      } else if (shapeType === "rectangle") {
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;
        const newRectangle = {
          start: startPoint,
          end: endPoint,
          width,
          height,
        };
        setShapes([...shapes, newRectangle]);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || (!drawModeLine && !drawModeRect)) return;
    const { offsetX, offsetY } = event.nativeEvent;
    setEndPoint({ x: offsetX, y: offsetY });
  };

  useEffect(() => {
    if (!isDrawing || (!drawModeLine && !drawModeRect)) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape) => {
      if (shapeType === "line") {
        context.beginPath();
        context.moveTo(shape.start.x, shape.start.y);
        context.lineTo(shape.end.x, shape.end.y);
        context.stroke();
      } else if (shapeType === "rectangle") {
        context.beginPath();
        context.rect(shape.start.x, shape.start.y, shape.width, shape.height);
        context.stroke();
        context.fill();
      }
    });

    if (isDrawing) {
      if (shapeType === "line" && drawModeLine) {
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
      } else if (shapeType === "rectangle" && drawModeRect) {
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;
        context.beginPath();
        context.rect(startPoint.x, startPoint.y, width, height);
        context.stroke();
        context.fill();
      }
    }
  }, [
    isDrawing,
    shapes,
    shapeType,
    startPoint,
    endPoint,
    drawModeLine,
    drawModeRect,
  ]);

  const handleDrawLineButtonClick = () => {
    setDrawModeLine(!drawModeLine);
  };

  const handleDrawRectButtonClick = () => {
    setDrawModeRect(!drawModeRect);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <button onClick={handleDrawLineButtonClick}>
        {drawModeLine ? "Disable Draw Mode Line" : "Enable Draw Mode Line"}
      </button>
      <button onClick={handleDrawRectButtonClick}>
        {drawModeRect
          ? "Disable Draw Mode Rectangle"
          : "Enable Draw Mode Rectangle"}
      </button>
    </div>
  );
};

FinalCanvas.propTypes = {
  shapeType: PropTypes.oneOf(["line", "rectangle"]).isRequired,
};

export default FinalCanvas;
