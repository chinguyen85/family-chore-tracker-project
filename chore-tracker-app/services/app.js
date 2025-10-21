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

// Get all family tasks
export const getAllTasks = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    const message = error.message || "Get All Tasks Failed";
    console.error("Get All Tasks error:", { message, url: "/tasks" });
    throw new Error(message);
  }
};

// Get one user's tasks
export const getTaskByUser = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    const message = error.message || "Get My Tasks Failed";
    console.error("Get My Tasks error:", { message, url: "/tasks/my" });
    throw new Error(message);
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status, token) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/status/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  } catch (error) {
    const message = error.message || "Update status failed";
    console.error("Update Task Status error:", { message, url: `/tasks/status/${taskId}`, payload: { status } });
    throw new Error(message);
  }
};

// post a new task
export const postTask = async (taskData, token) => {
  try {
    // Debug outbound payload
    console.log("POST /tasks payload:", taskData);
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  } catch (error) {
    const message = error.message || "Ceate task failed";
    console.error("Create task error:", { message, url: "/tasks", payload: taskData });
    throw new Error(message);
  }
}

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

// delete a task
export const deleteTask = async (taskId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // DELETE may return 204 with no body
    if (response.status === 204) {
      return { success: true };
    }
    return handleResponse(response);
  } catch (error) {
    const message = error.message || 'Delete task failed';
    console.error('Delete task error:', { message, url: `/tasks/${taskId}` });
    throw new Error(message);
  }
}
