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

export default function RfpAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files)
      .filter(file => file.type === "application/pdf")
      .map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: "uploading",
        progress: 0,
      }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev =>
        prev.map(file => {
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

  const analyzeDocument = (fileId: string) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, status: "analyzing" } : file
      )
    );

    // Simulate analysis (replace with actual API call)
    setTimeout(() => {
      const mockAnalysis: RfpAnalysisResult = {
        summary: "This RFP seeks a comprehensive IT infrastructure upgrade for a government agency, including cloud migration, cybersecurity enhancements, and staff training programs.",
        keyRequirements: [
          "Cloud infrastructure migration (AWS/Azure)",
          "Multi-factor authentication implementation",
          "Staff training on new systems",
          "24/7 technical support",
          "Compliance with PIPEDA and SOC 2 standards",
        ],
        timeline: {
          proposalDeadline: "2024-02-15",
          projectStart: "2024-03-01",
          projectEnd: "2024-08-31",
          keyMilestones: [
            { date: "2024-03-15", description: "Infrastructure assessment complete" },
            { date: "2024-04-30", description: "Cloud migration phase 1" },
            { date: "2024-06-15", description: "Security implementation" },
            { date: "2024-07-31", description: "Staff training completion" },
          ],
        },
        evaluation: {
          criteria: [
            { criterion: "Technical Approach", weight: 30, description: "Quality and feasibility of proposed solution" },
            { criterion: "Experience", weight: 25, description: "Relevant project experience and references" },
            { criterion: "Cost", weight: 20, description: "Total cost and value proposition" },
            { criterion: "Timeline", weight: 15, description: "Realistic project timeline" },
            { criterion: "Team Qualifications", weight: 10, description: "Team expertise and certifications" },
          ],
          scoringMethod: "Weighted scoring with technical threshold of 70%",
        },
        budgetInfo: {
          estimatedValue: "$2.5M - $3.2M CAD",
          paymentTerms: "Net 30 days, milestone-based payments",
          budgetConstraints: [
            "Annual budget cannot exceed $1.2M",
            "Capital expenditure approval required for hardware >$50K",
            "Training budget separate allocation of $200K",
          ],
        },
        complianceRequirements: [
          "PIPEDA compliance for personal data handling",
          "SOC 2 Type II certification required",
          "Government security clearance for key personnel",
          "ISO 27001 certification preferred",
        ],
        riskFactors: [
          "Tight timeline may impact quality",
          "Legacy system integration complexity",
          "Potential resistance to change from staff",
          "Budget constraints may limit scope",
        ],
        recommendations: [
          "Emphasize proven cloud migration methodology",
          "Highlight relevant government sector experience",
          "Propose phased implementation to reduce risk",
          "Include comprehensive change management plan",
          "Demonstrate cost optimization strategies",
        ],
      };

      setUploadedFiles(prev =>
        prev.map(file =>
          file.id === fileId
            ? { ...file, status: "completed", analysis: mockAnalysis }
            : file
        )
      );
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const downloadReport = (fileId: string) => {
    // Mock download functionality
    console.log("Downloading report for file:", fileId);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          icon={<FileText className="w-10 h-10 text-primary" />}
          title="RFP Analysis"
          description="Upload RFP documents to get AI-powered analysis and insights to help you craft winning proposals"
        />

      {/* Upload Section */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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
          <h2 className="text-xl font-semibold text-text">Uploaded Documents</h2>
          {uploadedFiles.map((fileObj) => (
            <div
              key={fileObj.id}
              className="bg-surface border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FilePdf className="w-8 h-8 text-error" />
                  <div>
                    <h3 className="font-medium text-text">{fileObj.file.name}</h3>
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
                      <span className="text-sm text-text-muted">Uploading...</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
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
                    <span className="text-sm">{fileObj.error || "Analysis failed"}</span>
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
                        <h5 className="font-medium text-text mb-2">Executive Summary</h5>
                        <p className="text-sm text-text-muted">{fileObj.analysis.summary}</p>
                      </div>

                      {/* Key Requirements */}
                      <div>
                        <h5 className="font-medium text-text mb-2">Key Requirements</h5>
                        <ul className="space-y-1">
                          {fileObj.analysis.keyRequirements.map((req, index) => (
                            <li key={index} className="text-sm text-text-muted flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Budget Info */}
                      <div>
                        <h5 className="font-medium text-text mb-2">Budget Information</h5>
                        <div className="space-y-1">
                          <p className="text-sm text-text-muted">
                            <span className="font-medium">Estimated Value:</span> {fileObj.analysis.budgetInfo.estimatedValue}
                          </p>
                          <p className="text-sm text-text-muted">
                            <span className="font-medium">Payment Terms:</span> {fileObj.analysis.budgetInfo.paymentTerms}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Timeline */}
                      <div>
                        <h5 className="font-medium text-text mb-2">Timeline</h5>
                        <div className="space-y-1">
                          <p className="text-sm text-text-muted">
                            <span className="font-medium">Proposal Deadline:</span> {fileObj.analysis.timeline.proposalDeadline}
                          </p>
                          <p className="text-sm text-text-muted">
                            <span className="font-medium">Project Duration:</span> {fileObj.analysis.timeline.projectStart} - {fileObj.analysis.timeline.projectEnd}
                          </p>
                        </div>
                      </div>

                      {/* Evaluation Criteria */}
                      <div>
                        <h5 className="font-medium text-text mb-2">Evaluation Criteria</h5>
                        <div className="space-y-1">
                          {fileObj.analysis.evaluation.criteria.slice(0, 3).map((criterion, index) => (
                            <p key={index} className="text-sm text-text-muted">
                              <span className="font-medium">{criterion.criterion}:</span> {criterion.weight}%
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h5 className="font-medium text-text mb-2">AI Recommendations</h5>
                        <ul className="space-y-1">
                          {fileObj.analysis.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="text-sm text-text-muted flex items-start gap-2">
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
          <h3 className="text-lg font-medium text-text mb-2">No documents uploaded yet</h3>
          <p className="text-text-muted">
            Upload your first RFP document to get started with AI-powered analysis
          </p>
        </div>
      )}
      </div>
    </div>
  );
}