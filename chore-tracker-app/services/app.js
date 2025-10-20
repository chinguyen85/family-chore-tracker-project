// Helper functions to communicate with Express backend
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

if (!BASE_URL) {
  console.error(
    "API URL is not defined. Please check your environment variables."
  );
}

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }
  return data;
};

// Call authentication endpoints
export const register = async ({ fullName, email, password, role }) => {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role }),
    });
    return handleResponse(response); // Return parsed JSON data
};

// login
export const login = async (email, password) => {
    console.log(' Attempting login to:', `${BASE_URL}/login`);
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Login fetch error:', error);
        throw error;
    }
};

export const forgotPassword = async (email, newPassword) => {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  return handleResponse(response);
};

// Call family management endpoints
const fetchWithAuth = async (endpoint, method = 'GET', token, body = null ) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
    const config = {
        method,
        headers,
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${BASE_URL}/family${endpoint}`, config);
    return handleResponse(response);
} // Helper to include auth token in requests

export const createFamily = async (familyName, token) => {
  const body = { familyName };
  return fetchWithAuth("/create", "POST", token, body);
};

export const joinFamily = async (inviteCode, token) => {
  const body = { inviteCode };
  return fetchWithAuth("/join", "POST", token, body);
};

export const getFamilyDetails = async (token) => {
  return fetchWithAuth("/", "GET", token);
};

export const getFamilyMembers = async (token) => {
  return fetchWithAuth("/members", "GET", token);
};

// create axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all family tasks
export const getAllTasks = async (token) => {
  try {
    const response = await api.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || "Get All Tasks Failed";
    console.error("Get All Tasks error:", { status, message, url: "/tasks" });
    throw new Error(message);
  }
};

// Get one user's tasks
export const getTaskByUser = async (token) => {
  try {
    const response = await api.get("/tasks/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || "Get My Tasks Failed";
    console.error("Get My Tasks error:", { status, message, url: "/tasks/my" });
    throw new Error(message);
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status, token) => {
  try {
    const response = await api.patch(
      `/tasks/status/${taskId}`,
      { status }, // body data
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const httpStatus = error.response?.status;
    const message = error.response?.data?.error || error.message || "Update status failed";
    console.error("Update Task Status error:", { httpStatus, message, url: `/tasks/status/${taskId}`, payload: { status } });
    throw new Error(message);
  }
};

// post a new task
export const postTask = async (taskData, token) => {
  try {
    // Debug outbound payload
    console.log("POST /tasks payload:", taskData);
    const response = await api.post("/tasks", taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || "Create task failed";
    console.error("Create task error:", { status, message, url: "/tasks", payload: taskData });
    throw new Error(message);
  }
};

// Call proof submit endpoint
const fetchWithFormAuth = async (endpoint, token, formData) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const config = {
        method: 'POST',
        headers,
        body: formData,
    };
    const response = await fetch(`${BASE_URL}/tasks${endpoint}`, config);
    return handleResponse(response);
} // Helper to include auth token for Task endpoints request

export const submitProof = async (formData, token) => {
    return fetchWithFormAuth('/proof', token, formData);
}
