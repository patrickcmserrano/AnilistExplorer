import { ImageItem } from './types';

interface CarouselImageDisplayProps {
  imageUrl: string;
  imageLabel: string;
  animeTitle: string;
  animeId: number | string;
  imageIndex: number;
}

export default function CarouselImageDisplay({
  imageUrl,
  imageLabel,
  animeTitle,
  animeId,
  imageIndex
}: CarouselImageDisplayProps) {
  return (
    <>
      {/* Background image with blur */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.3)',
        }}
      />

      {/* Main image */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-2 md:p-0">
        <img
          key={`${animeId}-${imageIndex}`}
          src={imageUrl}
          alt={`${animeTitle} - ${imageLabel}`}
          className="max-h-full max-w-full w-auto h-auto object-contain animate-fade-in"
          onError={(e) => { 
            (e.target as HTMLImageElement).src = '/placeholder-anime.svg'; 
          }}
        />
      </div>

      {/* Fade animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </>
  );
}
