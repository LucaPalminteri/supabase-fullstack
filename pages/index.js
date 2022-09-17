import Head from 'next/head'
import { useEffect, useState } from "react";
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {supabase} from '../utils/ideas';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Document from './_document';
import Popup from '../components/Popup';
import Contact from '../components/Contact';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Home() {
  
  const [ideas,setIdeas] = useState([])
  const [idea,setIdea] = useState({title: '', description: ""})
  const {title, description} = idea
  const [isUpdate,setIsUpdate] = useState(false)
  const [idUpdate,setIdUpdate] = useState(0)
  const [isShowContact,setIsShowContact] = useState(false)
  

  useEffect(()=>{
    fetchIdeas()
  },[])

  async function fetchIdeas() {
    const {data} = await supabase.from('Ideas').select()
    setIdeas(data)
  }

  async function createIdea() {
    if (validInput(idea) == false){
      alert('The title or description must be different than an empty string') 
      return;
    } 
    const {data} = await supabase.from('Ideas').insert([{title, description}],{ upsert: false }).single()
    setIdea({title:"",description: ""})
    window.location.reload();
  }

  async function deleteIdea(id) {
    if(confirm('Do you really want to delete this idea?') == false) return;
    const {data} = await supabase.from('Ideas').delete().match({id});
    window.location.reload();
  } 

  const midUpdateIdea = (id,index) => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsUpdate(true)
    setIdea({title: ideas[index].title, description: ideas[index].description})
    setIdUpdate(id)
  }

  async function updateIdea(id) {
    if (validInput(idea) == false){
      alert('The title or description must be different than an empty string') 
      return;
    } 
      
    id = idUpdate
    const {data} = await supabase.from('Ideas').update({title: idea.title,description: idea.description}).match({id})
    setIdea({title:"",description: ""})
    setIsUpdate(false)
    window.location.reload();
  }

  const inputHandle = (e,i)=> {
    if ( i == 1 ) setIdea(prev => ({...prev, title:e}))
    else if (i == 2) setIdea(prev => ({...prev, description:e}))
  }

  const validInput = (pIdea) => {
    if(pIdea.title == "" || pIdea.description == "") return false
    return true
  }

  const cancelUpdate = ()=> {
    setIsUpdate(false)
    setIdea({title:"",description: ""})
  }

  const handleContact = () => {
    setIsShowContact(prev => !prev)
  }

  return (
    <div>
      <Head>
        <title>Great Ideas</title>
        <meta name="description" content="A simple website where anyone can share their best ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
 
      <div className='drop-menu' >
        {
          isShowContact ? 
          <>
            <div onClick={handleContact}>
              <KeyboardArrowUpIcon style={{cursor:'pointer'}} fontSize='large'/>            
            </div>
            <Contact />
          </>
          :
            <KeyboardArrowDownIcon style={{cursor:'pointer'}} onClick={handleContact} fontSize='large'/>

        }
      </div>

      {/* <Contact /> */}
      {/* <Popup/> */}

    <div className='title'>
      <h1>IDEAS</h1>
    </div>
      <h4>Upload your best ideas to the world</h4>
    <div className='container'>
      <h2></h2>
      <input
        placeholder='Title'
        value={idea.title}
        onChange={ (e,i)=> inputHandle(e.target.value,1)}
      />
      <textarea
        placeholder='Description'
        value={idea.description}
        onChange={ (e,i)=> inputHandle(e.target.value,2)}
      />
      {
        isUpdate ?
        <div className='btn-container'>
          <button
            className='btn-create'
            onClick={updateIdea}>UPDATE</button>
          <button
            onClick={cancelUpdate}
          >CANCEL</button>
        </div> 
        :
          <button
            className='btn-create'
            onClick={createIdea}>CREATE</button>
      }
      
        
    </div>
    <div className='item-container'>
      {
        ideas.length == 0 ?
        <div className="spinner"></div> :
        ideas.map((idea,index) => (
          <div className='item' key={idea.id}>
            <h3>{idea.title}</h3>
            <h6>{idea.description}</h6>
            <button 
              className='btn-delete'
              onClick={() => deleteIdea(idea.id)}
              ><DeleteIcon />
              </button>
            <button
              className='btn-update'
              onClick={ () => midUpdateIdea(idea.id,index)}>
                <EditIcon />
              </button>
          </div>)
        )
      }
    </div>
    </div>
  )
}
