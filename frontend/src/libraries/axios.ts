import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true
})

// TODO: take out interceptor before deployment
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("Server responded with an error:", error.response.data)
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response was received:", error.request)
    } else {
      // Something happened setting up the request
      console.error("Axios setup error:", error.message)
    }

    // Pass down error safely
    return Promise.reject(error)
  }
)

export default api