import { motion } from "framer-motion";

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
}

const questions = [
  "What is the admission procedure?",
  "What documents are required for admission?",
  "Who is eligible for B.Tech admission?",
  "What are the admission start and deadline dates?",
];

const QuickQuestions = ({ onSelect }: QuickQuestionsProps) => (
  <div className="flex flex-col gap-1.5 w-full px-2">
    {questions.map((q, i) => (
      <motion.button
        key={q}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * i, duration: 0.25 }}
        onClick={() => onSelect(q)}
        className="w-full text-left px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted transition-all"
      >
        {q}
      </motion.button>
    ))}
  </div>
);

export default QuickQuestions;
