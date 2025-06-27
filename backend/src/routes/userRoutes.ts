import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Biodata } from "../models/user";

const router = Router();
const userService = new UserService();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, biodata } = req.body;
    const user = await userService.registerUser(email, password, biodata);
    res.status(201).json({
      message: "User registered successfully",
      uid: user._id,
      user: { id: user._id, email: user.email, biodata: user.biodata },
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", token });
  })
);

router.put(
  "/profile",
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const biodata: Partial<Biodata> = req.body;
    const user = await userService.updateBiodata(req.user!.id, biodata);
    res.status(200).json({
      message: "Profile updated successfully",
      user: { id: user._id, email: user.email, biodata: user.biodata },
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      email: user.email,
      biodata: user.biodata,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  })
);

export default router;
