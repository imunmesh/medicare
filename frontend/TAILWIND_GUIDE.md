# Frontend Mastery with React & Tailwind CSS

## Complete Implementation Guide for Medicare System

This guide demonstrates all the Tailwind CSS concepts covered in Chapter 2, with code examples from your Medicare appointment booking system.

---

## 1. Tailwind Setup (CDN, npm, Vite)

### ✅ Your Current Setup: **Vite + npm**

**Installation (Already done in your project):**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Your `tailwind.config.js`:**
```javascript
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors, fonts, animations...
    },
  },
  plugins: [],
}
```

**Your `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Other Setup Methods (for reference):

**CDN Method (Quick Prototyping):**
```html
<!-- Add to index.html <head> -->
<script src="https://cdn.tailwindcss.com"></script>
```

---

## 2. Utility Classes (Spacing, Typography, Colors)

### Spacing Examples

```jsx
// Padding (p) and Margin (m)
<div className="p-4">Padding 1rem on all sides</div>
<div className="px-6 py-3">Padding horizontal & vertical</div>
<div className="m-2">Margin 0.5rem</div>
<div className="mt-8 mb-4">Margin top & bottom</div>

// Real example from your Modal component:
<div className="p-6">
  <div className="mb-4">Modal header</div>
  <div className="mb-6">Modal content</div>
</div>
```

**Spacing Scale:**
- `p-0` = 0px
- `p-1` = 0.25rem (4px)
- `p-2` = 0.5rem (8px)
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)

### Typography Examples

```jsx
// Font Size
<h1 className="text-3xl">Large Heading</h1>
<h2 className="text-2xl">Medium Heading</h2>
<p className="text-base">Normal text</p>
<small className="text-sm">Small text</small>

// Font Weight
<p className="font-bold">Bold text</p>
<p className="font-medium">Medium weight</p>
<p className="font-normal">Normal weight</p>

// Real example from your Button:
<button className="font-medium">Click Me</button>
```

### Color Examples

```jsx
// Text Colors
<p className="text-gray-700">Gray text</p>
<p className="text-primary-600">Primary color</p>
<p className="text-red-500">Error text</p>

// Background Colors
<div className="bg-white">White background</div>
<div className="bg-primary-50">Light primary</div>
<div className="bg-gray-900">Dark background</div>

// Border Colors
<div className="border border-gray-300">Gray border</div>

// Your custom colors in action:
<button className="bg-primary-600 text-white hover:bg-primary-700">
  Book Appointment
</button>
```

---

## 3. Responsive Design (Breakpoints)

### Your Custom Breakpoints

```javascript
// In tailwind.config.js
screens: {
  'xs': '375px',   // Extra small phones
  'sm': '640px',   // Small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Desktops
  'xl': '1280px',  // Large desktops
  '2xl': '1440px', // Extra large screens
}
```

### Responsive Examples

```jsx
// Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">
  Small on mobile, larger on desktop
</div>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  More padding on larger screens
</div>

// Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Real example - Responsive navigation:
<nav className="flex flex-col md:flex-row gap-4 md:gap-6">
  <a href="/">Home</a>
  <a href="/doctors">Doctors</a>
  <a href="/appointments">Appointments</a>
</nav>
```

---

## 4. Flexbox & Grid

### Flexbox Examples (One-dimensional)

```jsx
// Horizontal flex container
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

// Vertical flex container
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Center content (both axes)
<div className="flex items-center justify-center min-h-screen">
  <div>Centered Content</div>
</div>

// Real example from your Modal:
<div className="flex items-center justify-between mb-4">
  <h3 className="text-2xl font-bold">Modal Title</h3>
  <button>Close</button>
</div>

<div className="flex gap-3 justify-end">
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```

### Grid Examples (Two-dimensional)

```jsx
// Basic grid
<div className="grid grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {doctors.map(doctor => (
    <DoctorCard key={doctor.id} doctor={doctor} />
  ))}
</div>

// Grid with different column spans
<div className="grid grid-cols-4 gap-4">
  <div className="col-span-3">Main content</div>
  <div className="col-span-1">Sidebar</div>
</div>

// Auto-fit grid (responsive without breakpoints)
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <div>Auto-sized card</div>
  <div>Auto-sized card</div>
</div>
```

---

## 5. Component Composition

### 1. Button Component

**Your Enhanced Button Component:**

```jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}) => {
  // Variant styles
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  };

  // Size styles
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const baseClasses = `
    rounded-lg font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200
    hover:scale-105 active:scale-95
    inline-flex items-center justify-center gap-2
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
```

**Usage Examples:**

