'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Award, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { quizService } from '@/lib/quiz.service';
import { authService } from '@/lib/auth.service';
import { Question, QuizConfig } from '@/types';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    const configStr = localStorage.getItem('quizConfig');
    if (!configStr) {
      router.push('/play');
      return;
    }

    const config: QuizConfig = JSON.parse(configStr);
    const qs = await quizService.getRandomQuestions(config);
    
    if (qs.length === 0) {
      alert('Aucune question disponible !');
      router.push('/play');
      return;
    }

    setQuestions(qs);
    setLoading(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion.bonne_reponse;

    if (isCorrect) {
      setScore(score + 1);
      triggerConfetti();
    } else {
      setWrongQuestions([...wrongQuestions, currentQuestion.$id]);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const finishQuiz = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    const user = await authService.getCurrentUser();
    if (user) {
      const configStr = localStorage.getItem('quizConfig');
      const config: QuizConfig = configStr ? JSON.parse(configStr) : null;
      
      await quizService.saveResult(
        user.$id,
        score + (selectedAnswer === questions[currentIndex].bonne_reponse ? 1 : 0),
        questions.length,
        wrongQuestions,
        config?.categorieId,
        duration
      );
    }

    setShowResult(true);
    if (score >= questions.length * 0.7) {
      triggerConfetti();
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

  if (showResult) {
    return <ResultScreen score={score} total={questions.length} />;
  }

  const currentQuestion = questions[currentIndex];
  const answers = JSON.parse(currentQuestion.reponses);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-white">
              <Award className="w-6 h-6" />
              <span className="text-2xl font-bold">{score}</span>
            </div>
            <div className="text-white text-xl font-bold">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                ?
              </div>
              <h2 className="text-2xl md:text-3xl text-white font-bold leading-tight">
                {currentQuestion.texte}
              </h2>
            </div>

            {/* Answers */}
            <div className="grid gap-4">
              {answers.map((answer: string, index: number) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.bonne_reponse;
                const showCorrect = answered && isCorrect;
                const showWrong = answered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    whileHover={!answered ? { scale: 1.02, x: 10 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left text-lg font-semibold transition-all ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showWrong
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-white/30 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{answer}</span>
                      {showCorrect && <span className="ml-auto">✓</span>}
                      {showWrong && <X className="ml-auto" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Difficulty Badge */}
        <div className="text-center">
          <span className={`inline-block px-6 py-2 rounded-full text-white font-semibold ${
            currentQuestion.difficulte === 'facile'
              ? 'bg-green-500'
              : currentQuestion.difficulte === 'moyen'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}>
            {currentQuestion.difficulte.charAt(0).toUpperCase() + currentQuestion.difficulte.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ score, total }: { score: number; total: number }) {
  const router = useRouter();
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4">
            {percentage >= 70 ? '🎉 Bravo !' : percentage >= 50 ? '👍 Pas mal !' : '💪 Continue !'}
          </h1>

          <div className="text-6xl font-bold text-white mb-2">
            {score} / {total}
          </div>
          <div className="text-2xl text-white/80 mb-8">{percentage}% de réussite</div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/play')}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Rejouer
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
            >
              Accueil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
