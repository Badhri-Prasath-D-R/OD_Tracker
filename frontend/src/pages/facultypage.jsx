import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  Download,
  Loader2,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Facultypage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [odRequests, setOdRequests] = useState([]);

  // Check if faculty is already logged in
  useEffect(() => {
    const facultyLoggedIn = localStorage.getItem("facultyLoggedIn");
    if (facultyLoggedIn === "true") {
      setIsLoggedIn(true);
      fetchAllODs();
    }
  }, []);

  const fetchAllODs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/od/all");
      if (!response.ok) {
        throw new Error("Failed to fetch OD requests");
      }
      const data = await response.json();
      setOdRequests(data);
    } catch (error) {
      console.error("Error fetching ODs:", error);
      alert("Failed to fetch OD requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/od/auth/faculty-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }
      
      const data = await response.json();
      
      // Only allow if password is "admin123"
      if (loginData.password === "admin123") {
        setIsLoggedIn(true);
        localStorage.setItem("facultyLoggedIn", "true");
        localStorage.setItem("facultyUsername", loginData.username);
        fetchAllODs();
      } else {
        throw new Error("Invalid credentials");
      }
      
    } catch (error) {
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLoading(false);
    setSelectedRequest(null);
    setLoginData({ username: "", password: "" });
    localStorage.removeItem("facultyLoggedIn");
    localStorage.removeItem("facultyUsername");
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this request?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/od/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Status update failed");
      }
      
      // Update local state
      setOdRequests(prev => 
        prev.map(request => 
          request._id === id ? { ...request, status: newStatus } : request
        )
      );
      
      if (selectedRequest?._id === id) {
        setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      }
      
      alert(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (error) {
      alert(error.message || "Failed to update status.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = odRequests.filter(request => {
    const matchesSearch = 
      (request.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.roll_no?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.student_email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.reason?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || (request.status === filterStatus);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusCount = (status) => {
    return odRequests.filter(req => req.status === status).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const exportToExcel = () => {
    // Simple CSV export implementation
    const headers = ['Name', 'Email', 'Roll No', 'Department', 'Section', 'Reason', 'Venue', 'Description', 'Status', 'Applied Date'];
    const csvData = [
      headers.join(','),
      ...odRequests.map(req => [
        `"${req.name || ''}"`,
        `"${req.student_email || ''}"`,
        `"${req.roll_no || ''}"`,
        `"${req.dept_name || ''}"`,
        `"${req.section || ''}"`,
        `"${req.reason || ''}"`,
        `"${req.venue || ''}"`,
        `"${req.description || ''}"`,
        `"${req.status || ''}"`,
        `"${req.applied_at ? new Date(req.applied_at).toLocaleDateString() : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `od-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert("Data exported successfully!");
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShieldCheck className="text-purple-400" />
                Faculty Portal - Admin Access
              </h1>
              <p className="text-gray-400">Restricted access for faculty members only</p>
            </div>
            
            <div className="w-32"></div>
          </motion.div>

          {/* Faculty Login Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-20 p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-purple-500/20 mb-4">
                <ShieldCheck className="text-purple-400" size={48} />
              </div>
              <h2 className="text-2xl font-bold">Faculty Login</h2>
              <p className="text-gray-400 mt-2">Enter admin credentials to access the portal</p>
            </div>
            
            <form onSubmit={handleFacultyLogin}>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Enter admin username"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Hint: Password is "admin123"
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Authenticating...
                  </>
                ) : (
                  "Login to Faculty Portal"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Faculty Dashboard
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <Loader2 className="animate-spin text-purple-500" size={48} />
            <p className="text-white mt-4">Processing...</p>
          </div>
        )}

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShieldCheck className="text-purple-400" />
                Faculty Portal
              </h1>
              <p className="text-gray-400">Review and manage OD requests</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="font-medium">{localStorage.getItem("facultyUsername") || "Admin"}</p>
              <p className="text-sm text-gray-400">Faculty Account</p>
            </div>
            
            <button
              onClick={fetchAllODs}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            
            <button
              onClick={exportToExcel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={20} />
              Export
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Requests</p>
                <p className="text-3xl font-bold">{odRequests.length}</p>
              </div>
              <AlertCircle className="text-blue-400" size={32} />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{getStatusCount('pending')}</p>
              </div>
              <Clock className="text-yellow-400" size={32} />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Approved</p>
                <p className="text-3xl font-bold text-green-400">{getStatusCount('approved')}</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Rejected</p>
                <p className="text-3xl font-bold text-red-400">{getStatusCount('rejected')}</p>
              </div>
              <XCircle className="text-red-400" size={32} />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, email, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                filterStatus === "all" 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600" 
                  : "bg-gray-800/50 hover:bg-gray-800"
              }`}
            >
              <Filter size={20} />
              All ({odRequests.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                filterStatus === "pending" 
                  ? "bg-gradient-to-r from-yellow-600 to-amber-600" 
                  : "bg-gray-800/50 hover:bg-gray-800"
              }`}
            >
              <Clock size={20} />
              Pending ({getStatusCount('pending')})
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Requests List */}
          <div className={`lg:w-2/3 ${selectedRequest ? 'lg:w-1/2' : 'w-full'}`}>
            <h2 className="text-xl font-bold mb-4">
              OD Requests ({filteredRequests.length})
              {searchTerm && (
                <span className="text-sm text-gray-400 ml-2">
                  filtered by "{searchTerm}"
                </span>
              )}
            </h2>
            
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">No OD requests found</p>
                <p className="text-sm">Try changing your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedRequest(request)}
                    className={`p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border cursor-pointer transition-all ${
                      selectedRequest?._id === request._id 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          {request.name || "N/A"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {request.roll_no || "N/A"} • {request.dept_name || "N/A"} • {request.section || "N/A"}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                        request.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {request.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-gray-300 font-medium">{request.reason || "No reason provided"}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        <span className="font-medium">Venue:</span> {request.venue || "N/A"}
                      </p>
                    </div>
                    
                    <p className="text-gray-500 text-sm truncate mb-3">
                      {request.description || "No description provided"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail size={14} />
                        <span className="truncate max-w-[200px]">{request.student_email || "N/A"}</span>
                      </div>
                      <div className="text-gray-400">
                        {formatDate(request.applied_at)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Request Details */}
          {selectedRequest && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2"
            >
              <div className="sticky top-4 p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Student Info */}
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <User className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{selectedRequest.name || "N/A"}</h3>
                        <p className="text-gray-400">{selectedRequest.student_email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Roll Number</p>
                        <p className="font-medium">{selectedRequest.roll_no || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Department</p>
                        <p className="font-medium">{selectedRequest.dept_name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Section</p>
                        <p className="font-medium">{selectedRequest.section || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Applied On</p>
                        <p className="font-medium">{formatDate(selectedRequest.applied_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <BookOpen size={20} />
                      OD Request Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">Reason for OD</p>
                        <p className="font-medium p-3 rounded bg-gray-800/50 mt-1">
                          {selectedRequest.reason || "No reason provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Venue</p>
                        <p className="font-medium p-3 rounded bg-gray-800/50 mt-1">
                          {selectedRequest.venue || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Description</p>
                        <p className="font-medium text-gray-300 p-3 rounded bg-gray-800/50 mt-1 whitespace-pre-wrap">
                          {selectedRequest.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <h4 className="font-bold mb-3">Current Status</h4>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      selectedRequest.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                      selectedRequest.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {selectedRequest.status === 'approved' ? <CheckCircle size={20} /> :
                       selectedRequest.status === 'rejected' ? <XCircle size={20} /> :
                       <Clock size={20} />}
                      <span className="font-bold">
                        {selectedRequest.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <h4 className="font-bold mb-3">Update Status</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest._id, 'approved')}
                        disabled={selectedRequest.status === 'approved' || isLoading}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                          selectedRequest.status === 'approved'
                            ? 'bg-green-600/30 text-green-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <CheckCircle size={20} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')}
                        disabled={selectedRequest.status === 'rejected' || isLoading}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                          selectedRequest.status === 'rejected'
                            ? 'bg-red-600/30 text-red-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      Clicking "Approve" or "Reject" will immediately update the student's request status.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}