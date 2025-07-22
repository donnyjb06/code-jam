import RouteContext from "../context/RouteContext";
import { useContext } from "react";

const useRoute = () => {
  const context = useContext(RouteContext)

  if (!context) throw new Error("useRoute must be used within a RouteProvider")

  return context
}

export default useRoute