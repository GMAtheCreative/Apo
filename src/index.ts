import express, { Express, Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";

const app: Express = express();

app.use(express.json());

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.use("/api/users", userRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
