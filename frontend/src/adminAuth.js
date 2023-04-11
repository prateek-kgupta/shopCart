import axios from "axios"

export default{
    created(){
        const token = localStorage.getItem("token")
        if(!token){
            this.$router.push('/')
        }
        else{
            const email = localStorage.getItem("email")
            axios.get(`http://localhost:3030/login/userType/${email}`)
            .then(response => {
                if(response.data !== 'admin'){
                    this.$router.push({name: 'pageNotFound'})
                }
            })
        }
    }
}