```jsx
// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Save</Button>
<Button variant="ghost">Cancel</Button>

// Different sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// With icons
<Button 
  leftIcon={<svg>...</svg>}
  variant="primary"
>
  Book Appointment
</Button>

// Full width
<Button fullWidth variant="primary">
  Sign In
</Button>

// Disabled state
<Button disabled>
  Processing...
</Button>
```

### 2. Card Component

**Your Enhanced Card Component:**

```jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false,
  variant = 'default',
  padding = 'normal',
  image,
  title,
  description,
  footer,
}) => {
  const variants = {
    default: 'bg-white border border-gray-100',
    elevated: 'bg-white shadow-xl',
    outlined: 'bg-transparent border-2 border-gray-300',
  };

  const paddings = {
    none: 'p-0',
    compact: 'p-4',
    normal: 'p-6',
    spacious: 'p-8',
  };

  const baseClasses = `
    rounded-xl shadow-lg
    transition-all duration-300
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverable ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
    ${className}
  `;
  
  return (
    <div onClick={onClick} className={baseClasses}>
      {image && (
        <div className="mb-4 -mx-6 -mt-6">
          <img 
            src={image} 
            alt={title || 'Card image'} 
            className="w-full h-48 object-cover rounded-t-xl"
          />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-gray-600 mb-4">
          {description}
        </p>
      )}
      
      {children}
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
```

**Usage Examples:**

```jsx
// Simple card
<Card>
  <h3>Card Content</h3>
  <p>Some text here</p>
</Card>

// Card with all props
<Card
  image="/doctor-photo.jpg"
  title="Dr. Sarah Johnson"
  description="Cardiologist with 15 years of experience"
  hoverable
  footer={
    <Button fullWidth>Book Appointment</Button>
  }
/>

// Interactive card
<Card 
  hoverable 
  onClick={() => navigate('/doctor/123')}
>
  <h3>Dr. Michael Chen</h3>
  <p>Pediatrician</p>
</Card>

// Compact card
<Card padding="compact" variant="outlined">
  <p>Small notification</p>
</Card>
```

### 3. Modal Component

**Your Current Modal (Already Excellent!):**

```jsx
import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  size = 'medium',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-scale-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className={`
        relative bg-white rounded-2xl shadow-2xl w-full
        animate-scale-in max-h-[90vh] overflow-y-auto
        ${sizes[size]}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200
                         p-1 rounded-lg hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="mb-6">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex gap-3 justify-end border-t pt-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

**Usage Examples:**

```jsx
import { useState } from 'react';
import Modal from './components/Modal';
import Button from './components/Button';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Appointment"
        size="medium"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to book this appointment?</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
          <p><strong>Date:</strong> March 15, 2024</p>
          <p><strong>Time:</strong> 10:00 AM</p>
        </div>
      </Modal>
    </>
  );
}
```

---

## 6. Tailwind Config Customization

**Your Complete Custom Configuration:**

```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // Enable dark mode with class strategy
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // Custom color palette
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Base primary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        teal: {
          50: '#f0fdfa',
          // ... full scale
          900: '#134e4a',
        },
        medical: {
          light: '#e8f4f8',
          DEFAULT: '#4a90a4',
          dark: '#2c5f6e',
        }
      },
      
      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      
      // Custom breakpoints
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      
      // Custom animations
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      
      // Custom keyframes
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // You can also extend spacing, shadows, etc.
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.5)',
      },
    },
  },
  
  plugins: [],
}
```

**Using Custom Config:**

```jsx
// Using custom colors
<div className="bg-primary-500 text-white">Primary color</div>
<div className="bg-medical text-white">Medical theme color</div>
<div className="bg-teal-400">Teal accent</div>

// Using custom fonts
<h1 className="font-heading">Poppins Heading</h1>
<p className="font-sans">Inter body text</p>

// Using custom animations
<div className="animate-scale-in">Scales in smoothly</div>
<div className="animate-slide-down">Slides down</div>

// Using custom breakpoints
<div className="xs:text-sm md:text-base 2xl:text-lg">
  Responsive text with custom breakpoints
</div>

// Using custom spacing
<div className="p-128">Extra large padding</div>

// Using custom shadows
<div className="shadow-soft">Soft shadow</div>
<button className="hover:shadow-glow">Glowing hover effect</button>
```

---

## 7. Animations (@apply, @keyframes)

### Using @apply for Component Classes

