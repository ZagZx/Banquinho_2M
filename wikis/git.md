# Git
<div style='display:flex; justify-content:center;'>
    <img src='../imagens/git.png'>
</div>

## O que é Git?
Git é uma ferramenta de versionamento de código/arquivos. Quando precisamos trabalhar com um grupo de pessoas para modificar um mesmo arquivo, torna-se inviável enviar o mesmo arquivo com suas modificações, pois as alterações feitas por outras pessoas podem se perder no meio do caminho, situação que piora com o aumento do número de pessoas no mesmo projeto. 

O Git surge para resolver esse problema, tornando possível que duas ou mais pessoas modifiquem um arquivo ao mesmo tempo e que essas mudanças não se percam pelo tempo. O uso dessa ferramenta torna possível também guardar *backups* dos arquivos modificados, logo, a qualquer momento você pode visualizar uma versão antiga do arquivo caso necessário.

Cada vez que uma nova versão do projeto é feita, o usuário precisa dar um ```commit``` nas alterações feitas, que nada mais é do que **postar** o arquivo com o que foi modificado. Adiante, estará disponível para leitura o passo a passo de como usar o Git sem nunca ter mexido na ferramenta e o que significa seus conceitos básicos.

> [!IMPORTANT]
> Antes de prosseguir, certifique-se de que o Git está instalado na sua máquina. Caso não tenha instalado, clique [aqui](#instalando-a-ferramenta-git).

> [!NOTE]
> Tem dúvidas com os conceitos que estão sendo utilizados? Clique [aqui](#conceitos-do-git) para melhor explicação.

## Configurando o Git
Antes de começar a utilizar os comandos do git, é necessário configurar ele primeiro. Essa configuração consiste em definir o usuário, email e iniciar um repositório. 

> [!NOTE]
> Caso você já seja mais avançado/já configurou o Git, ignore esta seção.

#### 1. Configure o usuário e o email
Quando você fizer alterações em um código e registrá-los, outras pessoas precisarão identificar o responsável por aquela mudança. Por isso é importante colocar essas informações. Para isso, digite no seu terminal:
```git
git config --global user.name "Seu Nome"
git config --global user.email "seuemail@exemplo.com" 
```


## Baixando e instalando a ferramenta Git
### Windows
1. Acesse a página do Git para baixar a ferramenta no Windows "https://git-scm.com/downloads/win".
2. Clique no link para fazer o download na opção mais recente, ou escolha outra desejável para você.
3. Feito o download, selecione o instalador e siga as instruções.
4. Conclua a instalação.

### Linux
1. Para o Linux, basta abrir o terminal da sua máquina e digitar o comando ```sudo apt install git```.
> [!NOTE]
> Caso esteja usando versões do Linux que não sejam compatíveis com essa sintaxe de comando, basta mudar para adaptar a sua versão.

### MacOS
1. O Git pode ser instalado a partir do XCode Command Line Tools.
2. Abra o terminal e digite ```git --version```. Caso ele não estiver disponível, o próprio sistema solicitará a instalação e basta seguir as instruções.

## Conceitos do Git