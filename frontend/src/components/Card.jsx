import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false 
}) => {
  const baseClasses = 'card-base';
  const hoverClasses = hoverable ? 'cursor-pointer' : '';
  
  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