**Your `index.css` with @apply:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* Button with @apply */
  .btn-primary {
    @apply bg-primary-600 text-white px-6 py-3 rounded-lg font-medium 
           hover:bg-primary-700 focus:outline-none focus:ring-2 
           focus:ring-primary-500 focus:ring-offset-2 
           transition-all duration-200 hover:scale-105 active:scale-95;
  }

  .btn-secondary {
    @apply bg-white text-primary-600 border-2 border-primary-600 
           px-6 py-3 rounded-lg font-medium hover:bg-primary-50 
           focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:ring-offset-2 transition-all duration-200 
           hover:scale-105 active:scale-95;
  }
  
  /* Card with @apply */
  .card-base {
    @apply bg-white rounded-xl shadow-lg border border-gray-100 p-6 
           transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }

  /* Input with @apply */
  .input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:border-transparent transition-all duration-200 bg-white;
  }

  /* Navigation link */
  .nav-link {
    @apply text-gray-700 hover:text-primary-600 font-medium 
           transition-colors duration-200;
  }
}
```

### Custom @keyframes Animations

**Add to your CSS:**

```css
@layer utilities {
  /* Fade In Animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  /* Slide Up Animation */
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-up {
    animation: slideUp 0.4s ease-out;
  }

  /* Bounce Animation */
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce-smooth {
    animation: bounce 2s ease-in-out infinite;
  }

  /* Spin Animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }

  /* Pulse Glow Animation */
  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(14, 165, 233, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.8);
    }
  }

  .animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  /* Shake Animation (for errors) */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .animate-shake {
    animation: shake 0.3s ease-in-out;
  }
}
```

**Using Custom Animations:**

```jsx
// Fade in on mount
<div className="animate-fade-in">
  Content fades in
</div>

// Slide up effect
<div className="animate-slide-up">
  Content slides up
</div>

// Loading spinner
<div className="animate-spin-slow">
  <svg>...</svg>
</div>

// Error shake
<input className={`input-field ${error ? 'animate-shake' : ''}`} />

// Pulsing notification badge
<span className="animate-pulse-glow bg-red-500 rounded-full w-3 h-3" />
```

### Animation with Tailwind Classes

```jsx
// Transition utilities
<button className="transition-all duration-300 hover:scale-110">
  Hover to scale
</button>

<div className="transition-colors duration-200 hover:bg-blue-500">
  Color transition
</div>

// Transform utilities
<img className="transform hover:rotate-6 transition-transform" />

<div className="transform hover:-translate-y-2 transition-transform duration-200">
  Lifts on hover
</div>

// Opacity transitions
<div className="opacity-0 hover:opacity-100 transition-opacity duration-500">
  Fades in on hover
</div>

// Combined animations
<button className="
  transform transition-all duration-300 ease-in-out
  hover:scale-110 hover:rotate-3 hover:shadow-2xl
  active:scale-95
">
  Multi-effect button
