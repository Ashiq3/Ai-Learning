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
      className={`overflow-hidden rounded-xl border border-white/15 bg-[#111d29] shadow-[0_16px_45px_rgba(0,0,0,0.4)] ${className}`}
    >
      {failed ? (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[#142333] p-6 text-center">
          <Layers className="h-8 w-8 text-[#60e0c0]" aria-hidden="true" />
          <p className="text-sm font-medium text-[#edf4f5]">{alt}</p>
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
        <figcaption className="border-t border-white/10 bg-[#0d1723] px-4 py-2 font-mono text-[11px] text-[#9aabba]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
