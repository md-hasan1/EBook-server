import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { BookRoutes } from "../modules/Book/Book.routes";
import { notificationsRoute } from "../modules/Notification/Notification.routes";
import { favouriteRoutes } from "../modules/favourite/favourite.route";
import { categoryRoutes } from "../modules/Category/Category.routes";
import { BannerRoutes } from '../modules/Banner/Banner.routes';
import { PurchaseRoutes } from "../modules/Purchase/Purchase.routes";
import { PointRoutes } from "../modules/Point/Point.routes";
import { RedeemRoutes } from "../modules/Redeem/Redeem.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
  {
    path: "/notifications",
    route:notificationsRoute,
  },
  {
    path: "/favorites",
    route:favouriteRoutes,
  },
  {
    path: "/category",
    route:categoryRoutes,
  },
  {
    path: "/banner",
    route:BannerRoutes
  },
  {
    path: "/purchase",
    route:PurchaseRoutes
  },
  {
    path: "/point",
    route:PointRoutes
  },
  {
    path: "/redeem",
    route:RedeemRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
