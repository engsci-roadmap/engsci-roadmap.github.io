import { ReactNode } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

// Difficulty enum
export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

// Question Type enum (expand as needed)
export enum QuestionType {
  Derivation = "Derivation",
  Computation = "Computation",
  Conceptual = "Conceptual",
  Proof = "Proof",
  ShortAnswer = "Short Answer",
  MultipleChoice = "Multiple Choice",
  Other = "Other",
}

// Allowed exam type codes -> label mapping
const EXAM_TYPE_MAP: Record<string, string> = {
  MT: "Midterm",
  FIN: "Final",
  QZ: "Quiz",
  EX: "Exam",
  HW: "Homework",
  PS: "Problem Set",
};

export type NewQuestion = {
  problem_id: string; // now excludes course code
  topic?: string;
  subtopics?: string[];
  question_type: string;
  difficulty: string;
};

export type NormalizedQuestion = {
  id: string;
  year: number;
  examType: string;
  questionNumber: number;
  questionType: QuestionType;
  difficulty: Difficulty;
  topic?: string;
  subtopics: string[];
};

// Optional: per-course subtopic enums (validate if defined)
// Add course-specific sets here when available
const COURSE_SUBTOPICS: Record<string, Set<string>> = {
  // Vetted subtopics for MIE286 (Probability & Statistics)
  MIE286: new Set([
    // Foundations & counting
    "Sets",
    "Counting",
    "Sum Rule",
    "Product Rule",
    "Permutations",
    "Combinations",
    "Mutually Exclusive Events",

    // Probability
    "Definitions of Probability",
    "Sample Space",
    "Events",
    "Conditional Probability",
    "Law of Total Probability",
    "Bayes' Rule",
    "Independence",

    // Random variables and distributions
    "Random Variables",
    "Discrete Random Variables",
    "Continuous Random Variables",
    "PMF",
    "PDF",
    "CDF",
    "Expectation",
    "Variance",
    "Covariance",

    // Common distributions
    "Common Discrete Distributions",
    "Binomial",
    "Geometric",
    "Poisson",
    "Common Continuous Distributions",
    "Uniform",
    "Exponential",
    "Normal",

    // Transformations and moments
    "Functions of Random Variables",
    "Transformations",
    "Moments",

    // Sampling and estimation
    "Sampling",
    "Sampling Distributions",
    "Quantiles",
    "Point Estimates",
    "Confidence Intervals",
    "Maximum Likelihood Estimation",

    // Hypothesis testing
    "Type I Error",
    "Type II Error",
    "Hypothesis Testing",
    "Goodness of Fit",

    // Regression
    "Linear Regression",
    "Regression Analysis",
  ]),
};

export function parseProblemId(problemId: string): {
  year: number;
  examType: string;
  questionNumber: number;
} {
  const re = /^(?<year>\d{4})-(?<exam>[A-Z]+)-Q(?<qnum>\d+)$/;
  const m = problemId.match(re);
  if (!m || !m.groups) {
    throw new Error(`Invalid problem_id format: ${problemId}`);
  }
  const year = Number(m.groups.year);
  const examRaw = m.groups.exam;
  const questionNumber = Number(m.groups.qnum);

  if (!EXAM_TYPE_MAP[examRaw]) {
    throw new Error(
      `Unsupported exam type '${examRaw}' in problem_id: ${problemId}`
    );
  }

  if (!Number.isFinite(year) || year < 1900 || year > 3000) {
    throw new Error(
      `Invalid year '${m.groups.year}' in problem_id: ${problemId}`
    );
  }
  if (!Number.isFinite(questionNumber) || questionNumber <= 0) {
    throw new Error(
      `Invalid question number '${m.groups.qnum}' in problem_id: ${problemId}`
    );
  }

  return {
    year,
    examType: EXAM_TYPE_MAP[examRaw],
    questionNumber,
  };
}

function coerceQuestionType(val: string): QuestionType {
  switch (val) {
    case QuestionType.Derivation:
      return QuestionType.Derivation;
    case QuestionType.Computation:
      return QuestionType.Computation;
    case QuestionType.Conceptual:
      return QuestionType.Conceptual;
    case QuestionType.Proof:
      return QuestionType.Proof;
    case QuestionType.ShortAnswer:
      return QuestionType.ShortAnswer;
    case QuestionType.MultipleChoice:
      return QuestionType.MultipleChoice;
    default:
      throw new Error(`Unsupported question_type '${val}'`);
  }
}

