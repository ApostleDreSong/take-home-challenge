import React from "react";

function SelectedOutput({ selected }) {
  // No need to convert prop to string, the input component will always  return a string or null from the parent
  // const selectedString = selected.toString();
  return (
    <div className="Output" data-cy="selected-output">
      <p>Selected Output:</p>
      <p>{selected || "Nothing selected"}</p>
    </div>
  );
}

export default SelectedOutput;
