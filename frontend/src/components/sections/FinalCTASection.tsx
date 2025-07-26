
export default function FinalCTASection() {
  return (
    <section className="py-12 px-6 bg-primary">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-col gap-8 lg:gap-12 items-center">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
            So — ready to stop wasting time on broken portals?
          </h2>
        </div>

        {/* Right side - Start Free Trial button */}
        <div className="flex-1 w-full max-w-md">
          <a
            href="/signup"
            className="block text-center w-full px-6 sm:px-8 py-3 bg-white text-primary font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}
