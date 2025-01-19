import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll(); // Get scroll progress

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      id="scroll-indicator"
      style={{
        position: 'sticky',
        zIndex: 1,
        top: 60,
        left: 0,
        right: 0,
        height: 11,
        originX: 0,
        backgroundColor: '#1e1e1e'
      }}
    >
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX,
          position: 'sticky',
          zIndex: 1,
          top: 60,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: '#058478'
        }}
      />
    </motion.div>
  );
};

export default ScrollIndicator;
