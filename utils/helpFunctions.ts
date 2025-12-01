export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Maps exam type to backend format
 * Converts "academic" -> "ac" and "general" -> "ge"
 * Returns the value as-is if it's already "ac" or "ge"
 */
export const mapExamTypeToBackend = (examType: string | undefined | null): string => {
  if (!examType) return "ac"; // default to "ac"
  
  const normalized = examType.toLowerCase().trim();
  
  if (normalized === "academic") return "ac";
  if (normalized === "general") return "ge";
  
  // If it's already "ac" or "ge", return as-is
  if (normalized === "ac" || normalized === "ge") return normalized;
  
  // Default fallback
  return "ac";
};

