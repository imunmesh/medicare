import React from 'react';
import Card from './Card';
import Button from './Button';

const DoctorCard = ({ doctor, onViewProfile }) => {
  return (
    <Card hoverable className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center flex-grow">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 overflow-hidden">
          {doctor.image ? (
            <img 
              src={doctor.image} 
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
        <p className="text-primary-600 font-medium mb-2">{doctor.specialization}</p>
        <div className="flex items-center space-x-1 text-yellow-500 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4" fill={i < doctor.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ))}
          <span className="text-gray-600 text-sm ml-1">({doctor.rating})</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">{doctor.experience} years experience</p>
      </div>
      <Button 
        variant="secondary" 
        onClick={() => onViewProfile(doctor)}
        className="w-full"
      >
        View Profile
      </Button>
    </Card>
  );
};

export default DoctorCard;
