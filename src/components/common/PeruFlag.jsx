import React from 'react';

/**
 * Componente vectorial de la Bandera del Perú
 * Proporción oficial 3:2 con micro-borde y esquinas suaves para renderizado idéntico en Windows, Mac, iOS y Android.
 */
export default function PeruFlag({ className = 'w-5 h-3.5' }) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-[2px] shadow-xs border border-slate-300/80 dark:border-slate-600/80 shrink-0 ${className}`}
      title="Perú (+51)"
      aria-label="Bandera de Perú"
    >
      <svg
        viewBox="0 0 30 20"
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="10" height="20" fill="#D91023" />
        <rect x="10" width="10" height="20" fill="#FFFFFF" />
        <rect x="20" width="10" height="20" fill="#D91023" />
      </svg>
    </span>
  );
}
