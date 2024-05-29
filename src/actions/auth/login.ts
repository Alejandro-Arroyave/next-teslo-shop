"use server";

import { signIn } from "@/auth.config";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return "Success";
  } catch (error) {
    // if ((error as any).type === "CredentialsSignin") {
    return "CredentialsSignin";
    // }

    // return "Unkonown Error";
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", { email: email.toLowerCase(), password });
    return {
      ok: true,
      message: "Logged!",
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      message: "Error on logging",
    };
  }
};
