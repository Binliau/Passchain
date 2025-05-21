import React, { useState, useEffect } from "react";
import { getContract } from "../models/passchain";
import CryptoJS from "crypto-js";

const SECRET_KEY = "passchain-demo-key"; // Ganti dengan cara yang lebih aman untuk produksi

function CredentialForm() {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editSite, setEditSite] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [account, setAccount] = useState("");
  const [showPasswordIndex, setShowPasswordIndex] = useState(null);

  // Ambil akun aktif dari MetaMask
  const fetchAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    }
  };

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const data = await contract.getCredentials();
      setCredentials(data);
    } catch (err) {
      console.error("Error fetching credentials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (account) fetchCredentials();
    // eslint-disable-next-line
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Enkripsi password sebelum dikirim ke blockchain
      const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
      const contract = await getContract();
      const tx = await contract.addCredential(site, encrypted);
      await tx.wait();
      fetchCredentials();
      setSite("");
      setPassword("");
    } catch (err) {
      console.error("Add credential failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditSite(credentials[index].site);
    // Dekripsi password untuk diedit
    try {
      const bytes = CryptoJS.AES.decrypt(credentials[index].encryptedPassword, SECRET_KEY);
      setEditPassword(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      setEditPassword("");
    }
  };

  const handleUpdate = async (index) => {
    try {
      setLoading(true);
      // Enkripsi password baru sebelum update
      const encrypted = CryptoJS.AES.encrypt(editPassword, SECRET_KEY).toString();
      const contract = await getContract();
      const tx = await contract.updateCredential(index, encrypted);
      await tx.wait();
      fetchCredentials();
      setEditIndex(null);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditSite("");
    setEditPassword("");
  };

  // Untuk menampilkan/dekripsi password pada credential tertentu
  const handleToggleShowPassword = (index) => {
    setShowPasswordIndex(showPasswordIndex === index ? null : index);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "40px auto",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      background: "#fff"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>🔐 PassChain Vault</h2>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        <b>Active Account:</b> {account ? account : "Not connected"}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          value={site}
          onChange={(e) => setSite(e.target.value)}
          placeholder="Site name"
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16
          }}
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Encrypted Password"
          type="password"
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Processing..." : "Add Credential"}
        </button>
      </form>
      <hr style={{ margin: "24px 0" }} />
      <h3 style={{ marginBottom: 12 }}>Semua Credential Akun Anda</h3>
      {loading && credentials.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>
      ) : credentials.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>No credentials found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {credentials.map((cred, index) => (
            <li
              key={index}
              style={{
                background: "#f3f4f6",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              {editIndex === index ? (
                <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={editSite}
                    disabled
                    style={{
                      padding: 6,
                      borderRadius: 4,
                      border: "1px solid #bbb",
                      fontSize: 14,
                      width: 120
                    }}
                  />
                  <input
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    style={{
                      padding: 6,
                      borderRadius: 4,
                      border: "1px solid #bbb",
                      fontSize: 14,
                      width: 180
                    }}
                  />
                  <button
                    onClick={() => handleUpdate(index)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#22c55e",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 13,
                      marginLeft: 8,
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 13,
                      marginLeft: 4,
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 15 }}>{cred.site}</div>
                    <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>
                      {/* Tampilkan password hanya jika showPasswordIndex === index */}
                      {showPasswordIndex === index
                        ? (() => {
                            try {
                              const bytes = CryptoJS.AES.decrypt(cred.encryptedPassword, SECRET_KEY);
                              return bytes.toString(CryptoJS.enc.Utf8);
                            } catch {
                              return "Failed to decrypt";
                            }
                          })()
                        : "••••••••••••••••••••••••"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() => handleToggleShowPassword(index)}
                      style={{
                        marginLeft: 8,
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "#6366f1",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 13,
                        cursor: loading ? "not-allowed" : "pointer"
                      }}
                      disabled={loading}
                    >
                      {showPasswordIndex === index ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => handleEdit(index)}
                      style={{
                        marginLeft: 8,
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: "#06b6d4",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 13,
                        cursor: loading ? "not-allowed" : "pointer"
                      }}
                      disabled={loading}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CredentialForm;