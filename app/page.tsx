'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function LookerExportPage() {
  // Updated Looker views from your list
  const views = [
    { value: 'fact_fenix_user_consult', label: 'Fenix User Consult' },
    { value: 'fact_consult', label: 'Consult' },
    { value: 'fact_clinician_calendar_qtr_hr', label: 'Clinician Calendar Quarter Hour' }
  ];

  // Form state
  const [selectedView, setSelectedView] = useState(views[0].value);
  const [limit, setLimit] = useState(200);
  const [noLimit, setNoLimit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [infiniteRange, setInfiniteRange] = useState(true);
  const [result, setResult] = useState<{
    message?: string;
    records_exported?: number;
    filename?: string;
    error?: string;
    sheet_url?: string;
  } | null>(null);

  // Set default start date to 7 days ago when component mounts
  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/fetch_and_send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          explore: selectedView,
          limit: limit,
          noLimit: noLimit,
          startDate: startDate,
          endDate: infiniteRange ? '9999-12-31' : endDate,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to connect to server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Looker Data Export
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Export data from Looker views to Google Sheets
            </p>
            <a 
              href="https://docs.google.com/spreadsheets/d/1ELA4sOTPm0MKQzxnl0-hXhyBfwk0s2r09RDfraO84DA/edit?gid=0#gid=0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View Google Sheet
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            {/* View Selection */}
            <div>
              <label htmlFor="view" className="block text-sm font-medium text-gray-900 mb-1">
                Select View
              </label>
              <select
                id="view"
                name="view"
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white text-gray-900"
              >
                {views.map((view) => (
                  <option key={view.value} value={view.value} className="text-gray-900">
                    {view.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-4">
              <div className="flex flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-900 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-3 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white text-gray-900"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 mb-1">
                    End Date
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={infiniteRange}
                      className={`mt-1 block w-40 pl-3 pr-3 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm ${
                        infiniteRange ? 'bg-gray-100' : 'bg-white'
                      } text-gray-900`}
                      placeholder="YYYY-MM-DD"
                    />
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="infiniteRange"
                          name="infiniteRange"
                          checked={infiniteRange}
                          onChange={(e) => setInfiniteRange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-2 text-sm text-gray-900 whitespace-nowrap">No end date</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Limit Settings */}
            <div className="space-y-4">
              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-900 mb-1">
                  Record Limit
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="limit"
                    id="limit"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 200)}
                    min={1}
                    max={10000}
                    disabled={noLimit}
                    className={`block w-32 pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm ${
                      noLimit ? 'bg-gray-100' : 'bg-white'
                    } text-gray-900`}
                  />
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="noLimit"
                        name="noLimit"
                        checked={noLimit}
                        onChange={(e) => setNoLimit(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-900 whitespace-nowrap">No limit</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    <span className="text-white">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">Export Data</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="px-6 py-5 border-t border-gray-200">
              <div className={`rounded-md p-4 ${result.error ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {result.error ? (
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${result.error ? 'text-red-800' : 'text-green-800'}`}>
                      {result.error ? 'Error' : 'Success'}
                    </h3>
                    <div className={`mt-2 text-sm ${result.error ? 'text-red-700' : 'text-green-700'}`}>
                      {result.error ? (
                        <p>{result.error}</p>
                      ) : (
                        <div className="space-y-1">
                          <p>Data successfully exported. Please wait 30 seconds for the data to show up in the Google Sheet.</p>
                          {result.records_exported && (
                            <p>Records exported: {result.records_exported}</p>
                          )}
                          {result.sheet_url && (
                            <a 
                              href={result.sheet_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View Google Sheet
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}