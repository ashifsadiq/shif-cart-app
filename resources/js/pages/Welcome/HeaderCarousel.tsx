import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

function SimpleSlider() {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
    };

    const sliderRef = useRef<Slider>(null);
    const width = 1500;
    const height = 600;

    return (
        <div className={`slider-container relative h-[${height}px] hidden lg:block`}>
            <Slider ref={sliderRef} {...settings}>
                {Array(10)
                    .fill('')
                    .map((_, i) => (
                        <div key={i} className="bg-red-500">
                            <img src={`https://picsum.photos/${width}/${height}?random=${i}`} className="w-full" alt={`Slide ${i}`} />
                        </div>
                    ))}
            </Slider>

            {/* Arrow buttons */}
            <div className="absolute top-1/2 right-0 left-0 z-10 flex -translate-y-1/2 justify-between px-4">
                <button
                    onClick={() => {
                        sliderRef.current?.slickPrev();
                    }}
                    className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                    <CircleArrowLeft size={24} />
                </button>
                <button
                    onClick={() => {
                        sliderRef.current?.slickNext();
                    }}
                    className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                    <CircleArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}

export default SimpleSlider;
