import Image from "next/image";

import type { House } from "@/data/contracts/catalog";

export function HouseCard({ house }: { house: House }) {
  return (
    <article className="house-card">
      <div className="house-card__image">
        <Image
          src={house.image}
          alt=""
          fill
          sizes="(max-width: 720px) 100vw, 33vw"
        />
      </div>
      <div className="house-card__content">
        <p className="eyebrow">
          До {house.capacity} гостей · {house.location}
        </p>
        <h3>{house.name}</h3>
        <p>{house.description}</p>
        <ul className="chips" aria-label="Особенности">
          {house.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
