export const storage={
    saveProducts:(products)=>{
        try{
            localStorage.setItem('ecommerce_products',JSON.stringify(products));
            return true;
        }catch(error){
            console.error('Error savingproducts:',error);
            return false;
        }
    },

loadProducts:()=>{
    try{
        const saved = localStorage.getItem('ecommerce_products');
        return saved?JSON.parse(saved):[];
    }catch(error){
        console.error('Error loading products:',error);
        return [];
    }
},

imageToBase64 :(file)=>{
    return new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>resolve(reader.result);
        reader.onerror=(error)=>reject(error);
    });

}
};