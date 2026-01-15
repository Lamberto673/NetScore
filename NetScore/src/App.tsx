import {  useRef, useState, useEffect } from 'react'
import './App.css'
import Post from './components/Post';
import Api from './components/api.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSun} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [visible, setVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [trues, setTrues] = useState<boolean>(false);
  const [list, setList]= useState<string>("");
  const [lists, setlists] = useState<{task: string, color: string, authorName: string, post:string}[]>([]);
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [user, setUser] = useState<string[]>([]);
  const [postColor, setPostColor] = useState<string>("");
  const [inputField, setInputField] = useState<string>("");
  const [PlaceHolder, setPlaceHolder] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [head, setHead] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const SignRef = useRef<HTMLInputElement>(null);

  // Load saved user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setName(savedUser);
      setVisible(true);
      fetchPosts();
      setUser([savedUser, ...user]);
    }
  }, []);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await Api.get("/content/posts");
      if (response.data.status === "Success") {
        const postsWithColors = response.data.data.map((post: any) => ({
          task: post.title,
          color: RandCOlors(),
          authorName: post.authorName,
          post: post.id,
        }));
        setlists(postsWithColors);
        setTrues(postsWithColors.length > 0);
      }
    } catch (err: any) {
      console.log("Error fetching posts:", err.response?.data?.message);
    }
  }

  const handleUser = async () => {
    try{
      if(!name){
        return setError("Name is required");
      }
      await Api.post("/auth/sign", {
        name,
      })
      console.log("It works");
      
      // Save current user to localStorage
      localStorage.setItem('currentUser', name);
      
      if(!SignRef.current) return;
      SignRef.current.value = "";
      setErrorVisible(false);
      setVisible(true);
      
      // Fetch posts after login
      await fetchPosts();

    }
    catch(err:any){
      console.log(err.response?.data?.message);
      setError(err.response?.data?.message);
      setErrorVisible(true);
    }
  }

  const handlePost = async () => {
    try{
      await Api.post("/content/post", {
        name,
        title: list,
      })
      // Refresh posts after creating new post
      await fetchPosts();
    }catch(err:any){
      console.log(err.response?.data?.message);
      setError(err.response?.data?.message);
      setErrorVisible(true);
    }
  }

  const setOfList = () => {
    if(!list) return;
    // This function is no longer needed - posts are fetched from backend
  }
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setName("");
    setVisible(false);
    setlists([]);
    setTrues(false);
    setList("");
  }
  
  const DeleteInput = () => {
    if(!inputRef.current) return;
    inputRef.current.value = "";
    setList("");
  }
  const RandCOlors = () => {
      const Colors = ["rgba(224, 14, 14, 0.868)", "rgba(19, 90, 212, 0.868)", "rgb(99, 12, 192)"];

      const RandColors = Math.floor(Math.random() * Colors.length);
      return Colors[RandColors];
  }
  const LightDarkMode = () => {
    if(document.body.style.backgroundColor === "rgb(31, 41, 55)"){
        document.body.style.backgroundColor="white";
        setPostColor("rgb(246, 246, 246)");
        setInputField("rgb(229, 230, 232)  ");
        setPlaceHolder("rgb(202, 206, 209)");
        setText("rgb(28, 28, 28)");
        setHead("linear-gradient(rgba(210, 105, 30, 0.614), rgb(209, 203, 29))")
    }else{ 
      document.body.style.backgroundColor="rgb(31, 41, 55)";
      setPostColor("rgb(32, 44, 60)");
      setInputField("rgb(52, 64, 82)  ");
      setPlaceHolder("rgb(110, 130, 150)");
      setText("rgb(234, 231, 231)");
      setHead("linear-gradient(rgb(228, 171, 15), rgb(192, 22, 22))");
    } 
  }
  return (
    <>
    <div  className={!visible ? 'AppSign' : 'AppPost'}>
    {!visible && 
    <div className='SignIn'>
      <h1>NAME</h1>
      <input value={name}onChange={(e) => setName(e.target.value)} ref={SignRef}/>
      <button onClick={handleUser}>Press</button>
      {errorVisible && <p style={{"color":"red"}}>{error}</p>}
    </div>
    }

    { visible && 
     <div  className='Wrapper'>
      <div style={{"background": head}} className='Wrapper2'>
        <h1>Hi {name}</h1>
        <button onClick={handleLogout} style={{marginLeft: "10px"}}>Logout</button>
      </div>
      <div  className='DarkMode'>
        <div style={{"backgroundColor":postColor}} className='Upload'>
          <div className='HeaderClass'><h2 className='Header' style={{"color":text}}>Post</h2></div>
        {errorVisible && <p style={{"color":"red"}}>{error}</p>}
          <div className='Wrapper3'>
            <input style={{"backgroundColor":inputField, "color":PlaceHolder, "border":`1px solid ${inputField}`}} className='Post' placeholder="What's on your mind?" value={list} onChange={(e) => {
                  setList(e.target.value); 
                  }} ref={inputRef}/>
            <button className='PostButton' onClick={() => {
              setTrues(true)
              handlePost()
              setOfList()
              DeleteInput()
              }} >Post </button>
        </div>
       </div>
        <div className='Dark'>
          <button onClick={LightDarkMode} style={{"backgroundColor":postColor, "color":text}}className='DarkButton'><FontAwesomeIcon icon={faSun} /></button>
       </div>
       </div>
      {trues && lists.map((item, index)=> {
        return <Post Text={text} Border={postColor} Colors={item.color} TitleId={item.post} Name={item.authorName} Task={item.task} index={index} key={index} onDelete={fetchPosts}/>
      })}
     </div>
    }
    </div>
    </>
  )
}

export default App
