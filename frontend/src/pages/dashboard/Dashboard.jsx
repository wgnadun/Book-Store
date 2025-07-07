import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md'; 
import { FiTrendingUp, FiShoppingBag, FiClock, FiUsers } from 'react-icons/fi';
import { FaBox, FaChartLine, FaFilter, FaSearch } from 'react-icons/fa';
import RevenueChart from './RevenueChart';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div className="flex justify-between items-center p-4 mx-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-800 text-gray-300 py-2 pl-10 pr-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" 
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition duration-200">
              <span className="font-bold text-white">A</span>
            </div>
          </div>
        </div>
        <div className="flex px-4 -mb-px">
          {['overview'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors duration-200 ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-400' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <motion.section 
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Products Card */}
          <motion.div 
            variants={fadeInUp}
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group hover:shadow-blue-900/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            <div className="flex p-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-indigo-600 to-blue-800 text-white rounded-lg p-4 mr-4 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                <FaBox className="size-6" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-2xl font-bold text-white">{data?.totalBooks || 0}</span>
                <span className="block text-sm text-gray-400 font-medium">Products</span>
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="flex items-center">
                <span className="text-xs text-emerald-400 font-semibold">+4.5%</span>
                <span className="ml-2 text-xs text-gray-500">vs last week</span>
              </div>
            </div>
          </motion.div>

          {/* Total Sales Card */}
          <motion.div 
            variants={fadeInUp}
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group hover:shadow-green-900/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
            <div className="flex p-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-emerald-600 to-green-800 text-white rounded-lg p-4 mr-4 shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                <FaChartLine className="size-6" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-2xl font-bold text-white">${data?.totalSales || 0}</span>
                <span className="block text-sm text-gray-400 font-medium">Total Sales</span>
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="flex items-center">
                <span className="text-xs text-emerald-400 font-semibold">+12.3%</span>
                <span className="ml-2 text-xs text-gray-500">vs last month</span>
              </div>
            </div>
          </motion.div>

          {/* Trending Books Card */}
          <motion.div 
            variants={fadeInUp}
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group hover:shadow-rose-900/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>
            <div className="flex p-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-rose-600 to-pink-800 text-white rounded-lg p-4 mr-4 shadow-lg group-hover:shadow-rose-500/30 transition-all duration-300">
                <FiTrendingUp className="size-6" />
              </div>
              <div className="flex flex-col justify-center">
                <div>
                  <span className="inline-block text-2xl font-bold text-white">{data?.trendingBooks || 0}</span>
                  <span className="inline-block ml-2 text-xs font-semibold bg-rose-900/50 text-rose-300 px-2 py-1 rounded">+13%</span>
                </div>
                <span className="block text-sm text-gray-400 font-medium">Trending Books</span>
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="flex items-center">
                <span className="text-xs text-rose-400 font-semibold">Featured</span>
                <span className="ml-2 text-xs text-gray-500">This Month</span>
              </div>
            </div>
          </motion.div>

          {/* Total Orders Card */}
          <motion.div 
            variants={fadeInUp}
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group hover:shadow-blue-900/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="flex p-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-cyan-800 text-white rounded-lg p-4 mr-4 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                <FiShoppingBag className="size-6" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-2xl font-bold text-white">{data?.totalOrders || 0}</span>
                <span className="block text-sm text-gray-400 font-medium">Total Orders</span>
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="flex items-center">
                <span className="text-xs text-cyan-400 font-semibold">+7.2%</span>
                <span className="ml-2 text-xs text-gray-500">vs last week</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Charts and tables section */}
        <motion.section 
          className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6 mt-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Monthly Orders Chart */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col md:col-span-2 md:row-span-2 bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
          >
            <div className="flex justify-between items-center px-6 py-4 font-semibold text-lg text-gray-200 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
              <span>Monthly Order Statistics</span>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                  <FaFilter size={16} />
                </button>
                <select className="bg-gray-700 text-gray-300 text-sm rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 px-2">
                  <option>Last 30 Days</option>
                  <option>Last 60 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
            </div>
            <div className="p-6 flex-grow bg-gray-800/50">
              <div className="h-full rounded-lg overflow-hidden">
                <RevenueChart />
              </div>
            </div>
          </motion.div>
          
          {/* Orders Left Card */}
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-amber-900/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex p-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-amber-500 to-yellow-700 text-white rounded-lg p-4 mr-4 shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                <FiClock className="size-6" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-2xl font-bold text-white">02</span>
                <span className="block text-sm text-gray-400 font-medium">Orders Pending</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mx-6">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-600 h-full w-1/4 relative">
                <div className="absolute top-0 right-0 h-full w-1 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="px-6 pb-4 pt-2">
              <span className="text-xs text-gray-400">25% Complete</span>
            </div>
          </motion.div>
          
          {/* Website Visits Card */}
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-teal-900/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex p-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-teal-500 to-cyan-700 text-white rounded-lg p-4 mr-4 shadow-lg">
                <FiUsers className="size-6" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-2xl font-bold text-white">139</span>
                <span className="block text-sm text-gray-400 font-medium">Website Visits (Last 24h)</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mx-6">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-600 h-full w-3/4 relative">
                <div className="absolute top-0 right-0 h-full w-1 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="px-6 pb-4 pt-2">
              <span className="text-xs text-gray-400">75% Increase from yesterday</span>
            </div>
          </motion.div>
          
          {/* Users by Average Order */}
          <motion.div 
            variants={fadeInUp}
            className="row-span-3 bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
          >
            <div className="flex items-center justify-between px-6 py-4 font-semibold text-lg text-gray-200 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
              <span>Users by Average Order</span>
              <div className="relative">
                <button type="button" className="inline-flex items-center px-3 py-1 bg-gray-700 border border-gray-600 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors">
                  Descending
                  <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '24rem' }}>
              <ul className="p-4 space-y-3">
                {[
                  { name: "Annette Watson", img: "/api/placeholder/40/40", score: 9.3 },
                  { name: "Calvin Steward", img: "/api/placeholder/40/40", score: 8.9 },
                  { name: "Ralph Richards", img: "/api/placeholder/40/40", score: 8.7 },
                  { name: "Bernard Murphy", img: "/api/placeholder/40/40", score: 8.2 },
                  { name: "Arlene Robertson", img: "/api/placeholder/40/40", score: 8.2 },
                  { name: "Jane Lane", img: "/api/placeholder/40/40", score: 8.1 },
                  { name: "Pat Mckinney", img: "/api/placeholder/40/40", score: 7.9 },
                  { name: "Norman Walters", img: "/api/placeholder/40/40", score: 7.7 }
                ].map((user, idx) => (
                  <li key={idx} className="flex items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 cursor-pointer group">
                    <div className="h-12 w-12 mr-4 rounded-full overflow-hidden shadow-md border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-200">
                      <img src={user.img} alt={`${user.name} profile picture`} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-gray-300 font-medium">{user.name}</span>
                    <span className="ml-auto text-sm font-bold bg-gray-700 text-blue-300 py-1 px-3 rounded-full group-hover:bg-blue-600/30 transition-colors duration-200">{user.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Students by Type Chart */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col row-span-3 bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
          >
            <div className="px-6 py-4 font-semibold text-lg text-gray-200 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
              Students by Type of Studying
            </div>
            <div className="p-6 flex-grow flex items-center justify-center">
              <div className="w-full h-64 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl"></div>
                <div className="text-center relative z-10">
                  <div className="text-6xl text-indigo-300 mb-4">📊</div>
                  <p className="text-gray-400 font-medium">Chart Coming Soon</p>
                  <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                    Explore Data
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
        
        {/* Footer section */}
        <section className="mt-6 flex justify-between items-center text-gray-500 border-t border-gray-800 pt-4">
          <p className="text-sm">© 2025 Dashboard. All rights reserved.</p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;