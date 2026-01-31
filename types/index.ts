export interface Category {
  $id: string;
  nom: string;
  $createdAt?: string;
}

export interface Question {
  $id: string;
  texte: string;
  categorie_id: string;
  reponses: string; // JSON string of array
  bonne_reponse: number;
  difficulte: 'facile' | 'moyen' | 'difficile';
  $createdAt?: string;
}

export interface Profile {
  $id: string;
  user_id: string;
  pseudo: string;
  type_compte: 'invite' | 'abonne';
  total_quiz_joues: number;
  meilleur_score: number;
  total_bonnes_reponses: number;
  total_reponses: number;
  pourcentage_reussite: number;
  derniere_activite?: string;
  $createdAt?: string;
}

export interface Resultat {
  $id: string;
  user_id: string;
  score: number;
  total_questions: number;
  questions_ratees: string; // JSON string
  categorie_id?: string;
  duree_secondes: number;
  $createdAt?: string;
}

export interface StatParCategorie {
  $id: string;
  user_id: string;
  categorie_id: string;
  quiz_joues: number;
  bonnes_reponses: number;
  total_reponses: number;
  pourcentage_reussite: number;
  meilleur_score: number;
  $createdAt?: string;
}

export interface QuizConfig {
  mode: 'rapide' | 'categorie' | 'global';
  nombreQuestions: 5 | 10;
  categorieId?: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  answers: (number | null)[];
  wrongQuestions: string[];
  startTime: number;
}

export interface LeaderboardEntry {
  userId: string;
  pseudo: string;
  value: number;
  rank: number;
  pourcentage?: number;
}
