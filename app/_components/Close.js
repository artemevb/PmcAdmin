import Image from "next/image";
import close from "@/public/svg/close.svg";

function Logo() {
  return (
    <button className="flex items-center gap-4 z-10 ">
      <Image
        priority
        src={close}
        width={10}
        height={10}
        alt="The Wild Oasis logo"
        quality={100}
        className="w-[35px]"
      />
    </button>
  );
}

export default Logo;
