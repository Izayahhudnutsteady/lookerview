'use client';

import { useState } from 'react';
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
  const [result, setResult] = useState<{
    message?: string;
    records_exported?: number;
    filename?: string;
    error?: string;
  } | null>(null);

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
              Export data from Looker views and send to Zapier
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            {/* View Selection */}
            <div>
              <label htmlFor="view" className="block text-sm font-medium text-gray-700">
                Select View
              </label>
              <select
                id="view"
                name="view"
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {views.map((view) => (
                  <option key={view.value} value={view.value}>
                    {view.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Limit Settings */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="noLimit"
                  name="noLimit"
                  type="checkbox"
                  checked={noLimit}
                  onChange={(e) => setNoLimit(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="noLimit" className="ml-2 block text-sm text-gray-700">
                  No record limit
                </label>
              </div>

              {!noLimit && (
                <div>
                  <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                    Record Limit
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="limit"
                      id="limit"
                      value={limit}
                      onChange={(e) => setLimit(parseInt(e.target.value) || 200)}
                      min={1}
                      max={10000}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    Export Data
                    <ArrowRight className="ml-2 h-4 w-4" />
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
                          <p>{result.message}</p>
                          {result.records_exported && (
                            <p>Records exported: {result.records_exported}</p>
                          )}
                          {result.filename && (
                            <p>File name: {result.filename}</p>
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