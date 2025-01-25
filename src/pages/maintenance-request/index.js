import React, { useState, useRef, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const sections = [
  { id: 1, title: 'Section 1' },
  { id: 2, title: 'Section 2' },
  { id: 3, title: 'Section 3' },
  { id: 4, title: 'Section 4' },
  { id: 5, title: 'Section 5' }
];

const fadeInOut = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

const easeScroll = (start, end, duration, callback) => {
  const startTime = performance.now();

  const animate = (currentTime) => {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = progress * (2 - progress); // Ease-out function
    const currentPosition = start + (end - start) * ease;

    callback(currentPosition);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const SingleSectionForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false); // Prevent overlapping scrolls

  const scrollToSection = (index) => {
    if (!containerRef.current || isScrollingRef.current) return;
    isScrollingRef.current = true;

    const container = containerRef.current;
    const sectionHeight = window.innerHeight;
    const targetPosition = index * sectionHeight;

    easeScroll(container.scrollTop, targetPosition, 500, (value) => {
      container.scrollTop = value;
    });

    setTimeout(() => {
      setCurrentSection(index);
      isScrollingRef.current = false;
    }, 500);
  };

  const handleScroll = () => {
    if (isScrollingRef.current) return;

    const container = containerRef.current;
    const sectionHeight = window.innerHeight;
    const scrollTop = container.scrollTop;
    const newIndex = Math.round(scrollTop / sectionHeight);

    if (newIndex !== currentSection) {
      scrollToSection(newIndex);
    }
  };

  useEffect(() => {
    scrollToSection(currentSection); // Ensure the correct section is displayed initially
  }, [currentSection]);

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        overflowY: 'scroll',
        height: '100vh',
        scrollSnapType: 'none' // Disable CSS snapping in favor of manual control
      }}
    >
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial="hidden"
          animate={index === currentSection ? 'visible' : 'hidden'}
          variants={fadeInOut}
          transition={{ duration: 0.3 }}
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {index === currentSection && (
            <Card
              sx={{
                width: '40%',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: 3,
                borderRadius: 4,
                padding: 2
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {section.title}
                </Typography>

                <Form
                  onSubmit={(values) => console.log('Submitted values:', values)}
                  render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      {[...Array(5)].map((_, fieldIndex) => (
                        <Field
                          key={`${section.id}-${fieldIndex}`}
                          name={`field-${section.id}-${fieldIndex}`}
                          render={({ input, meta }) => (
                            <Box sx={{ mb: 2 }}>
                              <TextField
                                {...input}
                                fullWidth
                                label={`Field ${fieldIndex + 1}`}
                                variant="outlined"
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error ? meta.error : ''}
                              />
                            </Box>
                          )}
                        />
                      ))}

                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button type="submit" variant="contained">
                          Submit Section {section.id}
                        </Button>
                      </Box>
                    </form>
                  )}
                />
              </CardContent>
            </Card>
          )}
        </motion.div>
      ))}
    </Box>
  );
};

export default SingleSectionForm;
