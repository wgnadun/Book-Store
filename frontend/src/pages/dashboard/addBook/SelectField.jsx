import React from 'react';

const SelectField = ({ 
  label, 
  name, 
  options, 
  register, 
  error, 
  required = false,
  className = "",
  labelClassName = ""
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-semibold text-white mb-2 ${labelClassName}`}
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={name}
          {...register(name, { required })}
          className={`w-full p-2.5 pl-4 pr-10 bg-slate-900 border border-slate-700 rounded-lg text-white 
          appearance-none 
          focus:outline-none focus:ring-0 focus:border-slate-700
          transition-all duration-300 ${className}`}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-slate-900 text-slate-200 py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SelectField;
