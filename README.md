# :memo: Aprova

## Introdução

Aplicação web client-side para a consulta do resultado final dos alunos do curso "Boas Escolhas Online" da [Safernet Brasil](https://new.safernet.org.br/), através do consumo da [Google Sheets API](https://developers.google.com/sheets/api).

A arquitetura de diretórios da aplicação segue a seguinte estrutura:


    .
    ├── src                    
    │   ├── images
    │   │   ├── google-icon.png
    │   │   ├── safernet-icon.png
    │   │   └── safernet-logo.png
    │   ├── index.html
    │   ├── index.js
    │   └── styles.css              
    ├── LICENSE
    └── README.md
    
 A planilha utilizada na aplicação se encontra [aqui](https://docs.google.com/spreadsheets/d/1cPefI67Fc1XFJ9sKMp1Qkp5seBmo6vK8tiEwOKxc7Uc/edit#gid=0).
 
 ## :gear: Configurações 
 
 Para executar esta aplicação, você precisa dos seguintes pré-requisitos:
 
 - Python 2.4 +
 - Uma contra do Google

É necessário ter o Python instalado, pois é através dele que a aplicação irá prover um web service. Caso você não o tenha em sua máquina, pode fazer o donwload da versão mais atual clicando [aqui](https://www.python.org/downloads/).

Para ter acesso à Google Sheets API foi necessário registrar essa aplicação no Google Cloud Platform. Por se tratar de uma aplicação teste, apenas os usuários de teste conseguirão acessar o app. Por isso, criei um e-mail pra você e o registrei como um testador da nossa aplicação:blush:.

Aqui estão as credenciais para você utilizar no momento do login:

    Usuário: usuarioteste.aprova@gmail.com
    Senha: teste@aprovasafernet

## :thinking: Como executar?

### 1. Primeiro passo:

Uma vez tendo todos os pré-requisitos satisfeitos, faça o clone desse repositório na sua máquina executando o seguinte comando:

     git clone https://github.com/basilioarth/Aprova-SaferNet.git

Caso você não tenha o git instalado, clica [aqui](https://git-scm.com/downloads) :wink:.

### 2. Segundo passo:

Dentro no diretório da aplicação, navegue até a pasta `src`. De acordo com a sua versão do Python, execute o seguinte comando:

Python 2.x:

    python -m SimpleHTTPServer 8000

Python 3.x:

    python -m http.server 8000

### 3. Terceiro passo:

No seu navegador de preferência, acesse: http://localhost:8000.

Pronto! Nossa aplicação está executando :heart_eyes:.
