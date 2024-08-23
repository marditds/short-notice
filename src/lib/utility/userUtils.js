import { UserId } from "../../components/User/UserId";

export const getUserId = (googleUserData) => {
    return UserId(googleUserData);
};