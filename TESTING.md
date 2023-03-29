# Prova backend Instacasa

## Dependencias

```log
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: typeorm@0.3.10
npm ERR! Found: ts-node@8.10.2
npm ERR! node_modules/ts-node
npm ERR!   dev ts-node@"8.10.2" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peerOptional ts-node@"^10.7.0" from typeorm@0.3.10
npm ERR! node_modules/typeorm
npm ERR!   typeorm@"0.3.10" from the root project
npm ERR! 
npm ERR! Conflicting peer dependency: ts-node@10.9.1
npm ERR! node_modules/ts-node
npm ERR!   peerOptional ts-node@"^10.7.0" from typeorm@0.3.10
npm ERR!   node_modules/typeorm
npm ERR!     typeorm@"0.3.10" from the root project
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR! 
npm ERR! See /home/waldney/.npm/eresolve-report.txt for a full report.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/waldney/.npm/_logs/2023-03-29T11_41_52_059Z-debug-0.log
```

* Existe uma incompatibilidade entre o pacote ts-node do projeto e o ts-node da versão do typeorm. O pacote do projeto está muito atrasado com relação ao pacote interno do typeorm.

Diante disso, validarei algumas hipóteses.

1. O Yarn é capaz de gerenciar esse conflito de dependência?
2. Um upgrade no ts-node poderia ser realiado para resolver o problema?

### 1. Usando o YARN

A utilização do YARN como gerenciador de pacotes, corrige o problema, no entanto, precisamos de mais alguns "porquê?" para permitir uma resolução mais adequada do problema, e que não prenda a aplicação a um fator externo como o gerenciador de pacotes a ser utilizado.

```log
yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
Done in 40.92s.
```

Estranhamente, ao realizar os testes eles passam, mas são lançadas exceções em alguns testes.

```log
  PASS  test/unit/useCases/user/getUser.test.ts
  ● Console

    console.log
      NotFoundError: user with id 0 can't be found.
          at UserRepository.<anonymous> (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/infra/database/repositories/baseRepository.ts:33:15)
          at Generator.throw (<anonymous>)
          at rejected (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/infra/database/repositories/baseRepository.ts:6:65) {
        status: 404
      }

      at GetUser.<anonymous> (src/useCases/user/getUser.ts:16:15)
          at Generator.throw (<anonymous>)

  PASS  test/unit/domain/user.test.ts
  PASS  test/unit/domain/comment.test.ts
  PASS  test/unit/domain/post.test.ts
  PASS  test/unit/useCases/user/listUser.test.ts

  Test Suites: 36 passed, 36 total
  Tests:       107 passed, 107 total
  Snapshots:   0 total
  Time:        31.83 s, estimated 35 s
  Ran all test suites matching /test/i.
  Done in 33.33s.
```

### 2. ts-node upgrade

Ao realizar *npm install -D ts-node@latest* verificaremos que o npm é capaz de lidar com os problemas de compatibilidade envolvendo o typeorm.

```log
added 857 packages, and audited 858 packages in 1m

114 packages are looking for funding
  run `npm fund` for details

5 high severity vulnerabilities
```

Podemos verificar que de fato, foi possível executar o projeto com npm mas internamente é necessário verificar se o software passa nos testes.

Algo estranho no processo é que apesar de uma grande quantidade de erros, o feedback final dos testes foi positivo.

```log
    PASS  test/unit/useCases/comment/createComment.test.ts
    console.log
      ValidationError: O nome do usuário é obrigatório
          at User.set name [as name] (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/domains/user.ts:19:13)
          at new User (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/domains/user.ts:36:14)
          at CreateUser.<anonymous> (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/useCases/user/createUser.ts:15:20)
          at Generator.next (<anonymous>)
          at /home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/useCases/user/createUser.ts:8:71
          at new Promise (<anonymous>)
          at Object.<anonymous>.__awaiter (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/useCases/user/createUser.ts:4:12)
          at CreateUser.execute (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/useCases/user/createUser.ts:13:83)
          at UserController.<anonymous> (/home/waldney/Documentos/OPTI/PROJETOS/instacasa/teste-backend/src/interfaces/http/userController.ts:68:34)
          at Generator.next (<anonymous>) {
        status: 400
      }

      at CreateUser.<anonymous> (src/useCases/user/createUser.ts:18:15)


Test Suites: 36 passed, 36 total
Tests:       107 passed, 107 total
Snapshots:   0 total
Time:        41.708 s
Ran all test suites matching /test/i
```

Diante do feedback, ambas as soluções se mostram promissoras, no entanto, como o cultural no projeto é o uso do Yarn devemos optar por seguir com yarn para trabalhar nos testes. Devemos propor ao líder a atualização e revisão da lib, já que não temos nesse momento como garantir o quanto isso afetará o projeto.