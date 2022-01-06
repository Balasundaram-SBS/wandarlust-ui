import React, { Component } from "react";
import axios from "axios";
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { backendUrlUser } from '../BackendURL';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerForm: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            registerFormErrorMessage: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            registerFormValid: {
                name: false,
                emailId: false,
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            register: false
        }
    }

    handleClick = () => {
        this.setState({ register: true })
    }

    handleChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;
        let { registerForm } = this.state;
        this.setState({
            registerForm: { ...registerForm, [name]: value }
        });
        this.validateField(name, value);

    }

    register = () => {
        let { registerForm } = this.state;
        this.setState({ successMessage: '', errorMessage: '' })
        axios.post(backendUrlUser + '/register', registerForm)
            .then(response => {
                this.setState({ successMessage: response.data.message, errorMessage: '' })
            }).catch(error => {
                this.setState({ successMessage: '', errorMessage: error.response.data.message })
            })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.register();
    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.registerFormErrorMessage;
        let formValid = this.state.registerFormValid;
        switch (fieldname) {
            case "name":
                let nameRegex = /^[A-Z][A-Z ]*[A-Z]$/i
                if (!value || value === "") {
                    fieldValidationErrors.name = "Please enter your name";
                    formValid.name = false;
                } else if (!value.match(nameRegex)) {
                    fieldValidationErrors.name = "Please enter a valid name";
                    formValid.name = false;
                } else {
                    fieldValidationErrors.name = "";
                    formValid.name = true;
                }
                break;
            case "emailId":
                let emailIdRegex = /^[A-z]{1,}[@][A-z]{1,}\.[A-Za-z]{2,3}$/
                if (!value || value === "") {
                    fieldValidationErrors.emailId = "Please enter your email Id";
                    formValid.emailId = false;
                } else if (!value.match(emailIdRegex)) {
                    fieldValidationErrors.emailId = "Please enter a valid email Id";
                    formValid.emailId = false;
                } else {
                    fieldValidationErrors.emailId = "";
                    formValid.emailId = true;
                }
                break;
            case "contactNo":
                let contactNo = /^[6-9][0-9]{9}$/;
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your Contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(contactNo)) {
                    fieldValidationErrors.contactNo = "Please enter a valid Contact Number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                } else if (!((value.match(/[A-Z]/) && value.match(/[a-z]/) && value.match(/[0-9]/)) && value.match(/[!@#$%^&]*/) && value.length >= 7 && value.length <= 20)) {
                    fieldValidationErrors.password = "Please Enter a Stronger Password"
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.name && formValid.password && formValid.emailId && formValid.contactNo;
        this.setState({
            registerFormErrorMessage: fieldValidationErrors,
            registerFormValid: formValid,
            successMessage: ""
        });
    }

    render() {
        return (
            <div>
                <section id="registerpage" className="registerSection ">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-9 offset-3 ">

                                <form className="form " onSubmit={this.handleSubmit} hidden={this.state.register}>
                                    <h2 className="text-left animate-bottom">Join Us</h2>


                                    <div className="form-inline form-group">
                                        <InputText
                                            type="text"
                                            value={this.state.registerForm.name}
                                            onChange={this.handleChange}
                                            id="name"
                                            name="name"
                                            placeholder="Username"
                                            tooltip="Name should contain only alphabets and must not have any empty spaces"
                                            className="p-error col-md-8 form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        {this.state.registerFormErrorMessage.name ? <Message severity="error" text={this.state.registerFormErrorMessage.name} /> : null}
                                        {!(this.state.registerFormErrorMessage.name) && this.state.registerForm.name ? <Message severity="success" text=""></Message> : null}
                                    </div>
                                    <div className="form-inline form-group">
                                        <InputText
                                            type="text"
                                            value={this.state.registerForm.emailId}
                                            onChange={this.handleChange}
                                            id="emailId"
                                            name="emailId"
                                            placeholder="Email Id"
                                            tooltip="Email should be of the form 'abcd@xyz.com' only"
                                            className="p-error col-md-8 form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        {this.state.registerFormErrorMessage.emailId ? <Message severity="error" text={this.state.registerFormErrorMessage.emailId} /> : null}
                                        {!(this.state.registerFormErrorMessage.emailId) && this.state.registerForm.emailId ? <Message severity="success" text=""></Message> : null}
                                    </div>

                                    <div className="form-group form-inline">
                                        <InputText
                                            type="text"
                                            value={this.state.registerForm.contactNo}
                                            onChange={this.handleChange}
                                            id="contactNo"
                                            name="contactNo"
                                            tooltip="Contact number must start with digits 6-9 and be 10 digits long"
                                            placeholder="Contact Number"
                                            className="p-error col-md-8 form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        {this.state.registerFormErrorMessage.contactNo ? <Message severity="error" text={this.state.registerFormErrorMessage.contactNo} /> : null}
                                        {!(this.state.registerFormErrorMessage.contactNo) && this.state.registerForm.contactNo ? <Message severity="success" text=""></Message> : null}
                                    </div>


                                    <div className="form-group form-inline">

                                        <InputText
                                            type="password"
                                            value={this.state.registerForm.password}
                                            onChange={this.handleChange}
                                            id="password"
                                            name="password"
                                            tooltip="Password should be a combination of UpperCase & LowerCase alphabets, symbols and numbers"
                                            placeholder="Password"
                                            className="p-error col-md-8 form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        {this.state.registerFormErrorMessage.password ? <Message severity="error" text={this.state.registerFormErrorMessage.password} /> : null}
                                        {!(this.state.registerFormErrorMessage.password) && this.state.registerForm.password ? <Message severity="success" text=""></Message> : null}
                                    </div>

                                    <div className="text-left"><span className="text-danger">*</span> All fields are mandatory</div>
                                    <br />

                                    <button
                                        type="submit"
                                        disabled={!this.state.registerFormValid.buttonActive}
                                        className="btn btn-primary col-md-8 btn-block"
                                        name="registerbtn"
                                        onClick={this.handleClick}
                                    >
                                        Register
                                    </button>
                                </form>
                                <div hidden={!this.state.register} className="col-md-8"><br></br><br></br>
                                    {this.state.errorMessage || this.state.successMessage ?

                                        (<div>
                                            {this.state.successMessage ?
                                                <div>
                                                    <h4 className="text-success">{this.state.successMessage}</h4><br></br><br />
                                                    <h4>Login to start wandering!</h4>
                                                    <Link className="text-link" to="/login">LOGIN</Link>
                                                </div>
                                                :
                                                null}

                                            {this.state.errorMessage ?
                                                <div>
                                                    <h4 className="text-danger">{this.state.errorMessage}</h4><br></br>
                                                    <h6> Click here to Register using a different contact number</h6>
                                                    <Link className="text-link" onClick={() => window.location.reload()} to="/register">REGISTER</Link><br /><br />
                                                    <h6> Click here to login</h6>
                                                    <Link className="text-link" to="/login">LOGIN</Link>
                                                </div>
                                                :
                                                null}
                                        </div>
                                        ) :
                                        <div id="details" className="details-section">
                                            <div className="col-md-12 text-center">
                                                <ProgressSpinner></ProgressSpinner>
                                            </div>
                                        </div>}


                                </div>

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
            </div>

        )
    }
}

export default Register;
