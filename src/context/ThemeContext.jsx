import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const isDarkMode = false;
  const toggleTheme = () => {};

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.remove('disable-transitions');
    localStorage.removeItem('theme');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
