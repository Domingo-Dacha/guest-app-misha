import Image from "next/image";

export function DomingoLogo() {
  return (
    <span className="brand-lockup">
      <Image
        src="/brand/logo.svg"
        alt="Domingo"
        width={44}
        height={44}
        priority
      />
      <span>guest care</span>
    </span>
  );
}
