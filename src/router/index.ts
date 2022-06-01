import Home from "../views/Home.vue"
import NotFound from "../views/NotFound.vue"

/** @type {import("vue-router").RouterOptions["routes"]} */
export const routes = [
  { path: "/", component: Home, meta: { title: "Home" } },
  { path: "/about", component: () => import("../views/About.vue"), meta: { title: "About" } },
  { path: "/:path(.*)", component: NotFound },
]
