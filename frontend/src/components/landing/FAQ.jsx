import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Does RepoMind support private repositories?",
    answer:
      "Currently RepoMind supports public GitHub repositories. Support for private repositories with secure authentication is planned for a future release.",
  },
  {
    question: "How does RepoMind answer repository questions?",
    answer:
      "RepoMind combines semantic search with Google's Gemini model to generate answers grounded in the indexed repository instead of relying only on general knowledge.",
  },
  {
    question: "What happens if a repository is updated?",
    answer:
      "RepoMind detects new commits and refreshes the indexed repository so future searches and responses reflect the latest code.",
  },
  {
    question: "Do I need to clone the repository locally?",
    answer:
      "No. Simply paste the URL of any public GitHub repository and RepoMind handles cloning, indexing, and analysis automatically.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  function toggleFAQ(index) {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  return (
    <section id="faq" className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            Everything you need to know about RepoMind.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:border-blue-500/40"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <h3 className="text-lg font-semibold text-white">
                  {faq.question}
                </h3>

                <ChevronDown
                  size={22}
                  className={`text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-slate-800 px-6 py-5">
                  <p className="leading-7 text-slate-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
