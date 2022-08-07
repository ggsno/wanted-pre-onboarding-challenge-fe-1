import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchGetTodoById, fetchUpdateTodo } from "../../api/todoAPI";
import checkToken from "../../utils/checkToken";
import { useTodoContext } from "../useTodoContext";
import Input from "../../common/Input";
import useInput from "../../hooks/useInput";

const Details = () => {
  const { selectedTodo, setSelectedTodo, todos, setTodos } = useTodoContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const inputTitle = useInput("");
  const inputContent = useInput("");
  const navigate = useNavigate();

  const handleEditMode = () => {
    setEditMode(true);
    inputTitle.setValue(selectedTodo.title);
    inputContent.setValue(selectedTodo.content);
  };

  const handleEdit = async (e: any) => {
    try {
      e.preventDefault();
      checkToken();
      const data = await fetchUpdateTodo(
        localStorage.getItem("token")!,
        JSON.stringify({
          title: inputTitle.value,
          content: inputContent.value
        }),
        selectedTodo.id
      );
      if (!data) throw Error;
      setTodos(
        todos.map((item: any) => (item.id !== selectedTodo.id ? item : data))
      );
      setSelectedTodo(data);
      inputTitle.setValue("");
      inputContent.setValue("");
      setEditMode(false);
    } catch {
      navigate("/login");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    inputTitle.setValue("");
    inputContent.setValue("");
  };

  useEffect(() => {
    (async () => {
      try {
        checkToken();
        if (
          searchParams.get("id") &&
          todos.some(({ id }) => id === searchParams.get("id"))
        ) {
          const data = await fetchGetTodoById(
            localStorage.getItem("token")!,
            searchParams.get("id")!
          );
          setSelectedTodo(data);
          setEditMode(false);
        } else {
          setSearchParams({});
          setSelectedTodo(null);
        }
      } catch {
        navigate("/login");
      }
    })();
  }, [searchParams]);

  return (
    <>
      <h2>Todo Details</h2>
      {!selectedTodo ? (
        <p>Click Todo To See Details</p>
      ) : !editMode ? (
        <>
          <h3>title</h3>
          <p>{selectedTodo.title}</p>
          <h3>content</h3>
          <p>{selectedTodo.content}</p>
          <h3>created at</h3>
          <p>{selectedTodo.createdAt}</p>
          <h3>updated at</h3>
          <p>{selectedTodo.updatedAt}</p>
          <button onClick={handleEditMode}>edit</button>
        </>
      ) : (
        <>
          <Input
            id="editTitle"
            labelName="title"
            placeholder={selectedTodo.title}
            {...inputTitle}
          />
          <Input
            id="editContent"
            labelName="content"
            placeholder={selectedTodo.content}
            textarea
            {...inputContent}
          />
          <h3>created at</h3>
          <p>{selectedTodo.createdAt}</p>
          <h3>updated at</h3>
          <p>{selectedTodo.updatedAt}</p>
          <button onClick={handleEdit}>ok</button>
          <button onClick={handleCancel}>cancel</button>
        </>
      )}
    </>
  );
};

export { Details };
