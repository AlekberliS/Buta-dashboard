import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Members = () => {
  const [currentUser, setCurrentUser] = useState(null); // Logged-in user
  const [members, setMembers] = useState([]); // All users excluding `id` and `password`
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Edit modal state for current user
  const [editedUser, setEditedUser] = useState({}); // Store current user edits

  // Filters
  const [searchTerm, setSearchTerm] = useState(""); // General search
  const [filterGender, setFilterGender] = useState(""); // Gender filter
  const [filterYear, setFilterYear] = useState(""); // Year filter
  const [filterInterest, setFilterInterest] = useState(""); // Interest filter

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Initialize all fields to ensure no missing values
      setEditedUser({
        name: parsedUser.name || "",
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        id: parsedUser.id || "",
        interest: parsedUser.interest || "",
        year: parsedUser.year || "",
        university: parsedUser.university || "",
        gender: parsedUser.gender || "",
      });
      setCurrentUser(parsedUser);
    } else {
      alert("No user logged in!");
    }
  }, []);

  // Fetch all users data excluding `id` and `password`
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users"); // API to fetch all users
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const data = await response.json();
        // Remove sensitive data like `id` and `password` from users
        const sanitizedMembers = data.map(({ id, password, ...rest }) => rest);
        setMembers(sanitizedMembers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle input changes for current user editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes for the current user
  const handleSaveChanges = async () => {
    if (editedUser && editedUser.id) {
      try {
        const response = await fetch(`http://localhost:3000/users/${editedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          console.log("User updated successfully:", updatedUser);
          setCurrentUser(updatedUser);
          setEditedUser(updatedUser);
          setIsEditing(false);
          alert("Profile updated successfully!");
        } else {
          const errorMessage = await response.text();
          alert(`Error: ${errorMessage}`);
        }
      } catch (error) {
        alert("There was an error updating the profile. Please try again.");
      }
    } else {
      alert("Error: Invalid user data.");
    }
  };
  // Filter members based on search term and additional filters
  const filteredMembers = members.filter((member) => {
    return (
      (searchTerm === "" ||
        Object.values(member).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (filterGender === "" || member.gender?.toLowerCase() === filterGender.toLowerCase()) &&
      (filterYear === "" || member.year?.toString() === filterYear) &&
      (filterInterest === "" || member.interest?.toLowerCase().includes(filterInterest.toLowerCase()))
    );
  });

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
       <h2 className="text-3xl font-bold mb-6 text-center">Members List</h2>

       <Link to="/menu" className="block text-blue-500 hover:underline">
         Back to Menu
         </Link>
{/* Current User Edit Section */}
<div className="mb-6">
  <h3 className="text-2xl font-semibold mb-4">Edit Your Information</h3>
  <table className="table-auto border-collapse border border-gray-300 mb-6">
    <tbody>
      {[
        { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "id", label: "ID" },
        { key: "interest", label: "Interest" },
        { key: "year", label: "Year" },
        { key: "university", label: "University" },
        { key: "gender", label: "Gender" },
      ].map(({ key, label }) => (
        <tr key={key}>
          <td className="border border-gray-300 px-4 py-2 font-bold">{label}</td>
          <td className="border border-gray-300 px-4 py-2">
            <input
              type="text"
              name={key}
              value={editedUser?.[key] || ""}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              disabled={key === "id"} // Disable editing for ID
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <button
    onClick={handleSaveChanges}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Save Changes
  </button>
</div>
      {/* Filters */}
      <div className="mb-6 p-4 border border-gray-300 rounded">
        <h3 className="text-2xl font-semibold mb-4">Filter Members</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by any field..."
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Gender</label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="border border-gray-300 p-2 w-full"
            >
              <option value="">All</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Year</label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="Enter year..."
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Interest</label>
            <input
              type="text"
              value={filterInterest}
              onChange={(e) => setFilterInterest(e.target.value)}
              placeholder="Search by interest..."
              className="border border-gray-300 p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Full Members Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
            <th className="border border-gray-300 px-4 py-2 text-left">University</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Interest</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                <td className="border border-gray-300 px-4 py-2">{member.username}</td>
                <td className="border border-gray-300 px-4 py-2">{member.email}</td>
                <td className="border border-gray-300 px-4 py-2">{member.gender}</td>
                <td className="border border-gray-300 px-4 py-2">{member.university}</td>
                <td className="border border-gray-300 px-4 py-2">{member.year}</td>
                <td className="border border-gray-300 px-4 py-2">{member.interest}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center border border-gray-300 py-4">
                No members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
