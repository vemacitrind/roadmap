import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { markLessonComplete } from "@/lib/userData";

function PracticeQuestion({
  q,
  qIdx,
  currentIndex,
  answers,
  setAnswers,
  userId,
  roadmapId,
  totalLessons
}) {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      textarea.value =
        value.substring(0, start) + "    " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    }
  };

  const runCode = async () => {
    setLoading(true);
    const code = answers[`${currentIndex}-${qIdx}`] || "";
    try {
      const res = await fetch("http://localhost:5000/api/run-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: q.language, code }),
      });
      const data = await res.json();
      const correct = data.output.trim() === q.expectedOutput.trim();
      setOutput(data.output);
      setIsCorrect(correct);
      if (correct) {
        await markLessonComplete(
          userId,
          roadmapId,
          currentIndex,
          totalLessons
        );
      }
    } catch (err) {
      setOutput("Error running code");
      setIsCorrect(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOutput("");
    setIsCorrect(null);
  }, [currentIndex]);

  return (
    <div className="space-y-3 border border-gray-800 p-4 rounded-lg bg-gray-950">
      <p className="font-medium">{q.question}</p>
      <p className="text-sm text-gray-500">
        Expected Output:{" "}
        <code className="bg-gray-800 px-1 py-0.5 rounded">
          {q.expectedOutput}
        </code>
      </p>

      <div className="relative w-full">
        <textarea
          rows={6}
          placeholder="Write your code here..."
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary pr-16"
          value={answers[`${currentIndex}-${qIdx}`] || ""}
          onChange={(e) =>
            setAnswers({
              ...answers,
              [`${currentIndex}-${qIdx}`]: e.target.value,
            })
          }
          onKeyDown={handleKeyDown}
        />

        {/* Run Button */}
        <Button
          onClick={runCode}
          variant="secondary"
          className="absolute top-2 right-2 p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Running..." : <><Icon icon="fluent:triangle-right-32-filled" className="w-6 h-6" />Run</>} 
        </Button>
      </div>

      {/* Output */}
      {output && (
        <div
          className={`p-3 font-mono text-sm rounded-md border ${
            isCorrect === null
              ? "border-gray-700 bg-gray-800 text-gray-200"
              : isCorrect
              ? "border-green-500 bg-green-900 text-green-200"
              : "border-red-500 bg-red-900 text-red-200"
          }`}
        >
          <strong>Output:</strong>
          <pre className="whitespace-pre-wrap mt-1">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default PracticeQuestion;
