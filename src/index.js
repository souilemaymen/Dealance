import {
  faFacebook,
  faGithub,
  faInstagram,
  faWebAwesome,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faFileWord, faObjectGroup } from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faCommentsDollar,
  faPhotoFilm,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const featuredPosts = [
  {
    title: "Mastering Freelancing in Tunisia",
    category: "Freelancing Tips",
    image: "/mastering-freelance.webp",
    author: "Farouk Bensaid",
    description:
      "Learn the essential steps to land your first freelance gig and start your career successfully.",
    fullDescription:
      "Freelancing is an exciting opportunity for many Tunisians looking for financial independence and flexible work. However, breaking into the market requires more than just skill—it takes strategy, patience, and persistence. In this article, we’ll walk you through the most effective steps to start your freelance journey. From identifying your strengths and choosing a niche to building a portfolio that attracts clients, we cover everything you need to establish a solid foundation. Additionally, we’ll discuss common mistakes that beginners make and how to avoid them. By the end of this guide, you’ll have a clear roadmap to secure your first freelance project and set yourself up for long-term success.",
  },
  {
    title: "How to Land High-Paying Clients",
    category: "Trending",
    image: "/high-paying.webp",
    author: "Aymen Souilem",
    description:
      "Discover proven techniques to attract premium clients and boost your freelance income.",
    fullDescription:
      "Many freelancers struggle to find high-paying clients, but the secret lies in positioning yourself as an expert in your field. In this article, we explore key strategies such as creating a standout personal brand, showcasing your skills effectively, and using platforms like LinkedIn and Upwork to connect with the right clients. You’ll also learn how to craft compelling proposals, set the right pricing strategy, and negotiate confidently. Whether you're a beginner or an experienced freelancer, these insights will help you elevate your freelancing career and secure better-paying opportunities.",
  },
  {
    title: "Success Story: From Beginner to Pro",
    category: "Success Story",
    image: "/pro.webp",
    author: "Amir Daoudi",
    description:
      "Explore inspiring freelancing success stories and learn from their journeys.",
    fullDescription:
      "Every successful freelancer started somewhere, and their journeys are full of valuable lessons. In this article, we share real-life stories of freelancers who went from zero clients to earning a full-time income online. You’ll read about the challenges they faced, the strategies they used to grow, and the mindset shifts that led to their success. Whether you’re looking for motivation or practical tips, these stories will give you the confidence to take your freelancing career to the next level.",
  },
];

export const footerCategories = [
  { title: "Services", href: "/service" },
  { title: "Pricing", href: "#" },
  { title: "Blog", href: "/" },
  { title: "Contact", href: "/contact" },
];

export const footerLinks = [
  {
    icon: <FontAwesomeIcon icon={faFacebook} width={25} height={25} />,
    href: "#",
  },
  {
    icon: <FontAwesomeIcon icon={faXTwitter} width={25} height={25} />,
    href: "#",
  },
  {
    icon: <FontAwesomeIcon icon={faInstagram} width={25} height={25} />,
    href: "#",
  },
  {
    icon: <FontAwesomeIcon icon={faGithub} width={25} height={25} />,
    href: "#",
  },
];

const Skeletons = ({ src, alt }) => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-white-200 dark:from-neutral-900 dark:to-neutral-800 to-white-100">
      <img
        onClick={() => console.log("clicked")}
        src={src}
        alt={alt}
        className="w-full rounded-xl group-hover/bento:scale-95 transition duration-200 object-cover cursor-pointer"
      />
    </div>
  );
};

export const categories = [
  {
    title: "Web & App Development",
    description:
      "Find expert developers who deliver custom websites and apps, meeting your unique business needs while ensuring top-tier quality and performance for clients.",
    header: <Skeletons src="/web.webp" alt="Web & App Development" />,
    icon: (
      <FontAwesomeIcon icon={faWebAwesome} className="h-4 w-4 text-white-200" />
    ),
  },
  {
    title: "Graphic Design & Branding",
    description:
      "Work with creative freelancers who craft unique, engaging designs and strong brand identities, helping clients stand out in a competitive market.",
    header: <Skeletons src="/graphic.webp" alt="Graphic Design & Branding" />,
    icon: (
      <FontAwesomeIcon
        icon={faObjectGroup}
        className="h-4 w-4 text-white-200"
      />
    ),
  },
  {
    title: "Marketing & SEO",
    description:
      "Team up with marketing and SEO experts who increase online visibility, optimize your website, and deliver results-driven campaigns to grow your client base.",
    header: <Skeletons src="/marketing.webp" alt="Marketing & SEO" />,
    icon: (
      <FontAwesomeIcon
        icon={faCommentsDollar}
        className="h-4 w-4 text-white-200"
      />
    ),
  },
  {
    title: "Video Editing & Animation",
    description:
      "Connect with video editors and animators who produce high-quality, captivating content, elevating your brand’s message and leaving a lasting impression.",
    header: <Skeletons src="/animation.webp" alt="Video Editing & Animation" />,
    icon: (
      <FontAwesomeIcon icon={faPhotoFilm} className="h-4 w-4 text-white-200" />
    ),
  },
  {
    title: "Virtual Assistance & Admin",
    description:
      "Partner with virtual assistants who handle administrative tasks efficiently, allowing clients to focus on growth while maintaining smooth operations.",
    header: <Skeletons src="/admin.webp" alt="Virtual Assistance & Admin" />,
    icon: (
      <FontAwesomeIcon icon={faUserTie} className="h-4 w-4 text-white-200" />
    ),
  },
  {
    title: "Content Writing & Copywriting",
    description:
      "Collaborate with skilled writers who produce compelling, SEO-friendly content that drives traffic and engages your audience, making your brand voice heard.",
    header: (
      <Skeletons src="/copywriting.webp" alt="Content Writing & Copywriting" />
    ),
    icon: (
      <FontAwesomeIcon icon={faFileWord} className="h-4 w-4 text-white-200" />
    ),
  },
  {
    title: "Photo Editing & Retouching",
    description:
      "Work with skilled photo editors who enhance, retouch, and transform images, delivering high-quality visuals that meet both creative and professional needs.",
    header: <Skeletons src="/photo.webp" alt="Photo Editing & Retouching" />,
    icon: (
      <FontAwesomeIcon icon={faCamera} className="h-4 w-4 text-white-200" />
    ),
  },
];

export const steps = [
  { title: "Post a Job", description: "Describe what you need in detail." },
  {
    title: "Browse & Hire",
    description: "View profiles, ratings, and past work.",
  },
  {
    title: "Collaborate & Pay",
    description: "Use tools for smooth communication and payments.",
  },
];

export const testimonials = [
  {
    name: "Amir Daoudi",
    title: "Full Stack Developer",
    rating: 3.2,
    reviews: 120,
    categories: ["Web Development", "JavaScript", "React"],
    skills: ["React", "Node.js", "CSS"],
    bio: "Passionate about building scalable web applications.",
    image: "/amir.webp", // Add the path to the freelancer's image
  },
  {
    name: "Farouk Bensaid",
    title: "Graphic Designer",
    rating: 4.9,
    reviews: 150,
    categories: ["Design", "UI/UX"],
    skills: ["Photoshop", "Figma", "Illustrator"],
    bio: "Creating visually stunning designs that engage users.",
    image: "/farouk.webp", // Add the path to the freelancer's image
  },
];
