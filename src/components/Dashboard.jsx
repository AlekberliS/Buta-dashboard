import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch members data.");
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  // Statistics calculations
  const genderStats = members.reduce(
    (acc, member) => {
      acc[member.gender === "M" ? "male" : "female"]++;
      return acc;
    },
    { male: 0, female: 0 }
  );

  const educationStats = members.reduce(
    (acc, member) => {
      acc[member.education === "bachelor" ? "bachelor" : "master"]++;
      return acc;
    },
    { bachelor: 0, master: 0 }
  );

  const interestStats = members.reduce((acc, member) => {
    acc[member.interest] = (acc[member.interest] || 0) + 1;
    return acc;
  }, {});

  const universityStats = members.reduce((acc, member) => {
    acc[member.university] = (acc[member.university] || 0) + 1;
    return acc;
  }, {});

  const yearStats = members.reduce((acc, member) => {
    acc[member.year] = (acc[member.year] || 0) + 1;
    return acc;
  }, {});

  const ageStats = members.reduce((acc, member) => {
    acc[member.age] = (acc[member.age] || 0) + 1;
    return acc;
  }, {});

  // Chart Data
  const genderData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [genderStats.male, genderStats.female],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffca28"],
      },
    ],
  };

  const educationData = {
    labels: ["Bachelor", "Master"],
    datasets: [
      {
        label: "Education Levels",
        data: [educationStats.bachelor, educationStats.master],
        backgroundColor: ["#2196F3", "#FF5722"],
      },
    ],
  };

  const interestData = {
    labels: Object.keys(interestStats),
    datasets: [
      {
        label: "Interests",
        data: Object.values(interestStats),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A", "#FFA726"],
      },
    ],
  };

  const universityData = {
    labels: Object.keys(universityStats),
    datasets: [
      {
        label: "University Attendance",
        data: Object.values(universityStats),
        backgroundColor: ["#AB47BC", "#42A5F5", "#FF7043", "#7E57C2"],
      },
    ],
  };

  const yearData = {
    labels: Object.keys(yearStats).map((year) => `${year} Year`),
    datasets: [
      {
        label: "Year of Study",
        data: Object.values(yearStats),
        backgroundColor: ["#FF7043", "#42A5F5", "#7E57C2", "#AB47BC"],
      },
    ],
  };

  const ageData = {
    labels: Object.keys(ageStats),
    datasets: [
      {
        label: "Age Distribution",
        data: Object.values(ageStats),
        backgroundColor: ["#FF5722", "#4CAF50", "#FFC107", "#2196F3", "#AB47BC"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard Statistics</h2>
      <Link to="/menu" className="block text-blue-500 hover:underline">
         Back to Menu
         </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Gender Pie Chart */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">Gender Distribution</h3>
          <Pie data={genderData} style={{ maxHeight: "250px" }} />
        </div>

        {/* Education Bar Chart */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">Education Levels</h3>
          <Bar data={educationData} options={{ maintainAspectRatio: false }} style={{ maxHeight: "250px" }} />
        </div>

        {/* Interest Chart */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">Interests</h3>
          <Doughnut data={interestData} style={{ maxHeight: "250px" }} />
        </div>

        {/* University Bar Chart */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">University Distribution</h3>
          <Bar data={universityData} options={{ maintainAspectRatio: false }} style={{ maxHeight: "250px" }} />
        </div>

        {/* Year of Study Chart */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">Year of Study</h3>
          <Doughnut data={yearData} style={{ maxHeight: "250px" }} />
        </div>

        {/* Age Distribution Chart */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">Age Distribution</h3>
          <Bar data={ageData} options={{ maintainAspectRatio: false }} style={{ maxHeight: "250px" }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
