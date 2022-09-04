import { useForm } from 'react-hook-form';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import { useAuth } from './Context';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';


const Register = () => {
  let navigate = useNavigate();
  const { token, setToken } = useAuth();
  const MySwal = withReactContent(Swal);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    const url = 'https://todoo.5xcamp.us/users';
    axios.post(url, {user: data})
    .then(function (response) {
      console.log(response);
      MySwal.fire({
        title: response.data.message,
        html: `
        <div class="d-flex justify-center">
        <ul class="text-start">
          <li>Email：${response.data.email}</li>
          <li>暱稱：${response.data.nickname}</li>
        </ul>
        </div>`,
        icon: 'success'
      })
      console.log(response.headers.authorization)
      setToken(response.headers.authorization)
      navigate('/login')
    })
    .catch(function (error) {
      console.log(error);
      MySwal.fire({
        title: error.response.data.message,
        text: error.response.data.error,
        icon: 'error'
      })
    });
  };
  return (
    <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
            <div className="side">
                <Link to="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt=""/></Link>
                <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg"/>
            </div>
            <form className="formControls" action="index.html" onSubmit={handleSubmit(onSubmit)} >
              <h2 className="formControls_txt">註冊帳號</h2>
              <div>
                <label className="formControls_label" htmlFor="email">Email</label>
                <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required {...register("email", 
                { required: {value:true,message:'此欄位必填'} ,
                  pattern:{value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,message:'不符合 Email 規則' } 
              })}/>
                <p className="error-message"> {errors.email?.message}</p>
              </div>
            <div>
              <label className="formControls_label" htmlFor="name">您的暱稱</label>
                <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" {...register("nickname", 
                { required: {value: true,message:'此欄位必填，不可只輸入空格'},
                  setValueAs:v => v.trim()
                } 
              )} />
              <p className="error-message">{errors.nickname?.message}</p>
            </div>
            <div>
            <label className="formControls_label" htmlFor="password">密碼</label>
              <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼" required {...register("password",
               { required: {value: true, message: '此欄位必填，不可輸入空格'}, 
                minLength: {value:6, message: '密碼至少為 6 碼'},
                setValueAs:v => v.trim()
               })} />
               <p className="error-message">{errors.password?.message}</p>
            </div>
              <div>
              <label className="formControls_label" htmlFor="passwordComfirm">再次輸入密碼</label>
              <input className="formControls_input" type="password" name="passwordComfirm" id="passwordComfirm" placeholder="請再次輸入密碼" required {...register("comfirmPassword",
               { required: {value: true, message: '此欄位必填，不可輸入空格'}, 
                minLength: {value:6, message: '密碼至少為 6 碼'},
                setValueAs:v => v.trim()
               })}/>
                <p className="error-message">{errors.comfirmPassword?.message}</p>
              </div>
             
              <button type="submit" className="formControls_btnSubmit" disabled={Object.keys(errors).length > 0}>註冊帳號</button>
              <Link className="formControls_btnLink" to="/login">登入</Link>
          </form>
        </div>
    </div>
  );
};

export default Register;