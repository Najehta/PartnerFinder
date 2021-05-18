import React from "react";
import "./Components.css";
import { Button } from "@material-ui/core";
import MultiSelect from "react-multi-select-component";
import { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core/";
import { Msgtoshow } from "./Msgtoshow";

import { BACKEND_URL } from "../utils";

import { BeatLoader } from "react-spinners";
//???
const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    fontSize: 30,
  },
}));
const Getcalls = (props) => {
  const classes = useStyles();

  //MultiSelect parameters definition
  const options = [
    { label: "BSF", value: "BSF" },
    { label: "ISF", value: "ISF" },
    { label: "Ministry Of Science And Technology", value: "MST" },
    { label: "Innovation Isreal", value: "INNOVATION" },
  ];
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#02203c",
      borderBottom: "1px dotted pink",
      color: "white",
      fontSize: "13px",
    }),
    placeholder: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "#02203c",
      color: "white",
      fontSize: "13px",
    }),

    option: (styles) => ({
      ...styles,
      color: "white",
      backgroundColor: "#02203c",
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "#f1f3f5",
        color: "black",
        fontSize: "13px",
      },
    }),
    singleValue: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
  };

  const [selectedOrganization, setselectedOrganization] = useState([]);

  const [state, setState] = React.useState({
    loading: false,
    firstLoading: true,
  });
  const handleChoose = (event) => {
    setselectedOrganization(event);
    //props.setState({ ...props.state, selected: event });
  };

  const updateOrganizations = () => {
    setState({ ...state, loading: true });
    let organizations = selectedOrganization.map((value) => {
      return value.value;
    });

    let params = {
      data: JSON.stringify({
        organizations: organizations,
      }),
    };

    let url = new URL(BACKEND_URL + "update/call_update/");

    //searchParams?
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    fetch(url, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((resp) => {
        if ("Error" in resp) {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Failed",
            body: "Error while updating the Organizations data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "Organizations data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating Organizations data",
          visible: true,
        });
      });
  };

  const [msgState, setMsgState] = React.useState({
    title: "",
    body: "",
    visible: false,
  });

  return (
    <div className="getCalls">
      <Msgtoshow
        {...msgState}
        handleClose={() => setMsgState({ ...msgState, visible: false })}
      />
      <div className="getTitle">
        <h1>Get calls from:</h1>
        <h5>Select an organization,then press Update now</h5>
      </div>
      <div className="getCallsMultiSelect">
        <h2 id="textFontFamily" style={{ color: "#02203c" }}>
          Organizations
        </h2>
        <FormControl id="text_select">
          <MultiSelect
            options={options}
            styles={customStyles}
            value={selectedOrganization}
            onChange={handleChoose}
            focusSearchOnOpen={true}
            className="select"
            labelledBy={"Select"}
          />
        </FormControl>
      </div>
      <div className="GetCallsButton">
        <Button
          color="primary"
          round
          variant="contained"
          id="BackgroundColor"
          onClick={() => updateOrganizations()}
          disabled={state.loading}
        >
          {state && state.loading && <i className="fa fa-refresh fa-spin"></i>}
          {state && state.loading && (
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={true}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className={classes.title}>LOADING</DialogTitle>
              <DialogContent style={{ "margin-left": "17px" }}>
                <BeatLoader />
              </DialogContent>
            </Dialog>
          )}
          {state && !state.loading && <span>Update</span>}
        </Button>
      </div>
    </div>
  );
};

export default Getcalls;
