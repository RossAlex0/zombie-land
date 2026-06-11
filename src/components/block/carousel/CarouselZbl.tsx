'use client';

import ActivityCard from '../card/ActivityCard';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ActivityWithCategory } from '@customTypes/collections/activity';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './carouselZbl.scss';

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

export default function AttractionsCarousel({
  activities,
}: {
  activities: ActivityWithCategory[];
}) {
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
          attr ? (
            <Link key={attr.id} href={`/activity/${attr.id}`}>
              <ActivityCard key={attr.id} activity={attr} />
            </Link>
          ) : undefined
        )}
      </Slider>
    </div>
  );
}
