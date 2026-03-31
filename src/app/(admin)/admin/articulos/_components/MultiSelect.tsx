"use client";

type Option = { id: number; name: string };

type Props = {
  label: string;
  options: Option[];
  selected: number[];
  onChange: (ids: number[]) => void;
};

export default function MultiSelect({ label, options, selected, onChange }: Props) {
  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {options.length === 0 ? (
        <p className="text-xs text-gray-400">No hay opciones disponibles</p>
      ) : (
        <div className="border rounded p-2 max-h-40 overflow-y-auto flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                selected.includes(opt.id)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
