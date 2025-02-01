"use server";

import { revalidatePath } from "next/cache";
import { Post, User } from "./models";
import { connectToDb } from "./utils";
import { signIn, signOut } from "next-auth/react";
import bcrypt from "bcryptjs";

// Check if window is defined before using it
const isClient = typeof window !== "undefined"; // This will be true on the client-side, false on the server-side

// fixed the bug in the addPost function
export const addPost = async (prevState) => {
  "use server";

  console.log("🔥 Received prevState:", prevState);

  // Check if prevState is a valid FormData object
  const formData = prevState instanceof FormData ? prevState : new FormData();

  console.log("🔥 Extracted formData:", formData);

  // ✅ Convert formData to object safely
  const formObject = Object.fromEntries(formData.entries());
  console.log("🎯 Parsed Form Data:", formObject);

  const { title, desc, slug, userId } = formObject;

  if (!title || !desc || !slug || !userId) {
    return { error: "Missing required fields" };
  }

  try {
    connectToDb();
    const newPost = new Post({ title, desc, slug, userId });

    await newPost.save();
    console.log("✅ Saved to DB");
    revalidatePath("/blog");
    revalidatePath("/admin");

    return { success: "Post created successfully!" };
  } catch (err) {
    console.error("🚨 Error saving post:", err);
    return { error: "Something went wrong!" };
  }
};

export const deletePost = async (formData) => {
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { id } = Object.fromEntries(formData);

  if (!id) {
    return { error: "Post ID is required" };
  }

  try {
    connectToDb();

    await Post.findByIdAndDelete(id);
    console.log("deleted from db");
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const addUser = async (prevState, formData) => {
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { username, email, password, img } = Object.fromEntries(formData);

  if (!username || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    connectToDb();
    const newUser = new User({
      username,
      email,
      password,
      img,
    });

    await newUser.save();
    console.log("saved to db");
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const deleteUser = async (formData) => {
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { id } = Object.fromEntries(formData);

  if (!id) {
    return { error: "User ID is required" };
  }

  try {
    connectToDb();

    await Post.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    console.log("deleted from db");
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const handleGithubLogin = async () => {
  "use server";
  if (isClient) {
    await signIn("github");
  } else {
    console.log("Oops, `window` is not defined, cannot execute login.");
  }
};

export const handleLogout = async () => {
  "use server";
  if (isClient) {
    await signOut();
  } else {
    console.log("Oops, `window` is not defined, cannot execute logout.");
  }
};

export const register = async (previousState, formData) => {
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { username, email, password, img, passwordRepeat } = Object.fromEntries(formData);

  if (!username || !email || !password || !passwordRepeat) {
    return { error: "Missing required fields" };
  }

  if (password !== passwordRepeat) {
    return { error: "Passwords do not match" };
  }

  try {
    connectToDb();

    const user = await User.findOne({ username });

    if (user) {
      return { error: "Username already exists" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      img,
    });

    await newUser.save();
    console.log("saved to db");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

// Login function
export const login = async (formData) => {
  if (!formData || !(formData instanceof FormData)) {
    console.error("Invalid formData:", formData);
    return { error: "Invalid form data" };
  }

  const { username, password } = Object.fromEntries(formData.entries());

  // Ensure both username and password are provided
  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    if (isClient) {
      await signIn("credentials", { username, password });
    } else {
      console.log("Oops, `window` is not defined, cannot execute login.");
    }
  } catch (err) {
    console.error("Login error:", err);
    if (err.message.includes("CredentialsSignin")) {
      return { error: "Invalid username or password" };
    }
    throw err;
  }
};
