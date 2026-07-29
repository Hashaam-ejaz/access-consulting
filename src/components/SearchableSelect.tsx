// src/components/SearchableSelect.tsx
import Select from "react-select";

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: boolean;
};

export default function SearchableSelect({ options, value, onChange, placeholder = "Select…", searchable = false, error = false }: Props) {
  // react-select works with {value,label} objects
  const opts = options.map((o) => ({ value: o, label: o }));
  const selected = value ? { value, label: value } : null;

  return (
    <Select
      options={opts}
      value={selected}
      onChange={(opt) => onChange(opt ? (opt as { value: string }).value : "")}
      placeholder={placeholder}
      isClearable
      isSearchable={searchable}
      // route styling through Tailwind-ish inline styles since react-select isn't class-based
      classNamePrefix="rs"
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: "0.75rem",              // rounded-xl
          borderColor: error ? "#f87171" : state.isFocused ? "var(--color-primary)" : "rgb(24 24 27 / 0.15)",
          boxShadow: "none",
          padding: "0.25rem 0.25rem",
          minHeight: "3.125rem",
          "&:hover": { borderColor: error ? "#f87171" : "var(--color-primary)" },
        }),
        placeholder: (base) => ({ ...base, color: "rgb(24 24 27 / 0.4)" }),
        singleValue: (base) => ({ ...base, color: "var(--color-ink)" }),
        menu: (base) => ({
          ...base,
          borderRadius: "0.75rem",
          overflow: "hidden",
          border: "1px solid rgb(24 24 27 / 0.1)",
          boxShadow: "0 10px 30px rgb(0 0 0 / 0.08)",
          zIndex: 30,
        }),
        option: (base, state) => ({
          ...base,
          fontSize: "0.875rem",
          cursor: "pointer",
          backgroundColor: state.isSelected
            ? "var(--color-sky-soft)"
            : state.isFocused
              ? "rgb(24 24 27 / 0.05)"          // bg-ink/5 hover
              : "white",
          color: state.isSelected ? "var(--color-primary)" : "var(--color-ink)",
          fontWeight: state.isSelected ? 600 : 400,
        }),
      }}
    />
  );
}