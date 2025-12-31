//Ed_Pharma\components\Testimonials.jsx
"use client";

export default function Testimonials() {
  // ✅ Online default avatar (no public folder)
  const DEFAULT_AVATAR =
    "https://ui-avatars.com/api/?name=User&background=eaeaea&color=555&size=128";

  const testimonials = [
    {
      name: "Elizabeth",
      location: "Germany",
      rating: 5,
      text:
        "ED Pharma has been our most reliable Europe-to-Europe supplier. Quality compliance and documentation are always excellent.",
      avatar:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Catherine",
      location: "France",
      rating: 5,
      text:
        "Professional handling of bulk pharmaceutical exports with strong EU regulatory understanding.",
      avatar: "", // default online avatar
    },
    {
      name: "Victoria",
      location: "Netherlands",
      rating: 5,
      text:
        "Consistent deliveries, transparent communication, and ethical sourcing. Highly recommended pharma partner.",
      avatar:
        "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Michael",
      location: "Spain",
      rating: 5,
      text:
        "ED Pharma provides dependable logistics and premium product quality across Europe.",
      avatar: "", // default online avatar
    },
  ];

  return (
    <>
      {/* ===== STYLES ===== */}
      <style jsx>{`
        .testimonial-section {
          padding: 80px 20px;
          background: #f7f9fc;
          text-align: center;
          overflow: hidden;
        }

        .testimonial-tag {
          font-size: 12px;
          letter-spacing: 4px;
          color: #ff5a3c;
          font-weight: 600;
        }

        .testimonial-title {
          font-size: 36px;
          font-weight: 700;
          margin: 12px 0;
          color: #222;
        }

        .testimonial-subtitle {
          max-width: 650px;
          margin: 0 auto 50px;
          color: #666;
          font-size: 15px;
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

        @media (max-width: 768px) {
          .testimonial-title {
            font-size: 26px;
          }

          .card {
            min-width: 260px;
          }
        }
      `}</style>

      {/* ===== CONTENT ===== */}
      <section className="testimonial-section">
        <p className="testimonial-tag">TESTIMONIAL</p>
        <h2 className="testimonial-title">What Our Client Says</h2>
        <p className="testimonial-subtitle">
          We build long-term pharmaceutical partnerships across Europe with trust,
          quality, and regulatory excellence.
        </p>

        <div className="slider">
          <div className="track">
            {[...testimonials, ...testimonials].map((item, i) => (
              <div className="card" key={i}>
                <div className="stars">★★★★★</div>

                <p className="text">{item.text}</p>

                <div className="user">
                  <img
                    src={item.avatar || DEFAULT_AVATAR}
                    alt={item.name}
                    className="avatar"
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