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
} as const;
