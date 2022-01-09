import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { backendUrlUser } from '../BackendURL';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
import { InputText } from "primereact/inputtext";
import { Growl } from 'primereact/growl';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginform: {
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                contactNo: "",
                password: ""
            },
            loginformValid: {
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: ""
        }
        this.showError = this.showError.bind(this)
    }

    handleClick = () => {
        this.setState({ loadRegister: true })
    }

    showError = () => {
        this.growl.show({ severity: 'error', summary: 'Invalid Login Credentials', detail: this.state.errorMessage, life: 5000, closeable: true });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { loginform } = this.state;
        this.setState({
            loginform: { ...loginform, [name]: value }
        });
        this.validateField(name, value);
        console.log(this.state.loginform[name], name);
    }

    login = () => {
        const { loginform } = this.state;
        axios.post(backendUrlUser + '/login', loginform)
            .then(response => {
                console.log(response);
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);
                this.setState({ loadHome: true, userId: userId, errorMessage: '' });
                //window.location.reload();
                window.location.href = window.location.origin + "/wanderlust-ui";

            }).catch(error => {

                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message });
                    sessionStorage.clear();
                } else {
                    this.setState({ errorMessage: 'Server Error. Kindly visit after sometime...' });
                    sessionStorage.clear();
                }
            })
        // console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.login();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;

        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[6-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Invalid Contact Number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is mandatory";
                    formValid.password = false;
                    // eslint-disable-next-line
                } else if (!((value.match(/[A-Z]/) && value.match(/[a-z]/) && value.match(/[0-9]/)) && value.match(/[!@#\$%\^&]*/) && value.length >= 7 && value.length <= 20)) {
                    fieldValidationErrors.password = "Please Enter a valid password"
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: "",
            errorMessage: ""
        });
    }

    render() {
        if (this.state.loadHome === true)
            return <Redirect to={'/home/' + this.state.userId} />
        if (this.state.loadRegister === true) return <Redirect to={'/register'} />
        return (
            <div>
                <section id="loginPage" className="loginSection">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-9 offset-3" >
                                <h1 className="text-left animate-bottom ">Login</h1>

                                <Growl ref={event => (this.growl = event)} position="bottomleft" />

                                <form className="form" onSubmit={this.handleSubmit}> {/* [formGroup]="loginForm" (ngSubmit)="login()" */}

                                    <div className="form-inline form-group" >
                                        <InputText
                                            type="number"
                                            value={this.state.loginform.contactNo}
                                            onChange={this.handleChange}
                                            id="uContactNo"
                                            name="contactNo"
                                            placeholder="Contact Number"
                                            tooltip="Contact number should be a valid 10 digit number"
                                            className="p-error col-md-8 form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        {this.state.loginformErrorMessage.contactNo ? <Message severity="error" text={this.state.loginformErrorMessage.contactNo} /> : null}
                                        {!(this.state.loginformErrorMessage.contactNo) && this.state.loginform.contactNo ? <Message severity="success" text=""></Message> : null}

                                    </div>


                                    <div className="form-inline form-group" >

                                        <InputText
                                            type="password"
                                            value={this.state.loginform.password}
                                            onChange={this.handleChange}
                                            id="uPass"
                                            name="password"
                                            placeholder="Password"
                                            tooltip="Please enter your Password"
                                            className="p-error col-md-8 form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        {this.state.loginformErrorMessage.password ? <Message severity="error" text={this.state.loginformErrorMessage.password} /> : null}
                                        {!(this.state.loginformErrorMessage.password) && this.state.loginform.password ? <Message severity="success" text=""></Message> : null}
                                    </div>

                                    <div className="col-md-8 text-left"><span className="text-danger">*</span> All fields are mandatory</div>
                                    <br />

                                    {this.state.errorMessage ? this.showError() : null} {/* Error Message trigger*/}

                                    <div className="form-inline form-group">

                                        <button
                                            type="submit"
                                            disabled={!this.state.loginformValid.buttonActive}
                                            className="btn btn-primary col-md-8 btn-block btn-primary:hover btn-primary:focus"
                                            name='login'
                                            id='login'>

                                            Login
                                        </button> {/* Login Button*/}

                                        <button
                                            type="button"
                                            className="btn btn-block col-md-8 btn-primary"
                                            onClick={this.handleClick}
                                            name='register'
                                            id='register'>

                                            Click here to Register
                                        </button> {/* Register Button*/}
                                    </div>
                                </form>
                                <br />
                                {/* <!--can be a button or a link based on need --> */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* <div * ngIf= "!registerPage" >
            <router-outlet></router-outlet>
            </div > */}
                {/* *ngIf="!registerPage" */}
                {/* </div > */}
            </div >

        )
    }
}

export default Login;