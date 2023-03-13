import { FaSolidSquareXmark } from "solid-icons/fa";
import { createBackendFetchAction } from "~/lib/backend";

export function deleteModal(
  delId: string,
  delTitle: string,
  setShowDeleteModal: (val: boolean) => void
) {
  const [_, sendBackendRequest] = createBackendFetchAction();

  async function deleteFlow() {
    await sendBackendRequest({
      route: `/api/v1/flows/${delId}`,
      init: {
        method: "DELETE",
      },
    });
    setShowDeleteModal(false);
  }

  return (
    <div class="fixed inset-0 flex items-center justify-center flex-col bg-gray-500 bg-opacity-75">
      <div class="bg-neutral-800 rounded-lg p-8 max-w-xs mx-auto outline outline-indigo-600 outline-offset-2">
        <FaSolidSquareXmark size={48} color="#dc2626" />
        <div class="text-2xl font-bold mb-2 text-white">Delete Flow:</div>
        <div class="mb-4">
          <p class="text-white pb-2">
            {" "}
            Are you sure you want to delete: {delTitle}?
          </p>
          <div class="flex justify-end">
            <button
              class="flex-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={deleteFlow}
            >
              Delete
            </button>
            <button
              class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
