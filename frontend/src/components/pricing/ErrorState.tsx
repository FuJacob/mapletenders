interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <section className="pb-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-error/10 text-error p-4 rounded-lg">{error}</div>
      </div>
    </section>
  );
}
