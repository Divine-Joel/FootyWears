"use client";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "/images/mbappe_boot.jpg",
    alt: "Play Mind Games",
    heading: (
      <>
        PLAY MIND
        <br />
        GAMES
      </>
    ),
    text: "Lock in before the game with our latest boots collection.",
    link: "/boots",
  },
  {
    image: "/images/messi_boot.jpg",
    alt: "Gear Up",
    heading: (
      <>
        GEAR UP
        <br />
        FOR MATCHDAY
      </>
    ),
    text: "New footy essentials to get you ready for kickoff.",
    link: "/equipments",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const goToSlide = (index) => {
    setCurrentSlide((index + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="hero-carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div className="carousel-slide" key={i}>
            <img src={slide.image} alt={slide.alt} />
            <div className="slide-content">
              <h1>{slide.heading}</h1>
              <p>{slide.text}</p>
              <a href={slide.link} className="carousel-btn">
                Shop
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control prev"
        onClick={() => goToSlide(currentSlide - 1)}
        aria-label="Previous slide"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button
        className="carousel-control next"
        onClick={() => goToSlide(currentSlide + 1)}
        aria-label="Next slide"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      <button
        className="carousel-pause"
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label="Pause slideshow"
      >
        <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
      </button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === currentSlide ? "active" : ""}
            onClick={() => goToSlide(i)}
          ></span>
        ))}
      </div>
    </section>
  );
}
