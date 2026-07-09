import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  askRepositoryQuestion,
  openRepository,
} from "../../services/repository.service";

const QUICK_ACTIONS = [
  {
    title: "🧠 Explain Repository Architecture",
    prompt: "Explain the architecture of this repository.",
  },
  {
    title: "📖 Summarize Repository",
    prompt: "Summarize this repository for a new developer.",
  },
  {
    title: "🔐 Explain Authentication",
    prompt: "Explain how authentication is implemented.",
  },
  {
    title: "🌐 List API Endpoints",
    prompt: "List all API endpoints in this repository.",
  },
  {
    title: "📂 Explain Folder Structure",
    prompt: "Explain the folder structure of this repository.",
  },
  {
    title: "🚀 Find Entry Point",
    prompt: "What is the main entry point of this repository?",
  },
];

export default function ChatPanel({ repositoryId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! Ask me anything about this repository, or choose one of the quick actions below.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [aiReady, setAiReady] = useState(false);

  const messagesContainerRef = useRef(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    loadRepositoryStatus();
  }, [repositoryId]);

  async function loadRepositoryStatus() {
    try {
      const response = await openRepository(repositoryId);

      setAiReady(response.repository.aiIndexStatus === "completed");
    } catch {
      setAiReady(false);
    }
  }

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function handleSend(customPrompt) {
    if (!aiReady) {
      return;
    }

    const prompt =
      typeof customPrompt === "string" ? customPrompt.trim() : question.trim();

    if (!prompt || isLoading) {
      return;
    }

    setShowQuickActions(false);

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: prompt,
      },
    ]);

    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    setQuestion("");

    try {
      setIsLoading(true);

      const response = await askRepositoryQuestion(repositoryId, prompt);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            error.message ||
            "Unable to generate a response.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  async function copyMessage(text, index) {
    await navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="font-semibold text-white">RepoMind AI</h2>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-5 overflow-y-auto p-4"
      >
        {!aiReady && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
            <strong>Preparing AI Knowledge Base...</strong>
            <br />
            AI chat will be available once repository indexing is complete.
          </div>
        )}

        {aiReady && showQuickActions && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-4 font-semibold text-white">Quick Actions</h3>

            <div className="space-y-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.title}
                  onClick={() => handleSend(action.prompt)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white"
                >
                  {action.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");

                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="rounded bg-slate-700 px-1 py-0.5"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>

              {message.role === "assistant" && (
                <button
                  onClick={() => copyMessage(message.content, index)}
                  className="mt-3 flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {message.role === "user" && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600">
              <Bot size={18} />
            </div>

            <div className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-400">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 p-4">
        <textarea
          value={question}
          disabled={!aiReady}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            aiReady
              ? "Ask anything about this repository..."
              : "Waiting for AI indexing..."
          }
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !aiReady}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
    </section>
  );
}
