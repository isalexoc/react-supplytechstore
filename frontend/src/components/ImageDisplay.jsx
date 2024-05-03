import { Form } from "react-bootstrap";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem"; // Ensure you have this component set up correctly

const ImageDisplay = ({ images, label, setImages, selectedFiles }) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id);
      const newIndex = images.findIndex((img) => img.url === over.id);
      const newImages = [...images];
      newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, images[oldIndex]);
      setImages(newImages);
    }
  };

  if (selectedFiles) {
    return;
  } else
    return (
      <div className="my-2" style={{ overflow: "hidden" }}>
        <Form.Label>{label}</Form.Label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((image) => image.url)}
            strategy={verticalListSortingStrategy}
          >
            <div className="d-flex flex-wrap justify-content-center gap-1">
              {images.map((image, index) => (
                <SortableItem
                  key={image.url}
                  id={image.url}
                  url={image.url}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
};

export default ImageDisplay;
