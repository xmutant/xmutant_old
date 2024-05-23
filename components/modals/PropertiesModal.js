/* eslint-disable react/no-unescaped-entities */
export default function PropertiesModal({ setShowPropertiesPopup }) {
  return (
    <div class="flex items-start justify-center bg-[#0D102D]/90 h-full w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-auto z-[99999999]">
      <div class="fade rounded-[15px] shadow-[0_0_10px_#00000080] opacity-100 overflow-hidden relative transform scale-100 transition-all duration-300 ease-in-out w-[40em] top-24">
        <div className="dark:bg-[#131740] bg-white">
          <div>
            <div className="modal-header">
              <h5 className="modal-title" id="addPropertiesLabel">
                Add properties
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowPropertiesPopup(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-6 w-6 fill-jacarta-700 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>

            <div className="modal-body p-6">
              <p className="mb-8 dark:text-jacarta-300">
                Item Properties show up underneath your item, are clickable, and
                can be filtered in your collection's sidebar.
              </p>

              <div className="relative my-3 flex items-center">
                <button className="flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-l-lg border border-r-0 border-jacarta-100 bg-jacarta-50 hover:bg-jacarta-100 dark:border-jacarta-600 dark:bg-jacarta-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="h-6 w-6 fill-jacarta-500 dark:fill-jacarta-300"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                  </svg>
                </button>

                <div className="flex-1">
                  <label className="mb-3 block font-display text-base font-semibold text-jacarta-700 dark:text-white">
                    Type
                  </label>
                  <input
                    type="text"
                    className="h-12 w-full border border-r-0 border-jacarta-100 focus:ring-inset focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder-jacarta-300"
                    placeholder="Character"
                  />
                </div>

                <div className="flex-1">
                  <label className="mb-3 block font-display text-base font-semibold text-jacarta-700 dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    className="h-12 w-full rounded-r-lg border border-jacarta-100 focus:ring-inset focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder-jacarta-300"
                    placeholder="Male"
                  />
                </div>
              </div>

              <button className="mt-2 rounded-full border-2 border-accent py-2 px-8 text-center text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-white">
                Add More
              </button>
            </div>

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
