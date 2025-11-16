interface CarouselProgressBarProps {
  progress: number;
}

export default function CarouselProgressBar({ progress }: CarouselProgressBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
