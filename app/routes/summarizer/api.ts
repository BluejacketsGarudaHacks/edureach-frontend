import { api } from "~/util/apiClient";

export default async function getSummarizedPDF(
  file: File,
  targetLanguage: string,
  token: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sourceLang", "english");
  formData.append("targetLang", targetLanguage);

  try {
    const result = api.post("summarize/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result as any;
  } catch (error: any) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}
