import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/pages/welcome.tsx"),
  ...prefix("/auth", [
    route("/login", "routes/pages/login/page.tsx"),
    route("/register", "routes/pages/register/page.tsx"),
  ]),
  route("/home", "routes/pages/home/page.tsx"),
  route("/create-community", "routes/pages/create-community/page.tsx"),
  route("/profile", "routes/pages/profile/page.tsx"),
  route("/summarizer", "routes/pages/summarizer/summarizer-page.tsx"),
] satisfies RouteConfig;
