import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchBox = ({ onSearch }) => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
      onSearch();
    } else {
      toast.error("Por favor, ingrese un término de búsqueda");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Buscar productos..."
        className="mr-sm-2 ml-sm-5 bg-transparent search-box"
        value={keyword}
        style={{ color: "white" }}
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Buscar
      </Button>
    </Form>
  );
};

export default SearchBox;
