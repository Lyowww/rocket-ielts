interface SigninPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

interface UploadQuestionPayload {
  exam_type: "ac" | "ge";
  task_number: string;
  file_base64: string | undefined;
  file_type: string;
  question_explanation: string | undefined;
}

interface SubmitQuestionPayload {
  exam_type: "ac" | "ge";
  task_number: string;
  answer_text: string;
  next_challenge?: string;
  left_without_completing?: string;
  image_path: string;
  imageAndText: string;
  manualQues: string;
  challenge_detection: string;
  answer_file_base64?: string;
  left_without_completing: string,
  completion: string,
  answer_file_type?: string;
  mode?: string;
  first_round?: string;
  user_input?: string;
  challenge_round?: number;
}
