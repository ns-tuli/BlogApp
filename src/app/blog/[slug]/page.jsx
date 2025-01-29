import styles from "./singlePost.module.css";
import Image from "next/image";

const SinglePostPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src="/post.jpg" alt="" fill className={styles.img} />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.title}> Title</h1>
        <div className={styles.detail}>
          <Image
            className={styles.avatar}
            src="/noavatar.png"
            alt=""
            width={50}
            height={50}
          />
          <div className={styles.detailedText}>
            <span className={styles.detailedTitle}>Author </span>
            <span className={styles.detailedValue}>N S tuli</span>
          </div>
          <div className={styles.detailedText}>
            <span className={styles.detailedTitle}>Date </span>
            <span className={styles.detailedValue}>01.01.2015</span>
          </div>
          <div className={styles.content}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod bibendum laoreet. Proin gravida dolor sit amet lacus
              accumsan et viverra justo commodo. Proin sodales pulvinar tempor.
              Cum sociis natoque penatibus et magnis dis parturient montes,
              nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra
              vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget
              odio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
