"use client"
import { useEffect, useState} from "react";
import AccountPage from "./AccountPage";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated ] = useState(false);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
  // vverification si l'utilisateur est connectee ou pas 
    const userId = localStorage.getItem("userId");
    if  (userId) {
      setIsAuthenticated(true);
    } else {
      router.push("/login") // redirection si pas connectee 
    }
    setLoading(false);

  } , []);
  if (loading) return null;
  if (!isAuthenticated) return null;

  return (
    <main>
      <AccountPage />
    </main>
  );
};
export default Page;