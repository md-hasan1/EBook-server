import express from "express";
import { FavouriteController } from "./favourite.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";



const router = express.Router();

// Route to toggle a favorite (add/remove)
router.post("/toggle",auth(UserRole.ADMIN,UserRole.USER), FavouriteController.toggleFavourite);

// Route to get all favorites (admin)
router.get("/", FavouriteController.getAllFavourites);

// Route to get a favorite by ID
router.get("/:id", FavouriteController.getFavouriteById);

// Route to delete a favorite by ID
router.delete("/:id", FavouriteController.deleteFavourite);

// Route to get all favorites of a user
router.get("/user/all",auth(UserRole.ADMIN,UserRole.USER), FavouriteController.getFavouritesByUser);

export const favouriteRoutes = router;
