import axios from "axios";

/**
 * Base URL for API endpoints
 * @constant {string}
 */
const API_BASE_URL = "http://localhost:4000";
const PDF_ANALYSIS_URL = "http://localhost:4500";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add response interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const operation = error.config?.url || "Unknown operation";
    console.error(
      `API Error [${operation}]:`,
      error.response?.data || error.message
    );

    // You can add global error notifications here
    // toast.error(`Failed to ${operation}`);

    return Promise.reject(error);
  }
);

/**
 * Generic error handler for API operations
 * @param error - The error object
 * @param operation - Description of the operation that failed
 */
const handleApiError = (error: any, operation: string): never => {
  console.error(`${operation} failed:`, error);
  throw new Error(
    `${operation} failed: ${error.response?.data?.error || error.message}`
  );
};
/**
 * Interface defining the structure of a tender notice
 */
export interface TenderNoticeInterface {
  "title-titre-eng": string;
  "tenderStatus-appelOffresStatut-eng": string;
  "gsinDescription-nibsDescription-eng": string;
  "unspscDescription-eng": string;
  "noticeType-avisType-eng": string;
  "procurementMethod-methodeApprovisionnement-eng": string;
  "selectionCriteria-criteresSelection-eng": string;
  "limitedTenderingReason-raisonAppelOffresLimite-eng": string;
  "tradeAgreements-accordsCommerciaux-eng": string;
  "regionsOfOpportunity-regionAppelOffres-eng": string;
  "regionsOfDelivery-regionsLivraison-eng": string;
  "contractingEntityName-nomEntitContractante-eng": string;
  "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng": string;
  "contractingEntityAddressCity-entiteContractanteAdresseVille-eng": string;
  "contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng": string;
  "contractingEntityAddressCountry-entiteContractanteAdressePays-eng": string;
  "endUserEntitiesName-nomEntitesUtilisateurFinal-eng": string;
  "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng": string;
  "contactInfoAddressLine-contactInfoAdresseLigne-eng": string;
  "contactInfoCity-contacterInfoVille-eng": string;
  "contactInfoProvince-contacterInfoProvince-eng": string;
  "contactInfoCountry-contactInfoPays-eng": string;
  "noticeURL-URLavis-eng": string;
  "attachment-piecesJointes-eng": string;
  "tenderDescription-descriptionAppelOffres-eng": string;
}

/**
 * Get AI completion - DEPRECATED: This endpoint no longer exists
 * @returns {Promise<any>} Completion response data
 */
// export const getCompletion = async () => {
//   const response = await axios.post(`${API_BASE_URL}/api/completion`);
//   return response.data;
// };

/**
 * Retrieve open tender notices from database
 * @returns {Promise<TenderNoticeInterface[]>} Array of tender notices
 */
export const getOpenTenderNoticesFromDB = async (): Promise<
  TenderNoticeInterface[]
> => {
  try {
    const response = await axios.get("/tenders/getOpenTenderNoticesFromDB");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch tender notices");
  }
};

/**
 * Generate leads based on form data
 * @param {any} formData - Form data for lead generation
 * @returns {Promise<any>} Generated leads data
 */
export const generateLeads = async (formData: any): Promise<any> => {
  try {
    const response = await axios.post("/ai/generateLeads", formData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Generate leads");
  }
};

/**
 * Redirect to open tender notices page
 */
export const getOpenTenderNotices = () => {
  window.location.href = `${API_BASE_URL}/tenders/getOpenTenderNotices`;
};

/**
 * Get filtered tender notices from database
 * @returns {Promise<TenderNoticeInterface[]>} Filtered tender notices
 */
export const getFilteredTenderNoticesFromDB = async (): Promise<
  TenderNoticeInterface[]
> => {
  try {
    const response = await axios.get("/tenders/getFilteredTenderNoticesFromDB");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch filtered tender notices");
  }
};

/**
 * Filter open tender notices based on search criteria
 * @param {string} search - Filter criteria
 * @returns {Promise<TenderNoticeInterface[]>} Filtered tender notices
 */
export const filterOpenTenderNotices = async (
  search: string
): Promise<TenderNoticeInterface[]> => {
  try {
    const response = await axios.get(
      `/tenders/filterOpenTenderNotices?search=${search}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Filter tender notices");
  }
};

/**
 * Save open tender notices to database
 * @returns {Promise<any>} Operation result
 */
export const getOpenTenderNoticesToDB = async (): Promise<any> => {
  try {
    const response = await axios.post("/tenders/getOpenTenderNoticesToDB");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Import tender notices to database");
  }
};

/**
 * Analyze PDF document
 * @param {FormData} formData - Form data containing PDF file
 * @returns {Promise<any>} Analysis results
 */
export const analyzePdf = async (formData: FormData): Promise<any> => {
  try {
    const response = await axios.post(
      `${PDF_ANALYSIS_URL}/analyze_pdf`,
      formData
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Analyze PDF");
  }
};

/**
 * Get RFP analysis
 * @param {any} rfpData - RFP data to analyze
 * @returns {Promise<any>} Analysis results
 */
export const getRfpAnalysis = async (rfpData: any): Promise<any> => {
  try {
    const response = await axios.post("/ai/getRfpAnalysis", rfpData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get RFP analysis");
  }
};

/**
 * Search tenders using vector similarity
 * @param {string} q - The search query
 * @returns {Promise<TenderNoticeInterface[]>} Array of matching tender notices
 */
export const filterByVector = async (
  q: string
): Promise<TenderNoticeInterface[]> => {
  try {
    const response = await axios.post("/tenders/filterByVector", { q });
    // Fixed: Return response.data directly instead of response.data.tenders for consistency
    return response.data;
  } catch (error) {
    return handleApiError(error, "Filter by vector search");
  }
};

/**
 * Get individual tender notice details
 * @param {string} tenderId - The tender ID
 * @returns {Promise<TenderNoticeInterface>} Tender notice details
 */
export const getTenderNotice = async (
  tenderId: string
): Promise<TenderNoticeInterface> => {
  try {
    const response = await axios.get(`/tender-notice/${tenderId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Fetch tender notice ${tenderId}`);
  }
};

/**
 * Refresh tender data (rate limited to once per 24 hours)
 * @returns {Promise<any>} Refresh operation result
 */
export const refreshTenders = async (): Promise<any> => {
  try {
    const response = await axios.post("/tenders/refreshTenders");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Refresh tenders");
  }
};
