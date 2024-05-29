import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { use } from "react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
      <h3 className=" text-5xl mb-10">{session.user.role}</h3>
    </div>
  );
}
