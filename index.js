const express = require('express');


const server = express();

server.use(express.json());
/**
 * Rotas
 * POST /projects
 * A rota deve receber id e title dentro do corpo e cadastrar um novo projeto dentro 
 * de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; 
 * Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.
 * 
 * GET /projects: Rota que lista todos projetos e suas tarefas
 * 
 * PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
 * 
 * DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
 * 
 * POST /projects/:id/tasks: 
 * A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de 
 * um projeto específico escolhido através do id presente nos parâmetros da rota;
 */

const projects =[];

function checkProjectRequirements(req,res,next){
  const { id, title } = req.body;
  if (!id) {
    res.status(400).json({ 'error': 'Project id is required' });
  }

  if (!title) {
    res.status(400).json({ 'error': 'Project title is required' });
  }

  return next();
}

function checkProjectId(req,res,next){
  const {id} = req.params;
  const index = projects.findIndex((val)=>val.id===id);
  if (index<0){
    return res.status(401).json({'error':`Invalid project Id ${id}`});
  }
  req.projectIndex = index;
  return next();
}

server.post('/projects', checkProjectRequirements, (req,res)=>{
  const {id, title} = req.body;
  const project = {id,title,tasks:[]};
  projects.push(project)
  res.json(project)
})

server.get('/projects',(req,res)=>{
  return res.json(projects)
})

server.delete('/projects/:id', checkProjectId, (req,res)=>{  
  projects.splice(req.projectIndex,1);
  return res.send();
})

server.put('/projects/:id', checkProjectId,(req,res)=>{
  const {title} = req.body;
  const {projectIndex} = req;
  projects[projectIndex].title = title;
  return res.json(projects[projectIndex]);
})

server.post('/projects/:id/task', checkProjectId, (req, res) => {
  const { title } = req.body;
  const { projectIndex } = req;
  projects[projectIndex].tasks.push(title);
  return res.json(projects[projectIndex]);
})

server.listen(3000);