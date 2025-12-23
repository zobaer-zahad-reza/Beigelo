import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import { RiShoppingBag3Line, RiMoneyDollarCircleLine, RiUser3Line } from 'react-icons/ri';

// --- Mock Data (ব্যাকএন্ড কানেক্ট না হওয়া পর্যন্ত ডামি ডাটা) ---

// মাসিক বিক্রয় ডাটা (Graph এর জন্য)
const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
];

// ক্যাটাগরি ডাটা (Pie Chart এর জন্য - Watches, Caps, Atar)
const categoryData = [
    { name: 'Watches', value: 400 },
    { name: 'Caps', value: 300 },
    { name: 'Atar', value: 200 },
    { name: 'Accessories', value: 100 },
];

// পাই চার্টের কালার
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// সাম্প্রতিক অর্ডার ডাটা
const recentOrders = [
    { id: '#ORD-001', customer: 'Rahim Ahmed', product: 'Premium Leather Watch', amount: '৳120', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Karim Ullah', product: 'Black Snapback Cap', amount: '৳25', status: 'Pending' },
    { id: '#ORD-003', customer: 'Sumi Akter', product: 'Oud Al Misk (Atar)', amount: '৳45', status: 'Processing' },
    { id: '#ORD-004', customer: 'John Doe', product: 'Luxury Silver Watch', amount: '৳250', status: 'Delivered' },
];

// --- Components ---

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10 text-xl`}>
            {icon}
        </div>
    </div>
);

const DashboardHome = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-500 text-sm">Welcome back to Beigelo Admin Panel</p>
            </div>
            
            {/* 1. Key Performance Indicators (KPI Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value="৳12,450" 
                    icon={<RiMoneyDollarCircleLine className="text-green-600" />} 
                    color="bg-green-600"
                />
                <StatCard 
                    title="Total Orders" 
                    value="150" 
                    icon={<RiShoppingBag3Line className="text-blue-600" />} 
                    color="bg-blue-600"
                />
                <StatCard 
                    title="Active Users" 
                    value="1,240" 
                    icon={<RiUser3Line className="text-purple-600" />} 
                    color="bg-purple-600"
                />
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sales Graph */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Analytics (Monthly)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                                />
                                <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Category Distribution</h3>
                    <div className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                     <button className="text-blue-600 text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Order ID</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{order.id}</td>
                                    <td className="p-4 text-gray-600">{order.customer}</td>
                                    <td className="p-4 text-gray-600">{order.product}</td>
                                    <td className="p-4 font-bold text-gray-800">{order.amount}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                                            ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                            ${order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : ''}
                                        `}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;