import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
    index("routes/welcome/page.tsx"),
    ...prefix("/auth", [
        route("/login", "routes/login/page.tsx"),
        route("/register", "routes/register/page.tsx")
    ]),
    route("/home", "routes/home/page.tsx"),
    route("/create-community", "routes/create-community/page.tsx"),
    route("/profile", "routes/profile/page.tsx"),
    ...prefix("/community", [
      index("routes/community-list/page.tsx"),
      route(":id", "routes/community/page.tsx")
    ]),
    route("/summarizer", "routes/summarizer/page.tsx"),
    
] satisfies RouteConfig;
