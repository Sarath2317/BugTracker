import { useState, useEffect } from "react";
import API from "../api/api";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [bugs, setBugs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchBugs = async () => {
    try {
      const res = await API.get("/bugs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBugs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const createBug = async () => {
    try {
      await API.post(
        "/bugs",
        {
          title,
          description,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bug Created");

      setTitle("");
      setDescription("");
      setPriority("Medium");

      fetchBugs();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBug = async (id) => {
    try {
      await API.delete(`/bugs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBugs();
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id) => {
    try {
      await API.put(
        `/bugs/${id}`,
        {
          status: "Resolved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBugs();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>🐞 Bug Tracker Dashboard</h1>

      <input
        type="text"
        placeholder="Bug Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Bug Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button onClick={createBug}>
        Create Bug
      </button>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <h2>Total Bugs: {bugs.length}</h2>

      <h3>
        Open Bugs: {
          bugs.filter((bug) => bug.status === "Open").length
        }
      </h3>

      <h3>
        Resolved Bugs: {
          bugs.filter((bug) => bug.status === "Resolved").length
        }
      </h3>

      <h2>All Bugs</h2>

      {bugs.map((bug) => (
        <div
          key={bug._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginTop: "10px",
          }}
        >
          <h3>{bug.title}</h3>

          <p>{bug.description}</p>

          <p>
            <strong>Priority:</strong> {bug.priority}
          </p>

          <p>
            <strong>Status:</strong> {bug.status}
          </p>

          <button
            onClick={() => updateStatus(bug._id)}
          >
            Mark Resolved
          </button>

          <button
            onClick={() => deleteBug(bug._id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;