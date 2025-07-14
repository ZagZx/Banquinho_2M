# Introdução ao banco de dados

## Criando tabelas
```SQL
create table nome_da_tabela (
    id int primary key auto_increment,
    variaveis
);
```

### Tipos de dados
```sql
int: Inteiro
text: string de tamanho ilimitado.
char(n): string de tamanho fixo
varchar(n): srting de tamanho ilimitado até n caracteres
date: Datas
bool: pode ter o valor True ou False. Podendo serem escritos como: 
- True / 1 / yes / on 
- False / 0 / no / off
```
#### Varchar(n) x Char(n)
O varchar aceita até x letras. 
Ex: varchar(3) **aceita de 1 a 3 letras**

Já diferente o só aceita strings com obrigatoriamente x letras.
Ex: char(3) **só aceita strings com 3 letras**

## Inserindo dados
```sql
insert into nome_da_tabela (todas as colunas)
values (valor1, valor2, valor3);
```

Exemplo:
```sql
# Não precisa colocar o id. Ele já assume o valor sozinho por conta do auto_increment

INSERT INTO alunos(nome, genero, matricula) 
VALUES 
('Arthur', 'Masculino', 2023110111);
```

# Consultas
As consultas podem ser feitas de 2 formas:

1. Exibindo tudo:
```sql
select * from nome_da_tabela;
```

2. Especificando as colunas
```sql
select nome, preco from produtos;
```

## Filtrando as colunas
Caso queria dados mais específicos, é possível filtar os dados usando...

### Where
```sql
# Me mostre apenas os produtos onde o preço é igual a 20

select * from produtos
where preco = 20;
```

Também podemos usar outros operadores de comparação:
- preco > 20
- preco < 20
- preco >= 20
- preco <= 20
- preco != 20

Ou adicionar intervalos:
```sql
# Me mostre apenas os produtos onde o preço esteja entre 20 e 50

select * from produtos
where preco between 20 and 50;
```

```sql
# Me mostre apenas os funcionarios onde a profissão seja Médico, Pedreiro ou Professor 

select * from funcionarios
where profissao in ('Médico', 'Pedreiro', 'Professor')
```

```sql
# Me mostre apenas os alunos com 15 ou 16 anos

select * from alunos
where idade = 15 or idade = 16;
```

### Like 
Like fará filtros com base em uma string específica:

Exemplo
```sql
select * from alunos
where nome like 'palavra'
```
| Operador      | Como ele funciona?                                            |
| ------------- | ------------------------------------------------------------- |
| Like 'a%'     | Encontra todos os valores que começarem com a                 |
| Like '%a'     | Encontra todos os valores que terminarem com a                |
| Like '%Maria' | Encontra todos os valores que tiverem Maria em qualquer lugar |



## Visualizar os dados na consulta
Me mostre apenas os **2 primeiros produtos** onde o preço é igual a 20
```sql
select * from produtos
where preco = 20 
limit 2;
```

Me mostre os alunos **ordenados pelo nome**
```sql
select * from alunos
order by nome;
```

## Atualizar dados inseridos nas tabelas
```SQL
UPDATE nome_da_tabela
SET coluna = Novo valor
WHERE condição;

# IMPORTANTE: Sempre coloque WHERE para que você não destrua seu banco de dados adicionando o mesmo valor para todos os dados!!!
```
Exemplo:
```SQL
UPDATE funcionarios
SET profissao = 'Programador'
WHERE nome = 'Arthur';
```

## Deletar registros em uma tabela
Para apagar registros específicos
```SQL
DELETE FROM nome_da_tabela
WHERE condição;

# IMPORTANTE: Sempre coloque WHERE para que você não destrua seu banco de dados apagando tudo!!!
```
Caso você realmente queira apagar todos os dados inseridos...
```sql
TRUNCATE TABLE nome_da_tabela;
```