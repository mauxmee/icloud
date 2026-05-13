import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lock, Sun, RefreshCw } from 'lucide-react';

const App = () => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null); // State to hold summary data for cards
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/sync', creds);
      if (res.data.data && res.data.data.length > 0) {
        setSummary(res.data.data[0]); // Assuming we display data for the first station
      }
      const analysisRes = await axios.get('http://localhost:8000/analysis');
      setData(analysisRes.data);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Failed to sync with iSolarCloud. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Sun className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">iSolarCloud Analysis</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md mt-1"
                value={creds.email}
                onChange={e => setCreds({...creds, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md mt-1"
                value={creds.password}
                onChange={e => setCreds({...creds, password: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin mr-2" /> : <Lock className="mr-2" />}
              Sync Inverter Data
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Energy Dashboard</h1>
          <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
            System Online (Australia)
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Daily Generation</p>
            <h2 className="text-2xl font-bold">{summary?.daily_yield ?? '--'} kWh</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Monthly Total</p>
            <h2 className="text-2xl font-bold">{summary?.monthly_yield ?? '--'} kWh</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Current Output</p>
            <h2 className="text-2xl font-bold text-yellow-600">{summary?.current_power ?? '--'} kW</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-semibold mb-4">Daily Yield Analysis {summary?.station_name ? `- ${summary.station_name}` : ''}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default App;