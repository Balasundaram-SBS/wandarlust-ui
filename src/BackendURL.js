
const port = 4000;
export const backendUrlUser = `http://localhost:${port}/user`; // /register - POST, /login - POST, /getBookings/:userId - GET
export const backendUrlPackage = `http://localhost:${port}/user/packages`; // /hotDeals -> GET, /destinations -> GET, 
export const backendUrlBooking = `http://localhost:${port}/user/book`; // /:userId/:destinationId -> POST, /cancelBooking/:bookingId -> DELETE, /getDetails/:destinationId - GET, 