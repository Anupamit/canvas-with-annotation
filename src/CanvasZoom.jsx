import { useEffect, useRef, useState } from "react";

const CanvasZoom = () => {
  const canvasRef = useRef(null);
  const [translatePos, setTranslatePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1.0);
  const scaleMultiplier = 0.8;
  const startDragOffset = useRef({});
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const draw = () => {
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(translatePos.x, translatePos.y);
      context.scale(scale, scale);
      context.beginPath();
      context.moveTo(-119, -20);
      context.bezierCurveTo(-159, 0, -159, 50, -59, 50);
      context.bezierCurveTo(-39, 80, 31, 80, 51, 50);
      context.bezierCurveTo(131, 50, 131, 20, 101, 0);
      context.bezierCurveTo(141, -60, 81, -70, 51, -50);
      context.bezierCurveTo(31, -95, -39, -80, -39, -50);
      context.bezierCurveTo(-89, -95, -139, -80, -119, -20);
      context.closePath();
      var grd = context.createLinearGradient(-59, -100, 81, 100);
      grd.addColorStop(0, "#8ED6FF");
      grd.addColorStop(1, "#004CB3");
      context.fillStyle = grd;
      context.fill();

      context.lineWidth = 5;
      context.strokeStyle = "#0000ff";
      context.stroke();
      context.restore();
    };

    const handleMouseDown = (evt) => {
      setMouseDown(true);
      startDragOffset.current.x = evt.clientX - translatePos.x;
      startDragOffset.current.y = evt.clientY - translatePos.y;
    };

    const handleMouseUp = () => {
      setMouseDown(false);
    };

    const handleMouseMove = (evt) => {
      if (mouseDown) {
        setTranslatePos({
          x: evt.clientX - startDragOffset.current.x,
          y: evt.clientY - startDragOffset.current.y,
        });
        draw();
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    draw(); // Initial draw

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scale, translatePos, mouseDown]);

  const handlePlusClick = () => {
    setScale(scale / scaleMultiplier);
  };

  const handleMinusClick = () => {
    setScale(scale * scaleMultiplier);
  };

  const handleResetClick = () => {
    setScale(1.0);
    setTranslatePos({ x: 0, y: 0 });
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          border: "1px solid #9C9898",
          width: "578px",
          height: "200px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={578}
          style={{ border: "none" }}
          height={200}
        ></canvas>
        <div
          style={{
            position: "absolute",
            width: "30px",
            top: "2px",
            right: "2px",
          }}
        >
          <input type="button" value="Zoom In" onClick={handlePlusClick} />
          <input type="button" value="Zoom Out" onClick={handleMinusClick} />
          <input type="button" value="Reset" onClick={handleResetClick} />
        </div>
      </div>
    </div>
  );
};

export default CanvasZoom;
