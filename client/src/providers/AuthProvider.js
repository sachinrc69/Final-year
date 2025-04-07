import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify"; // Importing Toastify
import { jwtDecode } from "jwt-decode";
const API_URL = process.env.REACT_APP_API_URL

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token')
        return storedToken ? JSON.parse(storedToken) : null
    })
    const [email, setEmail] = useState(() => {
        const storedEmail = localStorage.getItem('email')
        return storedEmail ? JSON.parse(storedEmail) : null
    })
    const [aadhar, setAadhar] = useState(() => {
        const storedAadhar = localStorage.getItem('aadhar')
        return storedAadhar ? JSON.parse(storedAadhar) : null
    })
    const [role, setRole] = useState(() => {
        const storedRole = localStorage.getItem('role')
        return storedRole ? JSON.parse(storedRole) : null
    })
    const navigate = useNavigate()



    const loginAction = async (data, role) => {
        if (role === "user") {
            try {
                console.log("Login action")
                console.log(data)
                const response = await axios.post(
                    "http://localhost:5000/api/users/login",
                    data
                );

                if (response.status === 200) {
                    toast.success("Login successful! Redirecting...", { autoClose: 2000 });
                    console.log(response.data)
                    setToken(response.data.token)
                    if (response.data.token) {
                        const decoded = jwtDecode(response.data.token);
                        console.log("Decoded Token Data:", decoded);
                        setAadhar(decoded.aadhar_no);
                        setRole(decoded.role);

                        localStorage.setItem("token", JSON.stringify(response.data.token));
                        localStorage.setItem("aadhar", JSON.stringify(decoded.aadhar_no));
                        localStorage.setItem("role", JSON.stringify(decoded.role));

                        setTimeout(() => {
                            navigate("/user_lobby");
                        }, 2000);
                    }
                    return
                } else {
                    toast.error(response.data.message || "Invalid email or password", {
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.log(error)
                if (error.response) {
                    toast.error(error.response.data.message || "Login failed", {
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Unable to connect to the server", { autoClose: 3000 });
                }
            }
        }
        else {
            try {
                console.log("Admin Login action")

                const response = await axios.post(
                    "http://localhost:5000/api/admin/login",
                    data
                );

                if (response.status === 200) {
                    toast.success("Login successful! Redirecting...", { autoClose: 2000 });
                    console.log(response.data)
                    setToken(response.data.token)
                    var decoded = {}
                    if (response.data.token) {
                        decoded = jwtDecode(response.data.token);
                        console.log("Decoded Token Data:", decoded);
                        setEmail(decoded.email)
                        setRole(decoded.role)
                    } else {
                        console.log("No token found");
                    }

                    localStorage.setItem('token', JSON.stringify(response.data.token))
                    localStorage.setItem('email', JSON.stringify(decoded.email))
                    localStorage.setItem('role', JSON.stringify(decoded.role))
                    // Wait for 3 seconds before navigating
                    setTimeout(() => {
                        navigate("/admin_panel");
                    }, 2000);
                    return
                } else {
                    toast.error(response.data.message || "Invalid email or password", {
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.log(error)
                if (error.response) {
                    toast.error(error.response.data.message || "Login failed", {
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Unable to connect to the server", { autoClose: 3000 });
                }
            }
        }
    }
    const logout = () => {
        // setUser(null)
        setToken(null)
        setAadhar(null)
        setRole(null)
        setEmail(null)

        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('aadhar')
        localStorage.removeItem('email')

    }

    return (
        <AuthContext.Provider value={{ token, role, aadhar, email, loginAction, logout }} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
