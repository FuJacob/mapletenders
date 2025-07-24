import { TenderNoticeFullContent } from "../components/tenderNotice/TenderNoticeFullContent";

export default function Test() {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Logo Test Page</h1>
      <div className="space-y-4">
        <TenderNoticeFullContent tenderId="MX-443538968279" />
      </div>
    </div>
  );
}
