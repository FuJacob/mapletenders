import { useState } from "react";
import { analyzePdf, getRfpAnalysis, type RfpAnalysisResponse } from "../api";

const Rfp = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<RfpAnalysisResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const raw_response = await analyzePdf(formData);
      console.log(raw_response);
      const analysisResult = await getRfpAnalysis(raw_response);
      setData(analysisResult);
      console.log("Successfully uploaded pdf");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Upload PDF</h1>
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            required
            onChange={handleChange}
          />
          <input
            type="submit"
            className="bg-black text-white p-12 hover:scale-110"
          />
        </form>
        {data && (
          <div className="mt-4">
            <h2>Analysis Result:</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default Rfp;
