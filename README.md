# tdd-Todoエディター

TDDで開発をする際に利用するTodoリストを簡単に管理するためのエディター

Markdown形式のファイルの読み込み、保存ができます。

テストフレームワークはjestを使用.

テストはカバレッジ計測もできるようになっている.

windows環境での利用を前提としている.

## ファイルフォーマット

Markdown形式のtodoリストを読み込むことができます。
下記のようなフォーマットにしてください。
ユニットtodo：大項目
モジュールtodo：中項目
大項目は空白なし、中項目以下は2つ以上の空白を入れてください。

```markdown
- [ ] ユニットtodo
  - [x] モジュールtodo
  - [x] モジュールtodo
  - [ ] モジュールtodo

- [ ] ユニットtodo
  - [ ] モジュールtodo
  - [ ] モジュールtodo
```

## Project setup

```ps1
npm install
```

### Run electron application

```ps1
npm run electron:serve
```

### Compiles and minifies for production electron application

```ps1
npm run electron:build
```

### Run unit test and calc coverage

```ps1
npm run test
```

### Compiles and hot-reloads for development

```ps1
npm run serve
```

### Compiles and minifies for production

```ps1
npm run build
```

### Lints and fixes files

```ps1
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
