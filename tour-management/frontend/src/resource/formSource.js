import { placeCodeMap } from "../utils/cities";
import { cityList } from "../utils/cities";

export const userInputs = [
    {
        id: "username",
        label: "Username",
        type: "text",
        placeholder: "john_doe",
    },
    {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "john_doe@gmail.com",
    },
    {
        id: "password",
        label: "Password",
        type: "password",
    },
    {
        id: "role",
        label: "Role",
        type: "select",
        options: [
            "user",
            "admin"
        ],
    },
];

export const tourInputs = [
    {
        id: "title",
        label: "Title",
        type: "text",
        placeholder: "Amazing Beach Tour",
        name: "title", required: true
    },
    {
        id: "city",
        label: "City",
        type: "select",
        name: "city",
        options: cityList, required: true
    },
    {
        id: "address",
        label: "Address",
        type: "text",
        placeholder: "123 Main Street",
        name: "address", required: true
    },
    {
        id: "duration",
        label: "Duration (days)",
        type: "number",
        placeholder: "5",
        name: "duration", required: false,
        inputProps: { min: 1 },
    },
    {
        id: "desc",
        label: "Description",
        type: "textarea",
        placeholder: "A beautiful tour with amazing experiences...",
        name: "desc", required: true
    },
    {
        id: "highlights",
        label: "Highlights",
        type: "textarea",
        placeholder: "A beautiful tour with amazing experiences...",
        name: "highlights", required: false
    },

    {
        id: "price",
        label: "Price ($)",
        type: "number",
        placeholder: "250",
        name: "price", required: false,
        inputProps: { min: 1 },
    },
    {
        id: "maxGroupSize",
        label: "Max Group Size",
        type: "number",
        placeholder: "15",
        name: "maxGroupSize", required: false,
        inputProps: { min: 1 },
    },
    {
        id: "featured",
        label: "Featured",
        type: "checkbox",
        name: "featured", required: false,
    },
];

export const postInputs = [
    {
        id: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter blog title...",
        name: "title",
    },
    {
        id: "content",
        label: "Content",
        type: "textarea",
        placeholder: "Write your blog content here...",
        name: "content",
    },
    {
        id: "author",
        label: "Author",
        type: "text",
        placeholder: "admin",
        name: "author",
    },

];

export const hotelInputs = [
    {
        id: "hotelName",
        label: "Hotel Name",
        type: "text",
        placeholder: "Sunset Beach Resort",
        name: "hotelName",
    },
    {
        id: "location",
        label: "Location",
        type: "select",
        name: "location",
        options: cityList
    },
    {
        id: "pricePerNight",
        label: "Price per Night ($)",
        type: "number",
        placeholder: "120",
        name: "pricePerNight",
        inputProps: { min: 1 },
    },
    {
        id: "stars",
        label: "Star Rating",
        type: "number",
        placeholder: "4",
        name: "stars",
        inputProps: { min: 1 },
    },
    {
        id: "roomsAvailable",
        label: "Rooms Available",
        type: "number",
        placeholder: "50",
        name: "roomsAvailable",
        inputProps: { min: 1 },
    },
    {
        id: "amenities",
        label: "Amenities",
        type: "text",
        placeholder: "Wifi, Pool, Spa, Gym",
        name: "amenities",
    },
];

export const flightInputs = [
    {
        id: "flightNumber",
        label: "Flight Number",
        type: "text",
        placeholder: "VN123",
        name: "flightNumber",
    },
    {
        id: "airline",
        label: "Airline",
        type: "text",
        placeholder: "Vietnam Airlines",
        name: "airline",
    },
    {
        id: "fromPlace",
        label: "Departure City",
        type: "select",
        name: "fromPlace",
        options: Object.keys(placeCodeMap),
    },
    {
        id: "toPlace",
        label: "Arrival City",
        type: "select",
        name: "toPlace",
        options: Object.keys(placeCodeMap),
    },
    {
        id: "ticketType",
        label: "Ticket Type",
        type: "text",
        name: "ticketType",
    },
    {
        id: "aircraftStr",
        label: "Airplane Type",
        type: "text",
        placeholder: "Airbus A321",
        name: "aircraftStr",
    },
    {
        id: "departDate",
        label: "Departure Date",
        type: "date",
        name: "departDate",
    },
    {
        id: "departTimeStr",
        label: "Departure Time",
        type: "time",
        name: "departTimeStr",
    },
    {
        id: "landingDate",
        label: "Landing Date",
        type: "date",
        name: "landingDate",
    },
    {
        id: "landingTimeStr",
        label: "Landing Time",
        type: "time",
        name: "landingTimeStr",
    },
    {
        id: "totalPriceUSD",
        label: "Price (USD)",
        type: "number",
        placeholder: "99",
        name: "totalPriceUSD",
        inputProps: { min: 1 },
    },
];
