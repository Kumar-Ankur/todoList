import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Link } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import { Redirect } from "react-router";
import Recaptcha from "react-recaptcha";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

const style = {
  margin: 15
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      contact: "",
      errorText: "",
      confirmErrorText: "",
      emailError: "",
      disabled: true,
      redirectToReferrer: false,
      message: "",
      captaVerified: false,
      value: 1,
      genderValue: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.updateTextField = this.updateTextField.bind(this);
    this.emailValidator = this.emailValidator.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  verifyCallback = response => {
    console.log(response);
    if (response) {
      this.setState({ captaVerified: true });
    }
  };

  handleClick = e => {
    e.preventDefault();
    var payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      contact: this.state.contact,
      gender: this.state.genderValue
    };

    fetch("/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          
          this.setState({ redirectToReferrer: true });
        } 
        else {
          this.setState({ message: "Problem during Registration.... User already exists." });
          setTimeout(() => {
              this.setState({ message : ""})
          },3000)
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateTextField(event, value) {
    if (value.length === 10) {
      this.setState({ contact: event.target.value, errorText: "" });
    } else {
      this.setState({ errorText: "Please enter only 10 digits mobile number" });
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

  checkConfirmPassword(event) {
    this.setState({ cpassword: event.target.value });
    if (this.state.password === event.target.value) {
      this.setState({ confirmErrorText: "" });
    } else {
      this.setState({ confirmErrorText: "Password does not Match" });
    }
  }

  dropdownhandleChange = (event, index, value) => {
    this.setState({ value });
    console.log(this.state.value);
    if (this.state.value === 1) {
      this.setState({ genderValue: "Male" });
    } else if (this.state.value === 2) {
      this.setState({ genderValue: "Female" });
    } else {
      this.setState({ genderValue: "Decline to designate" });
    }
  };
  render() {
    if (this.state.redirectToReferrer) {
      return <Redirect to="/Login" />;
    }

    const isdisable =
      this.state.name !== "" &&
      this.state.email !== "" &&
      this.state.password !== "" &&
      this.state.cpassword !== "" &&
      this.state.contact !== "" &&
      this.state.errorText === "" &&
      this.state.confirmErrorText === "" &&
      this.state.captaVerified === true &&
      this.state.value !== 1;

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

    const dropdownStyle = {
      width: 450
    };

    var callback = function() {
      console.log("Done!!!!");
    };

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Register" iconElementRight={rightButtons} />
            <p className="messStyle">{this.state.message}</p>
            <form className="formStyle">
              <TextField
                hintText="Enter your  Name"
                floatingLabelText=" Name"
                style={textStyle}
                onChange={(event, newValue) =>
                  this.setState({ name: newValue })
                }
              />
              <br />
              <TextField
                hintText="Enter your Email"
                type="email"
                floatingLabelText="Email"
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
                onChange={(event, newValue) =>
                  this.setState({ password: newValue })
                }
              />
              <br />
              <TextField
                type="password"
                hintText="Confirm Password"
                floatingLabelText="Confirm Password"
                style={textStyle}
                required={true}
                errorText={this.state.confirmErrorText}
                onChange={event => this.checkConfirmPassword(event)}
              />
              <br />
              <TextField
                type="number"
                hintText="Enter your Mobile Number"
                floatingLabelText="Mobile Number"
                style={textStyle}
                required={true}
                errorText={this.state.errorText}
                onChange={(event, v) => this.updateTextField(event, v)}
              />
              <br />
              <DropDownMenu
                value={this.state.value}
                onChange={this.dropdownhandleChange}
                style={dropdownStyle}
                autoWidth={false}
              >
                <MenuItem value={1} primaryText="Select Gender" />
                <MenuItem value={2} primaryText="Male" />
                <MenuItem value={3} primaryText="Female" />
                <MenuItem value={4} primaryText="Decline to designate" />
              </DropDownMenu>
              <br />
              <div className="recaptchaStyle">
                <Recaptcha
                  sitekey="6LfS6kUUAAAAANQFTbidkcgHuNwxwdsKpIwTlgFB"
                  type="reCAPTCHA v2"
                  render="explicit"
                  verifyCallback={this.verifyCallback}
                  onloadCallback={callback}
                />
              </div>

              <br />
              <RaisedButton
                label="Submit"
                primary={true}
                disabled={!isdisable}
                style={style}
                onClick={event => this.handleClick(event)}
              />
            </form>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Register;
