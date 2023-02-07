# Prova backend Instacasa

## Concluir uma API para atender um sistema de posts e comentários

Temos uma API para gerenciar posts e comentários de diversos usuários.

Sua tarefa será implementar controle de categorias por posts, a estrutura e requisitos funcionais estão descritos no final deste documento.

Ao final do desenvolvimento você deve submeter um pull request com as alterações

Adicionais:

- A API está funcional, mas possui alguns bugs, débitos técnicos e inconformidades na arquitetura. Encorajamos a encontrar estes problemas e apresentar soluções para eles
- Também temos necessidade de uma nova funcionalidade, Consultar todos Posts de um usuário pelo id do mesmo
- A API está atualmente utilizando ExpressJS e TypeORM que podem ser substituídos por outro web server/ORM

## O que será avaliado

- Boas praticas de programação ( POO, Clean Code, SOLID )
- Testes automatizados
- Arquitetura do projeto
- Melhorias e correções propostas

## Entidades

### User

- id: number
- name: string
- active: boolean
- isAdmin: boolean

### Post

- id: number
- title: string
- text: string
- user: User
- categories: Category[]

### Comment

- id: number
- text: string
- user: User
- post: Post

### Requisitos técnicos

- Desenvolver a API utilizando Typescript
- Utilizar banco sqlite3 em memória
- Utilizar alguma ferramenta ORM como TypeORM, Sequelize, Prisma
- Testes unitários e funcionais fazem parte do desenvolvimento
- A camada de domínios, contento as regras de negócio e especificações das entidades, devem ficar separadas da - camada de infraestrutura de modelos e repositórios que fazem a comunicação com o banco de dados.
- A rotas da API devem seguir o padrão REST
- As rotas devem possuir tratamento de erro também seguindo o padrão REST

### Requisitos funcionais

- Apenas usuários ativos podem criar novos posts
- Apenas usuários administradores podem ativar e desativar usuários
- Apenas usuários administradores podem excluir usuários não administradores
- Usuários administradores não podem ser excluídos
- Posts, comentários podem apenas ser excluídos pelos seus autores ou por administradores
- Um post deve conter obrigatoriamente título e texto.
- Um comentário conter obrigatoriamente texto
- Posts e comentários devem ficar vinculados ao autor
- Posts podem ser editados pelo autor enquanto não tiverem nenhum comentário

## A Tarefa a ser desenvolvida

Você deve implementar toda estrutura necessária para categorizar posts atendendo a entidade e os requisitos funcionais descritos abaixo.

### Category

- id: number
- label: string

### Requisitos funcionais para Categorias

- Apenas usuários administradores podem criar, editar e excluir categorias
- Posts podem conter uma ou mais categorias
- Apenas o autor e usuários administradores podem adicionar categorias aos posts
- As categorias de um posts podem ser editadas pelo autor e pelos administradores a qualquer momento

### Requisitos funcionais Consultar Posts por Usuário

- Deve ser possível consultar todos os posts de um usuário a partir do ID do usuário
