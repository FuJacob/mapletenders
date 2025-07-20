import { Link } from "react-router-dom";
import { ConfettiIcon, LightningIcon, XIcon } from "@phosphor-icons/react";

const WelcomeBanner = ({ closeBanner }: { closeBanner: () => void }) => {
  return (
    <div className="sticky z-50 top-0 bg-primary text-white py-2 px-4 w-full">
      <div className="mx-auto flex items-center justify-center gap-3 text-center">
        <ConfettiIcon />
        We just launched! — Smarter tender discovery is here — powered by AI,
        built for Canada.
        <Link
          to="/pricing"
          className="ml-4 flex items-center justify-center gap-2 text-sm bg-white text-primary px-3 py-1 rounded"
        >
          <LightningIcon /> Claim your 14-day free trial
        </Link>
      </div>
      <XIcon
        onClick={closeBanner}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
      />
    </div>
  );
};

export default WelcomeBanner;
