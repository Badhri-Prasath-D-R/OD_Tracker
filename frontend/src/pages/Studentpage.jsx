import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  PlusCircle, 
  History, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  MapPin,
  FileText,
  GraduationCap,
  Loader2,
  AlertCircle,
  Eye,
  RefreshCw,
  LogOut,
  Download,
  Filter,
  Search,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";

export default function Studentpage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apply");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    student_email: "",
    name: "",
    dept_name: "",
    roll_no: "",
    section: "",
    reason: "",
    venue: "",
    description: ""
  });

  const [odRequests, setOdRequests] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Load student info from localStorage on component mount
  useEffect(() => {
    const savedStudent = localStorage.getItem('studentInfo');
    const savedEmail = localStorage.getItem('studentEmail');
    
    if (savedStudent && savedEmail) {
      setIsLoggedIn(true);
      setStudentEmail(savedEmail);
      setFormData(prev => ({
        ...prev,
        student_email: savedEmail
      }));
    }
  }, []);

  // Auto-refresh OD requests every 30 seconds
  useEffect(() => {
    let interval;
    if (isLoggedIn && activeTab === "history" && studentEmail) {
      fetchStudentODs();
      interval = setInterval(fetchStudentODs, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, isLoggedIn, studentEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.login(studentEmail);
      setIsLoggedIn(true);
      localStorage.setItem('studentEmail', studentEmail);
      
      const namePart = studentEmail.split('@')[0];
      const name = namePart.split('.')[0];
      const dept = namePart.split('.')[1].replace(/\d+/g, '');
      
      setFormData(prev => ({
        ...prev,
        student_email: studentEmail,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        dept_name: dept.toUpperCase()
      }));
      
    } catch (error) {
      alert(error.message || "Login failed. Please check your email format.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      const odData = {
        ...formData,
        student_email: studentEmail,
        applied_at: new Date().toISOString()
      };
      
      await api.submitODRequest(odData);
      alert("✅ OD Request Submitted Successfully!");
      
      setActiveTab("history");
      await fetchStudentODs();
      
      setFormData(prev => ({
        ...prev,
        roll_no: "",
        section: "",
        reason: "",
        venue: "",
        description: ""
      }));
      
    } catch (error) {
      alert(error.message || "Failed to submit OD request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentODs = async () => {
    if (!studentEmail) return;
    
    try {
      setIsLoading(true);
      const data = await api.getStudentODsByEmail(studentEmail);
      setOdRequests(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching ODs:", error);
      setOdRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentEmail("");
    setOdRequests([]);
    localStorage.removeItem('studentEmail');
  };

  // Filter and sort requests
  const filteredRequests = odRequests
    .filter(request => {
      const matchesSearch = 
        request.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "date-desc": return new Date(b.applied_at || b.date) - new Date(a.applied_at || a.date);
        case "date-asc": return new Date(a.applied_at || a.date) - new Date(b.applied_at || b.date);
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

  const stats = {
    total: odRequests.length,
    approved: odRequests.filter(req => req.status === 'approved').length,
    pending: odRequests.filter(req => req.status === 'pending').length,
    rejected: odRequests.filter(req => req.status === 'rejected').length
  };

  const exportToPDF = () => {
    alert("Exporting your OD history...");
    // Implement PDF export logic here
  };

  const departmentOptions = [
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "ECE", label: "Electronics & Communication" },
    { value: "EEE", label: "Electrical & Electronics" },
    { value: "MECH", label: "Mechanical Engineering" },
    { value: "CIVIL", label: "Civil Engineering" },
    { value: "IT", label: "Information Technology" }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "status", label: "By Status" }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <GraduationCap className="text-blue-400" />
              Student Portal
            </h1>
            <div className="w-32"></div>
          </div>

          {/* Login Card */}
          <div className="max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                  <GraduationCap className="text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold">Student Login</h2>
                <p className="text-gray-400 mt-2">Access your OD management portal</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    College Email Address
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="name.departmentYEAR@citchennai.net"
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Format: name.departmentYEAR@citchennai.net
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : null}
                  {isLoading ? "Signing in..." : "Sign in to Portal"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Home</span>
              </button>
              <div className="flex items-center gap-2">
                <GraduationCap className="text-blue-400" size={24} />
                <div>
                  <h1 className="font-bold text-lg">Student Portal</h1>
                  <p className="text-xs text-gray-400">{studentEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === "apply" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <PlusCircle size={20} />
            New Application
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === "history" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <History size={20} />
            Request History
            {stats.total > 0 && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-500/30">
                {stats.total}
              </span>
            )}
          </button>
        </div>

        {/* Apply Form */}
        <AnimatePresence mode="wait">
          {activeTab === "apply" && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <PlusCircle className="text-blue-400" />
                    New OD Application
                  </h2>
                  <p className="text-gray-400">Fill out the form below to submit your OD request</p>
                </div>
                <button
                  onClick={() => setActiveTab("history")}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View History →
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <Dropdown
                      options={departmentOptions}
                      value={formData.dept_name}
                      onChange={(value) => setFormData({...formData, dept_name: value})}
                      placeholder="Select Department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="roll_no"
                      value={formData.roll_no}
                      onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Venue
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({...formData, venue: e.target.value})}
                        placeholder="e.g., IIT Madras, Chennai"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reason for OD
                    </label>
                    <input
                      type="text"
                      name="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="e.g., Technical Symposium, Sports Event, Conference"
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        placeholder="Provide detailed description of the event and your participation..."
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        roll_no: "",
                        section: "",
                        reason: "",
                        venue: "",
                        description: ""
                      });
                    }}
                    className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium flex items-center gap-2"
                  >
                    <PlusCircle size={20} />
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <BarChart3 className="text-blue-400" size={24} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-300">Pending</p>
                      <p className="text-2xl font-bold text-yellow-300">{stats.pending}</p>
                    </div>
                    <Clock className="text-yellow-400" size={24} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-300">Approved</p>
                      <p className="text-2xl font-bold text-green-300">{stats.approved}</p>
                    </div>
                    <CheckCircle className="text-green-400" size={24} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-300">Rejected</p>
                      <p className="text-2xl font-bold text-red-300">{stats.rejected}</p>
                    </div>
                    <XCircle className="text-red-400" size={24} />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex gap-2">
                  <Dropdown
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-40"
                  />
                  <Dropdown
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-40"
                  />
                </div>
              </div>

              {/* Request List */}
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400">No OD requests found</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                              request.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {request.status.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar size={14} />
                              {new Date(request.applied_at || request.date).toLocaleDateString()}
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-1">{request.venue}</h3>
                          <p className="text-gray-300">{request.reason}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={fetchStudentODs}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title="Refresh"
                          >
                            <RefreshCw size={18} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-4">
                        {request.description}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">
                          Request ID: {request._id?.substring(0, 8)}...
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === 'approved' && (
                            <CheckCircle className="text-green-400" size={16} />
                          )}
                          {request.status === 'rejected' && (
                            <XCircle className="text-red-400" size={16} />
                          )}
                          {request.status === 'pending' && (
                            <Clock className="text-yellow-400" size={16} />
                          )}
                          <span>
                            {request.status === 'approved' ? 'Approved' : 
                             request.status === 'rejected' ? 'Rejected' : 
                             'Pending Review'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Auto-refresh indicator */}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Auto-refresh enabled (every 30s)
                </div>
                {lastUpdated && (
                  <span>Last updated: {lastUpdated}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm OD Submission"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-400 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-blue-300">Please review your application</p>
                <p className="text-sm text-blue-200/80 mt-1">
                  Once submitted, your OD request will be sent for faculty review. 
                  You cannot edit the request after submission.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Department:</span>
              <span className="font-medium">{formData.dept_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Roll No:</span>
              <span className="font-medium">{formData.roll_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reason:</span>
              <span className="font-medium">{formData.reason}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmSubmit}
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : null}
              {isLoading ? 'Submitting...' : 'Confirm & Submit'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}