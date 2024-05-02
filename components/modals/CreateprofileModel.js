import Link from "next/link";

const CreateProfileModel = ({ onClose }) => (
  <div
    id="popup-modal"
    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
  >
    {/* Popup content */}
    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <button
        type="button"
        className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={onClose}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Close modal</span>
      </button>
      <div className="p-4 md:p-5 text-center">
        <svg
          className="mx-auto mb-4 text-green-500 dark:text-green-400 w-12 h-12"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h3 className="mb-5 text-lg font-normal text-green-500 dark:text-green-400">
          No profile found. Would you like to update your profile?
        </h3>
        <Link href="/edit-profile">
          <button
            type="button"
            className="text-accent-dark bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          >
            Yes, update my profile
          </button>
        </Link>
        <button
          onClick={onClose}
          type="button"
          className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          No, cancel
        </button>
      </div>
    </div>
  </div>
);

export default CreateProfileModel;
