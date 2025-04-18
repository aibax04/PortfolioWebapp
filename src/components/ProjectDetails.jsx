import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';

const ProjectDetails = ({ project, onClose, handleCursorEnterButton, handleCursorLeaveButton }) => {
  if (!project) return null;
  
  return (
    <motion.div 
      className="project-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="project-modal-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <button 
          className="close-button"
          onClick={onClose}
          onMouseEnter={handleCursorEnterButton}
          onMouseLeave={handleCursorLeaveButton}
        >
          <X size={24} />
        </button>
        
        <div className="project-modal-header">
          <h2>{project.title}</h2>
        </div>
        
        <div className="project-modal-body">
          <img src={project.image} alt={project.title} />
          <p>{project.longDescription}</p>
          
          <div className="project-highlights">
            <h3>Highlights</h3>
            <ul>
              {project.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
          
          <div className="project-technologies">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="project-modal-footer">
          <a 
            href={project.link} 
            target="_blank" 
            rel="noreferrer"
            className="primary-button"
            onMouseEnter={handleCursorEnterButton}
            onMouseLeave={handleCursorLeaveButton}
          >
            <Github size={16} /> View on GitHub
          </a>
          
          <button 
            className="secondary-button"
            onClick={onClose}
            onMouseEnter={handleCursorEnterButton}
            onMouseLeave={handleCursorLeaveButton}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetails;