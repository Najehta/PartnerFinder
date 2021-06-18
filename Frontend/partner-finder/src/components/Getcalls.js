import React from "react";
import "./Components.css";
import { Button } from "@material-ui/core";
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
    EU: "",
    Technion: "",
    BSF: "",
    INNOVATION: "",
    ISF: "",
    MST: "",
    firstLoading: true,
  });

  if (state.firstLoading) {
    setState({ ...props.updateState });
  }

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
    <React.Fragment>
      <Msgtoshow
        {...msgState}
        handleClose={() => setMsgState({ ...msgState, visible: false })}
      />
      <div className="getCalls">
        <h1 style={{ fontSize: "45px" }}>Updates</h1>
        <div className="UpdateParent">
          <div className="BsfUpdate">
            <h2 style={{ fontSize: "28px" }}>BSF</h2>
            <h3
              style={{
                "margin-left": "50px",
                fontSize: "24px",
              }}
            >
              Last Update :
            </h3>
            <h3 style={{ marginTop: "8%", fontSize: "15px" }}>{state.BSF}</h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateBsf()}
              disabled={state.loading}
              style={{ "margin-left": "50px", "margin-top": "20px" }}
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
            <h2 style={{ fontSize: "28px" }}>ISF</h2>
            <h3 style={{ "margin-left": "50px", fontSize: "24px" }}>
              Last Update :
            </h3>
            <h3 style={{ marginTop: "8%", fontSize: "15px" }}>{state.ISF}</h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateIsf()}
              disabled={state.loading}
              style={{ "margin-left": "50px", "margin-top": "20px" }}
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
            <h2 style={{ fontSize: "28px" }}>
              Ministry Of Science And Technology
            </h2>
            <h3 style={{ "margin-left": "50px", fontSize: "24px" }}>
              Last Update :
            </h3>
            <h3 style={{ marginTop: "8%", fontSize: "15px" }}>{state.MST}</h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateMst()}
              disabled={state.loading}
              style={{ "margin-left": "50px", "margin-top": "20px" }}
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
            <h2 style={{ fontSize: "28px" }}>Innovation Israel</h2>
            <h3 style={{ "margin-left": "50px", fontSize: "24px" }}>
              Last Update :
            </h3>
            <h3 style={{ marginTop: "8%", fontSize: "15px" }}>
              {state.INNOVATION}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateInnovation()}
              disabled={state.loading}
              style={{ "margin-left": "50px", "margin-top": "20px" }}
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
            <h2 style={{ fontSize: "28px" }}>Others Via Technion</h2>
            <h3 style={{ "margin-left": "50px", fontSize: "24px" }}>
              Last Update :
            </h3>
            <h3 style={{ marginTop: "8%", fontSize: "15px" }}>
              {state.Technion}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateTechnion()}
              disabled={state.loading}
              style={{ "margin-left": "50px", "margin-top": "20px" }}
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
            <h2 style={{ fontSize: "28px" }}>EU</h2>
            <h3 style={{ "margin-left": "50px", fontSize: "24px" }}>
              Last Update :
            </h3>
            <h3 style={{ marginTop: "8%", fontSize: "15px" }}>{state.EU}</h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateEu()}
              disabled={state.loading}
              style={{ "margin-left": "50px", "margin-top": "20px" }}
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
    </React.Fragment>
  );
};

export default Getcalls;
