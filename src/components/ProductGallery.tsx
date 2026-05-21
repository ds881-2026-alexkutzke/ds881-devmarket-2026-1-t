import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./styles/ProductGallery.css";

type ProductGalleryProps = {
  images: string[];
};

const COMPACT_LIMIT = 4;

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState("");
  const [mainHeight, setMainHeight] = useState<number | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const compactMode = images.length <= COMPACT_LIMIT;

  useEffect(() => {
    if (images.length > 0 && !images.includes(selectedImage)) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (!mainRef.current) return;
      setMainHeight(mainRef.current.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (mainRef.current) observer.observe(mainRef.current);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const scrollThumbnails = (direction: "up" | "down") => {
    if (!thumbnailsRef.current) return;

    thumbnailsRef.current.scrollBy({
      top: direction === "up" ? -220 : 220,
      behavior: "smooth",
    });
  };

  if (!images.length) {
    return <p className="product-gallery__empty">Nenhuma imagem disponível</p>;
  }

  return (
    <div
      className={`product-gallery ${compactMode ? "product-gallery--compact" : "product-gallery--scroll"}`}
    >
      <div className="product-gallery__content">
        <div className="product-gallery__sidebar">
          {!compactMode && (
            <button
              type="button"
              className="product-gallery__arrow"
              onClick={() => scrollThumbnails("up")}
            >
              ▲
            </button>
          )}

          <div
            ref={thumbnailsRef}
            className={`product-gallery__thumbnails ${
              compactMode
                ? "product-gallery__thumbnails--compact"
                : "product-gallery__thumbnails--scroll"
            }`}
          >
            {images.map((image) => (
              <button
                key={image}
                type="button"
                className={`product-gallery__thumbnail ${
                  selectedImage === image
                    ? "product-gallery__thumbnail--active"
                    : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  className="product-gallery__thumbnail-image"
                  src={image}
                  alt="Miniatura do produto"
                />
              </button>
            ))}
          </div>

          {!compactMode && (
            <button
              type="button"
              className="product-gallery__arrow"
              onClick={() => scrollThumbnails("down")}
            >
              ▼
            </button>
          )}
        </div>

        <div ref={mainRef} className="product-gallery__main">
          <img
            className="product-gallery__main-image"
            src={selectedImage}
            alt="Imagem principal do produto"
          />
        </div>
      </div>
    </div>
  );
}
