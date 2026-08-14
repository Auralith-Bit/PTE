export interface User {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name?: string | null;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Question {
  id: number;
  category: string;
  type: string;
  title: string | null;
  instructions: string | null;
  difficulty: string;
  content: Record<string, unknown>;
  created_at: string;
}

export interface QuestionList {
  items: Question[];
  total: number;
}
