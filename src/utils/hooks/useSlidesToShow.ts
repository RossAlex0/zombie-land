import { useEffect, useState } from 'react';

// Nombre de cartes à afficher selon la largeur de fenêtre.
// On gère le responsive du carousel nous-mêmes car le système `responsive`
// de react-slick ne s'initialise pas de façon fiable avec le SSR de Next.
export function useSlidesToShow() {
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const computeSlides = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setSlidesToShow(1);
      } else if (width <= 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    computeSlides();
    window.addEventListener('resize', computeSlides);
    return () => window.removeEventListener('resize', computeSlides);
  }, []);

  return slidesToShow;
}
