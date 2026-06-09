'use client';

import ActivityCard from '../card/ActivityCard';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './carouselZbl.scss';
import { activity } from '@prismaInstance/*';
const attractions = [
  {
    id: 1,
    name: 'Grand Huit',
    picture: null,
    description: null,
    status: 'active',
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    id: 2,
    name: 'Grande Roue',
    picture: null,
    description: null,
    status: 'active',
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    id: 3,
    name: 'Maison Hantée',
    categorie_id: { name: 'horreur' },
    picture: null,
    description: null,
    status: 'active',
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    id: 4,
    name: 'Grande De',
    picture: null,
    description: null,
    categorie_id: { name: 'Famille' },
    status: 'active',
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    id: 5,
    name: 'Maison Hée',
    categorie_id: { name: 'horreur' },
    picture: null,
    description: null,
    status: 'active',
    updated_at: new Date(),
    created_at: new Date(),
  },
] as const;

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="carousel-arrow carousel-arrow--prev"
      onClick={onClick}
      aria-label="Attraction précédente"
    >
      <ArrowLeft />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="carousel-arrow carousel-arrow--next"
      onClick={onClick}
      aria-label="Attraction suivante"
    >
      <ArrowRight />
    </button>
  );
}

export default function AttractionsCarousel({ activities }: { activities: Partial<activity[]> }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, arrows: false },
      },
    ],
  };

  return (
    <div className="attractions-carousel">
      <Slider {...settings}>
        {activities.map((attr) =>
          attr ? <ActivityCard key={attr.id} activity={attr} /> : undefined
        )}
      </Slider>
    </div>
  );
}
