import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/JuUE97nTCbkBODNWfDYp6m?s=sw&p=a&iam=2';

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside aria-label="Comunidad de WhatsApp" className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-2 select-none">
      {/* Tooltip / Globo informativo emergente */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold max-w-[210px] flex items-center justify-between gap-2"
          >
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-tight"
            >
              👋 ¡Únete a nuestro <strong className="text-emerald-600 dark:text-emerald-400">Grupo de WhatsApp</strong>!
            </a>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg shrink-0"
              title="Cerrar aviso"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante circular principal */}
      <motion.a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 relative group"
        title="Unirse al Grupo Oficial de WhatsApp de SISNETS"
        aria-label="Unirse al Grupo de WhatsApp"
      >
        {/* Efecto de pulso radiante */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />

        {/* Ícono de WhatsApp Vectorial */}
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="currentColor"
          className="relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.06-.53.26-.18.2-.7.68-.7 1.66s.72 1.93.82 2.06c.1.14 1.38 2.18 3.4 3.01.48.2.85.32 1.15.41.48.15.92.13 1.27.08.39-.06 1.2-.49 1.37-.96.17-.48.17-.88.12-.97-.05-.08-.19-.14-.4-.24s-1.2-.59-1.39-.66-.32-.1-.46.1-.53.66-.65.8-.24.16-.45.06c-.21-.1-.89-.33-1.69-1.05-.63-.56-1.05-1.25-1.17-1.46-.12-.21-.01-.33.09-.43.09-.09.21-.24.32-.36.1-.12.14-.21.21-.35.07-.14.03-.27-.02-.37-.05-.1-.46-1.1-.63-1.51-.17-.4-.34-.35-.46-.35" />
        </svg>
      </motion.a>
    </aside>
  );
}
