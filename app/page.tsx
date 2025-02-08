import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./Home";

export default function Page() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
