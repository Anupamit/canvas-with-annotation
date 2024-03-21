import AnnotationComponent from "./AnnotationComponent";
import Annothtml from "./Annothtml";
import "./App.css";
import FreehandDrawCanvas from "./FreehandDrawCanvas";
import HighlightCanvas from "./HighlightCanvas";
import Highlighter from "./Highlighter";
import LineCanvas from "./LineCanvas";
import RectangleCanvas from "./RectangleCanvas";
// import SelectableRectangleCanvas from "./SelectableRectangleCanvas";
import TextRectangleCanvas from "./TextRectangleCanvas";

function App() {
  return (
    <>
      <AnnotationComponent />
      <Annothtml />
      <LineCanvas />
      <RectangleCanvas />
      <FreehandDrawCanvas />
      <HighlightCanvas />
      <Highlighter />
      <TextRectangleCanvas />
      {/* <SelectableRectangleCanvas /> */}
    </>
  );
}

export default App;
