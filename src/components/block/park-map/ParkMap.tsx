import Image from 'next/image';
import './parkMap.scss';

export default function ParkMap() {
  return (
    <div className="park-map-wrapper">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="parchment" clipPathUnits="objectBoundingBox">
            <path
              d="
          M 0.02,0.03
          Q 0.06,0 0.12,0.015 
          Q 0.20,0.005 0.28,0.012 
          Q 0.40,0 0.50,0.018 
          Q 0.62,0.005 0.72,0.015 
          Q 0.82,0 0.90,0.018 
          Q 0.96,0.01 0.985,0.04
          Q 1,0.10 0.99,0.18 
          Q 1.005,0.30 0.99,0.45
          Q 1.008,0.58 0.99,0.72 
          Q 1,0.85 0.985,0.96
          Q 0.96,1 0.90,0.985 
          Q 0.82,1 0.72,0.988 
          Q 0.62,1.005 0.50,0.985 
          Q 0.40,1 0.28,0.988 
          Q 0.18,1 0.10,0.985 
          Q 0.04,1 0.015,0.96
          Q 0,0.88 0.008,0.75 
          Q -0.005,0.62 0.005,0.50 
          Q -0.008,0.38 0.005,0.22 
          Q 0,0.10 0.02,0.03
          Z
        "
            />
          </clipPath>
        </defs>
      </svg>

      <Image
        fill
        sizes="(max-width: 768px) 100%, (max-width: 1200px) 80vw, 100%"
        src="/images/park-map.webp"
        alt="Plan du parc Zombieland"
        className="park-map"
        loading="eager"
      />
    </div>
  );
}
