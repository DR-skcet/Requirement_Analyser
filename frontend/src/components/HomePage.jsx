import { Link } from "react-router-dom";
import { FaClock, FaFileAlt, FaCheckCircle, FaRobot, FaFileUpload } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-6 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4 animate-fadeIn">
          AI-Powered Requirement Extractor
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl leading-relaxed animate-fadeIn delay-100">
          Upload your project documents, and let AI do the heavy lifting! Extract
          functional & non-functional requirements, constraints, and assumptions — fast,
          accurate, and ready to use.
        </p>
        <Link
          to="/upload"
          className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition duration-300 animate-fadeIn delay-200"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-indigo-600 text-center mb-8">
          Why Choose This Tool?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
          <FeatureCard
            icon={<FaClock className="text-indigo-600 text-3xl" />}
            title="Save Time"
            desc="No more manual reading! Let the AI instantly extract requirements from your files."
          />
          <FeatureCard
            icon={<FaCheckCircle className="text-indigo-600 text-3xl" />}
            title="High Accuracy"
            desc="Trained on real-world project data to extract key points with precision."
          />
          <FeatureCard
            icon={<FaFileAlt className="text-indigo-600 text-3xl" />}
            title="Multiple Format Support"
            desc=".doc, .docx, .txt, .pdf, .csv, .xls-we've got you covered."
          />
          <FeatureCard
            icon={<FaRobot className="text-indigo-600 text-3xl" />}
            title="Clean JSON Output"
            desc="Extracted data is formatted and export-ready for dev tools or PM platforms."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-indigo-600 mb-6 text-center">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700 text-lg">
          <li>Select and upload your project document.</li>
          <li>The AI model processes the file using NLP and LLMs.</li>
          <li>Requirements are parsed, categorized, and returned as JSON.</li>
          <li>Review, export, and integrate into your dev pipeline.</li>
        </ol>
      </div>

      {/* Testimonials */}
      <div className="bg-indigo-50 rounded-xl p-6 shadow-inner max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">What Users Say</h2>
        <p className="italic text-gray-700 text-center max-w-3xl mx-auto">
          "This tool saved me hours during requirement analysis in a client meeting.
          Loved the clean JSON output and the support for PDFs!" <br />
          — <span className="font-semibold">Product Manager, FinTech Startup</span>
        </p>
      </div>

      {/* Tech Info */}
      <div className="text-center text-sm text-gray-500 mt-12">
        <p>Built with 💻 React + TailwindCSS | Backend powered by 🧠 AI & NLP</p>
        <p className="mt-2">© {new Date().getFullYear()} AI Requirement Extractor. All rights reserved.</p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex items-start space-x-4 animate-fadeInUp">
    <div>{icon}</div>
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p>{desc}</p>
    </div>
  </div>
);

export default HomePage;
