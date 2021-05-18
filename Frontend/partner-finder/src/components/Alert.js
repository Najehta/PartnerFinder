import React from "react";
import "./Components.css";
import MultiSelect from "react-multi-select-component";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const Alert = (props) => {
  const options = [
    { label: "BSF", value: "BSF" },
    { label: "ISF", value: "ISF" },
    { label: "Ministry Of Science And Technology", value: "MST" },
    { label: "Innovation Isreal", value: "INNOVATION" },
  ];
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderBottom: "1px dotted pink",
      color: "white",
      fontSize: "13px",
    }),
    placeholder: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      color: "white",
      fontSize: "13px",
    }),

    option: (styles) => ({
      ...styles,
      color: "white",
      backgroundColor: "white",
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "#f1f3f5",
        color: "black",
        fontSize: "13px",
      },
    }),
    singleValue: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
  };

  const [selected, setSelected] = useState([]);

  const [state, setState] = React.useState({
    loading: false,
    firstLoading: true,
  });
  const handleChoose = (event) => {
    setSelected(event);
    // props.setState({ ...props.state, selected: event });
  };

  //EMAIL
  const handleInputChange = (event) => {
    let newState = { ...state };
    newState[event.target.id] = event.target.value;
    setState(newState);
    //props.setState({ ...props.state, ...newState });
    let newFormState = { ...formState };
    if (
      event.target.id !== "email" &&
      (event.target.value > 1 || event.target.value < 0)
    ) {
      newFormState[event.target.id] = true;
    } else {
      newFormState[event.target.id] = false;
    }
    setFormState(newFormState);
  };

  const [formState, setFormState] = React.useState({
    email: false,
  });

  const classes = useStyles();
  return (
    <div className="Alerts">
      <div className="title">
        <h1>Alert Subcription</h1>
        <h5>Enter your email to receive updates</h5>
      </div>
      <div className="email">
        <TextField
          id="email"
          onChange={handleInputChange}
          className={Alert.textField}
          value={state.email}
          error={formState.email}
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
      </div>
      <div className="emailMultiSelect">
        <h2 id="textFontFamily" style={{ color: "black" }}>
          Organizations
        </h2>
        <FormControl id="text_select">
          <MultiSelect
            options={options}
            styles={customStyles}
            value={selected}
            onChange={handleChoose}
            focusSearchOnOpen={true}
            className="select"
            labelledBy={"Select"}
          />
        </FormControl>
      </div>
    </div>
  );
};

export default Alert;
