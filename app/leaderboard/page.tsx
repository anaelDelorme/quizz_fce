'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp, Crown, Medal, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { leaderboardService } from '@/lib/leaderboard.service';
import { quizService } from '@/lib/quiz.service';
import { LeaderboardEntry, Category } from '@/types';

type LeaderboardType = 'players' | 'correct' | 'winrate' | 'bestscore';

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>('players');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [type, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await quizService.getCategories();
    setCategories(cats as Category[]);
  };

  const loadData = async () => {
    setLoading(true);
    let data: LeaderboardEntry[] = [];

    if (selectedCategory) {
      const metric = type === 'players' ? 'quiz_joues' 
        : type === 'correct' ? 'bonnes_reponses'
        : type === 'winrate' ? 'pourcentage_reussite'
        : 'meilleur_score';
      
      data = await leaderboardService.getTopByCategory(selectedCategory, metric);
    } else {
      switch (type) {
        case 'players':
          data = await leaderboardService.getTopPlayers();
          break;
        case 'correct':
          data = await leaderboardService.getTopByCorrectAnswers();
          break;
        case 'winrate':
          data = await leaderboardService.getTopByWinRate();
          break;
        case 'bestscore':
          data = await leaderboardService.getTopByBestScore();
          break;
      }
    }

    setEntries(data);
    setLoading(false);
  };

  const getIcon = () => {
    switch (type) {
      case 'players': return <Zap className="w-6 h-6" />;
      case 'correct': return <Target className="w-6 h-6" />;
      case 'winrate': return <TrendingUp className="w-6 h-6" />;
      case 'bestscore': return <Trophy className="w-6 h-6" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'players': return 'Plus Actifs';
      case 'correct': return 'Champions';
      case 'winrate': return 'Élite (% réussite)';
      case 'bestscore': return 'Hall of Fame';
    }
  };

  const getValue = (entry: LeaderboardEntry) => {
    if (type === 'winrate') {
      return `${entry.value}%`;
    }
    return entry.value.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Trophy className="w-16 h-16 text-yellow-400" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Classements
            </h1>
          </motion.div>
        </div>

        {/* Type Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TypeButton
              active={type === 'players'}
              onClick={() => { setType('players'); setSelectedCategory(null); }}
              icon={<Zap className="w-5 h-5" />}
              label="Plus Actifs"
            />
            <TypeButton
              active={type === 'correct'}
              onClick={() => { setType('correct'); setSelectedCategory(null); }}
              icon={<Target className="w-5 h-5" />}
              label="Champions"
            />
            <TypeButton
              active={type === 'winrate'}
              onClick={() => { setType('winrate'); setSelectedCategory(null); }}
              icon={<TrendingUp className="w-5 h-5" />}
              label="Élite"
            />
            <TypeButton
              active={type === 'bestscore'}
              onClick={() => { setType('bestscore'); setSelectedCategory(null); }}
              icon={<Trophy className="w-5 h-5" />}
              label="Hall of Fame"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Global
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.$id}
                  onClick={() => setSelectedCategory(cat.$id)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.$id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cat.nom}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
              />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center text-white py-20">
              <p className="text-xl">Aucune donnée disponible</p>
            </div>
          ) : (
            <>
              {/* Podium for Top 3 */}
              {entries.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-end justify-center gap-4 mb-12">
                    {/* 2nd Place */}
                    <PodiumPlace entry={entries[1]} rank={2} height="h-40" />
                    {/* 1st Place */}
                    <PodiumPlace entry={entries[0]} rank={1} height="h-56" />
                    {/* 3rd Place */}
                    <PodiumPlace entry={entries[2]} rank={3} height="h-32" />
                  </div>
                </motion.div>
              )}

              {/* Rest of the list */}
              <div className="space-y-3">
                {entries.slice(3).map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {entry.rank}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{entry.pseudo}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-2xl">{getValue(entry)}</div>
                        <div className="text-white/60 text-sm">{getTitle()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-4 rounded-xl font-semibold transition-all ${
        active
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      <div className="flex items-center justify-center gap-2 flex-col md:flex-row">
        {icon}
        <span className="text-sm md:text-base">{label}</span>
      </div>
    </motion.button>
  );
}

function PodiumPlace({
  entry,
  rank,
  height,
}: {
  entry: LeaderboardEntry;
  rank: number;
  height: string;
}) {
  const getColor = () => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getMedalIcon = () => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8" />;
      case 2: return <Medal className="w-7 h-7" />;
      case 3: return <Award className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="relative"
    >
      <motion.div
        animate={rank === 1 ? { y: [-5, 5, -5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center mb-4"
      >
        <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${getColor()} rounded-full flex items-center justify-center text-white mb-2 shadow-2xl`}>
          {getMedalIcon()}
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{entry.pseudo}</h3>
        <div className="text-yellow-400 font-bold text-2xl">{entry.value}</div>
      </motion.div>
      <div className={`${height} w-32 bg-gradient-to-t ${getColor()} rounded-t-xl shadow-2xl`} />
    </motion.div>
  );
}
