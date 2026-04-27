// Ed_Pharma/components/Testimonials.jsx
"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
  // ✅ Online default avatar (no public folder)
  const DEFAULT_AVATAR =
    "https://ui-avatars.com/api/?name=User&background=eaeaea&color=555&size=128";

  const { t } = useLanguage();

  // Get translations from context or use defaults
  const testimonialsData = t?.testimonials || {
    tag: "TESTIMONIAL",
    title: "What Our Client Says",
    subtitle: "We build long-term pharmaceutical partnerships across Europe with trust, quality, and regulatory excellence.",
    items: []
  };

  // Use translated items if available, otherwise use defaults
  const testimonials = testimonialsData.items?.length > 0 ? testimonialsData.items : [
    {
      name: "Elizabeth",
      location: "Germany",
      rating: 5,
      text: "ED Pharma has been our most reliable Europe-to-Europe supplier. Quality compliance and documentation are always excellent.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Catherine",
      location: "France",
      rating: 5,
      text: "Professional handling of bulk pharmaceutical exports with strong EU regulatory understanding.",
      avatar: "", // default online avatar
    },
    {
      name: "Victoria",
      location: "Netherlands",
      rating: 5,
      text: "Consistent deliveries, transparent communication, and ethical sourcing. Highly recommended pharma partner.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Michael",
      location: "Spain",
      rating: 5,
      text: "ED Pharma provides dependable logistics and premium product quality across Europe.",
      avatar: "", // default online avatar
    },
  ];

  return (
    <>
      {/* ===== STYLES ===== */}
      <style jsx>{`
        .testimonial-section {
          padding: 40px 16px;
          background: #f7f9fc;
          text-align: center;
          overflow: hidden;
        }

        .testimonial-tag {
          font-size: 12px;
          letter-spacing: 4px;
          color: #ff5a3c;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .testimonial-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #222;
          line-height: 1.2;
        }

        .testimonial-subtitle {
          max-width: 650px;
          margin: 0 auto 40px;
          color: #666;
          font-size: 15px;
          line-height: 1.5;
          padding: 0 10px;
        }

        .slider {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .track {
          display: flex;
          gap: 30px;
          width: max-content;
          animation: scroll 28s linear infinite;
        }

        .slider:hover .track {
          animation-play-state: paused;
        }

        .card {
          background: #fff;
          min-width: 320px;
          max-width: 320px;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          text-align: left;
          transition: transform 0.3s ease;
          margin-top:20;
          margin-bottom:80
        }

        .card:hover {
          transform: translateY(-6px);
        }

        .stars {
          color: #ff5a3c;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .text {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          background: #eaeaea;
        }

        .name {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .location {
          font-size: 12px;
          color: #888;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .testimonial-section {
            padding: 30px 12px;
          }
          
          .testimonial-tag {
            font-size: 11px;
            letter-spacing: 3px;
            margin-bottom: 6px;
          }
          
          .testimonial-title {
            font-size: 22px;
            margin-bottom: 10px;
            padding: 0 10px;
          }
          
          .testimonial-subtitle {
            font-size: 14px;
            margin-bottom: 30px;
            padding: 0 8px;
          }
          
          .card {
            min-width: 280px;
            max-width: 280px;
            padding: 20px;
            margin: 0 5px;
          }
          
          .track {
            gap: 20px;
          }
          
          .text {
            font-size: 13.5px;
          }
        }
        
        @media (max-width: 480px) {
          .testimonial-section {
            padding: 24px 10px;
          }
          
          .testimonial-tag {
            font-size: 10px;
            letter-spacing: 2px;
          }
          
          .testimonial-title {
            font-size: 20px;
            margin-bottom: 8px;
          }
          
          .testimonial-subtitle {
            font-size: 13px;
            margin-bottom: 24px;
            line-height: 1.4;
          }
          
          .card {
            min-width: 260px;
            max-width: 260px;
            padding: 16px;
          }
          
          .track {
            gap: 16px;
          }
        }
        
        @media (max-width: 360px) {
          .card {
            min-width: 240px;
            max-width: 240px;
            padding: 14px;
          }
          
          .testimonial-title {
            font-size: 18px;
          }
        }
      `}</style>

      {/* ===== CONTENT ===== */}
      <section className="testimonial-section">
        <p className="testimonial-tag">{testimonialsData.tag}</p>
        <h2 className="testimonial-title">{testimonialsData.title}</h2>
        <p className="testimonial-subtitle">
          {testimonialsData.subtitle}
        </p>

        <div className="slider">
          <div className="track">
            {[...testimonials, ...testimonials].map((item, i) => (
              <div className="card" key={i}>
                <div className="stars">{"★".repeat(item.rating || 5)}</div>

                <p className="text">{item.text}</p>

                <div className="user">
                  <img
                    src={item.avatar || DEFAULT_AVATAR}
                    alt={item.name}
                    className="avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div>
                    <p className="name">{item.name}</p>
                    <span className="location">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}