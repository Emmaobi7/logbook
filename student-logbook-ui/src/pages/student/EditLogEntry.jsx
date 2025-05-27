import { useState } from 'react';

const EditLogModal = ({ log, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

  // Open modal and initialize form data
  const openModal = () => {
    setFormData({
      id: log._id,
      date: log.date,
      title: log.title,
      description: log.content,
    //   status: log.status,
      // ... other log fields
    });
    setIsOpen(true);
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSave(formData);  // Wait for save to complete
      setIsOpen(false);        // Only close on success
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      {/* Button to trigger modal - now part of the component */}
      <button
        type="button"
        disabled={log.status !== 'rejected'}
        className="p-2 rounded text-black bg-blue-600 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        onClick={openModal}
      >
        Edit log
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Edit Log</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Activity</label>
                <textarea
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Competencies Aquired</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div> */}

              <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                    disabled={isSubmitting}
                    >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center min-w-24"
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditLogModal;