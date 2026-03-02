import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // for create
  const [offers, setOffers] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false); // ✅ for job list
  const [offersLoading, setOffersLoading] = useState(false);
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

  const fetchOffers = async () => {
    setOffersLoading(true);
    try {
      const res = await axios.post(
        "https://aqitsys-backend.vercel.app/web/offers/get-all-offers"
      );
      setOffers(res.data.data || res.data);
    } catch {
      toast.error("Failed to fetch contact messages");
    } finally {
      setOffersLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchOffers(); // ✅ fetch contact data
  }, []);

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

      {/* ================= CONTACT US SUBMISSIONS ================= */}
      <h2 className="mb-5 mt-14 text-2xl font-bold">
        Contact Us Form Submissions
      </h2>

      {offersLoading ? (
        <div className="flex justify-center py-12">
          <div className="border-t-transparent h-10 w-10 animate-spin rounded-full border-4 border-green-500"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No contact messages available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition hover:scale-105 hover:shadow-2xl dark:from-navy-800 dark:to-navy-700"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-brand-500">
                  👤 {offer.name}
                </h3>
                <p className="break-all text-sm text-gray-500">
                  📧 {offer.image}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-4 text-gray-700 dark:bg-navy-600 dark:text-gray-200">
                {offer.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div className="bg-black/50 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-[400px] scale-100 transform rounded-xl bg-white p-6 transition-all dark:bg-navy-800">
            <h2 className="mb-4 text-xl font-bold">Edit Job</h2>

            <input
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              className="mb-3 w-full rounded border p-2"
              disabled={editLoading}
            />

            <input
              name="location"
              value={editData.location}
              onChange={handleEditChange}
              className="mb-3 w-full rounded border p-2"
              disabled={editLoading}
            />

            <input
              name="jobnumber"
              value={editData.jobnumber}
              onChange={handleEditChange}
              className="mb-3 w-full rounded border p-2"
              disabled={editLoading}
            />

            <textarea
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              className="mb-3 w-full rounded border p-2"
              disabled={editLoading}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg bg-gray-400 px-4 py-2 text-white"
                disabled={editLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={editLoading}
                className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white"
              >
                {editLoading ? (
                  <>
                    <div className="border-t-transparent h-4 w-4 animate-spin rounded-full border-2 border-white"></div>
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
        <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-[350px] scale-100 transform rounded-xl bg-white p-6 text-center transition-all dark:bg-navy-800">
            <h3 className="mb-4 text-lg font-bold">
              Are you sure you want to delete this job?
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteJobNumber(null)}
                className="rounded-lg bg-gray-400 px-4 py-2 text-white"
                disabled={deleteLoading}
              >
                No
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                {deleteLoading ? (
                  <>
                    <div className="border-t-transparent h-4 w-4 animate-spin rounded-full border-2 border-white"></div>
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
