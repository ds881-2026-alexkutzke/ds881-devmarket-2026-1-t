import { useRef, useState } from "react";

import "./styles/ProductGallery.css";

type ProductGalleryProps = {
  images: string[];
};

const COMPACT_LIMIT = 4;

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? "");

  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const compactMode = images.length <= COMPACT_LIMIT;

  const currentImage = images.includes(selectedImage)
    ? selectedImage
    : (images[0] ?? "");

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
      className={`product-gallery ${
        compactMode ? "product-gallery--compact" : "product-gallery--scroll"
      }`}
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
                  currentImage === image
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

        <div className="product-gallery__main">
          <img
            className="product-gallery__main-image"
            src={currentImage}
            alt="Imagem principal do produto"
          />
        </div>
      </div>
    </div>
  );
}
