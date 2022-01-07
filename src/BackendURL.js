
const port = 4000;
export const backendUrlUser = `https://wandarlust-web-service.herokuapp.com/user`; // /register - POST, /login - POST, /getBookings/:userId - GET
export const backendUrlPackage = `https://wandarlust-web-service.herokuapp.com/user/packages`; // /hotDeals -> GET, /destinations -> GET, 
export const backendUrlBooking = `https://wandarlust-web-service.herokuapp.com/user/book`; // /:userId/:destinationId -> POST, /cancelBooking/:bookingId -> DELETE, /getDetails/:destinationId - GET, 