import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Nếu chưa login
  if (!user) {
    return (
      <div className="page-container">
        <div className="card profile-card">
          <h1 className="chat-title" style={{ marginBottom: "0.5rem" }}>
            Profile
          </h1>
          <p className="chat-subtitle">
            You are not logged in. Please <a href="/login">log in</a> to view
            your profile.
          </p>
        </div>
      </div>
    );
  }

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [status, setStatus] = useState(null); // {type: "success" | "error", text: string}

  // Modal state
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  // Edit profile form
  const [editFullName, setEditFullName] = useState(user.full_name || "");
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  // key lưu avatar theo email
  const storageKey = `profileAvatar_${user.email}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setAvatarUrl(saved);
  }, [storageKey]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setAvatarUrl(base64);
      try {
        localStorage.setItem(storageKey, base64);
      } catch {}
      setStatus({ type: "success", text: "Avatar updated locally." });
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatarUrl(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setStatus({ type: "success", text: "Avatar removed." });
  };

  const initials =
    user.full_name
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U";

  const roleLabel =
    user.role === "admin"
      ? "Admin"
      : user.role === "student"
      ? "Student"
      : user.role || "User";

  // ------- API CALLS -------

  const handleSaveProfile = async () => {
    setStatus(null);
    if (!editFullName.trim() || !editEmail.trim()) {
      setStatus({ type: "error", text: "Full name and email are required." });
      return;
    }

    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/profile", {
        full_name: editFullName.trim(),
        email: editEmail.trim(),
      });

      // Cập nhật localStorage user
      const updatedUser = {
        ...user,
        full_name: data.user.full_name,
        email: data.user.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setStatus({ type: "success", text: "Profile updated successfully." });
      setEditOpen(false);
      // reload page state (để hiển thị thông tin mới)
      window.location.reload();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to update profile. Please try again.";
      setStatus({ type: "error", text: msg });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setStatus(null);
    if (!oldPassword || !newPassword) {
      setStatus({
        type: "error",
        text: "Please enter both current and new password.",
      });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        text: "New password should be at least 6 characters.",
      });
      return;
    }

    setChangingPwd(true);
    try {
      const { data } = await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setStatus({
        type: "success",
        text: data.message || "Password changed successfully.",
      });
      setPwdOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to change password. Please try again.";
      setStatus({ type: "error", text: msg });
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card profile-card">
        {/* Header: avatar + name */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : initials}
            </div>

            {/* nút upload avatar */}
            <label className="profile-avatar-upload" title="Change avatar">
              <span>✏</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="profile-title-block">
            <div className="profile-name">
              {user.full_name || "Student User"}
            </div>
            <div className="profile-role-badge">{roleLabel}</div>
          </div>
        </div>

        {/* Status message */}
        {status && (
          <div
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              padding: "0.45rem 0.7rem",
              borderRadius: 8,
              border:
                status.type === "success"
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              background:
                status.type === "success" ? "#dcfce7" : "#fee2e2",
              color: status.type === "success" ? "#166534" : "#b91c1c",
            }}
          >
            {status.text}
          </div>
        )}

        {/* Thông tin chi tiết */}
        <div className="profile-grid">
          <div>
            <div className="profile-field-label">Full name</div>
            <div className="profile-field-value">{user.full_name}</div>
          </div>
          <div>
            <div className="profile-field-label">Email</div>
            <div className="profile-field-value">{user.email}</div>
          </div>
          <div>
            <div className="profile-field-label">Role</div>
            <div className="profile-field-value">{roleLabel}</div>
          </div>
          <div>
            <div className="profile-field-label">Student ID</div>
            <div className="profile-field-value">
              (coming soon – from database)
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="profile-actions">
          <button
            className="btn-outline"
            type="button"
            onClick={() => {
              setEditFullName(user.full_name || "");
              setEditEmail(user.email || "");
              setEditOpen(true);
            }}
          >
            Edit profile
          </button>
          <button
            className="btn-outline"
            type="button"
            onClick={() => setPwdOpen(true)}
          >
            Change password
          </button>
          {avatarUrl && (
            <button
              className="btn-outline"
              type="button"
              onClick={handleAvatarRemove}
            >
              Remove avatar
            </button>
          )}
        </div>
      </div>

      {/* ----- MODAL: Edit Profile ----- */}
      {editOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-title">Edit profile</div>
            <p
              className="chat-subtitle"
              style={{ marginBottom: "0.75rem", fontSize: "0.85rem" }}
            >
              Update your name and email. This will be used for your chatbot
              experience.
            </p>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div className="profile-field-label">Full name</div>
                <input
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                />
              </div>
              <div>
                <div className="profile-field-label">Email</div>
                <input
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={savingProfile}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----- MODAL: Change Password ----- */}
      {pwdOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-title">Change password</div>
            <p
              className="chat-subtitle"
              style={{ marginBottom: "0.75rem", fontSize: "0.85rem" }}
            >
              Enter your current password and a new password (min 6 characters).
            </p>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div className="profile-field-label">Current password</div>
                <input
                  type="password"
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <div className="profile-field-label">New password</div>
                <input
                  type="password"
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => setPwdOpen(false)}
                disabled={changingPwd}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={handleChangePassword}
                disabled={changingPwd}
              >
                {changingPwd ? "Updating..." : "Update password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
