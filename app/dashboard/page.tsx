'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Clock, Award, LogOut, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { quizService } from '@/lib/quiz.service';
import { leaderboardService } from '@/lib/leaderboard.service';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const prof = await authService.getCurrentProfile();
        setProfile(prof || {});

        const res = await quizService.getUserResults(user.$id);
        setResults(res || []);

        const wrong = await quizService.getWrongQuestions(user.$id);
        setWrongQuestions(wrong || []);

        const rank = await leaderboardService.getUserRank(user.$id);
        setUserRank(rank || null);

      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      router.push('/');
    }
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

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Accueil
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{profile.pseudo || 'Utilisateur'}</h1>
              <p className="text-white/70 text-lg">
                {userRank
                  ? `Rang global: #${userRank.globalRank || '?'} sur ${userRank.totalPlayers || '?'}`
                  : 'Rang non disponible'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Trophy className="w-8 h-8" />}
            label="Quiz joués"
            value={profile.total_quiz_joues ?? 0}
            gradient="from-yellow-400 to-orange-500"
          />
          <StatCard
            icon={<Target className="w-8 h-8" />}
            label="Bonnes réponses"
            value={profile.total_bonnes_reponses ?? 0}
            gradient="from-green-400 to-blue-500"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Taux de réussite"
            value={`${Math.round(profile.pourcentage_reussite ?? 0)}%`}
            gradient="from-purple-400 to-pink-500"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="Meilleur score"
            value={profile.meilleur_score ?? 0}
            gradient="from-pink-400 to-red-500"
          />
        </div>

        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Derniers résultats</h2>
          {results.length === 0 ? (
            <p className="text-white/70 text-center py-8">Aucun résultat pour le moment</p>
          ) : (
            <div className="space-y-4">
              {results.slice(0, 5).map((result: any) => (
                <div
                  key={result.$id || Math.random()}
                  className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-bold text-xl">
                      {result.score ?? 0} / {result.total_questions ?? 0}
                    </div>
                    <div className="text-white/60 text-sm">
                      {result.$createdAt
                        ? new Date(result.$createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Date inconnue'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">{result.duree_secondes ?? 0}s</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Wrong Questions */}
        {wrongQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Questions à réviser</h2>
            <div className="space-y-4">
              {wrongQuestions.slice(0, 5).map((question: any) => (
                <div
                  key={question.$id || Math.random()}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                >
                  <p className="text-white font-semibold mb-2">{question.texte || 'Texte indisponible'}</p>
                  <div className="text-white/60 text-sm">
                    Réponse correcte:{' '}
                    {Array.isArray(question.reponses)
                      ? question.reponses[question.bonne_reponse ?? 0]
                      : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/play">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg"
            >
              Jouer un quiz
            </motion.button>
          </Link>
          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
            >
              Voir les classements
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-2xl`}
    >
      <div className="text-white mb-3">{icon}</div>
      <div className="text-white/80 text-sm mb-1">{label}</div>
      <div className="text-white text-3xl font-bold">{value}</div>
    </motion.div>
  );
}
