import Image from "next/image";

export default function GoogleButton() {
  return (
    <div className="mt-7 w-full py-[10px] border border-[#E8E8E8] rounded-md flex items-center justify-center gap-x-4 cursor-pointer">
      <Image src="/google.png" width={25} height={25} alt="google" />
      <p className="text-sm font-bold text-[#828282]">Continue com o Google</p>
    </div>
  );
}
