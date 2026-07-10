/** @param {{ cd: CD, onDelete: (id: number) => void }} props */
const CDItem = ({ cd, onDelete }) => {
  return (
    <li>
      <span>
        {cd.title} - {cd.artist} ({cd.year})
      </span>
      <button className="delete-btn" onClick={() => { onDelete(cd.id) } }>
        🗑 Supprimer
      </button>
    </li>
  );
};

export default CDItem;
