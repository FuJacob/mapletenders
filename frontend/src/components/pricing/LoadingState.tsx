export default function LoadingState() {
  return (
    <section className="pb-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-border rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-border rounded w-32 mx-auto"></div>
        </div>
      </div>
    </section>
  );
}