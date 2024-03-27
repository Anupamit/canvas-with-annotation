import { useState } from "react";

function Dragshapes() {
  const [objects, setObjects] = useState([
    { id: 1, type: "rectangle", x: 100, y: 100 },
    { id: 2, type: "circle", x: 200, y: 200 },
    // Add more objects as needed
  ]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id); // Set data to transfer the object ID
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default behavior to allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("text/plain")); // Get the dropped object ID
    const newObj = objects.find((obj) => obj.id === id); // Find the object by ID
    if (newObj) {
      const updatedObjects = objects.map((obj) => {
        if (obj.id === id) {
          // Update the object's position based on the drop position
          return { ...obj, x: e.clientX, y: e.clientY };
        }
        return obj;
      });
      setObjects(updatedObjects); // Update state with the new object positions
    }
  };

  return (
    <div className="Dragshapes" onDragOver={handleDragOver} onDrop={handleDrop}>
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={`object ${obj.type}`}
          style={{ left: obj.x, top: obj.y }}
          draggable
          onDragStart={(e) => handleDragStart(e, obj.id)}
        ></div>
      ))}
    </div>
  );
}

export default Dragshapes;
