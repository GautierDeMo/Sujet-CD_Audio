import { useEffect, useState } from "react";
import { getCDs, deleteCD } from "../services/cdService";
import CDItem from "./CDItem";

const CDList = () => {
  const [cds, setCDs] = useState(/** @type {Array<CD>} */ ([]));

  useEffect(() => {
    fetchCDs();
  }, []);

  const fetchCDs = async () => {
    const data = await getCDs();
    setCDs(data);
  };

  const handleDelete = async (/** @type {number} */ id) => {
    await deleteCD(id);
    fetchCDs(); // Rafraîchir la liste après suppression
  };

  return (
    <div className="container">
      <h2>Liste des CD 🎵</h2>
        {cds.length > 0 ? (
          <ul>
            {cds.map((cd) => (
              <CDItem key={cd.id} cd={cd} onDelete={handleDelete} />
            ))}
          </ul>
        ) : (
          <p>Aucun CD disponible</p>
        )}
    </div>
  );
};

export default CDList;
