// import { useRef, useEffect } from "react";

// const ResizableCanvasElement = () => {
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const isResizingRef = useRef(false);
//   const currentResizerRef = useRef(null);
//   const prevXRef = useRef(0);
//   const prevYRef = useRef(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     ctxRef.current = canvas.getContext("2d");

//     const el = {
//       x: 50,
//       y: 50,
//       width: 100,
//       height: 100,
//     };

//     const drawElement = () => {
//       ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
//       ctxRef.current.fillRect(el.x, el.y, el.width, el.height);
//       drawResizers();
//     };

//     const drawResizers = () => {
//       const resizerSize = 8;
//       ctxRef.current.fillStyle = "black";
//       ctxRef.current.fillRect(
//         el.x + el.width - resizerSize / 2,
//         el.y + el.height - resizerSize / 2,
//         resizerSize,
//         resizerSize
//       );
//       ctxRef.current.fillRect(
//         el.x - resizerSize / 2,
//         el.y + el.height - resizerSize / 2,
//         resizerSize,
//         resizerSize
//       );
//       ctxRef.current.fillRect(
//         el.x + el.width - resizerSize / 2,
//         el.y - resizerSize / 2,
//         resizerSize,
//         resizerSize
//       );
//       ctxRef.current.fillRect(
//         el.x - resizerSize / 2,
//         el.y - resizerSize / 2,
//         resizerSize,
//         resizerSize
//       );
//     };

//     const mousedown = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;

//       if (
//         mouseX >= el.x &&
//         mouseX <= el.x + el.width &&
//         mouseY >= el.y &&
//         mouseY <= el.y + el.height
//       ) {
//         window.addEventListener("mousemove", mousemove);
//         window.addEventListener("mouseup", mouseup);

//         prevXRef.current = mouseX;
//         prevYRef.current = mouseY;
//       }
//     };

//     const mousemove = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;

//       if (!isResizingRef.current) {
//         const newX = el.x + (mouseX - prevXRef.current);
//         const newY = el.y + (mouseY - prevYRef.current);

//         el.x = newX;
//         el.y = newY;

//         drawElement();
//       } else {
//         const deltaX = mouseX - prevXRef.current;
//         const deltaY = mouseY - prevYRef.current;

//         if (currentResizerRef.current === "se") {
//           el.width += deltaX;
//           el.height += deltaY;
//         } else if (currentResizerRef.current === "sw") {
//           el.width -= deltaX;
//           el.height += deltaY;
//           el.x += deltaX;
//         } else if (currentResizerRef.current === "ne") {
//           el.width += deltaX;
//           el.height -= deltaY;
//           el.y += deltaY;
//         } else {
//           el.width -= deltaX;
//           el.height -= deltaY;
//           el.x += deltaX;
//           el.y += deltaY;
//         }

//         drawElement();
//       }

//       prevXRef.current = mouseX;
//       prevYRef.current = mouseY;
//     };

//     const mouseup = () => {
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//       isResizingRef.current = false;
//     };

//     const resizers = ["se", "sw", "ne", "nw"];
//     resizers.forEach((resizer) => {
//       canvas.addEventListener("mousedown", (e) => {
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         if (
//           mouseX >= el.x &&
//           mouseX <= el.x + el.width &&
//           mouseY >= el.y &&
//           mouseY <= el.y + el.height
//         ) {
//           currentResizerRef.current = resizer;
//           isResizingRef.current = true;
//           window.addEventListener("mousemove", mousemove);
//           window.addEventListener("mouseup", mouseup);
//         }
//       });
//     });

//     canvas.addEventListener("mousedown", mousedown);

//     drawElement();

//     return () => {
//       canvas.removeEventListener("mousedown", mousedown);
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={400}
//       height={400}
//       style={{ border: "1px solid black" }}
//     />
//   );
// };

// export default ResizableCanvasElement;

import { useRef, useEffect } from "react";

const ResizableCanvasElement = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isResizingRef = useRef(false);
  const currentResizerRef = useRef(null);
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    const el = {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };

    const drawElement = () => {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      ctxRef.current.fillRect(el.x, el.y, el.width, el.height);
    };

    const mousedown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX >= el.x &&
        mouseX <= el.x + el.width &&
        mouseY >= el.y &&
        mouseY <= el.y + el.height
      ) {
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        prevXRef.current = mouseX;
        prevYRef.current = mouseY;
      }
    };

    const mousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (!isResizingRef.current) {
        const newX = el.x + (mouseX - prevXRef.current);
        const newY = el.y + (mouseY - prevYRef.current);

        el.x = newX;
        el.y = newY;

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{ border: "1px solid black" }}
    />
  );
};

export default ResizableCanvasElement;
