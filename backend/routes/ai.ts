import { Router } from "express";
import { aiController } from "../container";

const router = Router();

/**
 * @route POST /ai/generateLeads
 * @desc Generate AI-powered lead suggestions based on user prompt
 * @access Public
 * @param {Object} req.body - Lead generation request data
 * @param {string} req.body.prompt - The prompt describing what type of leads to generate
 * @returns {Object} res.json - AI generated lead suggestions and recommendations
 * @example
 * POST /ai/generateLeads
 * {
 *   "prompt": "Find IT consulting opportunities in government sector"
 * }
 * Response: {
 *   "leads": "Based on current tender data, here are relevant IT consulting opportunities..."
 * }
 */
router.post("/generateLeads", (req, res) =>
  aiController.generateLeads(req, res)
);

/**
 * @route POST /ai/getRfpAnalysis
 * @desc Analyze RFP (Request for Proposal) data using AI for insights and recommendations
 * @access Public
 * @param {Object} req.body - RFP data to analyze
 * @param {string} req.body.title - RFP title
 * @param {string} req.body.description - RFP description content
 * @param {Array} [req.body.requirements] - List of requirements
 * @param {Object} [req.body.additionalData] - Additional RFP metadata
 * @returns {Object} res.json - AI generated analysis and recommendations
 * @example
 * POST /ai/getRfpAnalysis
 * {
 *   "title": "Software Development Services",
 *   "description": "Government seeks contractor for custom software...",
 *   "requirements": ["5+ years experience", "Security clearance"]
 * }
 * Response: {
 *   "analysis": "This RFP presents a strong opportunity for established software firms..."
 * }
 */
router.post("/getRfpAnalysis", (req, res) =>
  aiController.getRfpAnalysis(req, res)
);

/**
 * @route POST /ai/filterTendersWithAI
 * @desc Filter and match tenders using AI based on specific criteria or requirements
 * @access Public
 * @param {Object} req.body - Tender filtering request
 * @param {string} req.body.prompt - The filtering criteria or requirements to match against
 * @param {Array} req.body.tenderData - Array of tender objects to filter through
 * @returns {Object} res.json - JSON object containing matching tender reference IDs
 * @example
 * POST /ai/filterTendersWithAI
 * {
 *   "prompt": "software development projects under $500K",
 *   "tenderData": [
 *     {
 *       "referenceNumber-numeroReference": "REF123",
 *       "tenderDescription-descriptionAppelOffres-eng": "Custom software development..."
 *     }
 *   ]
 * }
 * Response: {
 *   "matches": ["REF123", "REF456"]
 * }
 */
router.post("/filterTendersWithAI", (req, res) =>
  aiController.filterTendersWithAI(req, res)
);

/**
 * @route POST /ai/generateTenderSummary
 * @desc Generate comprehensive AI-powered summary for a specific tender
 * @access Public
 * @param {Object} req.body - Tender summary request data
 * @param {string} req.body.tenderId - Unique identifier for the tender
 * @param {string} req.body.tenderData - Structured tender data as formatted text
 * @returns {Object} res.json - AI generated structured summary with recommendations
 * @example
 * POST /ai/generateTenderSummary
 * {
 *   "tenderId": "tender-uuid-123",
 *   "tenderData": "Description: Software development services\nCategory: IT\nValue: $200,000..."
 * }
 * Response: {
 *   "summary": {
 *     "summary": "Government seeking software development services...",
 *     "keyDetails": {
 *       "objective": "Custom software development",
 *       "category": "Information Technology",
 *       "value": "$100K - $500K"
 *     },
 *     "requirements": ["5+ years experience", "Security clearance"],
 *     "recommendation": {
 *       "priority": "High",
 *       "reason": "Good fit for your expertise"
 *     }
 *   }
 * }
 */
router.post("/generateTenderSummary", (req, res) => {
  aiController.generateTenderSummary(req, res);
});

export default router;
