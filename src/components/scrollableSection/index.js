import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const ScrollableSection = ({ children, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-50% 0px -50% 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, scale: 0.95, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={{
        duration: 0.5,
        delay: index * 0.2
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        scrollSnapAlign: 'start',
        left: 0,
        right: 0,
        position: 'absolute'
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollableSection;
