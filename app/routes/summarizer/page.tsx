"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  Zap,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate } from "react-router";

function useTiptapEditor(): Editor | null {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Ringkasan akan keluar disini...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  return editor;
}

export default function SummarizerPage() {
  window.document.title = "Summarizer AI | EduReach";

  const [isClient, setIsClient] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const navigate = useNavigate();

  const languageOptions = [
    { value: "id", label: "Indonesia" },
    { value: "ban", label: "Bali" },
    { value: "jw", label: "Jawa" },
    { value: "su", label: "Sunda" },
    { value: "btx", label: "Batak Karo" },
    { value: "bts", label: "Batak Simalungun" },
    { value: "bbc", label: "Batak Toba" },
    { value: "min", label: "Minang" },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useTiptapEditor();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleSummarize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing steps
    const steps = [
      { message: "Uploading PDF...", progress: 20 },
      { message: "Extracting text...", progress: 40 },
      { message: "Analyzing content...", progress: 60 },
      { message: "Generating summary...", progress: 80 },
      { message: "Finalizing...", progress: 100 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(step.progress);
    }

    // Mock summary content based on selected language
    const getLocalizedSummary = (langCode: string) => {
      const selectedLang =
        languageOptions.find((lang) => lang.value === langCode)?.label ||
        "Indonesia";

      if (langCode === "id") {
        return `
          <h2>Ringkasan Dokumen</h2>
          <p>Dokumen ini membahas prinsip-prinsip utama pengembangan web modern, dengan fokus pada:</p>
          <ul>
            <li><strong>Optimasi Performa:</strong> Teknik untuk meningkatkan waktu muat halaman dan pengalaman pengguna</li>
            <li><strong>Aksesibilitas:</strong> Memastikan aplikasi web dapat digunakan oleh semua orang</li>
            <li><strong>Praktik Keamanan Terbaik:</strong> Melindungi aplikasi dari kerentanan umum</li>
            <li><strong>Skalabilitas:</strong> Membangun aplikasi yang dapat menangani pertumbuhan</li>
          </ul>
          <h3>Poin Penting</h3>
          <p>Dokumen ini menekankan pentingnya mengikuti pola yang telah mapan dan memanfaatkan framework modern untuk membangun aplikasi yang kuat dan mudah dipelihara.</p>
          <blockquote>
            <p>"Aplikasi terbaik adalah yang mengutamakan pengalaman pengguna sambil mempertahankan kualitas kode dan keamanan."</p>
          </blockquote>
        `;
      } else {
        return `
          <h2>Document Summary (${selectedLang})</h2>
          <p>This document discusses the key principles of modern web development, focusing on:</p>
          <ul>
            <li><strong>Performance Optimization:</strong> Techniques for improving page load times and user experience</li>
            <li><strong>Accessibility:</strong> Ensuring web applications are usable by everyone</li>
            <li><strong>Security Best Practices:</strong> Protecting applications from common vulnerabilities</li>
            <li><strong>Scalability:</strong> Building applications that can handle growth</li>
          </ul>
          <h3>Key Takeaways</h3>
          <p>The document emphasizes the importance of following established patterns and leveraging modern frameworks to build robust, maintainable applications.</p>
          <blockquote>
            <p>"The best applications are those that prioritize user experience while maintaining code quality and security."</p>
          </blockquote>
          <p><em>Note: This summary has been generated in ${selectedLang} language.</em></p>
        `;
      }
    };

    const mockSummary = getLocalizedSummary(selectedLanguage);

    editor?.commands.setContent(mockSummary);
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (editor) {
      navigator.clipboard.writeText(editor.getText());
    }
  };

  const handleDownload = () => {
    if (editor) {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "summary.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleGoBack = () => {
    navigate("/home");
  };

  if (!isClient || !editor) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduReach
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Now Available
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            PDF Summarizer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Unggah dokumen PDF Anda dan dapatkan ringkasan bertenaga AI dalam
            hitungan detik. Sangat cocok untuk pelajar, peneliti, dan
            profesional.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Unggah PDF
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Pilih file PDF untuk di ringkas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-medium">
                        Klik untuk mengunggah atau seret dan jatuhkan.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hanya file PDF, maksimal 10MB.
                      </p>
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800 truncate flex-1">
                        {selectedFile.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="language"
                      className="text-sm font-medium text-gray-700"
                    >
                      Pilih Bahasa
                    </Label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSummarize}
                    disabled={!selectedFile || isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Buat Ringkasan
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-3">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-gray-600 text-center">
                        {progress < 20
                          ? "Uploading PDF..."
                          : progress < 40
                          ? "Extracting text..."
                          : progress < 60
                          ? "Analyzing content..."
                          : progress < 80
                          ? "Generating summary..."
                          : "Finalizing..."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Ringkasan AI
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Edit ringkasan yang sudah dibuat
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="border-gray-200 bg-transparent"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="border-gray-200 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator className="bg-gray-100" />
              <CardContent className="p-0">
                <div className="min-h-[500px] bg-white">
                  <EditorContent editor={editor} className="h-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
