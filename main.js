const KEY_BD = '@usuariosestudo'

var listCad = {
    ultimoIdGerado:0,
    usuarios:[]
}

var FILTRO = ''

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listCad) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listCad = JSON.parse(data)
    }
    draw()
}


function pesquisar(value){
    FILTRO = value;
    draw()
}


function draw(){
    const tbody = document.getElementById('listBody')
    if(tbody){
        var data = listCad.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.cel )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.id}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.cel}</td>
                        <td>${usuario.carro}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function userInst(nome, email, cel, carro ){
    const id = listCad.ultimoIdGerado + 1;
    listCad.ultimoIdGerado = id;
    listCad.usuarios.push({
        nome, id, email, cel, carro
    })
    gravarBD()
    draw()
    vizualizar('lista')
}

function userEdit(nome, email, cel, carro){
    var usuario = listCad.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.cel = cel;
    usuario.email = email;
    usuario.carro = carro;
    gravarBD()
    draw()
    vizualizar('lista')
}

function userDel(id){
    listCad.usuarios = listCad.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    draw()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        userDel(id)
    }
}


function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('cel').value = ''
    document.getElementById('email').value = ''
    document.getElementById('carro').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listCad.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('nome').value = usuario.nome
                document.getElementById('id').value = usuario.id
                document.getElementById('email').value = usuario.email
                document.getElementById('cel').value = usuario.cel
                document.getElementById('carro').value = usuario.carro
            }
        }
        document.getElementById('nome').focus()
    }
}



function submit(e){
    e.preventDefault()
    const data = {
        nome: document.getElementById('nome').value,
        id: document.getElementById('id').value,
        email: document.getElementById('email').value,
        cel: document.getElementById('cel').value,
        carro: document.getElementById('carro').value
    }
    if(data.id){
        userEdit(data.nome, data.id, data.email, data.cel, data.carro)
    }else{
        userInst( data.nome, data.email, data.cel, data.carro )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('userCad').addEventListener('submit', submit)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})