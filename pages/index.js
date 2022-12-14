import Document from "./_document";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../utils/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Contact from "../components/Contact";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [idea, setIdea] = useState({ title: "", description: "" });
  const [isUpdate, setIsUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState(0);
  const [isShowContact, setIsShowContact] = useState(false);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchIdeas();
    getAuthor();
  }, []);

  async function fetchIdeas() {
    const { data } = await supabase.from("Ideas").select();
    setIdeas(data.reverse());
  }

  async function createIdea() {
    if (validInput(idea) == false) {
      alert("The title or description must be different than an empty string");
      return;
    }
    let date = new Date();
    const { data } = await supabase
      .from("Ideas")
      .insert(
        [
          {
            title: idea.title,
            description: idea.description,
            author: 1,
            created_at: date,
          },
        ],
        { upsert: false }
      );
    setIdea({ title: "", description: "" });
    window.location.reload();
  }

  async function deleteIdea(id) {
    if (confirm("Do you really want to delete this idea?") == false) return;
    const { data } = await supabase.from("Ideas").delete().match({ id });
    window.location.reload();
  }

  const midUpdateIdea = (id, index) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setIsUpdate(true);
    setIdea({
      title: ideas[index].title,
      description: ideas[index].description,
    });
    setIdUpdate(id);
  };

  async function updateIdea(id) {
    if (validInput(idea) == false) {
      alert("The title or description must be different than an empty string");
      return;
    }

    


    let date = new Date();
    id = idUpdate;
    const { data } = await supabase
      .from("Ideas")
      .update({
        title: idea.title,
        description: idea.description,
        updated_at: date,
      })
      .match({ id });
    setIdea({ title: "", description: "" });
    setIsUpdate(false);
    window.location.reload();
  }

  const inputHandle = (e, i) => {
    if (i == 1) setIdea((prev) => ({ ...prev, title: e }));
    else if (i == 2) setIdea((prev) => ({ ...prev, description: e }));
  };

  const validInput = (pIdea) => {
    if (pIdea.title == "" || pIdea.description == "") return false;
    return true;
  };

  const cancelUpdate = () => {
    setIsUpdate(false);
    setIdea({ title: "", description: "" });
  };

  const getAuthor = async () => {
    const { data } = await supabase.from("users").select("first_name");
    const arrayAuthors = [];
    data.map((author) => {
      if (author != undefined) arrayAuthors.push(author.first_name);
    });
    setAuthors(arrayAuthors);
  };

  const handleContact = () => setIsShowContact((prev) => !prev);

  return (
    <div>
      <Head>
        <title>Great Ideas</title>
        <meta
          name="description"
          content="A simple website where anyone can share their best ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="home">
        <div className="drop-menu">
          {isShowContact ? (
            <>
              <div onClick={handleContact}>
                <KeyboardArrowUpIcon
                  style={{ cursor: "pointer" }}
                  fontSize="large"
                />
              </div>
              <Contact />
            </>
          ) : (
            <KeyboardArrowDownIcon
              style={{ cursor: "pointer" }}
              onClick={handleContact}
              fontSize="large"
            />
          )}
        </div>

        <div className="title">
          <h1>IDEAS</h1>
        </div>
        <h4>Upload your best ideas to the world</h4>
        <div className="container">
          <h2></h2>
          <input
            placeholder="Title"
            value={idea.title}
            onChange={(e, i) => inputHandle(e.target.value, 1)}
          />
          <textarea
            placeholder="Description"
            value={idea.description}
            onChange={(e, i) => inputHandle(e.target.value, 2)}
          />
          {isUpdate ? (
            <div className="btn-container">
              <button className="btn-create" onClick={updateIdea}>
                UPDATE
              </button>
              <button onClick={cancelUpdate}>CANCEL</button>
            </div>
          ) : (
            <button className="btn-create" onClick={createIdea}>
              CREATE
            </button>
          )}
        </div>
      </div>
      <div className="item-container">
        {ideas.length == 0 ? (
          <div className="spinner"></div>
        ) : (
          ideas.map((idea, index) => (
            <div className="item" key={idea.id}>
              <h3>{idea.title}</h3>
              <h6>{idea.description}</h6>
              <button
                className="btn-delete"
                onClick={() => deleteIdea(idea.id)}
              >
                <DeleteIcon />
              </button>
              <button
                className="btn-update"
                onClick={() => midUpdateIdea(idea.id, index)}
              >
                <EditIcon />
              </button>
              <p className="author">{authors[idea.author - 1]}</p>
              <p>{index + 1}</p>
              {idea.updated_at == null ? (
                <span>{idea.created_at}</span>
              ) : (
                <span>{idea.updated_at}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
