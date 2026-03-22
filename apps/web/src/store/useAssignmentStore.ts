import { create } from "zustand";

type Assignment = {
  _id: string;
  totalQuestions: number;
  totalMarks: number;
  status: string;
};

type Store = {
  assignments: Assignment[];
  setAssignments: (data: Assignment[]) => void;
};

export const useAssignmentStore = create<Store>((set) => ({
  assignments: [],
  setAssignments: (data) => set({ assignments: data }),
}));
