import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AutoSignOut() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const timeout = setTimeout(() => {
        signOut(); // Automatically sign out the user after 30 minutes
        router.push("/"); // Redirect to the home page
      }, 30*60 * 1000); // 30 minutes in milliseconds

      return () => clearTimeout(timeout); // Clear timeout on component unmount
    }
  }, [status, router]);

  return null; // No UI required for this component
}