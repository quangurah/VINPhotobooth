const fs = require("fs");
const path = require("path");

const JOBS_DIR = path.join(__dirname, "jobs");

// Đảm bảo thư mục jobs/ tồn tại
if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

function getJobDir(jobId) {
  const cleanId = String(jobId || "unknown").replace(/[^a-zA-Z0-9_-]/g, "_");
  const jobPath = path.join(JOBS_DIR, cleanId);
  if (!fs.existsSync(jobPath)) {
    fs.mkdirSync(jobPath, { recursive: true });
  }
  return jobPath;
}

function initJob(jobId) {
  try {
    const jobDir = getJobDir(jobId);
    fs.writeFileSync(path.join(jobDir, "status.txt"), "RUNNING", "utf8");
    fs.writeFileSync(path.join(jobDir, "log.txt"), `--- Job ${jobId} initialized ---\n`, "utf8");
    fs.writeFileSync(path.join(jobDir, "llm_calls.json"), "[]", "utf8");
    fs.writeFileSync(path.join(jobDir, "api_calls.json"), "[]", "utf8");
    fs.writeFileSync(path.join(jobDir, "result.json"), "{}", "utf8");
    console.log(`[JobLogger] Initialized job log for ${jobId}`);
  } catch (e) {
    console.error(`[JobLogger] Failed to init job ${jobId}:`, e.message);
  }
}

function updateJobStatus(jobId, status) {
  try {
    const jobDir = getJobDir(jobId);
    fs.writeFileSync(path.join(jobDir, "status.txt"), status, "utf8");
    
    // Ghi cả vào status.json cho đồng bộ
    fs.writeFileSync(
      path.join(jobDir, "status.json"), 
      JSON.stringify({ jobId, status, updatedAt: new Date().toISOString() }, null, 2), 
      "utf8"
    );
  } catch (e) {
    console.error(`[JobLogger] Failed to update status for job ${jobId}:`, e.message);
  }
}

function logConsole(jobId, message) {
  try {
    const jobDir = getJobDir(jobId);
    const logPath = path.join(jobDir, "log.txt");
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`, "utf8");
  } catch (e) {
    console.error(`[JobLogger] Failed to append console log for job ${jobId}:`, e.message);
  }
}

function logLlmCall(jobId, prompt, response, tokens = {}) {
  try {
    const jobDir = getJobDir(jobId);
    const filePath = path.join(jobDir, "llm_calls.json");
    let calls = [];
    if (fs.existsSync(filePath)) {
      try {
        calls = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (err) {}
    }
    calls.push({
      timestamp: new Date().toISOString(),
      prompt,
      response,
      tokens
    });
    fs.writeFileSync(filePath, JSON.stringify(calls, null, 2), "utf8");
  } catch (e) {
    console.error(`[JobLogger] Failed to log LLM call for job ${jobId}:`, e.message);
  }
}

function logApiCall(jobId, apiName, request, response) {
  try {
    const jobDir = getJobDir(jobId);
    const filePath = path.join(jobDir, "api_calls.json");
    let calls = [];
    if (fs.existsSync(filePath)) {
      try {
        calls = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (err) {}
    }
    calls.push({
      timestamp: new Date().toISOString(),
      apiName,
      request,
      response
    });
    fs.writeFileSync(filePath, JSON.stringify(calls, null, 2), "utf8");
  } catch (e) {
    console.error(`[JobLogger] Failed to log API call for job ${jobId}:`, e.message);
  }
}

function saveJobResult(jobId, result) {
  try {
    const jobDir = getJobDir(jobId);
    fs.writeFileSync(
      path.join(jobDir, "result.json"), 
      JSON.stringify(result, null, 2), 
      "utf8"
    );
  } catch (e) {
    console.error(`[JobLogger] Failed to save result for job ${jobId}:`, e.message);
  }
}

function getJobLogs(jobId) {
  try {
    const jobDir = getJobDir(jobId);
    const logPath = path.join(jobDir, "log.txt");
    if (fs.existsSync(logPath)) {
      return fs.readFileSync(logPath, "utf8");
    }
  } catch (e) {
    console.error(`[JobLogger] Failed to read logs for job ${jobId}:`, e.message);
  }
  return "";
}

module.exports = {
  initJob,
  updateJobStatus,
  logConsole,
  logLlmCall,
  logApiCall,
  saveJobResult,
  getJobLogs
};
