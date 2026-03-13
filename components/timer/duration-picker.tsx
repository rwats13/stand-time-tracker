'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];

interface DurationPickerProps {
  value: number;
  onChange: (minutes: number) => void;
  disabled?: boolean;
  collapsed?: boolean;
}

export function DurationPicker({
  value,
  onChange,
  disabled,
  collapsed,
}: DurationPickerProps) {
  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="inline-flex h-10 items-center rounded-full bg-secondary px-5 text-sm font-medium text-secondary-foreground"
          >
            {value}m
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ToggleGroup
              value={[String(value)]}
              onValueChange={(v) => {
                const selected = v[v.length - 1];
                if (selected) onChange(Number(selected));
              }}
              className="flex flex-wrap justify-center gap-2"
              disabled={disabled}
            >
              {DURATIONS.map((min) => (
                <ToggleGroupItem
                  key={min}
                  value={String(min)}
                  className="h-10 min-w-[3.5rem] rounded-full px-4 text-sm"
                >
                  {min}m
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
