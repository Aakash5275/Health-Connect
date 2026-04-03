import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  icon: Icon,
  loadingText,
  asChild = false,
  ...props 
}) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg focus:ring-primary-500",
    secondary: "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500",
    danger: "bg-brand-emergency text-white hover:bg-red-700 shadow-md focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-semibold"
  };

  const Component = asChild ? Slot : 'button';

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {loadingText || children}
        </>
      ) : Icon ? (
        <>
          <Icon className={cn("h-5 w-5", children ? "mr-2" : "")} />
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
