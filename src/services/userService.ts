import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Collection, Db } from "mongodb";
import { connectMongo } from "../config/mongoConfig";
import { Biodata, User } from "../models/user";
import { SuiService } from "./suiService";
import crypto from "crypto";

export class UserService {
  private users?: Collection<User>;
  private suiService = new SuiService();

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const db: Db = await connectMongo();
      this.users = db.collection<User>("users");
      await this.users.createIndex({ email: 1 }, { unique: true });
      await this.users.createIndex({ id: 1 }, { unique: true });
    } catch (error: any) {
      console.error("Failed to initialize MongoDB collections:", error.message);
      throw error;
    }
  }

  async registerUser(
    email: string,
    password: string,
    biodata: Partial<Biodata>
  ): Promise<User> {
    if (!this.users) {
      throw new Error("UserService not initialized");
    }

    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      throw new Error("Invalid email format");

    const existingUser = await this.users.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const encryptionKey = crypto.randomBytes(32).toString("hex");

    const validatedBiodata: Biodata = {
      personalInformation: {
        nationalId: biodata?.personalInformation?.nationalId || "",
        firstName: biodata?.personalInformation?.firstName || "",
        lastName: biodata?.personalInformation?.lastName || "",
        dob: biodata?.personalInformation?.dob || "",
        nationality: biodata?.personalInformation?.nationality || "",
        contactAddress: biodata?.personalInformation?.contactAddress || "",
        phoneNumber: biodata?.personalInformation?.phoneNumber || "",
        emailAddress: biodata?.personalInformation?.emailAddress || "",
        linkedinProfile: biodata?.personalInformation?.linkedinProfile || "",
      },
      educationalBackground: biodata?.educationalBackground || [],
      workExperience: biodata?.workExperience || [],
      skills: biodata?.skills || { technicalSkills: [], softSkills: [] },
    };

    await this.suiService.registerUserOnChain(validatedBiodata, encryptionKey);

    const now = new Date().toISOString();
    const user: User = {
      email,
      password: hashedPassword,
      biodata: validatedBiodata,
      encryptionKey,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.users.insertOne(user);

    user._id = result.insertedId;

    return user;
  }

  async loginUser(email: string, password: string): Promise<string> {
    if (!this.users) {
      throw new Error("UserService not initialized");
    }

    const user = await this.users.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });
    return token;
  }

  async updateBiodata(
    userId: string,
    biodata: Partial<Biodata>
  ): Promise<User> {
    if (!this.users) {
      throw new Error("UserService not initialized");
    }

    const user = await this.users.findOne({ id: userId });
    if (!user) throw new Error("User not found");

    const updatedBiodata: Biodata = {
      personalInformation: {
        nationalId:
          biodata?.personalInformation?.nationalId ||
          user.biodata.personalInformation?.nationalId ||
          "",
        firstName:
          biodata?.personalInformation?.firstName ||
          user.biodata.personalInformation?.firstName ||
          "",
        lastName:
          biodata?.personalInformation?.lastName ||
          user.biodata.personalInformation?.lastName ||
          "",
        dob:
          biodata?.personalInformation?.dob ||
          user.biodata.personalInformation?.dob ||
          "",
        nationality:
          biodata?.personalInformation?.nationality ||
          user.biodata.personalInformation?.nationality ||
          "",
        contactAddress:
          biodata?.personalInformation?.contactAddress ||
          user.biodata.personalInformation?.contactAddress ||
          "",
        phoneNumber:
          biodata?.personalInformation?.phoneNumber ||
          user.biodata.personalInformation?.phoneNumber ||
          "",
        emailAddress:
          biodata?.personalInformation?.emailAddress ||
          user.biodata.personalInformation?.emailAddress ||
          "",
        linkedinProfile:
          biodata?.personalInformation?.linkedinProfile ||
          user.biodata.personalInformation?.linkedinProfile ||
          "",
      },
      educationalBackground:
        biodata?.educationalBackground ||
        user.biodata.educationalBackground ||
        [],
      workExperience:
        biodata?.workExperience || user.biodata.workExperience || [],
      skills: biodata?.skills ||
        user.biodata.skills || { technicalSkills: [], softSkills: [] },
    };

    const updatedUser: User = {
      ...user,
      biodata: updatedBiodata,
      updatedAt: new Date().toISOString(),
    };

    await this.users.updateOne(
      { id: userId },
      { $set: { biodata: updatedBiodata, updatedAt: updatedUser.updatedAt } }
    );
    return updatedUser;
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.users) {
      throw new Error("UserService not initialized");
    }
    return await this.users.findOne({ id });
  }
}
