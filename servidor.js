import express from "express"
import db from "./src/config/db.js"

const app = express(); // cria o app UMA vez
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.status(200).json({msg: "Servidor rodando"});
});

app.get("/alunos", async(req,res)=>{
    const [resultado] = await db.execute("SELECT * FROM tbaluno")
    res.status(200).json(resultado)
})

app.post("/alunos", async (req,res)=>{
    try{
        const {aluno_nome} = req.body;
        if(!aluno_nome)
            return res.status(400).json({erro: "Campo Obrigatório"})

        await db.execute(
            "INSERT INTO tbaluno (aluno_nome) VALUES (?)",
            [aluno_nome]
        );

        res.json({msg: "Aluno criado com sucesso"})
    } catch (err){
        res.status(500).json({erro: err.message})
    }
});

app.delete("/alunos/:id", async (req,res)=>{
    try{
        await db.execute("DELETE FROM tbaluno WHERE aluno_id = ?", [req.params.id]);
        res.json({msg: "Aluno deletado com sucesso!"})
    }catch(err){
        res.status(500).json({erro: err.message})
    }
});

app.put("/alunos/:id", async (req,res)=>{
    try{
        const {aluno_nome} = req.body
        await db.execute(
            "UPDATE TbAluno SET aluno_nome = ? WHERE aluno_id = ?",
            [aluno_nome, req.params.id]
        );
        res.json({msg: "Aluno atualizado com sucesso!"})
    }catch(err){
        res.status(500).json({erro: err.message})
    }
})

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));