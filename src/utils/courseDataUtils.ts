import {
  GraphNode,
  GraphEdge,
} from "../components/roadmap/CourseDependencyGraph";
import { transformQuestions, NewQuestion } from "./questionUtils";
import { ReactNode } from "react";

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

type ProblemData = {
  topicId: string;
  label?: string;
  questions: NewQuestion[];
};

type ProblemCollection = {
  problems: ProblemData[];
};

/**
 * Merges roadmap data with problem data by enhancing nodes with questions
 *
 * @param roadmapData - The roadmap JSON data with nodes and edges
 * @param problemsData - The problems JSON data with topicId and questions
 * @returns Enhanced graph data with questions merged into node data
 */
export const mergeCourseData = (
  roadmapData: GraphData,
  problemsData: ProblemCollection,
  courseCode?: string
): GraphData => {
  // Create maps for quick lookups
  const questionsMap = new Map<string, ReactNode[]>();

  problemsData.problems.forEach((problem: ProblemData) => {
    const rendered = transformQuestions(problem.questions, { courseCode });
    questionsMap.set(problem.topicId, rendered);
    // label handling is done by consumers; no per-topic label map needed
  });

  // Enhance nodes with questions from the problems data
  const enhancedNodes = roadmapData.nodes.map((node) => {
    const questions = questionsMap.get(node.id);
    if (questions) {
      return {
        ...node,
        data: {
          ...node.data,
          questions,
        },
      };
    }
    return node;
  });

  return {
    nodes: enhancedNodes,
    edges: roadmapData.edges,
  };
};

/**
 * Retrieves problems data without the need for roadmap data
 * Useful for features that only need the problems/questions
 *
 * @param problemsData - The problems JSON data with topicId, label and questions
 * @returns An array of problems with topic ID, label and questions
 */
export const getProblemsData = (
  problemsData: ProblemCollection,
  courseCode?: string
): { topicId: string; label: string; questions: ReactNode[] }[] => {
  return problemsData.problems.map((problem) => ({
    topicId: problem.topicId,
    label: problem.label || problem.topicId,
    questions: transformQuestions(problem.questions, { courseCode }),
  }));
};
