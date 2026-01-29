
import { User, Fixture } from './types';

// No pre-defined users except a template if needed, but we'll start fresh.
export const INITIAL_FIXTURES: Fixture[] = [
  {
    id: 'fix-1',
    title: 'Advanced Calculus Assignment',
    description: 'Complete the problem set on Multivariable Integration.',
    deadline: new Date(Date.now() + 86400000 * 3), // 3 days from now
    difficulty: 4,
    matchweek: 1,
    leagueId: 'default-league',
    isCommon: true,
  },
  {
    id: 'fix-2',
    title: 'Organic Chemistry Lab Report',
    description: 'Submit the synthesis results and spectroscopy analysis.',
    deadline: new Date(Date.now() + 86400000 * 5), // 5 days from now
    difficulty: 5,
    matchweek: 1,
    leagueId: 'default-league',
    isCommon: true,
  },
  {
    id: 'fix-3',
    title: 'Data Structures Quiz',
    description: 'Preparation for the upcoming binary search tree quiz.',
    deadline: new Date(Date.now() + 86400000 * 1), // Tomorrow
    difficulty: 3,
    matchweek: 1,
    leagueId: 'default-league',
    isCommon: true,
  }
];

export const VAR_PUNISHMENTS = [
  "The Gaffer's Fine: You pay for the group's coffee tomorrow.",
  "Training Drills: Run 5 laps around the library.",
  "Kit Wash: You have to organize the next study session's snacks.",
  "Transfer List: You are muted in the league chat for 24 hours.",
  "Bench Warmers: You must sit in the front row of the next lecture.",
];