function coerceDifficulty(val: string): Difficulty {
  switch (val) {
    case Difficulty.Easy:
      return Difficulty.Easy;
    case Difficulty.Medium:
      return Difficulty.Medium;
    case Difficulty.Hard:
      return Difficulty.Hard;
    default:
      throw new Error(`Unsupported difficulty '${val}'`);
  }
}

export function validateAndNormalizeQuestion(
  q: unknown,
  courseCode?: string
): NormalizedQuestion {
  if (!q || typeof q !== "object") {
    throw new Error("Question entry must be an object");
  }
  const obj = q as Record<string, unknown>;

  const problem_id = obj["problem_id"];
  const question_type = obj["question_type"];
  const difficulty = obj["difficulty"];
  if (typeof problem_id !== "string")
    throw new Error("problem_id must be a string");
  if (typeof question_type !== "string")
    throw new Error("question_type must be a string");
  if (typeof difficulty !== "string")
    throw new Error("difficulty must be a string");
  const { year, examType, questionNumber } = parseProblemId(problem_id);
  const qtype = coerceQuestionType(question_type);
  const diff = coerceDifficulty(difficulty);

  const topic =
    typeof obj["topic"] === "string" ? (obj["topic"] as string) : undefined;
  const subtopics = Array.isArray(obj["subtopics"])
    ? (obj["subtopics"] as unknown[])
    : [];

  const subtopicStrings: string[] = [];
  if (!Array.isArray(subtopics)) {
    throw new Error("subtopics must be an array of strings if provided");
  }
  for (const s of subtopics) {
    if (typeof s !== "string" || s.trim() === "") {
      throw new Error("subtopics items must be non-empty strings");
    }
    subtopicStrings.push(s);
  }

  // Validate subtopics against course registry if available (by provided courseCode)
  const registry = courseCode ? COURSE_SUBTOPICS[courseCode] : undefined;
  if (registry) {
    for (const st of subtopicStrings) {
      if (!registry.has(st)) {
        throw new Error(
          `Unknown subtopic '${st}' for course '${courseCode}'. Please update allowed subtopics.`
        );
      }
    }
  }

  return {
    id: problem_id,
    year,
    examType,
    questionNumber,
    questionType: qtype,
    difficulty: diff,
    topic,
    subtopics: subtopicStrings,
  };
}

function difficultyBadge(diff: Difficulty): ReactNode {
  switch (diff) {
    case Difficulty.Easy:
      return (
        <span className="inline-flex items-center gap-1 text-green-700 underline decoration-green-500/60">
          <FaCheckCircle aria-hidden="true" className="text-green-600" />
          <span>Easy</span>
        </span>
      );
    case Difficulty.Medium:
      return (
        <span className="inline-flex items-center gap-1 text-yellow-700 underline decoration-yellow-500/60">
          <FaExclamationTriangle
            aria-hidden="true"
            className="text-yellow-600"
          />
          <span>Medium</span>
        </span>
      );
    case Difficulty.Hard:
      return (
        <span className="inline-flex items-center gap-1 text-red-700 underline decoration-red-500/60">
          <FaTimesCircle aria-hidden="true" className="text-red-600" />
          <span>Hard</span>
        </span>
      );
  }
}

export function renderQuestionDisplay(q: NormalizedQuestion): ReactNode {
  const subtopics =
    q.subtopics && q.subtopics.length > 0 ? q.subtopics.join(", ") : "";
  const header = `${q.examType} ${q.year} Q${q.questionNumber} (${q.questionType})`;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-2">
      <span className="font-medium text-slate-800">{header}:</span>
      <span className="text-slate-700">{subtopics}</span>
      <span className="ml-0 md:ml-auto">{difficultyBadge(q.difficulty)}</span>
    </div>
  );
}

// Transform an array of question objects (new schema) into display nodes
export function transformQuestions(
  questions: unknown[],
  opts?: { courseCode?: string }
): ReactNode[] {
  const result: ReactNode[] = [];
  for (const item of questions) {
    if (typeof item === "string") {
      throw new Error(
        "Legacy string questions are no longer supported. Please migrate to the new question schema."
      );
    }
    try {
      const normalized = validateAndNormalizeQuestion(item, opts?.courseCode);
      result.push(renderQuestionDisplay(normalized));
    } catch (e) {
      // Skip invalid entries but surface a console error to aid debugging
      console.error("Invalid question entry skipped:", e);
    }
  }
  return result;
}
