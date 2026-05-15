import React, { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

const SIZES: Record<string, string> = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

type LogoProps = Omit<HTMLMotionProps<"div">, "children"> & {
  size?: keyof typeof SIZES | string;
  children?: ReactNode;
};

export const Logo = ({ 
  size = 'md', 
  className = '',
  children,
  ...rest 
}: LogoProps) => {
  const sizeClass = SIZES[size as keyof typeof SIZES] || '';

  return (
    <motion.div 
      {...rest}
      role="img"
      aria-label="T-Solver Logo"
      initial={{ scale: 0.8, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'logo relative flex items-center justify-center',
        `logo-${size}`,
        sizeClass,
        className
      )}
    >
      <div className="absolute inset-0 bg-black dark:bg-white rounded-xl rotate-12 transition-transform" />
      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 rounded-xl -rotate-6" />
      <span className="relative text-white dark:text-black font-black text-2xl italic tracking-tighter">T</span>
      {children}
    </motion.div>
  );
};
