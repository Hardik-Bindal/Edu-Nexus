import React, { useEffect, useState } from "react";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import {
  getMaterials,
  requestMaterial,
  uploadMaterial,
} from "../services/materialService";
import { getUser } from "../services/session";

const Materials = () => {
  const user = getUser();
  const isTeacher = user?.role === "teacher";
  const [materials, setMaterials] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    subject: "",
    gradeLevel: "",
    fileUrl: "",
  });
  const [requestTopic, setRequestTopic] = useState("");

  const loadMaterials = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getMaterials();
      setMaterials(data || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const submitUpload = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await uploadMaterial(uploadForm);
      setUploadForm({
        title: "",
        description: "",
        subject: "",
        gradeLevel: "",
        fileUrl: "",
      });
      setMessage("Material uploaded successfully.");
      loadMaterials();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const data = await requestMaterial(requestTopic);
      setMessage(data.message || "Material request submitted.");
      setRequestTopic("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Materials" links={isTeacher ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <h1 className="hero-title">
            {isTeacher ? "Publish learning content for your class." : "Browse and request study resources."}
          </h1>
          <p className="hero-subtitle">
            Centralized material library with subject filters and AI request support.
          </p>
        </section>

        {message && (
          <p
            className={`status ${
              message.toLowerCase().includes("uploaded") || message.toLowerCase().includes("submitted")
                ? "status-ok"
                : "status-error"
            }`}
          >
            {message}
          </p>
        )}

        {isTeacher ? (
          <section className="panel panel-pad">
            <h2 className="panel-title">Upload Study Material</h2>
            <form onSubmit={submitUpload} className="grid-auto grid-auto-2 mt-4">
              <input
                placeholder="Title"
                value={uploadForm.title}
                onChange={(event) =>
                  setUploadForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
                className="field"
              />
              <input
                placeholder="Subject"
                value={uploadForm.subject}
                onChange={(event) =>
                  setUploadForm((prev) => ({ ...prev, subject: event.target.value }))
                }
                required
                className="field"
              />
              <input
                placeholder="Grade Level"
                value={uploadForm.gradeLevel}
                onChange={(event) =>
                  setUploadForm((prev) => ({ ...prev, gradeLevel: event.target.value }))
                }
                className="field"
              />
              <input
                placeholder="File URL (optional)"
                value={uploadForm.fileUrl}
                onChange={(event) =>
                  setUploadForm((prev) => ({ ...prev, fileUrl: event.target.value }))
                }
                className="field"
              />
              <textarea
                placeholder="Description"
                value={uploadForm.description}
                onChange={(event) =>
                  setUploadForm((prev) => ({ ...prev, description: event.target.value }))
                }
                className="textarea-field md:col-span-2"
              />
              <button type="submit" className="btn btn-primary">
                Upload Material
              </button>
            </form>
          </section>
        ) : (
          <section className="panel panel-pad">
            <h2 className="panel-title">Request AI Material</h2>
            <form onSubmit={submitRequest} className="flex flex-wrap gap-2 mt-4">
              <input
                value={requestTopic}
                onChange={(event) => setRequestTopic(event.target.value)}
                placeholder="Topic"
                required
                className="field flex-1 min-w-[220px]"
              />
              <button type="submit" className="btn btn-secondary">
                Request
              </button>
            </form>
          </section>
        )}

        <section className="stack-3">
          <h2 className="panel-title">Available Materials</h2>
          {loading ? (
            <p className="status status-info">Loading materials...</p>
          ) : !materials.length ? (
            <p className="status status-info">No materials found.</p>
          ) : (
            materials.map((material, index) => (
              <article
                key={material._id}
                className="panel panel-pad fade-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="panel-title">{material.title}</h3>
                  <span className="badge">{material.subject}</span>
                </div>
                <p className="panel-muted mt-1">
                  Level: {material.gradeLevel || "All levels"} · Uploaded by{" "}
                  {material.uploadedBy?.name || "teacher"}
                </p>
                {material.description && <p className="panel-muted mt-2">{material.description}</p>}
                {material.fileUrl && (
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost mt-3"
                  >
                    Open Material
                  </a>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Materials;

