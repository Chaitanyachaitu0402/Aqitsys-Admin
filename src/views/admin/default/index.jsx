import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // for create
  const [jobsLoading, setJobsLoading] = useState(false); // ✅ for job list

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    jobnumber: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteJobNumber, setDeleteJobNumber] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);

  // ================= FETCH =================
  const fetchJobs = async () => {
    setJobsLoading(true); // ✅ start loading

    try {
      const res = await axios.get(
        "https://aqitsys-backend.vercel.app/web/card/get-all-card"
      );

      setJobs(res.data.data || res.data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setJobsLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= CREATE =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://aqitsys-backend.vercel.app/web/card/create-card",
        {
          ...formData,
          createdAt: new Date(),
        }
      );

      toast.success("Job Created Successfully 🚀");

      setFormData({
        name: "",
        description: "",
        location: "",
        jobnumber: "",
      });

      fetchJobs();
    } catch (error) {
      toast.error("Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const openEditModal = (job) => {
    setEditData(job);
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
  setEditLoading(true);

  try {
    await axios.post(
      "https://aqitsys-backend.vercel.app/web/card/update-card",
      {
        jobnumber: editData.jobnumber,
        ...editData,
      }
    );

    toast.success("Job Updated Successfully ✨");
    setIsEditOpen(false);
    fetchJobs();
  } catch (error) {
    toast.error("Failed to update job");
  } finally {
    setEditLoading(false);
  }
};

  // ================= DELETE =================
  const handleDelete = async () => {
  setDeleteLoading(true);

  try {
    await axios.post(
      "https://aqitsys-backend.vercel.app/web/card/delete-card-by-id",
      {
        jobnumber: deleteJobNumber,
      }
    );

    toast.success("Job Deleted Successfully 🗑️");
    setDeleteJobNumber(null);
    fetchJobs();
  } catch (error) {
    toast.error("Failed to delete job");
  } finally {
    setDeleteLoading(false);
  }
};

  return (
    <div className="p-6">
      {/* ================= ADD JOB ================= */}
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-lg dark:bg-navy-800">
        <h2 className="mb-4 text-2xl font-bold">Add New Job</h2>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            name="name"
            placeholder="Job Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 dark:bg-navy-700"
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 dark:bg-navy-700"
          />

          <input
            name="jobnumber"
            placeholder="Job ID"
            value={formData.jobnumber}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 dark:bg-navy-700"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 dark:bg-navy-700 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand-500 py-3 text-white transition hover:scale-105 md:col-span-2"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
      {/* ================= JOB LIST ================= */}
      <h2 className="mb-5 text-2xl font-bold">Current Job Openings</h2>
      {/* ✅ Loading Screen */}
      {jobsLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="border-t-transparent h-12 w-12 animate-spin rounded-full border-4 border-brand-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading job openings...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No job openings available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.jobnumber}
              className="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-xl dark:bg-navy-800"
            >
              <h3 className="mb-2 text-xl font-bold">{job.name}</h3>
              <p>{job.description}</p>
              <p>📍 {job.location}</p>
              <p>🔢 Job ID: {job.jobnumber}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openEditModal(job)}
                  className="rounded-lg bg-blueSecondary px-4 py-2 text-white transition hover:scale-105"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteJobNumber(job.jobnumber)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* ================= EDIT MODAL ================= */}
{isEditOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl w-[400px] transform transition-all scale-100">
      <h2 className="text-xl font-bold mb-4">Edit Job</h2>

      <input
        name="name"
        value={editData.name}
        onChange={handleEditChange}
        className="w-full p-2 border rounded mb-3"
        disabled={editLoading}
      />

      <input
        name="location"
        value={editData.location}
        onChange={handleEditChange}
        className="w-full p-2 border rounded mb-3"
        disabled={editLoading}
      />

      <input
        name="jobnumber"
        value={editData.jobnumber}
        onChange={handleEditChange}
        className="w-full p-2 border rounded mb-3"
        disabled={editLoading}
      />

      <textarea
        name="description"
        value={editData.description}
        onChange={handleEditChange}
        className="w-full p-2 border rounded mb-3"
        disabled={editLoading}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsEditOpen(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          disabled={editLoading}
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={editLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
        >
          {editLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  </div>
)}
      {/* ================= DELETE MODAL ================= */}
{deleteJobNumber && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl w-[350px] text-center transform transition-all scale-100">
      <h3 className="text-lg font-bold mb-4">
        Are you sure you want to delete this job?
      </h3>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setDeleteJobNumber(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          disabled={deleteLoading}
        >
          No
        </button>

        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
        >
          {deleteLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </>
          ) : (
            "Yes"
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;
