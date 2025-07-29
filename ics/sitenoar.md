# Como colocar um site no ar

### **1.** Primeiramente, crie um diretório dentro do diretório `/var/www/` utilizando o seguinte comando:
```cmd
$ sudo mkdir /var/www/nomesite
```

### **2.** Depois, clone o arquivo do Github para o repositório utilizando o comando: 
```cmd
$ sudo git clone <link_do_repositório>
```

### **3.** Crie um arquivo de configuração dentro do diretório `/etc/apache2/sites-available`:
```cmd
$ sudo nano /etc/apache2/sites-available/nomesite.conf
```

### **4.** Configure seu arquivo com o seguinte conteúdo, adaptando os caminhos e nomes de domínio de acordo com suas necessidades:
```
<VirtualHost *:80>
ServerName nomesite.com
ServerAlias www.nomesite.com
DocumentRoot /var/www/meusites
ErrorLog ${APACHE_LOG_DIR}/nomesite_error.log
CustomLog ${APACHE_LOG_DIR}/nomesite_access.log combined
</VirtualHost>
```

> [!NOTE]
> Ao clonar um repositório do Github, ele irá criar uma página com o nome do repositório, então no DocumentRoot provavelmente precisará adicionar `/onomedorepositório`, logo após o nome do diretório, aqui: DocumentRoot /var/www/meusites/nomedorepositório

> [!IMPORTANT]
> Também vale lembrar que se for usar uma porta auxiliar diferente da porta 80 é preciso abrir ela em `ports.conf`, basta acessar o ports.conf utilizando o `nano` e adicionar ‘Listen X’.

### **5.** Habilite o virtual host que você acabou de criar:
```cmd
$ sudo a2ensite nomesite.conf
```

Para aplicar as novas configurações, reinicie o serviço Apache:
```cmd
$ sudo systemctl restart apache2
```
Agora você pode acessar seu site digitando o nome de domínio (se existir) ou o endereço IP do seu servidor. Por exemplo: http://seu_ip
