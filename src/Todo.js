import {useState, useRef, useEffect} from 'react'
import {
  useNavigate,
  Link
} from 'react-router-dom';
import { useAuth } from './Context';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
const Logout = () => {
  let navigate = useNavigate();

  return <button type="button" onClick={() => {navigate('/login')}}>登出</button>
}
const TodoItem = ({todo, index, ...props}) => {
  const [ isEditing, setIsEditing ] = useState(false);
  const inputRef = useRef();
  return (
    <li>
      <div className={`${isEditing ? 'd-none' : 'd-flex'} d-flex items-center`}>
        <label className="todoList_label">
            <input className="todoList_input" type="checkbox" value="true" onChange={(e) => {props.toggleDone(todo.id)}}  checked={!!todo.completed_at}/>
            <span>{todo.content}</span>
        </label>
        
        <Link to="#" onClick={(e) => {props.deleteTodo(e,todo.id)}}>
            <i className="fa fa-times"></i>
        </Link>
        <Link to="#" onClick={(e) => {setIsEditing(!isEditing)}}>
            <i className="fa fa-pen"></i>
        </Link>
      </div>
      <div className={`items-center ${isEditing ? 'd-flex' : 'd-none'}`}>
        <input type="text" className="w-100 py-2" ref={inputRef}/>
        <Link to="#" onClick={(e) => {setIsEditing(false)}}>
            <i className="fa fa-arrow-left"></i>
        </Link>
        <Link to="#" onClick={(e) => {props.doneEdit(e, inputRef.current.value , todo.id,setIsEditing)}}>
            <i className="fa fa-check"></i>
        </Link>
      </div>
  </li>
  )
}
const Todo = () => {
  const { token, setToken } = useAuth();
  
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    
    const url = 'https://todoo.5xcamp.us/check';
    console.log(token)
    axios.defaults.headers.common['Authorization'] = token
    axios.get(url)
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          navigate('/login')
          return;
        }
        getTodos();
      })
      .catch((err) => {
        MySwal.fire({
          title: '登入失敗',
          text: '請重新登入',
          icon: 'warning',
          confirmButtonColor: '#FFD370',
        })
        navigate('/login')
      })
    
  }, [])
  useEffect(() => {
    localStorage.setItem('token', token)
  },[token])
  const [todolist, setTodolist] = useState([]);
  const [activeTab, setActiveTab] = useState('全部');
  const [filteredTodos, setFilteredTodos] = useState(todolist);
  
  const inputRef = useRef();

  useEffect(() => {
    setActiveTab('全部')
    setFilteredTodos(todolist)
  },[todolist])
  const getTodos = () => {
    const url = 'https://todoo.5xcamp.us/todos'
    axios.get(url)
      .then(response => {
        console.log(response.data.todos)
        setTodolist(response.data.todos)
      })
      .catch(err => {
        MySwal.fire({
          title: err,
          icon: 'error'
        })
      })
  }
  const addTodo = (e) => {
    e.preventDefault();
    const newTodo = {
      todo: {
        content: inputRef.current.value,
      }
    };
    const url = 'https://todoo.5xcamp.us/todos'
    axios.post(url, newTodo)
      .then(response => {
        console.log(response);
        if (response.status !== 201) {
          MySwal.fire({
            title: response.data.message,
            icon: 'error'
          })
          return
        }
        getTodos();
        MySwal.fire({
          title: '新增成功',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
      })
      .catch(err => {
        MySwal.fire({
          title: err.response.message,
          icon: 'error'
        })
      })
    inputRef.current.value = '';
  }
  
  const doneEdit = (e,content,id,setIsEditing) => {
    e.preventDefault();
    console.log(e)
    const url = `https://todoo.5xcamp.us/todos/${id}`
    const editTodo = {
      todo: {
        content
      }
    }
    axios.put(url, editTodo)
      .then(response => {
        console.log(response)
        setIsEditing(false)
        getTodos()
      })
      .catch(err => {
        MySwal.fire({
          title: err,
          icon: 'error'
        })
      })
  }
  const deleteTodo = (e, id) => {
    e.preventDefault();
    const url = `https://todoo.5xcamp.us/todos/${id}`
    axios.delete(url, id)
      .then(response => {
        console.log(response)
        getTodos()
      })
      .catch(err => {
        MySwal.fire({
          title: err,
          icon: 'error'
        })
      })
  }
  const toggleDone = (id) => {
    const url = `https://todoo.5xcamp.us/todos/${id}/toggle`
    axios.patch(url, id)
      .then((response) => {
        console.log(response)
        getTodos()
      })
      .catch((err) => {
        MySwal.fire({
          title: err,
          icon: 'error'
        })
      })
  }
 const deleteTodos = () => {
  const completedTodos = todolist.filter(todo => todo.completed_at)
  const deleteAll = completedTodos.map(todo => axios.delete(`https://todoo.5xcamp.us/todos/${todo.id}`, todo.id))
  
  Promise.all(deleteAll)
    .then(response => {
      getTodos()
      MySwal.fire({
        title: '已清除完成項目',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      })
    })
    .catch(err => {
      MySwal.fire({
        title: err,
        icon: 'error'
      })
    })
  setActiveTab('全部')
 }

 const filterTodos = (e) => {
  const expr = e.target.textContent;
  setActiveTab(expr);
  switch (expr) {
    case '已完成':
      setFilteredTodos(todolist.filter(todo => todo.completed_at))
      break;
    case '待完成':
      setFilteredTodos(todolist.filter(todo => !todo.completed_at))
      break;
    default:
      setFilteredTodos(todolist)
  }
 }
  return (
    <>
      <div id="todoListPage" className="bg-half todoListPage">
        <nav>
            <h1><Link to="#">ONLINE TODO LIST</Link></h1>
            
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
                <input type="text" placeholder="請輸入待辦事項" ref={inputRef}/>
                <Link to="#" onClick={addTodo}>
                    <i className="fa fa-plus"></i>
                </Link></div>
            {!todolist?.length && (<><p className="text-center font-bold">目前尚無代辦事項</p>
            <img src="https://s3-alpha-sig.figma.com/img/7465/9ab1/8911ab6dcbda98df56e26aa23c6643ac?Expires=1662940800&Signature=Q9mjabC99DVjLvpRipWI9HtP4GGjrxAw2UAYdPPCzFrWnX0NOXvYgPu-Wpb6ccldi~V1a7tER5goJVOyiVkvDFZsQKiyZ6gxLiUZT4rpcPlY9Cc0g015YozU8o8wDfyPFzyh1WEGKuid06mXBkct9XbU77RDPaWwKzvXiBCHdEN8jkZwhaT6Z6AFrdT~0nzSfDTWkBu3Q1le8xGYuZCUFjpFSS1NWce1uXxPiL4p9CoMvfI5lIZVHWmuhJqnJByhzzRyySYZ~G6ENMRXwAmZ9Lus3JcihfyT3HaYWPhGTjDZ227STUNMuszxclfd1XPqXoQeVrOgrtBN1fPMTuODzQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" alt="" /></>)
            }    
            <div className="todoList_list">
              
                <ul className="todoList_tab" onClick={(e) => {filterTodos(e)}}>
                    <li><Link to="#" className={activeTab === '全部'?'active': ''}>全部</Link></li>
                    <li><Link to="#" className={activeTab === '待完成'?'active': ''}>待完成</Link></li>
                    <li><Link to="#" className={activeTab === '已完成'?'active': ''}>已完成</Link></li>
                </ul>
                <div className="todoList_items">
                    
                    <ul className="todoList_item">
                      {filteredTodos?.length &&filteredTodos.map((item, index) => <TodoItem todo={item} index={index} key={item.id} deleteTodo={deleteTodo} toggleDone={toggleDone}  doneEdit={doneEdit} />)}
                        
                        
                    </ul>
                    <div className="todoList_statistics">
                        <p>{todolist.filter(todo => !todo.completed_at).length}  個待完成項目</p>
                        <button type="button" onClick={deleteTodos}  className={`btn-delete-all ${todolist.filter(todo => todo.completed_at).length ? 'd-block' : 'd-none'}`}>清除已完成項目</button>
                    </div>
                </div>
            </div>
          </div>
      </div>
  </div>
      <Logout/>
    </>
  );
};

export default Todo;