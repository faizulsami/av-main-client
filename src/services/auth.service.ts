import { jwtDecode } from "jwt-decode";
import { APIError } from "@/types/error";
import { apiConfig } from "@/config/api.config";
import { UserRole } from "@/types/user.types";
import { CreateMentorData, MentorDataField } from "@/types/auth.types";
import { getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "@/lib/firebase";

export interface UserInfo {
  userName: string;
  role: UserRole;
  userDetails: string;
  isVerified: boolean;
}

interface CreateMenteeData {
  userName: string;
  password: string;
  mentee: {
    gender: string;
    age: number;
  };
}

interface LoginData {
  userName: string;
  password: string;
}

interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    needsPasswordChange: boolean;
  };
}

export class AuthService {
  static async createMentee(data: CreateMenteeData) {
    const response = await fetch(
      `${apiConfig.apiUrl}/api/v1/users/create-mentee`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new APIError(
        "Failed to create mentee",
        response.status,
        "REGISTRATION_ERROR",
      );
    }
    return response.json();
  }

  static async login(credentials: LoginData) {
    const response = await fetch(`${apiConfig.apiUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new APIError("Login failed", response.status, "AUTH_ERROR");
    }

    const data: LoginResponse = await response.json();

    if (data.success) {
      const decodedToken = jwtDecode<UserInfo>(data.data.accessToken);

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.data.accessToken);
        localStorage.setItem(
          "needsPasswordChange",
          String(data.data.needsPasswordChange),
        );
        localStorage.setItem("user", JSON.stringify(decodedToken));
        localStorage.setItem("isAuthenticated", "true");
      }
    }

    return data;
  }

  static getStoredUser(): UserInfo | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("needsPasswordChange");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isAuthenticated") === "true";
    }
    return false;
  }

  static getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  // ==============MENTOR SERVICE============== //

  static async handleGoogleMentorSignUp() {
    try {
      googleProvider.addScope("profile");
      googleProvider.addScope("email");

      const result = await signInWithPopup(getAuth(), googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error("No user returned from Google Sign-In");
      }

      const idToken = await user.getIdToken();

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          idToken,
        },
      };
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      throw error;
    }
  }

  static async createMentor(data: CreateMentorData) {
    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/users/create-mentor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getStoredToken()}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new APIError(
          errorData.message || "Failed to create mentor",
          response.status,
          "MENTOR_REGISTRATION_ERROR",
        );
      }
      return response.json();
    } catch (error) {
      console.error("Create Mentor Error Details:", error);
      throw error;
    }
  }

  // Updated getNestedValue
  private static getNestedValue(
    obj: CreateMentorData,
    path: MentorDataField,
  ): string | number | boolean {
    const parts = path.split(".");
    let result: unknown = obj;

    for (const part of parts) {
      if (result && typeof result === "object" && part in result) {
        result = (result as Record<string, unknown>)[part];
      } else {
        return "";
      }
    }

    return typeof result === "string" ||
      typeof result === "number" ||
      typeof result === "boolean"
      ? result
      : "";
  }

  // Validate mentor data method
  static validateMentorData(data: Partial<CreateMentorData>): boolean {
    const requiredFields: MentorDataField[] = [
      "userName",
      "mentor.name",
      "mentor.email",
      "mentor.gender",
      "mentor.specialization",
    ];

    return requiredFields.every((field) => {
      const value = this.getNestedValue(data as CreateMentorData, field);
      return value !== undefined && value !== "";
    });
  }
}

export const authService = new AuthService();
