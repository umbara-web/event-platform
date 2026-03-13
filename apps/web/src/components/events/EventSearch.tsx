'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { useDebounce } from '@/src/hooks/useDebounce';

interface EventSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EventSearch({
  value,
  onChange,
  placeholder = 'Cari event...',
}: EventSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className='relative w-full max-w-md'>
      <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
      <Input
        type='text'
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className='pr-10 pl-10'
      />
      {localValue && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute top-0 right-0 h-10 w-10'
          onClick={handleClear}
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
}

export default EventSearch;
