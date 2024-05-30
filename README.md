# EXPERIMENTAL

# pangeia-collector - Coletor de documentação

Este projeto coleta documentações de multiplos projetos, em vários formatoes, e gera um modelo usado pelo [https://github.com/gabrielogregorio/pangeia-api](https://github.com/gabrielogregorio/pangeia-api).

# Como configurar esse projeto?

Você precisa de criar um `config.json` e aponta-lo no .env, exemplo `CONFIG_FILE="../config.json"`. Esse exemplo, o config file está no diretório anterior a esse projeto, ajuste conforme você quiser.

O config precisa de ter essa configuração, `sem os comentários` e como JSON e não js como vou exemplificar?

```js
{
  "projects": [ // local onde estarão os arquivos de configuração
    {
      "bannedPaths": ["node_modules", ".git", "next", "build", "dist"], // pastas para o coletor ignorar
      "directory": "../myproject",
      "tags": ["combratec", "time", "infraestrutura"], // tags que podem ser usadas para se referenciar a essa documentação
      "title": "📙 Infraestrutura" // nome da hierarquia que ela irá pertencer
    },
  ]
}
```

## Markdown de código em comentários

Markdown de código tem algumas limitações em relação ao markdown padrão, por exemplo, comentários podem estar espaçados, exemplo:

    if(codigo) {
      /* doc
      sua documetação aqui
        comentários em niveis incosinstentes
      */
    }

No markdown padrão, esse espaçamento indicaria um código de programação, e para evitar essa inconsistência, o markdown em comentário tem todas as linhas a esquerda removidas, ou seja, em comentários os espaços a esquerda são removidos, e consequentemente os códigos em comentários baseado em espaçamento não irão funcionar.

Para fazer código em comentário, use o \`\`\`, exemplo:

    \`\`\`py
    print("seu codigo aqui");
    \`\`\`

Além de usar o \`\`\`, informe a linguagem usada, como \`ts\`, \`py\`, \`js\`, \`bash\` ou outras, sem isso a formatação não ficará legal

## Dev blocks

Nas documentações você pode marcar um trecho de código como sendo de dev, isso irá mostrar esse código somente no modo de dev (🧑‍💻), mas irá ocultar no modo de produtos ⭐.

Isso é util para esconder detalhes como tags, ids, requests, endpoints e coisas techs que podem confundir produtos.

> Lembre-se, faça a doc para atender a TECH, e ser simples para produtos, assim a gente centraliza tudo.

Para iniciar um bloco de dev, basta adicionar esse comentário

\`\`\`ts
documentação para todos aqui

<!-- dev:start -->

coisas de dev aqui

<!-- dev:end -->

continua documentação para todos
\`\`\`

Em arquivos markdown no \`vscode\` você pode usar o \`CTRL + /\`, isso irá adicionar um comentário no markdown.

// add dot env support
// add name support
