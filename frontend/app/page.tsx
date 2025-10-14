"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSummary(data.summary || "Error generating summary");
    } catch {
      setSummary("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
        Text Summarizer
      </h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Left: Input form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white p-6 rounded-2xl shadow"
        >
          <label
            htmlFor="text"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Enter Text:
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text here..."
            className="border border-gray-300 p-3 rounded-lg mb-4 h-80 resize-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </form>

        {/* Right: Summary output */}
        <div className="flex flex-col bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary:</h2>
          <div className="flex-1 border border-gray-200 p-4 rounded-lg overflow-auto h-80">
            <p className="text-gray-800 whitespace-pre-wrap">
              {summary || "Your summary will appear here..."}
            </p>
          </div>
          <button
            onClick={handleCopy}
            disabled={!summary}
            className="mt-4 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg transition disabled:bg-gray-400"
          >
            {copied ? "Copied!" : "Copy Summary"}
          </button>
        </div>
      </div>
    </main>
  );
}
