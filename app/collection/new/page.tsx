import { Navigation } from "@/components/navigation";
import { Input } from "@/components/ui/input";

export default function NewCollectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create a New Collection
        </h1>
        <form
          className="grid gap-4 max-w-md mx-auto mt-10"
          action="/api/collections"
          method="POST"
        >
          {/* name input */}
          <Input name="name" placeholder="Collection Name" />
          {/* submit button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Collection
          </button>
        </form>
      </main>
    </div>
  );
}
