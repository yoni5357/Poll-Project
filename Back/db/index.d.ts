import { Sequelize, Model, ModelStatic } from 'sequelize';

export const sequelize: Sequelize;

// --- Poll ---
export interface PollAttributes {
  id: number;
  slug: string;
  title: string;
  creator_username: string;
}
export type PollInstance =
  Model<PollAttributes, Partial<PollAttributes>> & PollAttributes;
export const Poll: ModelStatic<PollInstance>;

// --- PollOption ---
export interface PollOptionAttributes {
  id: number;
  poll_id: number;
  label: string;
  position: number;
}
export type PollOptionInstance =
  Model<PollOptionAttributes, Partial<PollOptionAttributes>> & PollOptionAttributes;
export const PollOption: ModelStatic<PollOptionInstance>;

// --- Vote ---
export interface VoteAttributes {
  id: number;
  poll_id: number;
  option_id: number;
  voter_username: string;
}
export type VoteInstance =
  Model<VoteAttributes, Partial<VoteAttributes>> & VoteAttributes;
export const Vote: ModelStatic<VoteInstance>;
