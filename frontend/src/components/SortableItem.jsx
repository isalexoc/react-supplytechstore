import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, url, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100px", // Consistent with your design
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="position-relative"
    >
      <img
        src={url}
        width={100}
        alt={`Imagen-${index + 1}`}
        className="img-fluid"
      />
      <span
        className="position-absolute botton-0 end-0 bg-dark text-white p-1 rounded"
        style={{ fontSize: "0.8rem", margin: "5px" }}
      >
        {index + 1}
      </span>
    </div>
  );
};

export default SortableItem;
