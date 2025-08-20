import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface VisualSelectOption {
  value: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface VisualSelectProps {
  options: VisualSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export const VisualSelect: React.FC<VisualSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  className
}) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("story-input h-auto min-h-12", className)}>
        <div className="flex items-center gap-3 py-2">
          {selectedOption?.image && (
            <img 
              src={selectedOption.image} 
              alt={selectedOption.label}
              className="w-8 h-8 rounded-md object-cover"
            />
          )}
          {selectedOption?.icon && (
            <div className="w-8 h-8 flex items-center justify-center">
              {selectedOption.icon}
            </div>
          )}
          <div className="flex-1 text-left">
            <SelectValue placeholder={placeholder} />
            {selectedOption?.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {selectedOption.description}
              </p>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </SelectTrigger>
      <SelectContent className="z-50">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="p-0"
          >
            <div className="flex items-center gap-3 py-3 px-3 w-full">
              {option.image && (
                <img 
                  src={option.image} 
                  alt={option.label}
                  className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                />
              )}
              {option.icon && (
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {option.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </div>
                )}
              </div>
              {value === option.value && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};