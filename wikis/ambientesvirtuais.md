## Criação de ambientes virtuais e execução da aplicação
Para a utilização de ambos tutoriais, certifique-se que o Python está instalado na sua máquina.
### Windows
> [!WARNING]
>_ps.: Os passos **2-5** só precisam ser executados se ocorrer erro para a criação do ambiente virtual._
1. Crie o diretório que será utilizado
2. Acesse o Power Shell
3. Navegue até o diretório WINDOWS/system32
4. Escreva na linha de comando:  ```Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned```
5. Após isso, confirme com "S"
6. Abra o cmd e navegue até o diretório criado no passo 1.
7. Crie o ambiente virtual com o comando: ```py -m venv .env```
8. Ative o ambiente virtual com o comando: ```.\.env\Scripts\activate```
9. Instale o flask no seu ambiente virtual com o código: ```pip install flask```
10. Com a aplicação já feita, execute a aplicação com o código: ```flask run --debug```
> [!NOTE]
> Se você criou uma env com outro nome que não seja `.env`, basta iniciar a sua env com o nome escolhido por você.
11. Para sair do ambiente virtual, escreva na linha de comando: ```deactivate```
#
### Linux
1. Crie o diretório que será utilizado.
2. Acesse o Terminal.
3. Navegue até o diretório criado no passo 1.
4. Para criar o ambiente virtual, escreva na linha de comando: ```python3 -m venv .env```
5. Para acessar o ambiente virtual: ```source .env/bin/activate```
6. Instale o pip com: ```sudo apt-get install python3-pip```
> [!NOTE]
> Se você já instalou o pip, pule essa etapa.
7. Execute o comando: ```pip install flask```
8. Com a aplicação feita, execute o código com: ```flask --app nome_da_aplicacao run --debug```
#
### MacOS
1. Crie o diretório que será utilizado.
2. Acesse o terminal.
3. Navegue até o diretório criado no passo 1.
4. Para criar o ambiente virtual, escreva na linha de comando: `python3 -m venv .env`
5. Acesse o ambiente virtual com: `source .env/bin/activate`
6. Instale as dependências do seu projeto.
7. Desative o ambiente virtual digitando no terminal `deactivate`.

#
1. Para colocar os pacotes para utilizar em projeto: ```pip freeze > requirements.txt```
2. Para instalar os pacotes: ```pip install -r requirements.txt```

