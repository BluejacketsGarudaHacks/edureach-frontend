import { api } from "~/util/apiClient";

export default async function getSummarizedPDF(
  file: File,
  targetLanguage: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sourceLang", "en");
  formData.append("targetLang", targetLanguage);

  try {
    const result = api.post("summarize/upload", formData);

    return result;
  } catch (error: any) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}
