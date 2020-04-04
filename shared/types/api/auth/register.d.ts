import {
    GoogleRegistrationPayload,
    GoogleRegistrationResponse,
    RegistrationPayload,
    RegistrationResponse
} from "./register";

// Mutation
// Register a user with email/password
// If the registration succeeds user gets a comfirmation email

declare type RegisterUser = (payload: RegistrationPayload) => RegistrationResponse

// Mutation
// Register with google
// Only google token is suffice as auth data can be confirmed via the google API
// If user gets succesfully registered server also logs him in and responds with the security token

declare type GoogleRegisterUser = (payload: GoogleRegistrationPayload) => GoogleRegistrationResponse