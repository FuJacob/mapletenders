import { useState, useRef } from "react";
import {
  FileArrowUp,
  FilePdf,
  Sparkle,
  Download,
  Trash,
  Warning,
  CheckCircle,
  Clock,
  FileText,
} from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";
import { getRfpAnalysis } from "../api/ai";

interface UploadedFile {
  file: File;
  id: string;
  status: "uploading" | "ready" | "analyzing" | "completed" | "error";
  progress?: number;
  analysis?: RfpAnalysisResult;
  error?: string;
}

interface RfpAnalysisResult {
  summary: string;
  keyRequirements: string[];
  timeline: {
    proposalDeadline: string;
    projectStart: string;
    projectEnd: string;
    keyMilestones: Array<{ date: string; description: string }>;
  };
  evaluation: {
    criteria: Array<{ criterion: string; weight: number; description: string }>;
    scoringMethod: string;
  };
  budgetInfo: {
    estimatedValue: string;
    paymentTerms: string;
    budgetConstraints: string[];
  };
  complianceRequirements: string[];
  riskFactors: string[];
  recommendations: string[];
}

// Helper function to convert file to text
const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export default function RfpAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: "uploading",
        progress: 0,
      }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((fileObj) => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "uploading") {
            const newProgress = (file.progress || 0) + Math.random() * 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...file, status: "ready", progress: 100 };
            }
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 200);
  };

  const analyzeDocument = async (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, status: "analyzing" } : file
      )
    );

    try {
      // Get the file to analyze
      const fileToAnalyze = uploadedFiles.find(f => f.id === fileId);
      if (!fileToAnalyze) {
        throw new Error('File not found');
      }

      // Convert file to text for analysis
      const fileText = await fileToText(fileToAnalyze.file);
      
      // Call real AI analysis API
      const analysisResponse = await getRfpAnalysis({
        title: fileToAnalyze.file.name,
        description: fileText,
        requirements: [], // Could be extracted from file content
        additionalData: {}
      });

      // Process the API response and map to our interface format
      const analysis: RfpAnalysisResult = {
        summary: analysisResponse.analysis || 'Analysis completed. Please review the detailed breakdown below.',
        keyRequirements: analysisResponse.keyRequirements || [
          'Requirements could not be extracted from the document'
        ],
        timeline: {
          proposalDeadline: analysisResponse.timeline?.proposalDeadline || "Not specified",
          projectStart: analysisResponse.timeline?.projectStart || "Not specified", 
          projectEnd: analysisResponse.timeline?.projectEnd || "Not specified",
          keyMilestones: analysisResponse.timeline?.keyMilestones || []
        },
        evaluation: analysisResponse.evaluation || {
          criteria: [{
            criterion: "To be determined",
            weight: 100,
            description: "Evaluation criteria not specified in document"
          }],
          scoringMethod: "Not specified"
        },
        budgetInfo: analysisResponse.budgetInfo || {
          estimatedValue: "Not specified",
          paymentTerms: "Not specified",
          budgetConstraints: []
        },
        complianceRequirements: analysisResponse.complianceRequirements || [],
        riskFactors: analysisResponse.riskFactors || [
          'Risk analysis could not be performed without more document details'
        ],
        recommendations: analysisResponse.recommendations || [
          'Review document details carefully before proceeding',
          'Consider reaching out to procurement contact for clarification'
        ],
      };

      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? { ...file, status: "completed", analysis }
            : file
        )
      );
    } catch (error) {
      console.error('RFP Analysis failed:', error);
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? { 
                ...file, 
                status: "error", 
                error: error instanceof Error ? error.message : 'Analysis failed'
              }
            : file
        )
      );
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const downloadReport = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.analysis) return;

    // Create a formatted report
    const reportContent = `
RFP ANALYSIS REPORT
==================

File: ${file.file.name}
Generated: ${new Date().toLocaleDateString()}

SUMMARY
-------
${file.analysis.summary}

KEY REQUIREMENTS
----------------
${file.analysis.keyRequirements.map(req => `• ${req}`).join('\n')}

TIMELINE
--------
Proposal Deadline: ${file.analysis.timeline.proposalDeadline}
Project Start: ${file.analysis.timeline.projectStart}
Project End: ${file.analysis.timeline.projectEnd}

Milestones:
${file.analysis.timeline.keyMilestones.map(m => `• ${m.date}: ${m.description}`).join('\n')}

EVALUATION CRITERIA
-------------------
${file.analysis.evaluation.criteria.map(c => `• ${c.criterion} (${c.weight}%): ${c.description}`).join('\n')}

Scoring Method: ${file.analysis.evaluation.scoringMethod}

BUDGET INFORMATION
------------------
Estimated Value: ${file.analysis.budgetInfo.estimatedValue}
Payment Terms: ${file.analysis.budgetInfo.paymentTerms}

Budget Constraints:
${file.analysis.budgetInfo.budgetConstraints.map(c => `• ${c}`).join('\n')}

COMPLIANCE REQUIREMENTS
-----------------------
${file.analysis.complianceRequirements.map(req => `• ${req}`).join('\n')}

RISK FACTORS
------------
${file.analysis.riskFactors.map(risk => `• ${risk}`).join('\n')}

RECOMMENDATIONS
---------------
${file.analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

Generated by Mapletenders AI Analysis
`;

    // Download the report
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rfp-analysis-${file.file.name.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          icon={<FileText className="w-10 h-10 text-primary" />}
          title="RFP Analysis"
          description="Upload RFP documents to get AI-powered analysis and insights to help you craft winning proposals"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileSelect(e.dataTransfer.files);
            }}
          >
            <FileArrowUp className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">
              Upload RFP Documents
            </h3>
            <p className="text-text-muted mb-4">
              Drag and drop PDF files here, or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Choose Files
            </button>
            <p className="text-sm text-text-muted mt-2">
              Supports PDF files up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text">
              Uploaded Documents
            </h2>
            {uploadedFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className="bg-surface border border-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FilePdf className="w-8 h-8 text-error" />
                    <div>
                      <h3 className="font-medium text-text">
                        {fileObj.file.name}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {fileObj.status === "ready" && (
                      <button
                        onClick={() => analyzeDocument(fileObj.id)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Sparkle className="w-4 h-4" />
                        Analyze
                      </button>
                    )}
                    {fileObj.status === "completed" && (
                      <button
                        onClick={() => downloadReport(fileObj.id)}
                        className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="p-2 text-text-muted hover:text-error transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status and Progress */}
                <div className="mb-4">
                  {fileObj.status === "uploading" && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-muted">
                          Uploading...
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-lg h-2">
                        <div
                          className="bg-primary h-2 rounded-lg transition-all"
                          style={{ width: `${fileObj.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {fileObj.status === "ready" && (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Ready for analysis</span>
                    </div>
                  )}
                  {fileObj.status === "analyzing" && (
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkle className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Analyzing document...</span>
                    </div>
                  )}
                  {fileObj.status === "error" && (
                    <div className="flex items-center gap-2 text-error">
                      <Warning className="w-4 h-4" />
                      <span className="text-sm">
                        {fileObj.error || "Analysis failed"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Analysis Results */}
                {fileObj.status === "completed" && fileObj.analysis && (
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-text mb-4 flex items-center gap-2">
                      <Sparkle className="w-5 h-5 text-primary" />
                      AI Analysis Results
                    </h4>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Summary */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-text mb-2">
                            Executive Summary
                          </h5>
                          <p className="text-sm text-text-muted">
                            {fileObj.analysis.summary}
                          </p>
                        </div>

                        {/* Key Requirements */}
                        <div>
                          <h5 className="font-medium text-text mb-2">
                            Key Requirements
                          </h5>
                          <ul className="space-y-1">
                            {fileObj.analysis.keyRequirements.map(
                              (req, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-text-muted flex items-start gap-2"
                                >
                                  <span className="text-primary mt-1">•</span>
                                  {req}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Budget Info */}
                        <div>
                          <h5 className="font-medium text-text mb-2">
                            Budget Information
                          </h5>
                          <div className="space-y-1">
                            <p className="text-sm text-text-muted">
                              <span className="font-medium">
                                Estimated Value:
                              </span>{" "}
                              {fileObj.analysis.budgetInfo.estimatedValue}
                            </p>
                            <p className="text-sm text-text-muted">
                              <span className="font-medium">
                                Payment Terms:
                              </span>{" "}
                              {fileObj.analysis.budgetInfo.paymentTerms}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Timeline */}
                        <div>
                          <h5 className="font-medium text-text mb-2">
                            Timeline
                          </h5>
                          <div className="space-y-1">
                            <p className="text-sm text-text-muted">
                              <span className="font-medium">
                                Proposal Deadline:
                              </span>{" "}
                              {fileObj.analysis.timeline.proposalDeadline}
                            </p>
                            <p className="text-sm text-text-muted">
                              <span className="font-medium">
                                Project Duration:
                              </span>{" "}
                              {fileObj.analysis.timeline.projectStart} -{" "}
                              {fileObj.analysis.timeline.projectEnd}
                            </p>
                          </div>
                        </div>

                        {/* Evaluation Criteria */}
                        <div>
                          <h5 className="font-medium text-text mb-2">
                            Evaluation Criteria
                          </h5>
                          <div className="space-y-1">
                            {fileObj.analysis.evaluation.criteria
                              .slice(0, 3)
                              .map((criterion, index) => (
                                <p
                                  key={index}
                                  className="text-sm text-text-muted"
                                >
                                  <span className="font-medium">
                                    {criterion.criterion}:
                                  </span>{" "}
                                  {criterion.weight}%
                                </p>
                              ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h5 className="font-medium text-text mb-2">
                            AI Recommendations
                          </h5>
                          <ul className="space-y-1">
                            {fileObj.analysis.recommendations
                              .slice(0, 3)
                              .map((rec, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-text-muted flex items-start gap-2"
                                >
                                  <span className="text-success mt-1">✓</span>
                                  {rec}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="text-center py-12">
            <FilePdf className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">
              No documents uploaded yet
            </h3>
            <p className="text-text-muted">
              Upload your first RFP document to get started with AI-powered
              analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
