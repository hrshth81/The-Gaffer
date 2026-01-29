
export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  LATE = 'LATE',
  MISSED = 'MISSED'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'MANAGER' | 'PLAYER';
  totalPoints: number;
  acceptedRules?: boolean;
}

export interface League {
  id: string;
  name: string;
  inviteCode: string;
  members: string[]; // User IDs
}

export interface Fixture {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  difficulty: 1 | 2 | 3 | 4 | 5;
  matchweek: number;
  leagueId: string;
  isCommon: boolean;
}

export interface Solution {
  id: string;
  fixtureId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  fileName: string;
  fileContent: string;
  points: number;
}

export interface Submission {
  id: string;
  fixtureId: string;
  userId: string;
  timestamp: Date;
  contentUrl?: string;
  rank: number;
  pointsEarned: number;
  status: TaskStatus;
}
