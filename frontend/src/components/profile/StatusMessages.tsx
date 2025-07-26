import { CheckCircle } from "@phosphor-icons/react";

interface StatusMessagesProps {
  success: string;
  error: string;
}

export default function StatusMessages({
  success,
  error,
}: StatusMessagesProps) {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 text-success rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg">
          {error}
        </div>
      )}
    </>
  );
}
