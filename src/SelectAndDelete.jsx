import { useRef, useEffect, useState } from "react";

const SelectAndDelete = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isResizingRef = useRef(false);
  const currentResizerRef = useRef(null);
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [elements, setElements] = useState([
    {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      isSelected: false,
    },
    // Add more elements if needed
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    const drawElement = () => {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach((el, index) => {
        ctxRef.current.fillStyle = el.isSelected ? "blue" : "red"; // Change color if selected
        ctxRef.current.fillRect(el.x, el.y, el.width, el.height);
        if (el.isSelected) {
          setSelectedElementIndex(index);
        }
      });
    };

    const checkSelection = (mouseX, mouseY) => {
      elements.forEach((el) => {
        el.isSelected = false; // Deselect all elements first
        if (
          mouseX >= el.x &&
          mouseX <= el.x + el.width &&
          mouseY >= el.y &&
          mouseY <= el.y + el.height
        ) {
          el.isSelected = true;
        }
      });
    };

    const mousedown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      checkSelection(mouseX, mouseY);

      drawElement();

      elements.forEach((el) => {
        if (el.isSelected) {
          window.addEventListener("mousemove", mousemove);
          window.addEventListener("mouseup", mouseup);

          prevXRef.current = mouseX;
          prevYRef.current = mouseY;
        }
      });
    };

    const mousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      elements.forEach((el) => {
        if (el.isSelected) {
          if (!isResizingRef.current) {
            const deltaX = mouseX - prevXRef.current;
            const deltaY = mouseY - prevYRef.current;

            el.x += deltaX;
            el.y += deltaY;

            drawElement();
          } else {
            const deltaX = mouseX - prevXRef.current;
            const deltaY = mouseY - prevYRef.current;

            if (currentResizerRef.current.classList.contains("se")) {
              el.width += deltaX;
              el.height += deltaY;
            } else if (currentResizerRef.current.classList.contains("sw")) {
              el.width -= deltaX;
              el.height += deltaY;
              el.x += deltaX;
            } else if (currentResizerRef.current.classList.contains("ne")) {
              el.width += deltaX;
              el.height -= deltaY;
              el.y += deltaY;
            } else {
              el.width -= deltaX;
              el.height -= deltaY;
              el.x += deltaX;
              el.y += deltaY;
            }

            drawElement();
          }

          prevXRef.current = mouseX;
          prevYRef.current = mouseY;
        }
      });
    };

    const mouseup = () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      isResizingRef.current = false;
    };

    const resizers = document.querySelectorAll(".resizer");
    resizers.forEach((resizer) => {
      resizer.addEventListener("mousedown", (e) => {
        currentResizerRef.current = e.target;
        isResizingRef.current = true;
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
      });
    });

    canvas.addEventListener("mousedown", mousedown);

    drawElement();

    return () => {
      canvas.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [elements]);

  const deleteSelectedElement = () => {
    if (selectedElementIndex !== null) {
      const updatedElements = [...elements];
      updatedElements.splice(selectedElementIndex, 1);
      setElements(updatedElements);
    }
  };

  return (
    <div>
      <button onClick={deleteSelectedElement}>Delete Selected</button>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default SelectAndDelete;
