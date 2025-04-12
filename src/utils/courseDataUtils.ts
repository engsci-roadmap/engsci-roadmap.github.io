import {
  GraphNode,
  GraphEdge,
} from "../components/roadmap/CourseDependencyGraph";

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

type ProblemData = {
  topicId: string;
  label?: string;
  questions: string[];
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
  problemsData: ProblemCollection
): GraphData => {
  // Create maps for quick lookups
  const questionsMap = new Map<string, string[]>();
  const labelsMap = new Map<string, string>();

  problemsData.problems.forEach((problem: ProblemData) => {
    questionsMap.set(problem.topicId, problem.questions);
    if (problem.label) {
      labelsMap.set(problem.topicId, problem.label);
    }
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
  problemsData: ProblemCollection
): ProblemData[] => {
  return problemsData.problems.map((problem) => ({
    topicId: problem.topicId,
    label: problem.label || problem.topicId, // Use topicId as fallback if label is missing
    questions: problem.questions,
  }));
};
