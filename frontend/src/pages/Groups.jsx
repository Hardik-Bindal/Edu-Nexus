import React, { useEffect, useState } from "react";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import {
  addGroupMember,
  createGroup,
  getMyGroups,
  requestGroupAIMaterial,
  uploadGroupMaterial,
} from "../services/groupService";
import { getUser } from "../services/session";

const Groups = () => {
  const user = getUser();
  const isTeacher = user?.role === "teacher";
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [addMemberForm, setAddMemberForm] = useState({ groupId: "", studentId: "" });
  const [materialForm, setMaterialForm] = useState({
    groupId: "",
    title: "",
    content: "",
  });
  const [aiTopic, setAiTopic] = useState("");
  const [aiNotes, setAiNotes] = useState("");

  const loadGroups = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getMyGroups();
      setGroups(data || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const submitCreateGroup = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await createGroup(groupName);
      setGroupName("");
      setMessage("Group created successfully.");
      loadGroups();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const submitAddMember = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await addGroupMember(addMemberForm.groupId, addMemberForm.studentId);
      setAddMemberForm({ groupId: "", studentId: "" });
      setMessage("Member added to group.");
      loadGroups();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const submitMaterial = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await uploadGroupMaterial(materialForm.groupId, materialForm.title, materialForm.content);
      setMaterialForm({ groupId: "", title: "", content: "" });
      setMessage("Material uploaded to group.");
      loadGroups();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const requestAI = async (event) => {
    event.preventDefault();
    setMessage("");
    setAiNotes("");
    try {
      const data = await requestGroupAIMaterial(aiTopic);
      setAiNotes(data.notes || "");
      setMessage("AI notes generated.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Groups" links={isTeacher ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <h1 className="hero-title">
            {isTeacher ? "Run collaborative study groups effectively." : "Join your learning groups and shared resources."}
          </h1>
          <p className="hero-subtitle">
            Manage members, materials, and AI-generated notes in one collaborative space.
          </p>
        </section>

        {message && (
          <p
            className={`status ${
              message.toLowerCase().includes("generated") ||
              message.toLowerCase().includes("created") ||
              message.toLowerCase().includes("added") ||
              message.toLowerCase().includes("uploaded")
                ? "status-ok"
                : "status-error"
            }`}
          >
            {message}
          </p>
        )}

        {isTeacher && (
          <section className="grid-auto grid-auto-3">
            <form onSubmit={submitCreateGroup} className="panel panel-pad stack-3">
              <h2 className="panel-title">Create Group</h2>
              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Group name"
                required
                className="field"
              />
              <button type="submit" className="btn btn-primary">
                Create Group
              </button>
            </form>

            <form onSubmit={submitAddMember} className="panel panel-pad stack-3">
              <h2 className="panel-title">Add Member</h2>
              <select
                value={addMemberForm.groupId}
                onChange={(event) =>
                  setAddMemberForm((prev) => ({ ...prev, groupId: event.target.value }))
                }
                required
                className="select-field"
              >
                <option value="">Select group</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <input
                value={addMemberForm.studentId}
                onChange={(event) =>
                  setAddMemberForm((prev) => ({ ...prev, studentId: event.target.value }))
                }
                placeholder="Student user ID"
                required
                className="field"
              />
              <button type="submit" className="btn btn-secondary">
                Add Member
              </button>
            </form>

            <form onSubmit={submitMaterial} className="panel panel-pad stack-3">
              <h2 className="panel-title">Upload Group Material</h2>
              <select
                value={materialForm.groupId}
                onChange={(event) =>
                  setMaterialForm((prev) => ({ ...prev, groupId: event.target.value }))
                }
                required
                className="select-field"
              >
                <option value="">Select group</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <input
                value={materialForm.title}
                onChange={(event) =>
                  setMaterialForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Material title"
                required
                className="field"
              />
              <textarea
                value={materialForm.content}
                onChange={(event) =>
                  setMaterialForm((prev) => ({ ...prev, content: event.target.value }))
                }
                placeholder="Content"
                required
                className="textarea-field"
              />
              <button type="submit" className="btn btn-primary">
                Upload
              </button>
            </form>
          </section>
        )}

        <section className="panel panel-pad">
          <h2 className="panel-title">AI Group Notes</h2>
          <p className="panel-muted mt-1">Generate concise notes for any topic with one click.</p>
          <form onSubmit={requestAI} className="flex flex-wrap gap-2 mt-4">
            <input
              value={aiTopic}
              onChange={(event) => setAiTopic(event.target.value)}
              placeholder="Topic for AI notes"
              required
              className="field flex-1 min-w-[220px]"
            />
            <button type="submit" className="btn btn-secondary">
              Generate Notes
            </button>
          </form>
          {aiNotes && <pre className="mono-surface">{aiNotes}</pre>}
        </section>

        <section className="stack-3">
          <h2 className="panel-title">My Groups</h2>
          {loading ? (
            <p className="status status-info">Loading groups...</p>
          ) : !groups.length ? (
            <p className="status status-info">No groups found.</p>
          ) : (
            groups.map((group, index) => (
              <article
                key={group._id}
                className="panel panel-pad fade-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="panel-title">{group.name}</h3>
                  <span className="badge">{(group.members || []).length} members</span>
                </div>
                <p className="panel-muted mt-1">
                  Members: {(group.members || []).map((member) => member.name).join(", ") || "None"}
                </p>
                <div className="mt-3 stack-3">
                  <h4 className="panel-title text-sm">Study Materials</h4>
                  {!group.studyMaterials?.length ? (
                    <p className="panel-muted">No materials in this group yet.</p>
                  ) : (
                    group.studyMaterials.map((material) => (
                      <div key={material._id} className="inline-note-card">
                        <p className="text-sm font-medium">{material.title}</p>
                        <p className="panel-muted text-xs mt-1">
                          Type: {material.type} · By {material.uploadedBy?.name || "teacher"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Groups;
