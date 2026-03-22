"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAssignmentStore = void 0;
const zustand_1 = require("zustand");
exports.useAssignmentStore = (0, zustand_1.create)((set) => ({
    assignments: [],
    setAssignments: (data) => set({ assignments: data }),
}));
