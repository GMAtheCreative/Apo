import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Biodata } from "../models/user";

const router = Router();
const userService = new UserService();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, biodata } = req.body;
    const user = await userService.registerUser(email, password, biodata);
    res.status(201).json({
      message: "User registered successfully",
      uid: user.id,
      user: { id: user.id, email: user.email, biodata: user.biodata },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.put(
  "/profile",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const biodata: Partial<Biodata> = req.body;
      const user = await userService.updateBiodata(req.user!.id, biodata);
      res.status(200).json({
        message: "Profile updated successfully",
        user: { id: user.id, email: user.email, biodata: user.biodata },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user.id,
      email: user.email,
      biodata: user.biodata,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/nin/:nationalId", async (req: Request, res: Response) => {
//   try {
//     const { nationalId } = req.params;
//     const userData = await userService.getUserByNin(nationalId);
//     res.status(200).json({
//       message: "User data retrieved successfully",
//       uid: userData.uid,
//       biodata: userData.biodata,
//     });
//   } catch (error: any) {
//     res.status(404).json({ message: error.message });
//   }
// });

export default router;
