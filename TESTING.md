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

## Verificando as mensagens no teste

Foi possível observar que as mensagens se tratavam códigos de depuração *console.log* no código, estes estavam em um try/catch desnecessário que apenas repassa o erro, sem nenhum tipo de tratamento.

### Removendo a depuração

Como resultado da remoção, foi possível executar todos os testes sem mensagens de erro.

## Varrendo o código

### post em Comments é obrigatório mas está passando.

```ts
  public set post(newValue: PostInterface) {
    if (!newValue) {
      throw new ValidationError('A publicação do comentário é obrigatório');
    }
    this._post = new Post(newValue);
  }
```

É possível observar que o post precisa ter valor. No entanto, o comportamento do método permitia que comentários sem post passagem. Ao remover o comentário e o return e rodar novamente os testes alguns testes não passaram.

```log
Test Suites: 11 failed, 25 passed, 36 total
Tests:       21 failed, 86 passed, 107 total
Snapshots:   0 total
Time:        41.958 s
Ran all test suites matching /test/i.
```

### Refatorando alguns pontos do código
Observei que para melhorar a legibilidade do código, seriam possível melhorar os imports, adicionando index em algumas pasta para que seja possível importar módulos de uma forma mais simples.

### Modificando nome dos casos de uso (Implementei como sugestão)
Observei (inclusive por experiência própria) uma dificuldade para compreender que não era muito rápido de entender que as classes dos casos de uso eram UseCases, apenas verificando o import era possível saber. Como sugestão, ter na instância da classe o sufixo UseCase, ajuda a compreender melhor o código. Um exemplo disso é quando utilizamos classes de erro. Por convenção, mantemos Error no nome e no arquivo (opcional).

### Adicionando o mocks
Observei que é necessário um mecanismo que crie usuários, posts e comentários, possibilitando que isso fique um pouco mais invisível para os testes.

## Adjusts comment.test
Percebi que nos comentários, o teste realizado estava repetindo o de criação de post sem titulo. Também identifiquei a necessidade de criar testes novos para garantir a lógica de negócio. Imediatamente o teste repetido foi removido.

### Criando o testes novos em comment.test

1. 'shouldn't create comment without text'

```ts
  test('shouldn\'t create comment without text', () => {
    const [ user, author ] = mockUsers([{ active: true }, { active: true }]);
    const [ post ] = mockPosts([{ user: author }]);
    try {
      mockComments([{ text: '', post, user }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto do comentário é obrigatório1');
    }
  });
```

Com a criaçãod dos mocks esse processo é mais rápido. Para saber se a implementação funciona, adicionei 1 ao fim do text, simulando que um desenvolvedor por acaso tenha alterado o texto de exceção.

```log
 FAIL  test/unit/domain/comment.test.ts
  ● Comment › shouldn't create comment without text

    expect(received).toEqual(expected) // deep equality

    Expected: "O texto do comentário é obrigatório1"
    Received: "O texto do comentário é obrigatório"

      19 |     } catch(error) {
      20 |       expect(error as Error).toBeInstanceOf(ValidationError);
    > 21 |       expect((error as Error).message).toEqual('O texto do comentário é obrigatório1');
         |                                        ^
      22 |     }
      23 |   });
      24 | });
```
Os demais testes serão apenas listados.

2. 



### include a test to ensure that comments can not be saved withou post
