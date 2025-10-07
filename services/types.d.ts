interface SubmitAnswer {
  results: string;
  scores: {
    "Task Achievement": number;
    "Coherence and Cohesion": number;
    "Lexical Resource": number;
    "Grammatical Range and Accuracy": number;
    "Overall Score": number;
  };
  answer: string;
}

// "scores": {
//     "Task Achievement": 0.0,
//     "Coherence and Cohesion": 0.0,
//     "Lexical Resource": 0.0,
//     "Grammatical Range and Accuracy": 0.0,
//     "Overall Score": 0.0
// },
