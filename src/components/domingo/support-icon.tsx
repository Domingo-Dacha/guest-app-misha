import {
  Bath,
  CookingPot,
  Droplets,
  Flame,
  KeyRound,
  Route,
  ShieldAlert,
  ThermometerSun,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { SupportIconName } from "@/data/contracts/support";

const icons: Record<SupportIconName, LucideIcon> = {
  route: Route,
  key: KeyRound,
  furako: Waves,
  fireplace: Flame,
  bath: Bath,
  wifi: Wifi,
  kitchen: CookingPot,
  water: Droplets,
  electricity: Zap,
  climate: ThermometerSun,
  safety: ShieldAlert,
};

export function SupportIcon({ name }: { name: SupportIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden size={22} strokeWidth={2} />;
}
