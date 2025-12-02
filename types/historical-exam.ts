export interface HistoricalExam {
  id: number;
  date: string;
  skill: string;
  score: number | string;
  topic: string;
  full_report_url?: string | null;
  final_answer?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HistoricalExamListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HistoricalExam[];
}

export interface HistoricalExamQueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  limit?: number;
  page_size?: number;
  skill?: string;
}

