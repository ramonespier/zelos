'use client';
export default function TextareaField({ label, value, onChange, placeholder, error, id, rows = 6 }) {
    return (
        <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">{label}</span>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${error ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
                aria-invalid={!!error}
                aria-describedby={`error-${id}`}
            />
            {error && <p id={`error-${id}`} className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{error}</p>}
        </label>
    );
}
