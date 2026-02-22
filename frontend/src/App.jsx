import { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [status, setStatus] = useState("");

  const fetchInfo = async () => {
    setStatus("Fetching info...");
    setVideoInfo(null);

    const res = await fetch("http://localhost:5000/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (res.ok) {
      setVideoInfo(data);
      setStatus("Select quality and download");
    } else {
      setStatus(data.error);
    }
  };

  const download = async () => {
    if (!selectedFormat) return alert("Select format");

    setStatus("Downloading...");

    const res = await fetch("http://localhost:5000/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        format_id: selectedFormat
      })
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("Download complete 🔥");
    } else {
      setStatus(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SneekSave</h1>

      <input
        type="text"
        placeholder="Paste video URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />

      <button onClick={fetchInfo} style={styles.button}>
        Fetch Info
      </button>

      {videoInfo && (
        <div style={styles.card}>
          <h3>{videoInfo.title}</h3>
          <img
            src={videoInfo.thumbnail}
            alt="thumbnail"
            style={{ width: "300px", marginBottom: "10px" }}
          />

          <select
            style={styles.select}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">Select Resolution</option>
            {videoInfo.formats.map((f) => (
              <option key={f.format_id} value={f.format_id}>
                {f.resolution} ({f.ext})
              </option>
            ))}
          </select>

          <button onClick={download} style={styles.downloadBtn}>
            Download
          </button>
        </div>
      )}

      <p style={styles.status}>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "60px",
    fontFamily: "monospace"
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px"
  },
  input: {
    width: "400px",
    padding: "12px",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#fff",
    marginBottom: "10px"
  },
  button: {
    padding: "10px 20px",
    marginBottom: "20px",
    background: "#00ff99",
    border: "none",
    cursor: "pointer"
  },
  card: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center"
  },
  select: {
    padding: "10px",
    marginBottom: "10px",
    background: "#111",
    color: "#fff"
  },
  downloadBtn: {
    padding: "10px 20px",
    background: "#ff0077",
    border: "none",
    cursor: "pointer"
  },
  status: {
    marginTop: "20px",
    color: "#00ff99"
  }
};
