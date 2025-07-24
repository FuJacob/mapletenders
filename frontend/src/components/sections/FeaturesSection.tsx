export default function Features() {
  return (
    <div className="flex flex-col">
      {/* Feature 1 */}
      <section className="h-screen flex flex-col justify-center items-center bg-blue-100 border-b-4 border-blue-400">
        <h2 className="text-4xl font-bold mb-4">Feature One</h2>
        <p className="text-lg text-gray-700 max-w-xl text-center">
          A short description of the first amazing feature goes here. This is just a placeholder.
        </p>
      </section>
      {/* Feature 2 */}
      <section className="h-screen flex flex-col justify-center items-center bg-green-100 border-b-4 border-green-400">
        <h2 className="text-4xl font-bold mb-4">Feature Two</h2>
        <p className="text-lg text-gray-700 max-w-xl text-center">
          Here is a brief description of the second feature. Replace this with real content later.
        </p>
      </section>
      {/* Feature 3 */}
      <section className="h-screen flex flex-col justify-center items-center bg-yellow-100 border-b-4 border-yellow-400">
        <h2 className="text-4xl font-bold mb-4">Feature Three</h2>
        <p className="text-lg text-gray-700 max-w-xl text-center">
          Description for the third feature. This section is a placeholder as well.
        </p>
      </section>
    </div>
  );
}
