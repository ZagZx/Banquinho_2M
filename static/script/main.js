function getApiGitHub(){
    fetch('https://api.github.com/repos/livialop/banquinho')
    .then( async res =>{
        if ( !res.ok){
            throw new Error(res.status)
        }

        let data = await res.json()
        console.log(data)

    })


}

getApiGitHub()