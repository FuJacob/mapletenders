// URL Constants
export const URLS = {
  BIDSANDTENDERS: {
    MISSISSAUGA: {
      BASE: "https://mississauga.bidsandtenders.ca/Module/Tenders/en",
      TENDER_DETAIL: (id: string) =>
        `https://mississauga.bidsandtenders.ca/Module/Tenders/en/Tender/Detail/${id}`,
    },
    BRAMPTON: {
      BASE: "https://brampton.bidsandtenders.ca/Module/Tenders/en",
      TENDER_DETAIL: (id: string) =>
        `https://brampton.bidsandtenders.ca/Module/Tenders/en/Tender/Detail/${id}`,
    },
    HAMILTON: {
      BASE: "https://hamilton.bidsandtenders.ca/Module/Tenders/en",
      TENDER_DETAIL: (id: string) =>
        `https://hamilton.bidsandtenders.ca/Module/Tenders/en/Tender/Detail/${id}`,
    },
    LONDON: {
      BASE: "https://london.bidsandtenders.ca/Module/Tenders/en",
      TENDER_DETAIL: (id: string) =>
        `https://london.bidsandtenders.ca/Module/Tenders/en/Tender/Detail/${id}`,
    },
  },
  TORONTO: {
    API: "https://secure.toronto.ca/c3api_data/v2/DataAccess.svc/pmmd_solicitations/feis_solicitation?$format=application/json;odata.metadata=none&$count=true&$skip=0&$orderby=Closing_Date%20desc,Issue_Date%20desc",
  },
  ONTARIO: {
    JAGGAER:
      "https://ontariotenders.app.jaggaer.com/esop/guest/go/public/opportunity/current?locale=en_CA&customLoginPage=/esop/nac-host/public/web/login.html&customGuest=",
  },
  QUEBEC: {
    BASE: "https://api.seao.gouv.qc.ca/prod/api/recherche?statIds=6&tpIds=2,3,5,6,7,8,10,14,15,17,18&catIds=52,53,51,54,1,20,4,27,5,18,7,21,9,26,8,22,28,10,2,24,3,12,16,17,13,25,19,23,6,29,14,31,15,30,11,56,55,57,58,38,34,39,50,46,42,43,32,33,41,47,35,44,49,40,48,45,36,37",
    TENDER_DETAIL: (id: string) =>
      `https://seao.gouv.qc.ca/avis-resultat-recherche/consulter?ItemId=${id}`,
  },
} as const;
