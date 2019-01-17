import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Link } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import { Redirect } from "react-router";
import FacebookLogin from "react-facebook-login";
import store from "store";
import Dialog from "material-ui/Dialog";

const style = {
  margin: 15
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      newEmail: "",
      password: "",
      errorText: "",
      message: "",
      redirectToReferrer: false,
      fbVerify: false,
      open: false,
      isUserexists: false,
      msg: "",
      id: ""
    };
    this.emailValidator = this.emailValidator.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClick = e => {
    e.preventDefault();
    var apiBaseUrl = `/login/${this.state.email}/${
      this.state.password
    }`;
    fetch(apiBaseUrl)
      .then(res => {
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          store.set("user", this.state.email);
          this.setState({ redirectToReferrer: true });
          console.log("login successful");
        } else {
          this.setState({ message: "Authetication Error" });
          console.log("Authetication Error");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  handleClickReset() {
    console.log(this.state.newEmail);
    this.handleClose();
    if (this.state.newEmail !== "") {
      var random = this.randomString(
        8,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );
      fetch(`/login/${this.state.newEmail}`)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              msg: "Temporary Password has been sent to your Registred Email."
            });
            var self = this;
            setTimeout(function() {
              self.setState({ msg: " " });
            }, 5000);
            return res.json();
          }
          if (res.status === 404) {
            this.setState({ msg: "User does not exists" });
            var self = this;
            setTimeout(function() {
              self.setState({ msg: " " });
            }, 5000);
          }
        })
        .then(res => {
          this.setState({ id: res._id });
          console.log(random);
          var payload = {
            password: random
          };
          fetch(`/login/${this.state.id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          })
            .then(res => {
              if (res.status === 200) {
                var payload1 = {
                  password: random,
                  email: this.state.newEmail
                };
                fetch("/send", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(payload1)
                }).catch(err => {
                  console.log(err);
                });
              }
              this.setState({ newEmail: "" });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        msg: "Please fill the email address field to Reset the password"
      });
      var self = this;
      setTimeout(() => {
        self.setState({ msg: "" });
      }, 3000);
    }
  }

  emailValidator(event) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (event.target.value.match(pattern)) {
      this.setState({ email: event.target.value, emailError: "" });
    } else {
      this.setState({ emailError: "Please enter Valid email address" });
    }
  }

  responseFacebook = response => {
    console.log(response);
    if (response.accessToken) {
      store.set("user", response.email);
      this.setState({ fbVerify: true });
    }
  };

  render() {
    const actions = [
      <FlatButton label="OK" primary={true} onClick={this.handleClickReset} />
    ];

    if (this.state.redirectToReferrer) {
      return <Redirect to="/todolist" />;
    }

    if (this.state.fbVerify === true) {
      return <Redirect to="/todolist" />;
    }

    const buttonStyle = {
      backgroundColor: "transparent",
      color: "white"
    };

    const rightButtons = (
      <div>
        <Link to="/">
          <FlatButton label="Home" style={buttonStyle} />
        </Link>
      </div>
    );

    const textStyle = {
      width: 400
    };

    const isDisabled = this.state.email !== "" && this.state.password !== "";

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Login" iconElementRight={rightButtons} />
            <p className="resetStyle">{this.state.msg}</p>
            <form className="formStyle">
              <p className="messageStyle">{this.state.message}</p>
              <TextField
                hintText="Enter your Email"
                floatingLabelText="Username"
                style={textStyle}
                errorText={this.state.emailError}
                onChange={event => this.emailValidator(event)}
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                style={textStyle}
                type="password"
                onChange={(event, newPassword) =>
                  this.setState({ password: newPassword })
                }
              />
              <br />
              <RaisedButton
                label="Submit"
                primary={true}
                disabled={!isDisabled}
                style={style}
                onClick={event => this.handleClick(event)}
              />
              <RaisedButton
                label="Reset Password"
                primary={true}
                style={style}
                onClick={this.handleOpen}
              />
              <Dialog
                title="Password Change Confirmation"
                actions={actions}
                modal={true}
                open={this.state.open}
              >
                <div>
                  <TextField
                    hintText="Enter your Registered Email Address"
                    floatingLabelText="Email"
                    style={textStyle}
                    onChange={(event, newEmail1) =>
                      this.setState({ newEmail: newEmail1 })
                    }
                  />
                </div>
              </Dialog>
              <p>Not Registred yet? Register Now</p>
              <Link to="/Register">
                <RaisedButton label="Register" primary={true} style={style} />
              </Link>
              <br />
              {/* <FacebookLogin
                appId="334301553731827"
                autoLoad={true}
                fields="name,email,picture"
                cssClass="kep-login-facebook kep-login-facebook-[50]"
                callback={this.responseFacebook}
                icon="fa-facebook"
              /> */}
            </form>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Login;
