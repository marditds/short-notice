import { redirect } from "react-router-dom";
import { getAccount } from "../lib/context/dbhandler";

const withAuth = (loader, path) => {

    return async (args) => {

        console.log('THIS IS PATH:', path);
        console.log('THIS IS ARGS:', args);

        const authenticatedUser = await getAccount();

        console.log(`authenticatedUser in ${path.toUpperCase()}'s authentication check:`, authenticatedUser);

        if (!authenticatedUser) {
            console.log(`authenticatedUser not found in ${path.toUpperCase()} loader. Redirecting to '/'`);
            return redirect('/');
        } else {
            console.log(`authenticatedUser found in authentication check. Now running loader for ${path.toUpperCase()}`);
        }
        return loader ? loader(args) : null;
    };
}


export const addAuthGuards = (routes) => {
    return routes.map(route => {

        if (route.authRequired) {
            const originalLoader = route.loader;
            const path = route.path;
            route.loader = withAuth(originalLoader, path);
        }
        if (route.children) {
            route.children = addAuthGuards(route.children);
        }
        return route;
    });
}
