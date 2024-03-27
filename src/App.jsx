import AnnotationComponent from "./AnnotationComponent";
import Annothtml from "./Annothtml";
import "./App.css";
import CanvasZoom from "./CanvasZoom";
import FinalCanvas from "./FinalCanvas";
import FreehandDrawCanvas from "./FreehandDrawCanvas";
import HighlightCanvas from "./HighlightCanvas";
import Highlighter from "./Highlighter";
import LineCanvas from "./LineCanvas";
import RectangleCanvas from "./RectangleCanvas";
import ResizableCanvasElement from "./ResizableCanvasElement";
// import SelectableRectangleCanvas from "./SelectableRectangleCanvas";
import TextRectangleCanvas from "./TextRectangleCanvas";

function App() {
  return (
    <>
      <AnnotationComponent />
      <FinalCanvas />
      <Annothtml />
      <LineCanvas />
      <RectangleCanvas />
      <FreehandDrawCanvas />
      <HighlightCanvas />
      <Highlighter />
      <TextRectangleCanvas />
      <CanvasZoom />
      <ResizableCanvasElement />
      {/* <SelectableRectangleCanvas /> */}
    </>
  );
}

export default App;
