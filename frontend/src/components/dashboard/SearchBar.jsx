import { Search } from "lucide-react";

export default function SearchBar({ onImportRepository }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-xl">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search repositories..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
        />
      </div>

      <button
        onClick={onImportRepository}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
      >
        + Import Repository
      </button>
    </div>
  );
}
