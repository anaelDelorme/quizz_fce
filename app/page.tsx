'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, User, LogIn, UserPlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/lib/auth.service';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <h1 className="text-7xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            Quiz Master
          </h1>
          <p className="text-xl text-gray-300">
            Testez vos connaissances et devenez champion !
          </p>
        </motion.div>

        {/* Menu principal */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
          <MenuCard
            icon={<Play className="w-12 h-12" />}
            title="Jouer"
            description="Lancez un quiz maintenant"
            href="/play"
            gradient="from-green-400 to-blue-500"
            delay={0.1}
          />
          <MenuCard
            icon={<Trophy className="w-12 h-12" />}
            title="Classements"
            description="Voir les meilleurs joueurs"
            href="/leaderboard"
            gradient="from-yellow-400 to-orange-500"
            delay={0.2}
          />
        </div>

        {/* Section utilisateur */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <Link href="/dashboard">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">Connecté en tant que</p>
                    <h3 className="text-white text-xl font-bold">{user.name}</h3>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto flex gap-4"
          >
            <Link href="/login" className="flex-1">
              <button className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all flex items-center justify-center gap-2 text-white font-semibold">
                <LogIn className="w-5 h-5" />
                Connexion
              </button>
            </Link>
            <Link href="/register" className="flex-1">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 text-white font-semibold">
                <UserPlus className="w-5 h-5" />
                Inscription
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function MenuCard({
  icon,
  title,
  description,
  href,
  gradient,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href}>
        <div
          className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all group relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative z-10">
            <div className="mb-4 text-white">{icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
