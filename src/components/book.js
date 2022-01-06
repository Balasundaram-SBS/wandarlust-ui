import React, { Component } from 'react';
import axios from "axios";
import { Link, Redirect } from 'react-router-dom';
import { backendUrlUser, backendUrlBooking } from '../BackendURL';
import { InputSwitch } from 'primereact/inputswitch';
import { Message } from 'primereact/message';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
import { InputText } from "primereact/inputtext";
import { Fieldset } from 'primereact/fieldset';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Growl } from 'primereact/growl';

class book extends Component {
    constructor(props) {
        super(props);
        this.showError = this.showError.bind(this);
        this.state = {
            bookingForm: {
                noOfPersons: null,
                checkInDate: "",
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                checkInDate: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                checkInDate: false,
                buttonActive: false
            },
            panel: {
                about: true,
                inclusions: true,
                itinerary: true
            },
            deal: "",
            userId:"",
            successMessage: "",
            errorMessage: "",
            totalCharges: "",
            packagePage: false,
            hotDealsPage: false,
            checkOutDate: new Date(),
            booked: false,
            show:false
        }
    }

    handleChange = (event) => {
        this.setState({successMessage:'',errorMessage:''})
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
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
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

    componentDidMount = () => {
        this.calculateCharges()
    }

    componentWillMount = () => {
        let userId= sessionStorage.getItem('userId')
        this.setState({userId:userId})
        this.setState({ deal: this.props.location.state.selectedDeal })
        this.setState({ bookingForm: this.props.location.state.bookingForm })
        this.setState({ bookingFormValid: this.props.location.state.bookingFormValid })
        this.setState({ packagePage: false, hotDealsPage: false, booked: false })
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        this.bookedDetails();
    }

    bookedDetails = () => {
        let {bookingForm} = this.state
        this.setState({ errorMessage: '', booked :false,show:false,successMessage: '' })
        bookingForm.userId= sessionStorage.getItem('userId')
        bookingForm.destinationName=this.state.deal.name
        bookingForm.checkOutDate=this.state.checkOutDate
        bookingForm.totalCharges=this.state.totalCharges
        bookingForm.checkInDate=new Date(this.state.bookingForm.date).toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })
        
