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

  const [state, setState] = React.useState({
    loading: false,
    firstLoading: true,
  });

  const updateBsf = () => {
    setState({ ...state, loading: true });

    let params = {
      data: JSON.stringify({
        organizations: ["BSF"],
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

  const updateIsf = () => {
    setState({ ...state, loading: true });

    let params = {
      data: JSON.stringify({
        organizations: ["ISF"],
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
  const updateMst = () => {
    setState({ ...state, loading: true });

    let params = {
      data: JSON.stringify({
        organizations: ["MST"],
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
  const updateInnovation = () => {
    setState({ ...state, loading: true });

    let params = {
      data: JSON.stringify({
        organizations: ["INNOVATION"],
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
  const updateTechnion = () => {
    setState({ ...state, loading: true });

    let params = {
      data: JSON.stringify({
        organizations: ["Technion"],
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
  const updateEu = () => {
    setState({ ...state, loading: true });

    let params = {
      data: JSON.stringify({
        organizations: ["EU"],
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
      <h1 style={{ fontSize: "50px" }}>Updates</h1>
      <div className="UpdateParent">
        <div className="BsfUpdate">
          <h1>BSF</h1>
          <h2 id="textFontFamily" style={{ "margin-left": "50px" }}>
            Last Update :
          </h2>
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => updateBsf()}
            disabled={state.loading}
            style={{ "margin-left": "50px", "margin-top": "50px" }}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
            {state && !state.loading && <span>Update Now</span>}
          </Button>
        </div>
        <div className="IsfUpdate">
          <h1>ISF</h1>
          <h2 id="textFontFamily" style={{ "margin-left": "50px" }}>
            Last Update :
          </h2>
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => updateIsf()}
            disabled={state.loading}
            style={{ "margin-left": "50px", "margin-top": "50px" }}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
            {state && !state.loading && <span>Update Now</span>}
          </Button>
        </div>
        <div className="MstUpdate">
          <h1>Ministry Of Science And Technology</h1>
          <h2 id="textFontFamily" style={{ "margin-left": "50px" }}>
            Last Update :
          </h2>
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => updateMst()}
            disabled={state.loading}
            style={{ "margin-left": "50px", "margin-top": "50px" }}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
            {state && !state.loading && <span>Update Now</span>}
          </Button>
        </div>
        <div className="InnovationUpdate">
          <h1>Innovation Israel</h1>
          <h2 id="textFontFamily" style={{ "margin-left": "50px" }}>
            Last Update :
          </h2>
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => updateInnovation()}
            disabled={state.loading}
            style={{ "margin-left": "50px", "margin-top": "50px" }}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
            {state && !state.loading && <span>Update Now</span>}
          </Button>
        </div>
        <div className="TechnionUpdate">
          <h1>Technion</h1>
          <h2 id="textFontFamily" style={{ "margin-left": "50px" }}>
            Last Update :
          </h2>
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => updateTechnion()}
            disabled={state.loading}
            style={{ "margin-left": "50px", "margin-top": "50px" }}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
            {state && !state.loading && <span>Update Now</span>}
          </Button>
        </div>
        <div className="EuUpdate">
          <h1>EU</h1>
          <h2 id="textFontFamily" style={{ "margin-left": "50px" }}>
            Last Update :
          </h2>
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => updateEu()}
            disabled={state.loading}
            style={{ "margin-left": "50px", "margin-top": "50px" }}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
            {state && !state.loading && <span>Update Now</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Getcalls;
