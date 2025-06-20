"use client";
import { SparklesCore } from "@/components/Sparkles";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/Button";
import { featuredPosts } from "../index";

const BlogPosts = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

  return (
    <section className="container">
      <h2 className="~text-2xl/3xl font-bold text-center mb-12">
        Featured Blog Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredPosts.map((post, index) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            key={index}
            className="relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative z-20 overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-[29rem] object-cover transition-transform duration-300 group-hover:scale-110"
                  property="true"
                />
              </motion.div>
              <div className="absolute inset-0 bg-white-200 bg-opacity-50 flex flex-col justify-end items-center text-white-50 text-center">
                <span className="bg-white-200 opacity-90 ~text-lg/xl uppercase px-3 py-1 rounded-full mb-2 mx-10">
                  {post.category}
                </span>
                <h3 className="~text-md/lg font-bold tracking-wider">
                  {post.title}
                </h3>
                <p className="~text-md/lg opacity-90 font-semibold tracking-wide">
                  By {post.author}
                </p>
                <p className="~text-md/lg mt-2 tracking-wide py-4">
                  {post.description}
                </p>
                <Button
                  onClick={() => setSelectedPost(post)}
                  titleClass="text-white-50 after:bg-white-50 my-4"
                >
                  Read More
                </Button>
              </div>
            </motion.div>
            <div className="absolute w-full h-1/4 flex flex-col items-center justify-center">
              <SparklesCore
                background="transparent"
                particleColor="#5c4d7c"
                minSize={0.9}
                maxSize={1}
                particleDensity={800}
                className="w-full h-full"
              />

              <div className="absolute inset-0 w-full h-full bg-white-50 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white-300/70 backdrop-blur-lg flex items-center justify-center z-50 p-6 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white-50 text-white-300 rounded-2xl max-w-3xl max-h-full w-full relative px-6"
            >
              <Button
                className="absolute m-4 top-4 right-4"
                titleClass="text-2xl"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </Button>
              <h3 className="~text-2xl/4xl font-bold mb-2 text-white-200 text-center">
                {selectedPost.title}
              </h3>
              <p className="~text-xl/2xl text-white-300 text-md mb-4 text-center">
                By {selectedPost.author}
              </p>
              <div className="flex justify-center items-center mb-4">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  width={250}
                  height={250}
                  className="rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
              <p className="~text-xs/sm py-6">{selectedPost.fullDescription}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogPosts;
