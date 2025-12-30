import {v4 as uuid} from 'uuid';
import jwtDecode from 'jwt-decode';

const JWT_SECRET='yozi-shop-demo-secret-key-2026';

const createJWT=(payload)=>{
    const header=btoa(JSON.stringify({alg:'HS256',typ:'JWT'}));
    const encodedPayload=btoa(JSON.stringify({
        ...payload,
        exp:Math.floor(Date.now()/1000)+(24*60*60)
    }));
    const signature=btoa(JWT_SECRET);

    return `${header}.${encodedPayload}.${signature}`;
};

const verifyJWT=(token)=>{
    try{
        const parts=token.split('.');
        if(parts.length!==3) return null;

        const payload=JSON.parse(atob(parts[1]));

        if(payload.exp && payload.exp<Math.floor(Date.now()/1000)){
            return null;
        }
         return payload;

    }catch(error){
        return null;
    }
};

let users=JSON.parse(localStorage.getItem('mock-users')||'[]');
let products=JSON.parse(localStorage.getItem('mockProducts')||'[]');

if(users.length===0){
    users=[
        {
            id:uuidv4(),
            email:'admin@gmail.com',
            password:'admin123',
            role:'admin',
            createdAt:new Date().toISOString()
        },

        {
            id:uuidv4(),
            email:'user@gmail.com',
            password:'user@123',
            role:'user',
            createdAt:new Date().toISOString()
        }
    ];
    localStorage.setItem('mock-users',JSON.stringify(users));
}
  if(products.length===0){
    products=[
        {
            id:uuidv4(),
            title:'Fjallraven Backpack',
            price:109.95,
            category:"men's clothing",
            image:'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
            description:'your perfect pack for everyday use and walks in the forest ',
            stock:46
        },

        {
            id:uuidv4(),
            title:'Mens casual premium slim fit t-shirts',
            price:34.50,
            category:"men's clothing",
            image:'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
            description:'Slim-fitting style,contrasting colors,pre-shrunk fabric',
            stock:43
        }
    ];
    localStorage.setItem('mockProducts',JSON.stringify(products));
}
 export const mockAuthService={
    async register(userData){
        await new Promise (resolve => setTimeout(resolve,500));
         
        if(users.some(u=> u.email===userData.email)){
            throw new ErrorEvent('User already exists with this email');
        }

        const newUser={
            id:uuid4(),
            ...userData,
            role:'user',
            createdAt:new DataTransfer().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('mockUsers',JSON.stringify(users));

        const token=createJWT({
            userId:newUser.id,
            email:newUser.email,
            role:newUser.role,
            name:newUser.name
        });

        const {password,...userWithoutPassword}=newUser;

        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userWithoutPassword));

        return {
            success:true,
            user:userWithoutPassword,
            token
        };

    },

    async login(email,password){
        await new Promise(resolve=> setTimeout(resolve,500));

        const user=users.find(u=>u.email===email&& u.password===password);

        if(!user){
            throw new Error('Invalid email or password');
        }

        const token=createJWT({
            userId:user.id,
            email:user.email,
            role:user.role,
            name:user.name
        });

        const {password:_,...userWithoutPassword}=user;

        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userWithoutPassword));

        return{
            success:true,
            user:userWithoutPassword,
            token};
        },
         logout(){
          localStorage.removeItem('token');
          localStorage.removeItem('user');
         },
     getCurrentUser(){
        const token=localStorage.getItem('token');
        const userStr=localStorage.getItem('user');
       if(!token || !userStr)  return null;
             const decoded=verifyJWT(token);
             if(!decoded){
                this.logout();
                return null;
             }
             return JSON.parse(userStr);
            },

            isAuthenticated(){
                const token=localStorage.getItem('token');
                if(!token) return false;
                
                const decoded=verifyJWT(token);
                return decoded!==null;
            },
            isAdmin(){
                const user=this.getCurrentUser();
                return user?.role==='admin';
            },
        getAuthHeader(){
            const token=localStorage.getItem('token');
            return token ? {Authorization:`Bearer ${token}`
        }:{};
    }
        };
    
 