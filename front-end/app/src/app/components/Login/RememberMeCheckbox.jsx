import { BiCheck } from 'react-icons/bi';

export default function RememberMeCheckbox({ marcado, setMarcado }) {
  return (
    <div className="flex items-center justify-center gap-x-3">
      <button
        onClick={() => setMarcado(!marcado)}
        className={`w-[12px] h-[12px] rounded-[5px] flex items-center justify-center text-white transition-colors duration-200 cursor-pointer ${marcado ? "bg-[#e7000b]" : "bg-gray-300"}`}
      >
        {marcado && <BiCheck size={10} />}
      </button>
      <p className="text-[12px] text-[#e7000b] font-normal">Remember Me</p>
    </div>
  );
}
