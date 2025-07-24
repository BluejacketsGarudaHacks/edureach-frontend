import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/pages/welcome.tsx"),
    ...prefix("/auth", [
        route("/login", "routes/pages/login.tsx"),
        route("/register", "routes/pages/register.tsx")
    ]),
    route("/home", "routes/pages/home.tsx")
] satisfies RouteConfig;
