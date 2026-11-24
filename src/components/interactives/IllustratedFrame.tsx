import { useState } from 'react';
import { Layers } from 'lucide-react';

interface IllustratedFrameProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function IllustratedFrame({
  src,
  alt,
  caption,
  className = '',
}: IllustratedFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)] ${className}`}
    >
      {failed ? (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-slate-50 p-6 text-center">
          <Layers className="h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">{alt}</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="aspect-video w-full object-cover"
        />
      )}
      {caption && (
        <figcaption className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
