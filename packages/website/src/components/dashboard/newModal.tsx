import { FaSolidSquarePlus } from "solid-icons/fa";
import { createSignal } from "solid-js";
import { useNavigate } from "solid-start";
import { createBackendFetchAction } from "~/lib/backend";

export function newModal() {
  const navigate = useNavigate();
  const [_, sendBackendRequest] = createBackendFetchAction();
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);

  async function handleSubmit() {
    if (name()) {
      await sendBackendRequest({
        route: "/api/v1/flows",
        init: {
          method: "POST",
          body: JSON.stringify({
            name: name(),
            description: description() || "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      })
        .then((res) => res.json())
        .then((flow) => navigate(`/flows/${flow._id}`));
      setShowModal(true);
    } else {
      setSubmitted(true);
    }
  }
  return (
    <div class="fixed inset-0 flex items-center justify-center flex-col bg-gray-500 bg-opacity-75">
      <div class="bg-neutral-800 rounded-lg p-8 max-w-xs mx-auto outline outline-indigo-600 outline-offset-2">
        <FaSolidSquarePlus size={48} color="#4f46e5" />
        <div class="text-2xl font-bold mb-4 text-white">New Flow:</div>
        <div class="mb-4">
          <label class="block text-sm font-bold mb-2 text-white">Name:</label>
          <input
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            class={`shadow bg-zinc-800 appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline ${
              submitted() && !name()
                ? "outline-red-500 outline outline-offset-1"
                : ""
            }`}
            type="text"
            placeholder="Flow name..."
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2">
            Description:
          </label>
          <input
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
            class="shadow bg-zinc-800 appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Flow description..."
          />
        </div>
        <div class="flex justify-end">
          <button
            class="flex-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Create
          </button>
          <button
            class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            onClick={() => {
              setShowModal(false);
              setSubmitted(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
