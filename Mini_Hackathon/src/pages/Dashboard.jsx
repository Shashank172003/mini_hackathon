import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [metrics, setMetrics] = useState({});
  const [chartData, setChartData] = useState([]);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("area");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const m = await api.get("/dashboard/metrics");
        const c = await api.get("/dashboard/chart");
        const t = await api.get("/dashboard/table");

        setMetrics(m.data);
        setChartData(c.data.months.map((month, i) => ({
          month,
          sales: c.data.sales[i],
          target: c.data.sales[i] * 1.2,
          growth: Math.random() * 100
        })));
        setTable(t.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTable = [...table].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredTable = sortedTable.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedTable = filteredTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTable.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'} transition-all duration-500`}>
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'}`}>
                  DataViz
                </span>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
              <svg className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard" },
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Analytics" },
              { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "Products" },
              { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", label: "Customers" },
              { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", label: "Settings" }
            ].map((item, i) => (
              <button key={i} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${i === 0 ? (darkMode ? 'bg-purple-600 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg') : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-purple-50')}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navigation */}
        <nav className={`sticky top-0 z-30 ${darkMode ? 'bg-gray-800' : 'bg-white/80'} backdrop-blur-xl shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'}`}>
                  Executive Dashboard
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Welcome back! Here's what's happening today.</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'}`}
                >
                  <svg className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={darkMode ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} />
                  </svg>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2.5 rounded-xl transition-all relative ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'}`}
                  >
                    <svg className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-4 border ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
                      <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                      {[
                        { msg: "New order received - $2,450", time: "2m ago", color: "green" },
                        { msg: "Low stock alert: Product XYZ", time: "15m ago", color: "yellow" },
                        { msg: "Monthly report generated", time: "1h ago", color: "blue" }
                      ].map((notif, i) => (
                        <div key={i} className={`p-3 rounded-lg mb-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'} transition-colors cursor-pointer`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 bg-${notif.color}-500`}></div>
                            <div className="flex-1">
                              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{notif.msg}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`flex items-center space-x-3 pl-3 border-l ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>John Doe</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    JD
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2.5 rounded-xl transition-all hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6 relative z-10">
          {/* Metric Cards with Advanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { 
                title: "Total Revenue", 
                value: `$${metrics.totalSales?.toLocaleString() || 0}`, 
                change: "+12.5%", 
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                gradient: "from-purple-500 to-pink-500",
                bgGlow: "bg-purple-500"
              },
              { 
                title: "Total Orders", 
                value: metrics.totalOrders?.toLocaleString() || 0, 
                change: "+8.2%", 
                icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
                gradient: "from-blue-500 to-cyan-500",
                bgGlow: "bg-blue-500"
              },
              { 
                title: "Inventory", 
                value: metrics.inventoryCount?.toLocaleString() || 0, 
                change: "-3.1%", 
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                gradient: "from-orange-500 to-red-500",
                bgGlow: "bg-orange-500"
              },
              { 
                title: "Conversion Rate", 
                value: "24.5%", 
                change: "+5.3%", 
                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                gradient: "from-green-500 to-emerald-500",
                bgGlow: "bg-green-500"
              }
            ].map((card, i) => (
              <div key={i} className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
                <div className={`absolute -right-8 -top-8 w-32 h-32 ${card.bgGlow} opacity-10 rounded-full filter blur-2xl`}></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${card.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {card.change}
                    </span>
                  </div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{card.title}</h3>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`} style={{width: `${65 + i * 10}%`}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Performance Analytics</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Real-time sales tracking & forecasting</p>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className={`px-4 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  
                  <div className={`flex ${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-xl p-1`}>
                    {['area', 'bar', 'line'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          chartType === type
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? "#1F2937" : "#fff", 
                          border: "none", 
                          borderRadius: "12px", 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                          color: darkMode ? "#fff" : "#000"
                        }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? "#1F2937" : "#fff", 
                          border: "none", 
                          borderRadius: "12px", 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                          color: darkMode ? "#fff" : "#000"
                        }}
                      />
                      <Bar dataKey="sales" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  ) : (
                    <LineChart data={chartData}>
                      <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? "#1F2937" : "#fff", 
                          border: "none", 
                          borderRadius: "12px", 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                          color: darkMode ? "#fff" : "#000"
                        }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={4} dot={{ fill: "#EC4899", r: 6 }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-500 to-pink-500'} rounded-2xl shadow-xl p-6 text-white`}>
                <h3 className="text-lg font-bold mb-4">Today's Highlights</h3>
                <div className="space-y-4">
                  {[
                    { label: "Active Users", value: "1,234", change: "+23" },
                    { label: "New Signups", value: "89", change: "+12" },
                    { label: "Avg. Order Value", value: "$142", change: "+8%" }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-80">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Top Categories</h3>
                <div className="space-y-3">
                  {[
                    { name: "Electronics", value: 45, color: "purple" },
                    { name: "Clothing", value: 30, color: "pink" },
                    { name: "Food", value: 15, color: "blue" },
                    { name: "Books", value: 10, color: "green" }
                  ].map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cat.name}</span>
                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cat.value}%</span>
                      </div>
                      <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div className={`h-full bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 rounded-full transition-all duration-500`} style={{width: `${cat.value}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Table */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-purple-100'}`}>
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Transactions</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Monitor all your latest activities</p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anything..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-12 pr-4 py-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-64 transition-all`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <button className={`p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'} rounded-xl transition-all`}>
                  <svg className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {['Date', 'Product', 'Category', 'Amount', 'Status'].map((header, i) => (
                      <th 
                        key={i}
                        onClick={() => handleSort(header.toLowerCase())}
                        className={`p-4 text-left text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer hover:bg-opacity-50 transition-all group`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{header}</span>
                          <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedTable.length > 0 ? (
                    paginatedTable.map((row, i) => (
                      <tr 
                        key={i} 
                        className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-purple-50'} transition-all cursor-pointer group`}
                      >
                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>{row.date}</span>
                          </div>
                        </td>
                        <td className={`p-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {row.product}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            darkMode ? 'bg-purple-900 text-purple-300' : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                          }`}>
                            {row.category}
                          </span>
                        </td>
                        <td className={`p-4 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          ${parseFloat(row.amount).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>No transactions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredTable.length > 0 && (
              <div className="flex flex-wrap justify-between items-center mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredTable.length)}</span> of <span className="font-bold">{filteredTable.length}</span> results
                </p>
                
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border ${darkMode ? 'border-gray-600 hover:bg-gray-700 disabled:bg-gray-800' : 'border-gray-300 hover:bg-gray-50 disabled:bg-gray-100'} rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-white' : 'text-gray-700'}`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg transition-all hover:shadow-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}