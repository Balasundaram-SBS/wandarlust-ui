import React, { Component } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Message } from 'primereact/message';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
import { InputText } from "primereact/inputtext";
import { Link, Redirect } from 'react-router-dom';
import { backendUrlUser, backendUrlPackage, backendUrlBooking } from '../BackendURL';
import { Dialog } from 'primereact/dialog';
import { ScrollPanel } from 'primereact/scrollpanel';

class HotDeals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: 1,
                date: "",
                flights: false
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: true,
                date: false,
                buttonActive: false
            },
            hotDeals: [],
            errorMessage: "",
            loadBook: false,
            bookingPage: false,
            show: false,
            showItinerary: false,
            successMessage: "",
            totalCharges: "",
            continent: "",
            dealId: "",
            index: "",
            deal: "",
            timeOut: 1500,
            checkOutDate: new Date(),
            visibleRight: false,
            loggedUserId: sessionStorage.getItem('userId'),
            loginOK: false
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        if (target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });

        this.validateField(name, value);

    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Please select a date later than today!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate = new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" }) });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }
    }

    getHotDeals = () => {
        axios.get(backendUrlPackage + '/hotDeals')
            .then(response => {
                this.setState({ hotDeals: response.data, errorMessage: null, show: false })
            })
            .catch(error => {
                this.setState({ errorMessage: error.message, hotDeals: null, show: false })
            })
    }

    getitinerary = (hotDeal) => {
        this.setState({ index: 0, deal: hotDeal, showItinerary: true })
    }

    openBooking = (hotDeal) => {
        this.setState({ index: 2, deal: hotDeal, showItinerary: true })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.calculateCharges();
    }

    loadBookingPage = (dealId) => {
        console.log(dealId);
        if (sessionStorage.getItem('userId')) {
            this.setState({ loadBook: true })
        }
        this.setState({ visibleRight: false });
        sessionStorage.setItem('noOfPersons', this.state.bookingForm.noOfPersons);
        sessionStorage.setItem('checkInDate', this.state.bookingForm.date);
        sessionStorage.setItem('flight', this.state.bookingForm.flights);
        sessionStorage.setItem('dealId', dealId);
        this.setState({ show: true, bookingPage: true, showItinerary: false, dealId: dealId })
    }

    displayHotDeals = () => {
        let hotDealsArray = [];
        if (this.state.hotDeals) {
            for (let hotDeal of this.state.hotDeals) {
                let name = hotDeal.imageUrl.split("/")[2]
                let element = (
                    <div className="card animateCard shadow bg-light text-dark package-card" key={hotDeal.destinationId}>
                        <div className="card-body">
                            <div className="row align-items-center no-gutters mb-4 mb-lg-5">
                                <div className="col-md-4">
                                    <img className="shadow img-thumbnail package-image" src={require("../assets/" + name)} alt="" />
                                </div>
                                <div className="col-md-5 details-section">
                                    <div className="featured-text text-center text-lg-left">
                                        <h4>{hotDeal.name}</h4>
                                        <div className="badge badge-info">{hotDeal.noOfNights}<em> Nights</em></div> &nbsp;
                                        {hotDeal.availability ? <div className="badge badge-info">{hotDeal.availability} <em> Tickets Left</em> </div> : <div className="badge badge-danger">Sold Out!</div> }
                                        {hotDeal.discount ? <div className="discount text-danger">{hotDeal.discount}% Instant Discount</div> : null}
                                        
                                        <p className="text-dark text-justify mb-0">{hotDeal.details.about}</p>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <h4>Prices Starting From :</h4>
                                    <h5><span className="badge badge-info">{"$ " + hotDeal.chargesPerPerson.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></h5><br /><br />
                                    <div><button label="hotDealsViewDetails" className="btn btn-primary w-100 book" onClick={() => this.getitinerary(hotDeal)} >View Details</button></div><br />
                                    <div><button label="hotDealsBook" className="btn btn-primary w-100 book" onClick={() => this.openBooking(hotDeal)} >Book</button>  </div><br />
                                </div>
                            </div>
                        </div >
                    </div>
                );
                hotDealsArray.push(element);
            }
        }

        return hotDealsArray;
    }

    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if (this.state.deal) {
            return packageInclusions.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }

    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0}>
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight, index) => {
                let element = (
                    <div key={index + 1}>
                        <br />
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <div key={666}>
                    <br />
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}

                    <div className="text-danger">
                        <br />
                        ** This itinerary is just a suggestion, itinerary can be modified as per requirement.
                        <Link
                            to="/home"
                            onClick={
                                async () => {
                                    this.setState({ showItinerary: false })
                                    let promise = new Promise((res, rej) => {
                                        setTimeout(() => res(window.scrollTo({
                                            top: 3070,
                                            left: 0,
                                            behavior: 'smooth'
                                        })), 1500)
                                    })
                                    await promise;
                                }}> Contact us </Link>
                        for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    componentDidMount() {

        this.setState({ show: true })
        this.getHotDeals();
    }

    render() {

        const DialogFooter = (
            <div>
                <Button name='loginOkButton' id='loginOkButton' label="LOGIN" icon="pi pi-check" onClick={(e) => { this.setState({ loginOK: true }) }} />
            </div>
        );

        return (
            <div>
                {
                    this.state.bookingPage ?
                        (this.state.loggedUserId ?
                            (
                                <Redirect to={{
                                    pathname: '/book/' + this.state.dealId,
                                    state: {
                                        selectedDeal: this.state.deal,
                                        bookingForm: this.state.bookingForm,
                                        continent: this.state.continent,
                                        bookingFormValid: this.state.bookingFormValid,
                                    }
                                }}
                                />
                            )
                            :
                            (
                                <div className="content-section implementation">
                                    <Dialog header="LOGIN"
                                        style={{ width: '50vw' }}
                                        visible={true}
                                        footer={DialogFooter}
                                        onHide={
                                            () => {
                                                this.setState({ loginOK: true });
                                            }}
                                    >
                                        Please Login to continue
                                    </Dialog>
                                </div>

                            )
                        ) : null
                }

                {this.state.loginOK ? <Redirect to="/login" /> : null}

                {this.state.show ?
                    <div id="details" className="details-section">
                        <div className="viewBookings">
                            <ProgressSpinner></ProgressSpinner>
                        </div>
                    </div>
                    :
                    <div className="viewBookings animate-bottom" >   {/* <!-- hot deals normal list display --> */}
                        {this.displayHotDeals()}
                    </div>}

                <Sidebar visible={this.state.showItinerary} position="right" baseZIndex={1} className="p-sidebar-lg" onHide={(e) => this.setState({ showItinerary: false })}>
                    <h2>{this.state.deal.name}</h2>
                    <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })}>
                        <TabPanel header="Overview">
                            <div className='animate-right'>
                                <br />
                                <div className="row">
                                    {this.state.deal ?
                                        <div className="col-md-6 text-center ">
                                            <img className="img img-thumbnail package-image" src={require("../assets/" + this.state.deal.imageUrl.split("/")[2])} alt="destination comes here" />
                                        </div> : null}

                                    <div className="col-md-6 text-left">
                                        <h4>Package Includes:</h4>
                                        <ul>
                                            {this.state.showItinerary ? this.displayPackageInclusions() : null}
                                        </ul>
                                    </div>
                                </div>
                                <div className="text-justify itineraryAbout">
                                    <h4>Tour Overview:</h4>
                                    {this.state.deal ? this.state.deal.details.about : null}
                                </div>
                            </div>

                        </TabPanel>

                        <TabPanel header="Itinerary">
                            <div className="col-md-12  text-left">
                                <br />
                                <ScrollPanel style={{ width: '100%', height: '480px' }}>
                                    <div className='animate-right'>
                                        {this.displayPackageHighlights()}
                                    </div>
                                </ScrollPanel>
                            </div>
                        </TabPanel>
                        <TabPanel header="Book">
                            <div className='animate-right'>
                                <form onSubmit={this.handleSubmit}>
                                    <br />
                                    <div className="form-group col-md-10 offset-md-1">
                                        <label htmlFor='noOfPersons'>
                                            Number Of Travellers
                                        </label><br />

                                        <InputText
                                            type="number"
                                            id="noOfPersons"
                                            name="noOfPersons"
                                            value={this.state.bookingForm.noOfPersons}
                                            onChange={this.handleChange}
                                            placeholder="Number of Persons"
                                            tooltip="Enter a value between 1 and 5"
                                            className="p-error form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        <div>
                                            {this.state.bookingFormErrorMessage.noOfPersons ? <Message severity="error" text={this.state.bookingFormErrorMessage.noOfPersons} /> : null}
                                        </div>
                                    </div>

                                    <div className="form-group col-md-10 offset-md-1">
                                        <label htmlFor='date'>
                                            Trip start date
                                        </label><br />
                                        <InputText
                                            type="date"
                                            id="date"
                                            name="date"
                                            placeholder="Trip start date"
                                            value={this.state.bookingForm.date}
                                            onChange={this.handleChange}
                                            tooltip="Enter a date when you'd like to start the trip"
                                            className="p-error form-control"
                                            style={{ marginRight: '1rem' }}
                                            label="Warn"
                                        />
                                        <div>
                                            {this.state.bookingFormErrorMessage.date ? <Message severity="error" text={this.state.bookingFormErrorMessage.date} /> : null}
                                        </div>
                                    </div>
                                    <div className="form-group col-md-10 offset-md-1">
                                        <label >Include Flights :   </label>&nbsp;
                                        <InputSwitch name="flights" id="flights"
                                            checked={this.state.bookingForm.flights}
                                            onChange={this.handleChange} />

                                    </div>
                                    <div className="form-group col-md-10 offset-md-1">
                                        <button id="buttonCalc" name="buttonCalc" className="btn w-100 btn-primary" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Calculate Charges</button>&nbsp;
                                </div>
                                </form>
                                {!this.state.totalCharges ?
                                    (
                                        <React.Fragment>
                                            <div className='row'>
                                                <div className="col-md-4 offset-md-1"><span className="text-danger">** </span>Charges per person<br /><b>{ "$ "+this.state.deal.chargesPerPerson}</b></div>
                                                <div className='col-md-2'></div>
                                                <div className="col-md-4"><span className="text-danger">** </span>Charges Exclude flight charges</div><br />
                                            </div><br />
                                        </React.Fragment>
                                    )
                                    :
                                    (<React.Fragment>
                                        <div className='row'>
                                            <div className="text-right col-md-6">
                                                <h5>
                                                    Your trip ends on <br />
                                                    You will pay
                                                </h5>
                                            </div>

                                            <div className="text-left col-md-6">
                                                <h5>
                                                    <span className='badge badge-secondary'>{this.state.checkOutDate}</span> <br />
                                                    <span className='badge badge-secondary'>$ {this.state.totalCharges.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
                                                </h5>
                                            </div>

                                        </div><br />
                                    </React.Fragment>

                                    )
                                }

                                <div className="form-inline col-md-10 offset-md-1">
                                    <button name='bookButton' type="button" disabled={!this.state.bookingFormValid.buttonActive} className="btn col-md-5  btn-primary" onClick={() => this.loadBookingPage(this.state.deal.destinationId)}>Book</button>
                                    <div class="col-md-2"></div>
                                    <button name='cancelButton' type="button" className="btn col-md-5  btn-primary" onClick={(e) => this.setState({ showItinerary: false })}>Cancel</button>
                                </div><br />
                            </div>


                        </TabPanel>
                    </TabView>
                </Sidebar>
            </div >
        )
    }
}

export default HotDeals;