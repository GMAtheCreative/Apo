import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Collection, Db } from "mongodb";
import { connectMongo } from "../config/mongoConfig";
import { Biodata, User } from "../models/user";
import { SuiService } from "./suiService";

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
    biodata: Biodata
  ): Promise<User> {
    if (!this.users) {
      throw new Error("UserService not initialized");
    }

    // Validate inputs
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      throw new Error("Invalid email format");
    if (!biodata.personalInformation.firstName)
      throw new Error("First name is required");
    if (!biodata.personalInformation.lastName)
      throw new Error("Last name is required");
    if (!biodata.personalInformation.dob)
      throw new Error("Date of birth is required");
    if (!biodata.personalInformation.contactAddress)
      throw new Error("Contact address is required");
    if (!biodata.personalInformation.phoneNumber)
      throw new Error("Phone number is required");
    if (!biodata.personalInformation.emailAddress)
      throw new Error("Email address is required");

    const existingUser = await this.users.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.suiService.registerUserOnChain(biodata);

    const now = new Date().toISOString();
    const user: User = {
      id: "",
      email,
      password: hashedPassword,
      biodata: {
        professionalSummary: "",
        personalInformation: {
          nationalId: "",
          firstName: "",
          lastName: "",
          dob: "",
          nationality: "",
          contactAddress: "",
          phoneNumber: "",
          emailAddress: "",
          linkedinProfile: "",
        },
        educationalBackground: [],
        workExperience: [],
        skills: { technicalSkills: [], softSkills: [] },
      },
      createdAt: now,
      updatedAt: now,
    };

    await this.users.insertOne(user);

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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
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
      professionalSummary:
        biodata.professionalSummary || user.biodata.professionalSummary,
      personalInformation: {
        ...user.biodata.personalInformation,
        ...(biodata.personalInformation || {}),
      },
      educationalBackground:
        biodata.educationalBackground || user.biodata.educationalBackground,
      workExperience: biodata.workExperience || user.biodata.workExperience,
      skills: biodata.skills || user.biodata.skills,
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

  // async getUserById(
  //   nationalId: string
  // ): Promise<{ uid: string; biodata: Biodata }> {
  //   if (!this.users) {
  //     throw new Error("UserService not initialized");
  //   }
  //   return await this.suiService.getUserByNinOnChain(nationalId);
  //}
}
