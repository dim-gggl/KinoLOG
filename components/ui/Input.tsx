import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-[10px] uppercase tracking-widest text-[#666] font-mono">{label}</label>}
      <input 
        className={`bg-[#0a0a0a] border border-[#222] text-[#e5e5e5] px-3 py-2 text-sm font-mono focus:border-[#e5e5e5] focus:outline-none transition-colors placeholder-[#333] ${className}`}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = '', ...props }) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-[10px] uppercase tracking-widest text-[#666] font-mono">{label}</label>}
        <textarea 
          className={`bg-[#0a0a0a] border border-[#222] text-[#e5e5e5] px-3 py-2 text-sm font-mono focus:border-[#e5e5e5] focus:outline-none transition-colors placeholder-[#333] min-h-[80px] ${className}`}
          {...props}
        />
      </div>
    );
  };

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: string[] }> = ({ label, options, className = '', ...props }) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-[10px] uppercase tracking-widest text-[#666] font-mono">{label}</label>}
        <select 
          className={`bg-[#0a0a0a] border border-[#222] text-[#e5e5e5] px-3 py-2 text-sm font-mono focus:border-[#e5e5e5] focus:outline-none transition-colors appearance-none cursor-pointer ${className}`}
          {...props}
        >
            <option value="" disabled>Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  };
