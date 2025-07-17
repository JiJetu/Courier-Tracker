import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-r from-primary to-purple-400 text-white p-4 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Track & Book Your Parcel Instantly 🚚
      </h1>
      <p className="text-lg mb-6 max-w-xl">
        Real-time parcel tracking with easy booking and lightning fast delivery
        service across your country.
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard/book-parcel">
          <button className="btn btn-primary">Book Parcel</button>
        </Link>
        <Link to="/dashboard/my-parcels">
          <button className="btn btn-outline btn-primary">Track Parcel</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
