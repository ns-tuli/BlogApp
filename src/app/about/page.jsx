"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./about.module.css";

// Animation Variants
const imageVariants = {
  hidden: { opacity: 1, scale: 1 }, // Initial state
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  animate: {
    scale: [1, 1.1, 1], // Makes the image scale between 1 and 1.1 in a loop
    transition: {
      duration: 2,
      repeat: Infinity, // Loops forever
      repeatType: "loop", // Continuously loops
      ease: "easeInOut",
    },
  },
};

const about = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.subtitle}>About Agency</h2>
        <h1 className={styles.title}>
          We create digital ideas that are bigger, bolder, braver, and better.
        </h1>
        <p className={styles.desc}>
          We create digital ideas that are bigger, bolder, braver, and better.
          We believe in good ideas, flexibility, and precision. We’re the
          world’s best consulting & finance solution provider with a wide range
          of web and software development services.
        </p>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <h1>10 K+</h1>
            <p>Years of experience</p>
          </div>
          <div className={styles.box}>
            <h1>500+</h1>
            <p>Successful Projects</p>
          </div>
          <div className={styles.box}>
            <h1>100+</h1>
            <p>Clients Worldwide</p>
          </div>
        </div>
      </div>

      {/* Animated Image Container */}
      <motion.div
        className={styles.imgContainer}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Image
          src="/about3.png"
          alt="About Image"
          fill
          className={styles.img}
        />
      </motion.div>
    </div>
  );
};

export default about;
