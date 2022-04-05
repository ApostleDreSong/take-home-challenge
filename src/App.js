import { useEffect, useState } from "react";
import "./App.css";
import Instructions from "./Instructions";
import Placeholder from "./Placeholder";
import Trigger from "./Trigger";
import SelectedOutput from "./SelectedOutput";

function App() {
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  function handleTrigger() {
    // setSelected("No implementation; unhandled trigger");
    setOpenModal(true);
  }

  const handleKeyDown = (event) => {
    const { key } = event; // "ArrowRight", "ArrowLeft", "ArrowUp", "Enter", or "ArrowDown"
    if (event.metaKey && key.toLowerCase() === "k") {
      setOpenModal(true);
    }
    event.stopPropagation();
  };


  useEffect(() => {

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div className="App" style={{ overflow: "auto" }}>
      <Instructions />
      <div
        className="Implementation"
        onKeyDown={(event) => {
          console.log("na me ooo");
          // handleKeyDown(event)
        }}
      >
        <Trigger onTrigger={handleTrigger} />

        {/* Replace the Placeholder component below with your implementation */}
        <Placeholder
          openModal={openModal}
          setOpenModal={setOpenModal}
          setSelected={setSelected}
        />

        <SelectedOutput selected={selected} />
      </div>
    </div>
  );
}

export default App;
