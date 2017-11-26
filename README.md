# Dynamic Tabs

Use `React`,` React Router` & `Webpack`.

## Key concept
When the application is launched, it loads a `JSON` file describing the tabs to be rendered.

The description of the tab contains
  - the identifier,
  - the title,
  - the sequence number of the tab,
  - the path to the javascript file that contains the React component for tab rendering.

When navigating between tabs, the current tab is displayed in the application `url`.
For example, `localhost/dummyTable` or `localhost/dummyChart` 

By default, the first tab is opened.

When the application starts , a tab from the `url` opens immediately.

The tab module file is loaded only when necessary.

## Start

1. Clone repo

2. Install dependencies
```
$ yarn install
```

3. Start WebpackDevServer
```
$ yarn start
```

# React Sortable Tree

## Получение и подготовка данных:

Используемые атрибуты контейнеров(сенсоров):
```
id
name
type
parent
```

1. Создаем массив данных и включаем в него контейнер (сенсор) для переноса
```
const data = [movedContainer]
```

2. Получаем родительский контейнер и добавляем в `data` родительский контейнер и его контейнеры, которые старше переносимого.
Родительский контейнер помечаем `expanded`
```
getContainerInfo(movedContainer.parent)
    .then(result => {
        const {items, ...props} = result;
        props.expanded = true;
        data.push(props);
        data.concat(items.filter(item => isGreatThen(item.type, movedContainer.type)));
    });
```
    
3. Повторяем операцию 2, пока `parent` очередного контейнера не `sensorspace`
   
4. Добавляем в `data` контейнеры из `current_sensorspace`
```
   data.push(current_sensorspace.items);
```
   
   
   