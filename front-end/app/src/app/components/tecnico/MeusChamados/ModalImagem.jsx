'use client';
export default function ModalImagem({ imagemUrl, onClose }) {
    if (!imagemUrl) return null;

    return (
        <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white cursor-pointer text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg"
                >
                    &times;
                </button>

                <img
                    src={imagemUrl}
                    alt="Visualização ampliada"
                    className="object-contain rounded-md max-h-[85vh] max-w-[90vw]"
                />
            </div>
        </div>
    );
}