</button>
```

---

## 8. Interactive Elements

### Dropdown Component (Your Current Implementation)

**Enhanced with More Hover Effects:**

```jsx
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  label, 
  options, 
  onSelect, 
  selectedValue,
  placeholder = 'Select an option',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left
          flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          hover:border-primary-400 hover:shadow-md
        "
      >
        <span className={selectedOption ? 'text-gray-700' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Animated Arrow Icon */}
        <svg
          className={`
            w-5 h-5 text-gray-500 
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute z-10 w-full mt-2 
          bg-white border border-gray-200 rounded-lg shadow-lg
          animate-slide-down overflow-hidden
        ">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left
                transition-colors duration-150
                ${selectedValue === option.value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
                first:rounded-t-lg last:rounded-b-lg
              `}
            >
              {option.label}
              
              {/* Check mark for selected */}
              {selectedValue === option.value && (
                <svg 
                  className="inline-block ml-2 w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
```

### Hover Effects Examples

```jsx
// 1. Lift on Hover (Card)
<div className="
  transition-transform duration-300
  hover:-translate-y-2 hover:shadow-xl
">
  Card lifts up
</div>

// 2. Scale on Hover (Image)
<img 
  src="/doctor.jpg" 
  className="
    transition-transform duration-300
    hover:scale-110
  "
/>

// 3. Underline on Hover (Link)
<a className="
  relative text-primary-600
  after:absolute after:bottom-0 after:left-0
  after:w-0 after:h-0.5 after:bg-primary-600
  after:transition-all after:duration-300
  hover:after:w-full
">
  Hover me
</a>

// 4. Background Color Change
<button className="
  bg-white text-primary-600
  transition-colors duration-300
  hover:bg-primary-600 hover:text-white
">
  Color swap
</button>

// 5. Glow Effect
<button className="
  transition-shadow duration-300
  hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]
">
  Glowing button
</button>

// 6. Rotate on Hover (Icon)
<svg className="
  transition-transform duration-300
  hover:rotate-90
">
  {/* icon */}
</svg>

// 7. Brightness on Hover (Image)
<img className="
  transition-all duration-300
  hover:brightness-110 hover:contrast-110
" />

// 8. Border Grow Effect
<div className="
  border-2 border-transparent
  transition-all duration-300
  hover:border-primary-500 hover:border-4
">
  Border grows
</div>
```

### Interactive Tooltip

```jsx
const Tooltip = ({ children, text }) => {
  return (
    <div className="relative group inline-block">
      {children}
      
      {/* Tooltip */}
      <div className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200
        whitespace-nowrap
        pointer-events-none
      ">
        {text}
        
        {/* Arrow */}
        <div className="
          absolute top-full left-1/2 -translate-x-1/2
          border-4 border-transparent border-t-gray-900
        " />
      </div>
    </div>
  );
};

// Usage
<Tooltip text="Book an appointment">
  <button>📅</button>
</Tooltip>
```

### Interactive Tabs

```jsx
const Tabs = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  const tabs = [
    { id: 'appointments', label: 'Appointments' },
    { id: 'history', label: 'History' },
    { id: 'prescriptions', label: 'Prescriptions' },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 font-medium
              transition-all duration-200
              relative
              ${activeTab === tab.id
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="
                absolute bottom-0 left-0 right-0
                h-0.5 bg-primary-600
                animate-slide-in
              " />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'appointments' && <AppointmentsContent />}
        {activeTab === 'history' && <HistoryContent />}
        {activeTab === 'prescriptions' && <PrescriptionsContent />}
      </div>
    </div>
  );
};
```

---

## 9. Dark Mode Support

**Your project already has dark mode configured!**

### Dark Mode Setup

```javascript
// In tailwind.config.js
export default {
  darkMode: 'class', // Use 'class' strategy
  // ...
}
```

### Dark Mode Classes

```css
/* In index.css */
@layer base {
  body {
    @apply bg-white text-gray-700;
  }
  
  .dark body {
    @apply bg-gray-900 text-gray-100;
  }
}

@layer components {
  .card-base {
    @apply bg-white border-gray-100;
  }
  
  .dark .card-base {
    @apply bg-gray-800 border-gray-700;
  }
}
```

### Dark Mode Toggle Component

```jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-gray-200 dark:bg-gray-700
        text-gray-800 dark:text-gray-200
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-colors duration-200
      "
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Sun icon */}
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Moon icon */}
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};
```

---

## 10. Complete Real-World Example

### Doctor Card Component (Combining Everything)

```jsx
import React from 'react';
import Button from './Button';
import Card from './Card';

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <Card 
      hoverable
      className="group"
    >
      {/* Doctor Image with Hover Effect */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={doctor.image || '/default-doctor.jpg'}
          alt={doctor.name}
          className="
            w-full h-48 object-cover
            transition-transform duration-300
            group-hover:scale-110
          "
        />
        
        {/* Available badge */}
        {doctor.available && (
          <div className="
            absolute top-3 right-3
            bg-green-500 text-white
            px-3 py-1 rounded-full text-sm font-medium
            animate-pulse-slow
          ">
            Available
          </div>
        )}
      </div>

      {/* Doctor Info */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        {doctor.name}
      </h3>
      
      <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
        {doctor.specialization}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(doctor.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {doctor.rating} ({doctor.reviews} reviews)
        </span>
      </div>

      {/* Experience */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {doctor.experience} years of experience
      </p>

      {/* Action Button */}
      <Button
        fullWidth
        variant="primary"
        onClick={() => onBook(doctor)}
        className="group-hover:shadow-lg"
      >
        Book Appointment
      </Button>
    </Card>
  );
};

export default DoctorCard;
```

---

## Quick Reference: Common Patterns

### Centering Content
```jsx
// Vertical & Horizontal center
<div className="flex items-center justify-center min-h-screen">
  <div>Centered</div>
</div>

// Center with Grid
<div className="grid place-items-center min-h-screen">
  <div>Centered</div>
</div>
```

### Responsive Container
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  Content
</div>
```

### Form Field
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <input
    type="email"
    className="input-field"
    placeholder="Enter your email"
  />
  <p className="text-red-500 text-sm mt-1">Error message</p>
</div>
```

### Loading Spinner
```jsx
<div className="flex justify-center items-center">
  <div className="
    animate-spin rounded-full
    h-12 w-12 border-b-2 border-primary-600
  " />
</div>
```

---

## Conclusion

This guide covers all the Tailwind CSS concepts from your Chapter 2 document with practical implementations from your Medicare appointment booking system. You can reference these patterns as you build out more features!

**Key Takeaways:**
- ✅ Utility-first CSS with Tailwind speeds up development
- ✅ Responsive design is built-in with breakpoint prefixes
- ✅ Component composition creates reusable UI elements
- ✅ Custom configuration makes Tailwind fit your brand
- ✅ Animations and interactions enhance user experience
- ✅ Dark mode support is straightforward with class strategy
