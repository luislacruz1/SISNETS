import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ColleagueCard from '../directory/ColleagueCard';

export default function MyCardsView({
  user,
  myCards = [],
  registeredUsers = [],
  onOpenPublishModal,
  onEditCard,
  onDeleteCard,
  onContactClick
}) {
  const [openMenuCardId, setOpenMenuCardId] = useState(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {myCards.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {myCards.map((card) => (
              <ColleagueCard
                key={card.id}
                card={card}
                user={user}
                registeredUsers={registeredUsers}
                openMenuCardId={openMenuCardId}
                setOpenMenuCardId={setOpenMenuCardId}
                handleEditCard={onEditCard}
                handleDeleteCard={onDeleteCard}
                handleContactClick={onContactClick || ((c) => {
                  const cleanPhone = (c.telefono || '').replace(/\D/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${c.nombre}, te contacto desde la red SISNETS.`)}`, '_blank');
                })}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 sm:p-14 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase">
              Aún no tienes fichas publicadas
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 font-medium">
              Al publicar tu ficha institucional, otras colegas de hospitales, municipios, juzgados y colegios podrán conocer tu centro laboral y coordinar contigo por WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#050B18] font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            + Publicar Mi Ficha
          </button>
        </motion.div>
      )}
    </div>
  );
}
