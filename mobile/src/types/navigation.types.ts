import { Task } from './task.types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  AnalyticsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CreateTask: { editTask?: Task } | undefined;
  TaskDetail: { taskId: string };
};
