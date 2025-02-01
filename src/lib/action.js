"use server";
import { revalidatePath } from "next/cache";
import { Post, User } from "./models";  // Assuming these are defined in the models file
import { connectToDb } from "./utils";  // Assuming a utility to connect to your DB
import bcrypt from "bcryptjs";

const isClient = typeof window !== "undefined"; // This will be true on the client-side, false on the server-side

// Add a new blog post
export const addPost = async (prevState) => {
  console.log("🔥 Received prevState:", prevState);

  // Ensure the data is a valid FormData object before processing
  const formData = prevState instanceof FormData ? prevState : new FormData();

  console.log("🔥 Extracted formData:", formData);

  // Convert FormData to a plain object
  const formObject = Object.fromEntries(formData.entries());
  console.log("🎯 Parsed Form Data:", formObject);

  // Destructure the required fields
  const { title, desc, slug, userId } = formObject;

  // Validation to ensure necessary fields are present
  if (!title || !desc || !slug || !userId) {
    return { error: "Missing required fields" };
  }

  try {
    // Connect to the database
    await connectToDb();

    // Create a new post instance
    const newPost = new Post({
      title,
      desc,
      slug,
      userId,
    });

    // Save the new post to the database
    await newPost.save();
    console.log("✅ Post saved to DB");

    // Revalidate paths to update any cached data or triggers
    revalidatePath("/blog");
    revalidatePath("/admin");

    return { success: "Post created successfully!" };
  } catch (err) {
    console.error("🚨 Error saving post:", err);
    return { error: "Something went wrong while saving the post." };
  }
};

// Delete a blog post
export const deletePost = async (formData) => {
  // Ensure the formData is valid
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { id } = Object.fromEntries(formData);

  // Ensure the post ID is provided
  if (!id) {
    return { error: "Post ID is required" };
  }

  try {
    // Connect to the database
    await connectToDb();

    // Find and delete the post from the database
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return { error: "Post not found" };
    }

    console.log("✅ Post deleted");

    // Revalidate paths to refresh the cached content
    revalidatePath("/blog");
    revalidatePath("/admin");

    return { success: "Post deleted successfully!" };
  } catch (err) {
    console.error("🚨 Error deleting post:", err);
    return { error: "Something went wrong while deleting the post." };
  }
};

export const handleGithubLogin = async (e) => {
  e.preventDefault();

  // Trigger the GitHub OAuth login with NextAuth.js
  const result = await signIn("github", {
    redirect: false, // Prevent auto redirect
  });

  if (result?.error) {
    console.error("GitHub login failed:", result.error);
  } else {
    window.location.href = "/"; // Redirect to the dashboard upon success
  }
};

// Register a new user
export const register = async (formData) => {
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { username, password } = Object.fromEntries(formData);

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return { error: "Username already taken" };
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ User registered");

    return { success: "User registered successfully!" };
  } catch (err) {
    console.error("🚨 Error registering user:", err);
    return { error: "Something went wrong while registering the user." };
  }
};

// Handle user login (using credentials)
export const login = async (formData) => {
  if (!formData) {
    return { error: "Invalid form data" };
  }

  const { username, password } = Object.fromEntries(formData);

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    // Find user in the database
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return { error: "Invalid username or password" };
    }

    console.log("✅ User logged in");

    return { success: "Login successful!" };
  } catch (err) {
    console.error("🚨 Error logging in:", err);
    return { error: "Something went wrong while logging in" };
  }
};