        axios.post(backendUrlBooking+"/"+this.state.deal.destinationId , bookingForm).then(data=>{
            this.setState({ successMessage: data, booked: true,show:false ,errorMessage:''})
        }).catch(error=>{
            this.setState({ errorMessage: error.response.data.message, booked :false,show:false,successMessage: '' })
        })
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
                <h3>Day Wise itinerary</h3>
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight, index) => {
                let element = (
                    <div key={index + 1}>
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <div key={666}>
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. 
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
                                }}> Contact us </Link>for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    showError = () => {
        this.growl.show({ severity: 'error', summary: 'Booking Failed', detail: this.state.errorMessage, life: 5000, closeable: true });
      }

    render() {
        return (
            <div>
                <Growl ref={(el) => this.growl = el} position="bottomleft" />
                <section id="bookingPage" className="bookingSection">
                    <div className="container-fluid">
                        <div className="row ">

                        {()=>{
                            (this.state.booked)?(
                                (this.state.successMessage.length>0?
                                    this.setState({show:false, errorMessage:""}):
                                    this.setState({show:true})
                                    )
                                )
                                :
                                (this.setState({show:false}))
                            }}

                            {(this.state.errorMessage.length>0?
                                    this.showError():
                                    null)}

                            {this.state.show ?
                                <div id="details" className="details-section">
                                    <div className="col-md-12 text-center">
                                        <ProgressSpinner></ProgressSpinner>
                                    </div>
                                </div> : null}

                            {!this.state.booked ? 
                            (<React.Fragment>
                             
                                <div className="col-md-6 offset-md-1">
                                    <h2>{this.state.deal.name}</h2><br/>                                    
                                    <div className="text-left content-section implementation">
                                    
                                        <Fieldset name="about" id="about" legend="Overview" toggleable={true} collapsed={this.state.panel.about} onToggle={
                                            (event) => {
                                                const value = event.value;
                                                const { panel } = this.state;
                                                this.setState({
                                                    panel: { ...panel, about: value }
                                                });
                                            }
                                        }>
                                            <div>
                                                {this.state.deal ? this.state.deal.details.about : null}
                                            </div>
                                        </Fieldset>

                                        <Fieldset name="inclusions" id="inclusions" legend="Package Inclusions" toggleable={true} collapsed={this.state.panel.inclusions} onToggle={
                                            (event) => {
                                                const value = event.value;
                                                const { panel } = this.state;
                                                this.setState({
                                                    panel: { ...panel, inclusions: value }
                                                });
                                            }
                                        }>
                                            <div>
                                                <ul>
                                                    {this.state.deal ? this.displayPackageInclusions() : null}
                                                </ul>
                                            </div>
                                        </Fieldset>

                                        <Fieldset name="itinerary" id="itinerary" legend="Itinerary" toggleable={true} collapsed={this.state.panel.itinerary} onToggle={
                                            (event) => {
                                                const value = event.value;
                                                const { panel } = this.state;
                                                this.setState({
                                                    panel: { ...panel, itinerary: value }
                                                });
                                            }
                                        }>
                                            <div>
                                                {this.state.deal ? this.displayPackageHighlights() : null}
                                            </div>

                                        </Fieldset>
                                    </div>

                                </div>


                                <div className="col-md-4" >
                                    <div className="card bg-light text-dark">
                                   
                                        <form onSubmit={this.handleSubmit}>
                                            <br />
                                            <div className="form-group col-md-12">
                                                <label className="text-left" htmlFor="noOfPersons">Number of travelers</label><br />
                                                <InputText
                                                    type="number"
                                                    id="noOfPersons"
                                                    className="p-error form-control"
                                                    name="noOfPersons"
                                                    value={this.state.bookingForm.noOfPersons}
                                                    onChange={async (event) => {
                                                        this.handleChange(event)

                                                        let promise = new Promise((res, rej) => {
                                                            setTimeout(()=> res(this.calculateCharges()),20)
                                                        })
                                                        await promise;
                                                    }}
                                                    placeholder="Number of Persons"
                                                    tooltip="Enter a value between 1 and 5"
                                                    style={{ marginRight: '1rem' }}
                                                    label="Warn"
                                                />
                                                <div>
                                                    {this.state.bookingFormErrorMessage.noOfPersons ? <Message severity="error" text={this.state.bookingFormErrorMessage.noOfPersons} /> : null}
                                                </div>
                                            </div>

                                            <div className="form-group col-md-12">
                                                <label className="text-left" htmlFor="date">Trip Start Date</label><br />
                                                <InputText
                                                    type="date"
                                                    id="date"
                                                    className="p-error form-control"
                                                    name="date"
                                                    placeholder="Trip start date"
                                                    value={this.state.bookingForm.date}
                                                    onChange={async (event) => {
                                                            this.handleChange(event)
    
                                                            let promise = new Promise((res, rej) => {
                                                                setTimeout(()=> res(this.calculateCharges()),20)
                                                            })
                                                            await promise;
                                                        }}
                                                    tooltip="Enter a date when you'd like to start the trip"
                                                    style={{ marginRight: '1rem' }}
                                                    label="Warn"
                                                />
                                                <div>
                                                    {this.state.bookingFormErrorMessage.date ? <Message severity="error" text={this.state.bookingFormErrorMessage.date} /> : null}
                                                </div>
                                            </div>
                                            <div className="form-group col-md-12 ">
                                                <label className="form-input-label">Include Flights : </label>
                                                <InputSwitch
                                                    name="flights"
                                                    id="flights"
                                                    checked={this.state.bookingForm.flights}
                                                    onChange={async (event) => {
                                                        this.handleChange(event)

                                                        let promise = new Promise((res, rej) => {
                                                            setTimeout(()=> res(this.calculateCharges()),20)
                                                        })
                                                        await promise;
                                                    }} />
                                            </div>

                                        {!this.state.totalCharges ?
                                            (
                                            <div className="row">
                                                <div className="col-md-12"><span className="text-danger">** </span>Charges Exclude flight charges</div><br />
                                            </div>
                                                
                                            )
                                            :
                                            (
                                                <React.Fragment>
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
                                                    </div><br/>
                                                </React.Fragment>
                                            )
                                        }

                                        <div className="form-group form-inline text-center col-md-12">
                                            <button
                                                type="submit"
                                                disabled={!this.state.bookingFormValid.buttonActive}
                                                className="btn btn-primary"
                                            > Confirm Booking
                                        </button>
                                            &nbsp;&nbsp;
    
                                        <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    if (this.state.deal.destinationId.match(/^D/)) {
                                                        this.setState({ packagePage: true, hotDealsPage: false })
                                                    }
                                                    else {
                                                        this.setState({ hotDealsPage: true, packagePage: false })
                                                    }
                                                }}
                                            > Go Back
                                        </button>
                                        </div>
                                        </form>
                                        <br />
                                        {/* <!--can be a button or a link based on need --> */}
                                        {this.state.packagePage ? <Redirect to={"/packages/" + this.props.location.state.continent} />
                                            :
                                            null}
                                        {this.state.hotDealsPage ? <Redirect to="/packages" />
                                            :
                                            null}
                                    </div>
                                </div>
                                </React.Fragment>
                                )
                                :
                                (
                                    <div className="col-md-12 text-center">
                                        <h3>
                                            Booking Confirmed
                                        </h3>
                                        <h4 className="text-success">
                                            Congratulations! Trip Planned {this.state.deal.name}
                                        </h4>
                                        <br/>
                                        <div>
                                            Trip starts on: {new Date(this.state.bookingForm.date).toDateString()}
                                        </div>
                                        <div>
                                            Trip ends on: {this.state.checkOutDate}
                                        </div>
                                        <br/>
                                        <div>
                                        <Link to={'/viewBookings/'+this.state.userId}>
                                            Click here to view your Bookings
                                        </Link>
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                    </div >
                </section>
            </div >
        )
    }
}

export default book;