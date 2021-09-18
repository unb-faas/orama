import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";

export const withSnackbar = WrappedComponent => 
  props => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success"); /** error | warning | info */
    const duration = 3000;

    const showMessageSuccess = (message, detail = "") => {
        showMessage("success", message, detail);
    };

    const showMessageError = (message, detail = "") => {
        showMessage("error", message, detail);
        console.log(Error().stack)
    };

    const showMessageWarning = (message, detail = "") => {
        showMessage("warning", message, detail);
    };

    const showMessage = (severity, message, detail = "") => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
        if(!detail){
          console.log(message)
        } else {
          console.log(`${message} => \n ${detail}`)
        }
    }

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    return (
      <>
        <WrappedComponent {...props} 
            showMessage={showMessage} 
            showMessageWarning={showMessageWarning} 
            showMessageError={showMessageError} 
            showMessageSuccess={showMessageSuccess}             
            />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          autoHideDuration={duration}
          open={open}
          onClose={handleClose}
          TransitionComponent={Slide}
        >
          <Alert variant="filled" onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  };
