import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import HotDeals from './hotdeals'
import { backendUrlUser, backendUrlPackage, backendUrlBooking } from '../BackendURL';
import { Growl } from 'primereact/growl';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
import { AutoComplete } from 'primereact/autocomplete';

class Home extends Component {
    constructor(props) {
        super(props);
        this.showInfo = this.showInfo.bind(this);
        this.showError = this.showError.bind(this);
        this.state = {
            continent: "",
            packagePage: false,
            successMessage: "",
            homePage: "",
            emailId: "",
            errorMessage: "",
            packageNames: [],
            filteredNames: []
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value })
        this.setState({ successMessage: "", errorMessage: "" });
    }
    
    handleClick = async (event) => {
        event.preventDefault();
        this.setState({ errorMessage: '', successMessage: '' })
        if (this.state.emailId) {
            this.setState({ successMessage: "Thank you for subscribing. Updates will be sent to the subscribed Email ID", errorMessage: "" });
        }
        else {
            this.setState({ successMessage: "", errorMessage: "Please enter a valid Email ID" });
        }

        let promise = new Promise((res, rej) => {
            setTimeout(() => res(this.setState({ errorMessage: '', successMessage: '' })), 500)
        })
        await promise;
    }

    getPackages = () => {
        sessionStorage.setItem('continent', this.state.continent);
        this.setState({ packagePage: true });
    }

    getPackageNames = () => {
        this.setState({ errorMessage: '', packageNames: [], filteredNames: [] })
        axios.get(backendUrlUser + '/getPackageNames').then(response => {
            this.setState({ packageNames: response.data, errorMessage: '' })
        }).catch(error => {
            this.setState({ errorMessage: 'Please start your server' })
        })
    }

    filterPackageNames = (event) => {
        let { packageNames } = this.state
        var results = packageNames.filter((packages) => {
            return packages.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredNames: results });
    }

    showInfo = () => {
        this.growl.show({ severity: 'info', summary: 'Subscribed!', detail: this.state.successMessage, life: 5000, closeable: true });
    }

    showError = () => {
        this.growl.show({ severity: 'error', summary: 'Invalid!', detail: this.state.errorMessage, life: 5000, closeable: true });

    }

    componentDidMount = () => {
        this.getPackageNames()
    }

    render() {
        if (this.state.packagePage === true) return <Redirect to={'/packages/' + this.state.continent} />
        return (
            <div>
                <Growl ref={(el) => this.growl = el} position="bottomleft" />
                <header className="masthead book-page animate-bottom" id="page-top">
                    <button type='button'
                        name='hotDealsNav'
                        id='hotDealsNav'
                        className='float text-center textHover'
                        onClick={
                            () => {
                                window.scrollTo({
                                    top: 1200,
                                    left: 0,
                                    behavior: 'smooth'
                                })
                            }
                        }
                    >HOT DEALS</button>
                    <div className="container d-flex h-100 align-items-center">
                        <div className="mx-auto text-center">
                            <h1 className="mx-auto my-0 animate-wanderlust text-uppercase">Wanderlust</h1>
                            <h2 className="text-white-50 mx-auto mt-2 mb-5">All that is gold does not glitter,
                                    Not all those who wander are lost.</h2>

                            <div>
                                <div className="form-group col-md-12 form-inline d-flex">
                                    <AutoComplete
                                        type="text"
                                        inputStyle={{ height: 58, 'padding-left': 20 }}
                                        size={100}
                                        name="continent"
                                        suggestions={this.state.filteredNames}
                                        completeMethod={(event) => { this.filterPackageNames(event) }}
                                        value={this.state.continent}
                                        onChange={(event) => { this.handleChange(event) }}
                                        id="continent"
                                        placeholder="Where?"
                                    />&nbsp;

                                    <button name="search" id="search" className="btn btn-primary" onClick={this.getPackages} >
                                        SEARCH
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </header>

                <section id="about" className="about-section text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <h2 className="text-white mb-4">Unleash the traveller inside you</h2>
                                <p className="about-paragraph text-center">When someone makes a travel plan, the first few things they want to sort out, are flights, accommodation, and other amenities for a convenient holiday.
                                To enjoy holidays, you want to have the basics taken care of, especially for family vacations and honeymoon trips.
                                You want your accommodation, return flight bookings, meals of the days, and other traveling formalities sorted beforehand.
                                At
                                <Link to="/home" onClick={
                                        () => {
                                            window.scrollTo({
                                                top: 0,
                                                left: 0,
                                                behavior: 'smooth'
                                            })
                                        }}> Wanderlust</Link>,
                                     we take care of all the requirements to ensure that you get to enjoy the best of your holiday, exploring and experiencing the destination.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="hotDeals" className="hotDeals-section">
                    <HotDeals />
                </section>

                <section id="signup" className="signup-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-lg-8 mx-auto text-center">
                                <h2 className="text-white mb-5">Subscribe to receive updates!</h2>
                                <form className="form-inline d-flex">
                                    <input
                                        type="email"
                                        className="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0"
                                        id="emailId"
                                        name="emailId"
                                        value={this.state.emailId}
                                        onChange={this.handleChange}
                                        placeholder="Enter email address..."
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={this.handleClick}
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                        <br />
                        {this.state.errorMessage.length > 0 ? this.showError() : null} {/* Error Message trigger*/}
                        {this.state.successMessage.length > 0 ? this.showInfo() : null} {/* Error Message trigger*/}
                    </div>
                </section>

                <section className="contact-section bg-black">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0">Address</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50">Institute, Cuddalore</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0">Email</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50"><Link to="/home">wandarlust@gmail.com</Link></div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0">Phone</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50">+91 9999999999</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        )
    }
}

export default Home;