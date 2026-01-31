'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Grid, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { quizService } from '@/lib/quiz.service';
import { Category } from '@/types';

export default function PlayPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMode, setSelectedMode] = useState<'rapide' | 'categorie' | 'global' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await quizService.getCategories();
    setCategories(cats as Category[]);
  };

  const startQuiz = () => {
    if (!selectedMode) return;

    const config = {
      mode: selectedMode,
      nombreQuestions: questionCount,
      categorieId: selectedCategory || undefined,
    };

    localStorage.setItem('quizConfig', JSON.stringify(config));
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-white text-center mb-12">
            Choisissez votre défi
          </h1>

          {/* Sélection du mode */}
          {!selectedMode && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <ModeCard
                icon={<Zap className="w-12 h-12" />}
                title="Quiz Rapide"
                description="Questions aléatoires de toutes catégories"
                onClick={() => setSelectedMode('rapide')}
                gradient="from-yellow-400 to-orange-500"
              />
              <ModeCard
                icon={<Grid className="w-12 h-12" />}
                title="Par Catégorie"
                description="Choisissez votre thème préféré"
                onClick={() => setSelectedMode('categorie')}
                gradient="from-green-400 to-blue-500"
              />
              <ModeCard
                icon={<Target className="w-12 h-12" />}
                title="Mode Global"
                description="Toutes les questions disponibles"
                onClick={() => setSelectedMode('global')}
                gradient="from-purple-400 to-pink-500"
              />
            </div>
          )}

          {/* Sélection catégorie */}
          {selectedMode === 'categorie' && !selectedCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button
                onClick={() => setSelectedMode(null)}
                className="mb-6 text-white/70 hover:text-white transition-colors"
              >
                ← Changer de mode
              </button>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.$id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.$id)}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-white"
                  >
                    <h3 className="text-xl font-bold">{cat.nom}</h3>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sélection nombre de questions */}
          {(selectedMode === 'rapide' || selectedMode === 'global' || selectedCategory) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  if (selectedMode !== 'categorie') setSelectedMode(null);
                }}
                className="mb-6 text-white/70 hover:text-white transition-colors"
              >
                ← Retour
              </button>

              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Combien de questions ?
              </h2>

              <div className="flex gap-4 mb-8 justify-center">
                <button
                  onClick={() => setQuestionCount(5)}
                  className={`px-8 py-4 rounded-xl font-bold text-xl transition-all ${
                    questionCount === 5
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  5 questions
                </button>
                <button
                  onClick={() => setQuestionCount(10)}
                  className={`px-8 py-4 rounded-xl font-bold text-xl transition-all ${
                    questionCount === 10
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  10 questions
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-2xl py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                🚀 C'est parti !
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  onClick,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-left shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group`}
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="relative z-10">
        <div className="text-white mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90">{description}</p>
      </div>
    </motion.button>
  );
}
