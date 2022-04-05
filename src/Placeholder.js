import React, { useEffect, useState, useRef } from "react";
import { FormControl } from "@mui/material";
import { Input } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { search } from "./API";
import "antd/dist/antd.css";

const StyledWrapper = styled.div`
  width: 80%;
  border-radius: 10px;
  margin: auto;
  background-color: #e0dbdb;
  min-height: 600px;
  margin-top: 10px;
`;

const StyledFormControl = styled(FormControl)`
  width: 98%;
`;

const StyledSuggestion = styled.div`
  cursor: pointer;
  margin-bottom: 5px;
  background-color: ${(props) => (props.selected ? "#add8e6" : "none")};
`;
const StyledSuggestions = styled.div`
  overflow: auto;
  max-height: 80vh;
  padding: 10px;
`;

export default function Placeholder({ openModal, setOpenModal, setSelected }) {
  const [inputValue, setInputValue] = useState("");
  const [originalSuggestions, setOriginalSuggestions] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [selectedGroupType, setSelectedGroupType] = useState(0);

  const suggestionsRef = useRef(null);

  const SetNextArrowSelection = () => {
    const newIndex = selectedSuggestionIndex + 1;
    setSelectedSuggestionIndex(newIndex);
  };
  const SetPreviousArrowSelection = () => {
    const newIndex = selectedSuggestionIndex - 1;
    setSelectedSuggestionIndex(newIndex);
  };

  const groupByType = (arr) =>
    arr.reduce((acc, element) => {
      // Extract key and height value array
      const [key, value] = Object.entries(element)[0];
      // Get or create if non-exist, and push height value from array, index 0
      (acc[value.type] || (acc[value.type] = [])).push({
        ...value,
      });
      return acc;
    }, {});

  const handleChange = (value) => {
    setInputValue(value);
    setOriginalSuggestions(search(value));
    setSuggestions(groupByType(search(value)));
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleKeyDown = (event) => {
    const { key } = event; // "ArrowRight", "ArrowLeft", "ArrowUp", "Enter", or "ArrowDown"

    if (
      key === "ArrowDown" &&
      Object.entries(suggestions)[selectedGroupType] &&
      selectedSuggestionIndex <
        Object.entries(suggestions)[selectedGroupType][1]?.length - 1
    ) {
      /// if it is the last of the group, jump to the next group if available
      SetNextArrowSelection();
    } else if (
      key === "ArrowDown" &&
      Object.entries(suggestions)[selectedGroupType][1]?.length - 1 ===
        selectedSuggestionIndex &&
      selectedGroupType < Object.entries(suggestions).length - 1
    ) {
      setSelectedGroupType(selectedGroupType + 1);
      setSelectedSuggestionIndex(0);
    }

    if (key === "ArrowUp" && selectedSuggestionIndex > 0) {
      SetPreviousArrowSelection();
    } else if (
      key === "ArrowUp" &&
      selectedSuggestionIndex <= 1 &&
      selectedGroupType !== 0
    ) {
      setSelectedGroupType(selectedGroupType - 1);
      setSelectedSuggestionIndex(
        Object.entries(suggestions)[selectedGroupType - 1][1]?.length - 1
      );
    }

    if (key === "Enter" && Object.entries(suggestions)[selectedGroupType]) {
      setSelected(
        Object.entries(suggestions)[selectedGroupType][1][
          selectedSuggestionIndex
        ]?.id
      );
      setOpenModal(false);
    }

    if (event.metaKey && key.toLowerCase() === "k") {
      setOpenModal(false);
    }

    event.stopPropagation();
  };

  return (
    <div onKeyDown={(event) => handleKeyDown(event)}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledWrapper>
          <StyledFormControl sx={{ m: 1 }} variant="standard">
            <Input
              ref={suggestionsRef}
              value={inputValue}
              onChange={(e) => handleChange(e?.target?.value)}
              prefix={<SearchIcon className="site-form-item-icon" />}
            />
          </StyledFormControl>
          <StyledSuggestions ref={suggestionsRef} onKeyDown={handleKeyDown}>
            {Object.entries(suggestions).map(
              ([key, groupedSuggestions], groupIndex) => (
                <div key={groupIndex}>
                  <h2 style={{ backgroundColor: "blue", color: "white" }}>
                    {key}
                  </h2>
                  <div style={{ marginLeft: "10px" }}>
                    {groupedSuggestions
                      .sort((a, b) => a?.id.localeCompare(b?.id))
                      .map(({ author, id, modified }, index) => (
                        <StyledSuggestion
                          onMouseEnter={() => {
                            setSelectedSuggestionIndex(index);
                            setSelectedGroupType(groupIndex);
                          }}
                          selected={
                            selectedSuggestionIndex === index &&
                            selectedGroupType === groupIndex
                          }
                          key={index}
                          onClick={(e) => {
                            setSelected(id);
                            setOpenModal(false);
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 800 }}>{id}</span>
                            {` - by: ${author}`}
                          </div>
                          <div>{`Updated: ${modified}`}</div>
                        </StyledSuggestion>
                      ))}
                  </div>
                </div>
              )
            )}
          </StyledSuggestions>
        </StyledWrapper>
      </Modal>
    </div>
  );
}
