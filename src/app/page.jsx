import BlogPosts from "@/home/BlogPosts";
import Footer from "@/home/Footer";
import Hero from "@/home/Hero";
import LastSec from "@/home/LastSec";
import NavbarMenu from "@/home/Navbar";

export default function Home() {
  return (
    <main>
      <NavbarMenu />
      <Hero />
      <BlogPosts />
      <LastSec />
      <Footer />
    </main>
  );
}
