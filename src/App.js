import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Brain, Code, PenTool, Award, Cpu, Github, Linkedin, Twitter, Mail, MapPin, ArrowRight, ExternalLink, ChevronDown, Moon, Sun, Menu, X } from 'lucide-react';
import './App.css';

// Lazy-loaded components for better performance
const ProjectDetails = React.lazy(() => import('./components/ProjectDetails'));
const ParticleBackground = React.lazy(() => import('./components/ParticleBackground'));
const ThreeDModel = React.lazy(() => import('./components/ThreeDModel'));

const App = () => {
  // State management
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  
  // Refs
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const cursorRef = useRef(null);
  
  // Scroll animations
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Projects data
  const [projects] = useState([
    {
      id: 1,
      title: "NeuroGAN: Advanced Image Synthesis",
      description: "A cutting-edge GAN architecture that combines neural style transfer with text-based image generation for unprecedented creative control.",
      longDescription: "NeuroGAN represents a breakthrough in generative adversarial networks, combining the latest advances in neural style transfer with transformer-based text understanding. This project achieved state-of-the-art results in the COCO-GEN benchmark and was featured at the International Conference on Machine Learning.",
      tags: ["PyTorch", "GANs", "NLP", "Computer Vision"],
      image: "/api/placeholder/800/600",
      link: "https://github.com/aibad/neurogan",
      highlights: [
        "99.7% user satisfaction rating in blind comparison tests",
        "3x faster inference than competitive models",
        "Novel attention mechanism for multi-modal input processing"
      ],
      technologies: ["Python", "PyTorch", "CUDA", "Docker", "React (visualization dashboard)"]
    },
    {
      id: 2,
      title: "QuantML: Financial Portfolio Optimization",
      description: "An AI-powered system that leverages reinforcement learning to create optimized investment portfolios with superior risk-adjusted returns.",
      longDescription: "Developed during a high-stakes fintech hackathon, QuantML revolutionizes portfolio management by implementing a multi-agent reinforcement learning system that continuously adapts to market conditions. The system incorporates alternative data sources and sentiment analysis to predict market movements beyond traditional technical indicators.",
      tags: ["Reinforcement Learning", "Financial Analysis", "Time Series", "Cloud Computing"],
      image: "/api/placeholder/800/600",
      link: "https://github.com/aibad/quantml",
      highlights: [
        "First place winner at GlobalFinHack 2024",
        "Outperformed market benchmarks by 17.3% in backtesting",
        "Successfully deployed to manage $1M test portfolio"
      ],
      technologies: ["TensorFlow", "Python", "AWS", "MongoDB", "React/Redux", "D3.js"]
    },
    {
      id: 3,
      title: "VizDash: Interactive ML Visualization",
      description: "A revolutionary dashboard that transforms complex machine learning metrics into intuitive interactive visualizations for non-technical stakeholders.",
      longDescription: "VizDash bridges the gap between data scientists and business stakeholders by transforming complex model metrics and predictions into beautiful, interactive visualizations. The system features real-time model monitoring, automated anomaly detection, and customizable reporting interfaces that adapt to different user expertise levels.",
      tags: ["Data Visualization", "UX/UI", "WebGL", "Real-time Analytics"],
      image: "/api/placeholder/800/600",
      link: "https://github.com/aibad/vizdash",
      highlights: [
        "Reduced decision time by 78% in user studies",
        "Modular architecture supporting 15+ ML frameworks",
        "Featured in UX Design Awards 2024"
      ],
      technologies: ["React", "Three.js", "D3.js", "WebGL", "GraphQL", "Node.js", "Redis"]
    },
    {
      id: 4,
      title: "ConvoAI: Contextual Conversation Agent",
      description: "A next-generation conversational AI system that maintains context over long interactions while integrating domain-specific knowledge.",
      longDescription: "ConvoAI pushes the boundaries of natural language processing by implementing a novel memory architecture that maintains contextual understanding across extended conversations. The system incorporates domain-specific knowledge graphs that can be customized for different industries, making it adaptable for healthcare, legal, financial, and educational applications.",
      tags: ["NLP", "Transformers", "Knowledge Graphs", "Conversational AI"],
      image: "/api/placeholder/800/600",
      link: "https://github.com/aibad/convoai",
      highlights: [
        "95.3% accuracy in maintaining context over 20+ conversation turns",
        "Seamless integration with 7 enterprise knowledge management systems",
        "Open-source core with 1,200+ GitHub stars"
      ],
      technologies: ["Python", "Hugging Face", "PyTorch", "Neo4j", "FastAPI", "Redis", "React"]
    }
  ]);
  
  // Skills data
  const skills = [
    { 
      name: "Machine Learning", 
      level: 95, 
      icon: <Brain size={24} />,
      description: "Expert in supervised, unsupervised, and reinforcement learning techniques. Experienced with neural networks, decision trees, and ensemble methods.",
      libraries: ["TensorFlow", "PyTorch", "scikit-learn", "Keras"]
    },
    { 
      name: "Generative AI", 
      level: 97, 
      icon: <Cpu size={24} />,
      description: "Specialized in GANs, diffusion models, and transformer architectures. Created production-ready generative systems for text, image, and audio.",
      libraries: ["DALL-E", "Stable Diffusion", "GPT", "VAEs"]
    },
    { 
      name: "Front-end Development", 
      level: 90, 
      icon: <Code size={24} />,
      description: "Experienced in building responsive, accessible, and performant web applications with modern JavaScript frameworks.",
      libraries: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    { 
      name: "UI/UX Design", 
      level: 85, 
      icon: <PenTool size={24} />,
      description: "Strong understanding of design principles, user research, and interaction design. Created intuitive interfaces for complex technical applications.",
      libraries: ["Figma", "Adobe XD", "Sketch", "Principle"]
    },
    { 
      name: "Data Engineering", 
      level: 88, 
      icon: <Cpu size={24} />,
      description: "Proficient in designing scalable data pipelines, ETL processes, and data storage solutions for big data applications.",
      libraries: ["Apache Spark", "Airflow", "Kafka", "MongoDB"]
    },
    { 
      name: "Hackathon Champion", 
      level: 95, 
      icon: <Award size={24} />,
      description: "Multiple-time winner of prestigious hackathons with expertise in rapid prototyping and innovative solution design.",
      libraries: ["GitHub Copilot", "rapid development", "team leadership"]
    },
  ];
  
  // Timeline data
  const timeline = [
    {
      year: "2024",
      title: "Lead AI Engineer",
      company: "TechNova Solutions",
      description: "Leading a team of 5 engineers in developing cutting-edge AI solutions for enterprise clients."
    },
    {
      year: "2022",
      title: "ML Research Scientist",
      company: "DataMinds Institute",
      description: "Conducted research in generative models and published 3 papers in top-tier conferences."
    },
    {
      year: "2020",
      title: "Front-end Developer",
      company: "UX Innovations",
      description: "Designed and implemented user interfaces for data-intensive applications."
    },
    {
      year: "2018",
      title: "Master's Degree",
      company: "Carnegie Mellon University",
      description: "MSc in Machine Learning with specialization in Computer Vision."
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at DataStream",
      text: "Aibad's machine learning solutions transformed our business. The models he built increased our prediction accuracy by 40% and significantly reduced operational costs.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Mark Chen",
      role: "Project Lead at AIStartup",
      text: "Working with Aibad was a game-changer for our team. His expertise in generative AI and ability to translate complex concepts into actionable insights is unparalleled.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Elena Rodriguez",
      role: "Senior Designer at UXMasters",
      text: "Aibad combines technical excellence with an eye for design. His front-end work is not just functional but beautiful, creating experiences that users love.",
      avatar: "/api/placeholder/100/100"
    }
  ];

  // Section intersection observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = [homeRef, aboutRef, skillsRef, projectsRef, contactRef];
    sections.forEach((section) => {
      if (section.current) {
        observer.observe(section.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.current) {
          observer.unobserve(section.current);
        }
      });
    };
  }, []);

  // Loading and scroll animations
  useEffect(() => {
    // Simulated loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Scroll progress
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse movement for custom cursor and interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      
      if (cursorRef.current) {
        const cursorX = clientX;
        const cursorY = clientY;
        
        // Use spring animation for smoother cursor movement
        cursorRef.current.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Cursor variants for interactive elements
  const handleCursorEnterLink = () => setCursorVariant("link");
  const handleCursorLeaveLink = () => setCursorVariant("default");
  const handleCursorEnterButton = () => setCursorVariant("button");
  const handleCursorLeaveButton = () => setCursorVariant("default");

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  // Handle project selection
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Close project details modal
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  // Loading screen component
  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="loading-logo" width="100" height="100" viewBox="0 0 100 100">
            <motion.path
              d="M20,50 A30,30 0 1,1 80,50 A30,30 0 1,1 20,50 Z"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M30,50 L70,50 M50,30 L50,70"
              stroke="url(#gradient)"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#00D9FF" />
              </linearGradient>
            </defs>
          </svg>
          <motion.h1
            className="loading-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="gradient-text">AIBAD</span>
          </motion.h1>
          <div className="loading-bar-container">
            <motion.div
              className="loading-bar"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
            ></motion.div>
          </div>
          <motion.p
            className="loading-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Machine Learning • Gen AI • Front-end
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      {/* Custom cursor */}
      <div 
        className={`cursor ${cursorVariant}`} 
        ref={cursorRef}
        style={{
          left: mousePosition.x,
          top: mousePosition.y
        }}
      >
        {cursorVariant === "link" && <span className="cursor-dot"></span>}
        {cursorVariant === "button" && <span className="cursor-ring"></span>}
      </div>
      
      {/* Progress bar */}
      <motion.div 
        className="progress-bar"
        style={{ scaleX: smoothScrollProgress }}
      />
      
      {/* Header */}
      <header className="header">
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={handleCursorEnterLink}
          onMouseLeave={handleCursorLeaveLink}
          onClick={() => scrollToSection('home')}
        >
          <motion.span 
            className="logo-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">AIBAD</span>
          </motion.span>
        </motion.div>
        
        {/* Desktop navigation */}
        <nav className="desktop-navigation">
          {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
            <motion.button
              key={section}
              className={`nav-item ${activeSection === section ? 'active' : ''}`}
              onClick={() => scrollToSection(section)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={handleCursorEnterLink}
              onMouseLeave={handleCursorLeaveLink}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * ['home', 'about', 'skills', 'projects', 'contact'].indexOf(section) }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </motion.button>
          ))}
        </nav>
        
        {/* Theme toggle and mobile menu */}
        <div className="header-controls">
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={handleCursorEnterButton}
            onMouseLeave={handleCursorLeaveButton}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          <motion.button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={handleCursorEnterButton}
            onMouseLeave={handleCursorLeaveButton}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
        
        {/* Mobile navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="mobile-navigation"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
                <motion.button
                  key={section}
                  className={`mobile-nav-item ${activeSection === section ? 'active' : ''}`}
                  onClick={() => scrollToSection(section)}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * ['home', 'about', 'skills', 'projects', 'contact'].indexOf(section) }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="main-content">
        {/* Hero Section */}
        <section id="home" ref={homeRef} className="section hero-section">
          <Suspense fallback={<div>Loading particles...</div>}>
            <ParticleBackground mousePosition={mousePosition} />
          </Suspense>
          
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Hello, I'm <span className="gradient-text">Aibad</span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Machine Learning Engineer & Front-end Developer
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Specializing in generative AI and creating intuitive, data-driven user experiences that bridge the gap between powerful algorithms and human needs.
              </motion.p>
              
              <motion.div 
                className="hero-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <motion.button 
                  className="primary-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={handleCursorEnterButton}
                  onMouseLeave={handleCursorLeaveButton}
                  onClick={() => scrollToSection('projects')}
                >
                  View My Work <ArrowRight size={16} />
                </motion.button>
                
                <motion.button 
                  className="secondary-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={handleCursorEnterButton}
                  onMouseLeave={handleCursorLeaveButton}
                  onClick={() => scrollToSection('contact')}
                >
                  Get In Touch
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="hero-stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <div className="stat">
                  <h3>20+</h3>
                  <p>ML Projects</p>
                </div>
                <div className="stat">
                  <h3>15+</h3>
                  <p>Hackathons</p>
                </div>
                <div className="stat">
                  <h3>6+</h3>
                  <p>Years Experience</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Suspense fallback={<div className="model-placeholder">Loading 3D model...</div>}>
                <ThreeDModel mousePosition={mousePosition} />
              </Suspense>
              
              <div className="tech-badges">
                {["TensorFlow", "PyTorch", "React", "Next.js", "Python"].map((tech, index) => (
                  <motion.div 
                    key={tech}
                    className="tech-badge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            onClick={() => scrollToSection('about')}
          >
            <p>Scroll to discover</p>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </section>
        
        {/* About Section */}
        <section id="about" ref={aboutRef} className="section about-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </motion.h2>
          
          <div className="about-content">
            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src="/api/placeholder/500/700" alt="Aibad - Machine Learning Engineer" />
              <div className="image-overlay"></div>
              
              <motion.div 
                className="experience-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <h3>6+</h3>
                <p>Years of Experience</p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="about-details"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Machine Learning Engineer & UI/UX Specialist
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                I'm a passionate technologist who thrives at the intersection of artificial intelligence and human-centered design. With expertise in machine learning, generative AI, and front-end development, I create intelligent solutions that are not only powerful but also intuitive and accessible.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                My journey began with a fascination for how technology can enhance human capabilities. This led me to pursue advanced studies in machine learning while simultaneously developing skills in UI/UX design and front-end development. This unique combination allows me to build end-to-end solutions where complex algorithms meet seamless user experiences.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                I've had the privilege of working on cutting-edge projects ranging from generative art platforms to financial prediction systems, always focusing on creating technology that feels natural and helpful. Whether I'm fine-tuning a neural network or crafting an intuitive interface, my goal remains the same: to create intelligent systems that augment human potential.
              </motion.p>
              
              <motion.div 
                className="about-highlights"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <Award size={24} />
                  </div>
                  <div className="highlight-text">
                    <h4>Award-winning Projects</h4>
                    <p>Multiple hackathon victories and industry recognition</p>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <Cpu size={24} />
                  </div>
                  <div className="highlight-text">
                    <h4>State-of-the-art Implementations</h4>
                    <p>Working with cutting-edge ML architectures</p>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <PenTool size={24} />
                  </div>
                  <div className="highlight-text">
                    <h4>Human-centered Design</h4>
                    <p>Creating intuitive interfaces for complex systems</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="about-cta"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
              >
                <a 
                  href="/api/placeholder/800/1000" 
                  target="_blank" 
                  rel="noreferrer"
                  className="download-button"
                  onMouseEnter={handleCursorEnterButton}
                  onMouseLeave={handleCursorLeaveButton}
                >
                  Download Resume <ExternalLink size={16} />
                </a>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="timeline-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="timeline-title">My Journey</h3>
            
            <div className="timeline">
              {timeline.map((item, index) => (
                <motion.div 
                  key={index}
                  className="timeline-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-year">{item.year}</span>
                    <h4>{item.title}</h4>
                    <h5>{item.company}</h5>
                    <p>{item.description}</p>
                  </div>
                </motion.div>
              ))}
              <div className="timeline-line"></div>
            </div>
          </motion.div>
        </section>
        
        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="section skills-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Skills & Expertise
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            My technical toolkit spans AI, software development, and design, allowing me to build complete, intelligent solutions.
          </motion.p>
          
          <div className="skills-container">
            {skills.map((skill, index) => (
              <motion.div 
                key={index}
                className="skill-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
              >
                <div className="skill-header">
                  <div className="skill-icon">{skill.icon}</div>
                  <h3>{skill.name}</h3>
                </div>
                
                <div className="skill-bar-container">
                  <motion.div 
                    className="skill-bar"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                  ></motion.div>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
                
                <p className="skill-description">{skill.description}</p>
                
                <div className="skill-libraries">
                  {skill.libraries.map((lib, i) => (
                    <span key={i} className="skill-library">{lib}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="testimonials"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="testimonials-title">What People Say</h3>
            
            <div className="testimonials-container">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="testimonial-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                >
                  <div className="testimonial-content">
                    <p>"{testimonial.text}"</p>
                  </div>
                  
                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        
        {/* Projects Section */}
        <section id="projects" ref={projectsRef} className="section projects-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            A selection of my recent work combining AI innovation with intuitive design.
          </motion.p>
          
          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
                onClick={() => handleProjectClick(project)}
                onMouseEnter={handleCursorEnterLink}
                onMouseLeave={handleCursorLeaveLink}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <span>View Details</span>
                  </div>
                </div>
                
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="projects-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <a 
              href="https://github.com/aibad" 
              target="_blank" 
              rel="noreferrer"
              className="github-button"
              onMouseEnter={handleCursorEnterButton}
              onMouseLeave={handleCursorLeaveButton}
            >
              <Github size={20} /> See More on GitHub
            </a>
          </motion.div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="section contact-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Get In Touch
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Interested in working together? Let's discuss how my skills can help your project succeed.
          </motion.p>
          
          <div className="contact-container">
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3>Contact Information</h3>
              <p>Feel free to reach out through any of these channels. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <Mail size={20} />
                  <a href="mailto:hello@aibad.dev">hello@aibad.dev</a>
                </div>
                
                <div className="contact-item">
                  <MapPin size={20} />
                  <span>San Francisco, CA</span>
                </div>
                
                <div className="contact-item">
                  <Github size={20} />
                  <a href="https://github.com/aibad" target="_blank" rel="noreferrer">github.com/aibad</a>
                </div>
                
                <div className="contact-item">
                  <Linkedin size={20} />
                  <a href="https://linkedin.com/in/aibad" target="_blank" rel="noreferrer">linkedin.com/in/aibad</a>
                </div>
                
                <div className="contact-item">
                  <Twitter size={20} />
                  <a href="https://twitter.com/aibad" target="_blank" rel="noreferrer">twitter.com/aibad</a>
                </div>
              </div>
              
              <div className="availability">
                <h4>Current Availability</h4>
                <p>I'm currently available for freelance work and selective full-time opportunities. My ideal project combines machine learning innovation with human-centered design.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    placeholder="Project Discussion" 
                    required 
                  />
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    placeholder="Tell me about your project..." 
                    required
                  ></textarea>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="submit-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={handleCursorEnterButton}
                  onMouseLeave={handleCursorLeaveButton}
                >
                  Send Message <ArrowRight size={16} />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">
              <span className="gradient-text">AIBAD</span>
            </span>
            <p>Machine Learning Engineer & Front-end Developer</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-nav">
              <h4>Navigation</h4>
              <ul>
                {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
                  <li key={section}>
                    <button onClick={() => scrollToSection(section)}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-social">
              <h4>Connect</h4>
              <div className="social-icons">
                <a href="https://github.com/aibad" target="_blank" rel="noreferrer">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com/in/aibad" target="_blank" rel="noreferrer">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com/aibad" target="_blank" rel="noreferrer">
                  <Twitter size={20} />
                </a>
                <a href="mailto:hello@aibad.dev">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aibad. All rights reserved.</p>
          <p>Designed and built with <span className="heart">❤</span> using React and Framer Motion</p>
        </div>
      </footer>
      
      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={<div className="loading-overlay">Loading project details...</div>}>
            <ProjectDetails 
              project={selectedProject} 
              onClose={closeProjectDetails} 
              handleCursorEnterButton={handleCursorEnterButton}
              handleCursorLeaveButton={handleCursorLeaveButton}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;