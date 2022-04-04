import useMediaQuery from './useMediaQuery';

const useScreenBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
  // Tailwind's breakpoints: https://tailwindcss.com/docs/responsive-design
  const value = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }[breakpoint];

  return useMediaQuery(`(min-width: ${value})`);
};

export default useScreenBreakpoint;
