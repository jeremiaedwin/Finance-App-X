import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="font-sans text-gray-800 bg-gray-100 p-12">
      <header className="text-center pb-8 border-b border-gray-300">
        <h1 className="text-teal-700 text-4xl font-bold">Welcome to PT Teknologi Mudah Selaras</h1>
        <h2 className="text-teal-900 text-2xl mt-4 italic">
          Project: <span className="font-light">FishFlow IoT</span>
        </h2>
        <p className="text-base text-gray-600 mt-2">
          Revolutionizing water quality monitoring for fish ponds using IoT technology.
        </p>
      </header>

      <main className="pt-8 max-w-3xl mx-auto leading-relaxed">
        <section className="mb-10">
          <h3 className="text-teal-900 text-xl font-semibold">About the Project</h3>
          <p>
            FishFlow IoT is an innovative solution designed to monitor water quality in fish ponds using IoT sensors. 
            By providing real-time data on key environmental factors such as pH levels, temperature, and ammonia content, 
            FishFlow IoT helps farmers optimize the conditions for fish growth, ensuring better yield and sustainability.
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-teal-900 text-xl font-semibold">Our Mission</h3>
          <p>
            At PT Teknologi Mudah Selaras, our mission is to make technology accessible and practical for businesses
            in various sectors. We believe that the right use of IoT technology can lead to greater efficiency, 
            sustainability, and better results for industries such as aquaculture.
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-teal-900 text-xl font-semibold">Technologies We Use</h3>
          <ul className="list-disc pl-5">
            <li>IoT Sensors for pH, Temperature, and Ammonia Monitoring</li>
            <li>ESP32 Microcontroller for real-time data transmission</li>
            <li>MQTT Protocol for efficient data communication</li>
            <li>React.js for building a modern, responsive front-end</li>
            <li>Node.js and Express for backend API development</li>
            <li>MongoDB for efficient data storage and management</li>
          </ul>
        </section>
      </main>

      <footer className="mt-12 pt-8 border-t border-gray-300 text-center">
        <p className="text-gray-600 text-sm">
          &copy; 2024 PT Teknologi Mudah Selaras. All rights reserved.
        </p>
        <div className="mt-4">
          <Link
            className="text-teal-700 text-lg font-mono hover:text-teal-900"
            to="/login"
          >
            Sign In to Access More Features
          </Link>
        </div>
      </footer>
    </section>
  );
  return content;
};

export default Public;
