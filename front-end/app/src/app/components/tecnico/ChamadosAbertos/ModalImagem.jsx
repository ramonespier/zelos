  'use client';

  export default function ModalImagem({ url, onClose }) {
    if (!url) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div className="relative rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg"
          >
            &times;
          </button>
          <img
            src={url}
            alt="Visualização ampliada"
            className="object-contain rounded-md max-h-[85vh] max-w-[90vw]"
          />
        </div>
      </div>
    );
  }
