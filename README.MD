jekyll

##  Subcommands:
  `docs` `import`                
  `build, b` 当前文件夹中的内容将会生成到 ./_site 文件夹中。

  `clean` Clean the site (removes site output and metadata file) without building.

  `doctor, hyde` Search site and print specific deprecation warnings

  `help`   Show the help message, optionally for a given subcommand.

  `new` Creates a new Jekyll site scaffold in PATH

  `new-theme` Creates a new Jekyll theme scaffold

  `serve, server, s`  Serve your site locally

  `draft` Creates a new draft post with the given NAME

  `post` Creates a new post with the given NAME

  `publish` Moves a draft into the _posts directory and sets the date

  `unpublish`  Moves a post back into the _drafts directory

  `page`  Creates a new page with the given NAME

`jekyll serve --detach` 功能和`jekyll serve`命令相同，但是会脱离终端在后台运行
`jekyll build --watch` 当前文件夹中的内容将会生成到 ./_site 文件夹中，查看改变，并且自动再生成。
`jekyll build --source <source> --destination <destination>` 指定源文件夹<source>中的内容将会生成到目标文件夹<destination>中。
https://pages.github.com/versions/
